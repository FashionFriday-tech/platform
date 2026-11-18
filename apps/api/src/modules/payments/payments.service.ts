import { OrderStatus, PaymentMethod, PaymentStatus } from '@ff/database';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { RazorpayService } from '../orders/services/razorpay.service';
import { PaymentQueryDto } from './dto/payment-query.dto';

export interface PaymentTransactionItem {
  id: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  amount: number;
  totalAmount: number;
  discountAmount: number;
  shippingFees: number;
  advanceAmount: number;
  refundedAmount: number;
  balanceAmount: number;
  currency: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignatureVerified: boolean;
  bankRrn?: string | null;
  customer: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
  };
  itemsCount: number;
  itemsSummary: string[];
  isExpiringSoon: boolean;
  hoursSinceAuthorized: number | null;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersService: OrdersService,
    private readonly razorpayService: RazorpayService,
  ) {}

  /**
   * Get all payments with advanced enterprise filtering, search & pagination
   */
  async getAllPayments(query: PaymentQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {
      // Exclude abandoned checkout attempts without gateway orders
      NOT: {
        AND: [
          { status: OrderStatus.PENDING },
          { paymentStatus: PaymentStatus.PENDING },
          { razorpayOrderId: null },
        ],
      },
    };

    // Filter by status
    if (query.status && query.status !== 'ALL') {
      const normalizedStatus = query.status.toUpperCase();
      if (normalizedStatus in PaymentStatus) {
        where.paymentStatus = normalizedStatus as PaymentStatus;
      }
    }

    // Filter by method
    if (query.method && query.method !== 'ALL') {
      const normalizedMethod = query.method.toUpperCase();
      if (normalizedMethod in PaymentMethod) {
        where.paymentMethod = normalizedMethod as PaymentMethod;
      }
    }

    // Filter by date range
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) {
        where.createdAt.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    // Risk filters
    const now = Date.now();
    const twoDaysAgo = new Date(now - 48 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now - 72 * 60 * 60 * 1000);

    if (query.riskFilter === 'EXPIRING') {
      where.paymentStatus = PaymentStatus.AUTHORIZED;
      where.createdAt = { lte: twoDaysAgo, gte: threeDaysAgo };
    } else if (query.riskFilter === 'NEEDS_CAPTURE') {
      where.paymentStatus = PaymentStatus.AUTHORIZED;
      where.status = OrderStatus.STOCK_CONFIRMED;
    } else if (query.riskFilter === 'REFUND_IN_PROGRESS') {
      where.paymentStatus = {
        in: [PaymentStatus.REFUND_PENDING, PaymentStatus.PARTIALLY_REFUNDED],
      };
    } else if (query.riskFilter === 'FAILED') {
      where.paymentStatus = {
        in: [PaymentStatus.FAILED, PaymentStatus.VOIDED, PaymentStatus.VOID_PENDING],
      };
    }

    // Search query
    if (query.search?.trim()) {
      const term = query.search.trim();
      where.OR = [
        { orderNumber: { contains: term, mode: 'insensitive' } },
        { razorpayPaymentId: { contains: term, mode: 'insensitive' } },
        { razorpayOrderId: { contains: term, mode: 'insensitive' } },
        { user: { name: { contains: term, mode: 'insensitive' } } },
        { user: { phone: { contains: term, mode: 'insensitive' } } },
        { user: { email: { contains: term, mode: 'insensitive' } } },
      ];
    }

    // Sorting
    const sortField = query.sortField || 'createdAt';
    const sortDir = query.sortDir === 'asc' ? 'asc' : 'desc';
    const orderBy: any = {};
    if (sortField === 'amount') {
      orderBy.finalAmount = sortDir;
    } else if (sortField === 'orderNumber') {
      orderBy.orderNumber = sortDir;
    } else if (sortField === 'status') {
      orderBy.paymentStatus = sortDir;
    } else {
      orderBy.createdAt = sortDir;
    }

    const [totalCount, orders] = await Promise.all([
      this.prisma.db.order.count({ where }),
      this.prisma.db.order.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          items: true,
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
        },
      }),
    ]);

    const items: PaymentTransactionItem[] = orders.map((order) => {
      const finalAmount = Number(order.finalAmount || order.totalAmount || 0);
      const totalAmount = Number(order.totalAmount || 0);
      const discountAmount = Number(order.discountAmount || 0);
      const shippingFees = Number(order.shippingFees || 0);
      const advanceAmount = Number(order.advanceAmount || 0);
      const refundedAmount = Number(order.refundedAmount || 0);
      const balanceAmount =
        order.paymentMethod === PaymentMethod.COD ? Math.max(0, finalAmount - advanceAmount) : 0;

      const orderCreatedTime = new Date(order.createdAt).getTime();
      const hoursSinceAuthorized =
        order.paymentStatus === PaymentStatus.AUTHORIZED
          ? Math.floor((now - orderCreatedTime) / (3600 * 1000))
          : null;
      const isExpiringSoon =
        order.paymentStatus === PaymentStatus.AUTHORIZED && (hoursSinceAuthorized ?? 0) >= 48;

      let address: any = {};
      if (typeof order.shippingAddress === 'string') {
        try {
          address = JSON.parse(order.shippingAddress);
        } catch {
          address = {};
        }
      } else if (order.shippingAddress && typeof order.shippingAddress === 'object') {
        address = order.shippingAddress;
      }

      const customerName = address.fullName || order.user?.name || 'Customer';
      const customerPhone = address.phoneNumber || order.user?.phone || '';

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        orderStatus: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        amount: finalAmount,
        totalAmount,
        discountAmount,
        shippingFees,
        advanceAmount,
        refundedAmount,
        balanceAmount,
        currency: 'INR',
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: order.razorpayPaymentId,
        razorpaySignatureVerified: Boolean(order.razorpaySignature),
        customer: {
          id: order.userId,
          name: customerName,
          phone: customerPhone,
          email: order.user?.email || null,
        },
        itemsCount: order.items.length,
        itemsSummary: order.items.map((i) => i.name).slice(0, 3),
        isExpiringSoon,
        hoursSinceAuthorized,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      };
    });

    return {
      items,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
    };
  }

  /**
   * Get KPI statistics and financial summary for payment operations
   */
  async getPaymentStats(startDate?: string, endDate?: string) {
    const where: any = {
      NOT: {
        AND: [
          { status: OrderStatus.PENDING },
          { paymentStatus: PaymentStatus.PENDING },
          { razorpayOrderId: null },
        ],
      },
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const orders = await this.prisma.db.order.findMany({
      where,
      select: {
        finalAmount: true,
        advanceAmount: true,
        refundedAmount: true,
        paymentStatus: true,
        paymentMethod: true,
        createdAt: true,
      },
    });

    let totalGrossVolume = 0;
    let capturedVolume = 0;
    let authorizedVolume = 0;
    let refundedVolume = 0;
    let failedVolume = 0;
    let codAdvanceVolume = 0;
    let codPendingVolume = 0;

    const totalTransactions = orders.length;
    let capturedCount = 0;
    let authorizedCount = 0;
    let refundedCount = 0;
    let failedCount = 0;

    const methodBreakdown = {
      razorpay: 0,
      cod: 0,
      wallet: 0,
      stripe: 0,
    };

    const now = Date.now();
    let expiringAuthorizationsCount = 0;

    // Daily volume trend map (past 7 days or date window)
    const dailyVolumeMap: Record<
      string,
      { date: string; volume: number; count: number; captured: number }
    > = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateKey = d.toISOString().split('T')[0];
      dailyVolumeMap[dateKey] = {
        date: dateKey,
        volume: 0,
        count: 0,
        captured: 0,
      };
    }

    for (const order of orders) {
      const amount = Number(order.finalAmount || 0);
      const advance = Number(order.advanceAmount || 0);
      const refunded = Number(order.refundedAmount || 0);
      const createdDateKey = order.createdAt.toISOString().split('T')[0];

      totalGrossVolume += amount;

      // Method breakdown
      if (order.paymentMethod === PaymentMethod.COD) {
        methodBreakdown.cod++;
        codAdvanceVolume += advance;
        codPendingVolume += Math.max(0, amount - advance);
      } else if (order.paymentMethod === PaymentMethod.RAZORPAY) {
        methodBreakdown.razorpay++;
      } else if (order.paymentMethod === PaymentMethod.WALLET) {
        methodBreakdown.wallet++;
      } else if (order.paymentMethod === PaymentMethod.STRIPE) {
        methodBreakdown.stripe++;
      }

      // Status aggregation
      if (order.paymentStatus === PaymentStatus.CAPTURED) {
        capturedVolume += amount;
        capturedCount++;
      } else if (order.paymentStatus === PaymentStatus.AUTHORIZED) {
        authorizedVolume += amount;
        authorizedCount++;
        const hoursOld = (now - new Date(order.createdAt).getTime()) / (3600 * 1000);
        if (hoursOld >= 48) {
          expiringAuthorizationsCount++;
        }
      } else if (
        order.paymentStatus === PaymentStatus.REFUNDED ||
        order.paymentStatus === PaymentStatus.PARTIALLY_REFUNDED
      ) {
        refundedCount++;
      } else if (
        order.paymentStatus === PaymentStatus.FAILED ||
        order.paymentStatus === PaymentStatus.VOIDED
      ) {
        failedVolume += amount;
        failedCount++;
      }

      refundedVolume += refunded;

      // Daily chart aggregation
      if (dailyVolumeMap[createdDateKey]) {
        dailyVolumeMap[createdDateKey].volume += amount;
        dailyVolumeMap[createdDateKey].count += 1;
        if (order.paymentStatus === PaymentStatus.CAPTURED) {
          dailyVolumeMap[createdDateKey].captured += amount;
        }
      }
    }

    const successDenominator = totalTransactions || 1;
    const successRate = Math.round(((capturedCount + authorizedCount) / successDenominator) * 100);
    const refundRate =
      capturedVolume > 0 ? Number(((refundedVolume / capturedVolume) * 100).toFixed(1)) : 0;

    return {
      summary: {
        totalGrossVolume: Math.round(totalGrossVolume),
        capturedVolume: Math.round(capturedVolume),
        authorizedVolume: Math.round(authorizedVolume),
        refundedVolume: Math.round(refundedVolume),
        failedVolume: Math.round(failedVolume),
        codAdvanceVolume: Math.round(codAdvanceVolume),
        codPendingVolume: Math.round(codPendingVolume),
        totalTransactions,
        capturedCount,
        authorizedCount,
        refundedCount,
        failedCount,
        expiringAuthorizationsCount,
        successRate,
        refundRate,
      },
      methodBreakdown,
      dailyTrend: Object.values(dailyVolumeMap),
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get deep dive forensics for a single payment transaction
   */
  async getPaymentDetails(orderId: string) {
    const order = await this.prisma.db.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order / Payment record ${orderId} not found`);
    }

    let liveGatewayData: any = null;
    let liveRefundsData: any = null;
    let gatewayFetchError: string | null = null;

    if (order.razorpayPaymentId) {
      try {
        liveGatewayData = await this.razorpayService.fetchPayment(order.razorpayPaymentId);
      } catch (err: any) {
        this.logger.warn(`Could not fetch live Razorpay payment: ${err.message}`);
        gatewayFetchError = err.message || 'Gateway details not reachable';
      }

      try {
        liveRefundsData = await this.razorpayService.fetchPaymentRefunds(order.razorpayPaymentId);
      } catch (err: any) {
        this.logger.warn(`Could not fetch live Razorpay refunds: ${err.message}`);
      }
    }

    let address: any = {};
    if (typeof order.shippingAddress === 'string') {
      try {
        address = JSON.parse(order.shippingAddress);
      } catch {
        address = {};
      }
    } else if (order.shippingAddress && typeof order.shippingAddress === 'object') {
      address = order.shippingAddress;
    }

    const amount = Number(order.finalAmount || 0);
    const advance = Number(order.advanceAmount || 0);
    const refunded = Number(order.refundedAmount || 0);
    const mdrFeeEstimated =
      order.paymentMethod === PaymentMethod.RAZORPAY
        ? Number((amount * 0.02).toFixed(2)) // 2% Razorpay standard fee
        : 0;
    const gstOnMdrEstimated = Number((mdrFeeEstimated * 0.18).toFixed(2)); // 18% GST on MDR fee
    const netPayoutEstimated = Math.max(0, amount - mdrFeeEstimated - gstOnMdrEstimated);

    return {
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        totalAmount: Number(order.totalAmount || 0),
        discountAmount: Number(order.discountAmount || 0),
        shippingFees: Number(order.shippingFees || 0),
        finalAmount: amount,
        advanceAmount: advance,
        refundedAmount: refunded,
        balanceDue: order.paymentMethod === PaymentMethod.COD ? Math.max(0, amount - advance) : 0,
        currency: 'INR',
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: order.razorpayPaymentId,
        razorpaySignature: order.razorpaySignature,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        shippingAddress: address,
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: Number(item.price),
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      },
      customer: {
        id: order.userId,
        name: address.fullName || order.user?.name || 'Customer',
        phone: address.phoneNumber || order.user?.phone || '',
        email: order.user?.email || null,
        joinedAt: order.user?.createdAt ? order.user.createdAt.toISOString() : null,
      },
      feeBreakdown: {
        grossAmount: amount,
        estimatedMdrFee: mdrFeeEstimated,
        estimatedGstOnFee: gstOnMdrEstimated,
        estimatedNetPayout: netPayoutEstimated,
      },
      gateway: {
        isConfigured: this.razorpayService.isConfigured(),
        livePayment: liveGatewayData,
        liveRefunds: liveRefundsData,
        fetchError: gatewayFetchError,
        bankRrn:
          liveGatewayData?.acquirer_data?.rrn ||
          liveGatewayData?.acquirer_data?.bank_transaction_id ||
          liveRefundsData?.items?.[0]?.acquirer_data?.rrn ||
          null,
      },
    };
  }

  /**
   * Live sync with Razorpay Gateway
   * Idempotently reconciles local DB with live gateway status if any mismatch exists
   */
  async syncGateway(orderId: string) {
    const order = await this.prisma.db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    if (!order.razorpayPaymentId) {
      return {
        success: false,
        message: 'No Razorpay payment ID recorded for this order',
        order,
      };
    }

    try {
      const payment = await this.razorpayService.fetchPayment(order.razorpayPaymentId);
      const gatewayStatus = (payment?.status || '').toLowerCase();
      let updatedStatus: PaymentStatus = order.paymentStatus;
      let orderStatus: OrderStatus = order.status;
      let stateChanged = false;

      if (gatewayStatus === 'captured' && order.paymentStatus !== PaymentStatus.CAPTURED) {
        updatedStatus = PaymentStatus.CAPTURED;
        if (order.status === OrderStatus.STOCK_CHECK) {
          orderStatus = OrderStatus.STOCK_CONFIRMED;
        }
        stateChanged = true;
      } else if (gatewayStatus === 'refunded' && order.paymentStatus !== PaymentStatus.REFUNDED) {
        updatedStatus = PaymentStatus.REFUNDED;
        stateChanged = true;
      } else if (gatewayStatus === 'failed' && order.paymentStatus !== PaymentStatus.FAILED) {
        updatedStatus = PaymentStatus.FAILED;
        stateChanged = true;
      }

      if (stateChanged) {
        const updated = await this.prisma.db.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: updatedStatus,
            status: orderStatus,
          },
        });
        this.logger.log(
          `[PaymentsService] Synced order ${order.orderNumber}: status changed from ${order.paymentStatus} to ${updatedStatus}`,
        );
        return {
          success: true,
          synced: true,
          previousStatus: order.paymentStatus,
          currentStatus: updatedStatus,
          gatewayStatus,
          order: updated,
        };
      }

      return {
        success: true,
        synced: false,
        message: 'Database is already in sync with gateway state',
        currentStatus: order.paymentStatus,
        gatewayStatus,
        payment,
      };
    } catch (err: any) {
      this.logger.error(`Failed to sync gateway for order ${orderId}: ${err.message}`);
      throw new BadRequestException(
        `Gateway sync failed: ${err?.error?.description || err.message}`,
      );
    }
  }

  /**
   * Capture authorized payment
   */
  async capturePayment(orderId: string) {
    return this.ordersService.confirmStockAndCapture(orderId);
  }

  /**
   * Void authorized payment (zero fee)
   */
  async voidPayment(orderId: string, reason?: string) {
    return this.ordersService.rejectStockAndVoid(orderId, reason);
  }

  /**
   * Issue partial or full refund for captured payment
   */
  async refundPayment(orderId: string, amount?: number, reason?: string) {
    return this.ordersService.refundCapturedOrder(orderId, amount, reason);
  }
}
