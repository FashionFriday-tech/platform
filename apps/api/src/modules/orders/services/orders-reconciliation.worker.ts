import { OrderStatus, PaymentStatus } from '@ff/database';
import { Injectable, Logger, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';

import { PrismaService } from '../../../database/prisma.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { OrdersService } from '../orders.service';
import { RazorpayService } from './razorpay.service';

/**
 * OrdersReconciliationWorker
 *
 * Automated Scheduled Worker that runs periodic background financial reconciliation.
 * Protected by Distributed Cluster Lease (cluster_locks table) to ensure that in multi-instance
 * clustered API deployments (including PgBouncer / Neon connection pooling), exactly ONE node
 * executes recovery at any time.
 *
 * Responsibilities:
 * 1. CAPTURE_PENDING recovery: Resolves orders stuck in uncertain capture state with Razorpay.
 * 2. VOID_PENDING recovery: Retries or reconciles authorization releases.
 * 3. REFUND_PENDING recovery: Resolves uncertain refund operations against Razorpay.
 * 4. Webhook inbox crash recovery: Picks up stuck PENDING/PROCESSING events (>5 mins old).
 * 5. Expiring authorization alerting: Flags orders in AUTHORIZED state approaching 72h limit.
 */
@Injectable()
export class OrdersReconciliationWorker implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(OrdersReconciliationWorker.name);
  private timer: NodeJS.Timeout | null = null;
  private readonly LOCK_NAME = 'reconciliation_worker';
  private readonly instanceId = `api_${process.pid}_${Math.random().toString(36).substring(2, 7)}`;
  private isRunning = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersService: OrdersService,
    private readonly razorpayService: RazorpayService,
    private readonly notificationsService: NotificationsService,
  ) {}

  onApplicationBootstrap() {
    this.logger.log(
      `[OrdersReconciliationWorker] Initializing automated payment reconciliation worker (Node: ${this.instanceId})...`,
    );

    // Initial warmup run 15 seconds after startup
    setTimeout(() => {
      void this.runReconciliationCycle('startup');
    }, 15000);

    // Schedule recurring reconciliation every 5 minutes (300,000 ms)
    this.timer = setInterval(() => {
      void this.runReconciliationCycle('scheduled');
    }, 300000);
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Main reconciliation execution cycle
   */
  async runReconciliationCycle(triggerSource = 'scheduled'): Promise<{
    executed: boolean;
    reason?: string;
    stats?: Record<string, number>;
  }> {
    if (this.isRunning) {
      this.logger.debug(
        `[OrdersReconciliationWorker] Previous cycle still executing on this node. Skipping.`,
      );
      return { executed: false, reason: 'ALREADY_RUNNING' };
    }

    this.isRunning = true;
    let lockAcquired = false;

    try {
      // 1. Cluster Concurrency Protection: Distributed Lease
      // Guaranteed safe with PgBouncer / Neon transaction pooling
      const rowsAffected = await this.prisma.db.$executeRawUnsafe(`
        INSERT INTO "cluster_locks" ("id", "lockedBy", "lockedAt", "expiresAt", "updatedAt")
        VALUES ('${this.LOCK_NAME}', '${this.instanceId}', NOW(), NOW() + INTERVAL '5 minutes', NOW())
        ON CONFLICT ("id") DO UPDATE
        SET "lockedBy" = '${this.instanceId}', "lockedAt" = NOW(), "expiresAt" = NOW() + INTERVAL '5 minutes', "updatedAt" = NOW()
        WHERE "cluster_locks"."expiresAt" < NOW();
      `);

      lockAcquired = rowsAffected > 0;

      if (!lockAcquired) {
        this.logger.log(
          `[OrdersReconciliationWorker] Another API cluster instance holds the active lease. Skipping cycle.`,
        );
        return { executed: false, reason: 'LEASE_HELD_BY_PEER' };
      }

      this.logger.log(
        `[OrdersReconciliationWorker] Acquired cluster lease. Starting reconciliation cycle (Node: ${this.instanceId}, trigger: ${triggerSource})...`,
      );

      const stats = {
        capturePendingReconciled: 0,
        voidPendingReconciled: 0,
        refundPendingReconciled: 0,
        webhooksRecovered: 0,
        expiringAuthorizationsFound: 0,
      };

      // -------------------------------------------------------------
      // TASK 1: Reconcile CAPTURE_PENDING Orders
      // -------------------------------------------------------------
      const capturePendingOrders = await this.prisma.db.order.findMany({
        where: { paymentStatus: PaymentStatus.CAPTURE_PENDING },
      });

      for (const order of capturePendingOrders) {
        if (!order.razorpayPaymentId) {
          continue;
        }
        try {
          const payment = await this.razorpayService.fetchPayment(order.razorpayPaymentId);
          if (payment?.status === 'captured') {
            const updated = await this.prisma.db.order.update({
              where: { id: order.id },
              data: {
                paymentStatus: PaymentStatus.CAPTURED,
                status: OrderStatus.STOCK_CONFIRMED,
              },
              include: { items: true },
            });
            try {
              void this.notificationsService.notifyOrderStatus(updated);
            } catch {
              // ignore notification errors during reconciliation
            }
            stats.capturePendingReconciled++;
            this.logger.log(
              `[OrdersReconciliationWorker] Reconciled CAPTURE_PENDING order ${order.orderNumber} -> CAPTURED (Gateway verified)`,
            );
          } else if (payment?.status === 'failed') {
            await this.prisma.db.order.update({
              where: { id: order.id },
              data: {
                paymentStatus: PaymentStatus.FAILED,
                status: OrderStatus.CANCELLED,
              },
            });
            stats.capturePendingReconciled++;
            this.logger.log(
              `[OrdersReconciliationWorker] Reconciled CAPTURE_PENDING order ${order.orderNumber} -> FAILED (Gateway confirmed failed)`,
            );
          }
        } catch (fetchErr: any) {
          this.logger.warn(
            `[OrdersReconciliationWorker] Could not fetch payment ${order.razorpayPaymentId} for order ${order.id}: ${fetchErr.message}`,
          );
        }
      }

      // -------------------------------------------------------------
      // TASK 2: Reconcile VOID_PENDING Orders
      // -------------------------------------------------------------
      const voidPendingOrders = await this.prisma.db.order.findMany({
        where: { paymentStatus: PaymentStatus.VOID_PENDING },
      });

      for (const order of voidPendingOrders) {
        if (!order.razorpayPaymentId) {
          continue;
        }
        try {
          const payment = await this.razorpayService.fetchPayment(order.razorpayPaymentId);
          if (payment?.status === 'refunded' || payment?.status === 'failed') {
            await this.prisma.db.order.update({
              where: { id: order.id },
              data: { paymentStatus: PaymentStatus.VOIDED },
            });
            stats.voidPendingReconciled++;
            this.logger.log(
              `[OrdersReconciliationWorker] Order ${order.orderNumber} VOID_PENDING -> VOIDED`,
            );
          } else if (payment?.status === 'authorized') {
            try {
              await this.razorpayService.voidPayment(order.razorpayPaymentId);
              await this.prisma.db.order.update({
                where: { id: order.id },
                data: { paymentStatus: PaymentStatus.VOIDED },
              });
              stats.voidPendingReconciled++;
              this.logger.log(
                `[OrdersReconciliationWorker] Retried void successfully for order ${order.orderNumber}`,
              );
            } catch (voidErr: any) {
              this.logger.error(
                `[OrdersReconciliationWorker] Retrying void failed for order ${order.orderNumber}: ${voidErr.message}`,
              );
            }
          }
        } catch (err: any) {
          this.logger.warn(
            `[OrdersReconciliationWorker] Error reconciling VOID_PENDING order ${order.id}: ${err.message}`,
          );
        }
      }

      // -------------------------------------------------------------
      // TASK 3: Reconcile REFUND_PENDING Orders
      // -------------------------------------------------------------
      const refundPendingOrders = await this.prisma.db.order.findMany({
        where: { paymentStatus: PaymentStatus.REFUND_PENDING },
      });

      for (const order of refundPendingOrders) {
        if (!order.razorpayPaymentId) {
          continue;
        }
        try {
          const payment: any = await this.razorpayService.fetchPayment(order.razorpayPaymentId);
          const gatewayRefunded = payment?.amount_refunded
            ? Number(payment.amount_refunded) / 100
            : 0;
          if (gatewayRefunded > 0) {
            const isFull = gatewayRefunded >= Number(order.finalAmount);
            await this.prisma.db.order.update({
              where: { id: order.id },
              data: {
                refundedAmount: gatewayRefunded,
                paymentStatus: isFull ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED,
                ...(isFull ? { status: OrderStatus.CANCELLED } : {}),
              },
            });
            stats.refundPendingReconciled++;
            this.logger.log(
              `[OrdersReconciliationWorker] Reconciled REFUND_PENDING order ${order.orderNumber} -> ₹${gatewayRefunded} refunded`,
            );
          }
        } catch (err: any) {
          this.logger.warn(
            `[OrdersReconciliationWorker] Error reconciling REFUND_PENDING order ${order.id}: ${err.message}`,
          );
        }
      }

      // -------------------------------------------------------------
      // TASK 4: Webhook Crash Recovery (Transactional Inbox)
      // -------------------------------------------------------------
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const stuckWebhooks = await this.prisma.db.webhookEvent.findMany({
        where: {
          OR: [
            { status: 'PENDING', createdAt: { lt: fiveMinutesAgo } },
            { status: 'PROCESSING', updatedAt: { lt: fiveMinutesAgo } },
          ],
          attempts: { lt: 5 },
        },
        take: 20,
      });

      for (const webhook of stuckWebhooks) {
        try {
          await this.prisma.db.webhookEvent.update({
            where: { id: webhook.id },
            data: { attempts: { increment: 1 }, status: 'PROCESSING' },
          });

          if (webhook.payload) {
            await this.ordersService.processWebhookEventLogic(webhook.payload);
          }

          await this.prisma.db.webhookEvent.update({
            where: { id: webhook.id },
            data: { status: 'PROCESSED', processedAt: new Date() },
          });

          stats.webhooksRecovered++;
          this.logger.log(
            `[OrdersReconciliationWorker] Successfully recovered stuck webhook event ${webhook.id}`,
          );
        } catch (webhookErr: any) {
          const newAttempts = webhook.attempts + 1;
          await this.prisma.db.webhookEvent.update({
            where: { id: webhook.id },
            data: {
              status: newAttempts >= 5 ? 'FAILED' : 'PENDING',
              lastError: webhookErr.message,
            },
          });
          this.logger.error(
            `[OrdersReconciliationWorker] Webhook recovery failed for ${webhook.id}: ${webhookErr.message}`,
          );
        }
      }

      // -------------------------------------------------------------
      // TASK 5: Expiring Authorizations Alerting
      // -------------------------------------------------------------
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
      const expiringAuthorizations = await this.prisma.db.order.count({
        where: {
          paymentStatus: PaymentStatus.AUTHORIZED,
          status: OrderStatus.STOCK_CHECK,
          createdAt: { lte: twoDaysAgo },
        },
      });

      stats.expiringAuthorizationsFound = expiringAuthorizations;
      if (expiringAuthorizations > 0) {
        this.logger.warn(
          `[OrdersReconciliationWorker] ALERT: ${expiringAuthorizations} authorized orders are > 48h old and approaching 72h bank expiry! Immediate staff stock check required.`,
        );
      }

      this.logger.log(
        `[OrdersReconciliationWorker] Reconciliation cycle completed. Summary: ${JSON.stringify(stats)}`,
      );

      return { executed: true, stats };
    } catch (cycleErr: any) {
      this.logger.error(
        `[OrdersReconciliationWorker] Reconciliation cycle error: ${cycleErr.message}`,
        cycleErr.stack,
      );
      return { executed: false, reason: cycleErr.message };
    } finally {
      if (lockAcquired) {
        try {
          await this.prisma.db.$executeRawUnsafe(`
            UPDATE "cluster_locks" 
            SET "expiresAt" = NOW() 
            WHERE "id" = '${this.LOCK_NAME}' AND "lockedBy" = '${this.instanceId}';
          `);
          this.logger.debug(
            `[OrdersReconciliationWorker] Released cluster lease (Node: ${this.instanceId})`,
          );
        } catch (unlockErr: any) {
          this.logger.error(
            `[OrdersReconciliationWorker] Error releasing cluster lease: ${unlockErr.message}`,
          );
        }
      }
      this.isRunning = false;
    }
  }
}
