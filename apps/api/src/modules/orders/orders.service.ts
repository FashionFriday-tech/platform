import { generateBrandId, OrderStatus, PaymentMethod, PaymentStatus } from '@ff/database';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { RazorpayService } from './services/razorpay.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly razorpayService: RazorpayService,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    this.logger.log(`[OrdersService] ---------------- ORDER CREATION STARTED ----------------`);
    this.logger.log(
      `[OrdersService] Processing order for userId: ${userId}, paymentMethod: ${dto.paymentMethod}`,
    );

    // 1. Fetch user's cart
    this.logger.log(`[OrdersService] Step 1: Fetching cart items from DB for user: ${userId}`);
    const cartItems = await this.prisma.db.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    this.logger.log(`[OrdersService] Found ${cartItems.length} items in user's DB cart`);

    if (cartItems.length === 0) {
      this.logger.warn(`[OrdersService] User ${userId} cart is empty in database`);
      throw new BadRequestException(
        'Your cart is empty. Please add items to cart before placing an order.',
      );
    }

    // 2. Calculate totals from verified DB prices (Never trust client prices!)
    this.logger.log(`[OrdersService] Step 2: Calculating totals and preparing order line items`);
    let totalAmount = 0;
    const itemsData = cartItems.map((item) => {
      const price = Number(item.product?.sellingPrice ?? 0);
      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;
      return {
        productId: item.productId,
        name: item.product?.name || 'Fashion Product',
        image: item.product?.mainImage || '',
        size: item.size || 'Standard',
        color: item.color || 'Standard',
        price: price,
        quantity: item.quantity,
        sellerId: item.product?.sellerId || null,
      };
    });

    const isCod = dto.paymentMethod === PaymentMethod.COD;
    const discountAmount = 0;
    const shippingFees = isCod ? 200 : 0; // Free delivery for online UPI / prepay
    const finalAmount = totalAmount - discountAmount + shippingFees;

    this.logger.log(
      `[OrdersService] Totals calculated: subtotal=₹${totalAmount}, shipping=₹${shippingFees}, discount=₹${discountAmount}, finalAmount=₹${finalAmount}`,
    );

    // 3. Resolve delivery address
    this.logger.log(`[OrdersService] Step 3: Resolving delivery address for user: ${userId}`);
    let selectedAddress: any = null;

    // A. If addressId explicitly passed, verify ownership & fetch
    if (dto.addressId) {
      selectedAddress = await this.prisma.db.address.findFirst({
        where: { id: dto.addressId, userId },
      });
      if (selectedAddress) {
        this.logger.log(`[OrdersService] Found address by addressId: ${dto.addressId}`);
      }
    }

    // B. If full shippingAddress provided in DTO, persist if new & resolve
    if (dto.shippingAddress) {
      const addrDto = dto.shippingAddress;
      const cleanPhone = addrDto.phoneNumber.replace(/\D/g, '').slice(-10);
      const cleanAltPhone = addrDto.altPhoneNumber
        ? addrDto.altPhoneNumber.replace(/\D/g, '').slice(-10)
        : null;
      const cleanPincode = addrDto.pincode.replace(/\D/g, '').slice(0, 6);

      // Check if this address already exists for user
      let matchedAddress = null;
      if (addrDto.id) {
        matchedAddress = await this.prisma.db.address.findFirst({
          where: { id: addrDto.id, userId },
        });
      }

      if (!matchedAddress) {
        matchedAddress = await this.prisma.db.address.findFirst({
          where: {
            userId,
            pincode: cleanPincode,
            street: addrDto.street.trim(),
            city: addrDto.city.trim(),
          },
        });
      }

      if (!matchedAddress) {
        const addressCount = await this.prisma.db.address.count({ where: { userId } });
        matchedAddress = await this.prisma.db.address.create({
          data: {
            userId,
            fullName: addrDto.fullName.trim(),
            phoneNumber: cleanPhone,
            altPhoneNumber: cleanAltPhone,
            building: addrDto.building?.trim() || null,
            street: addrDto.street.trim(),
            city: addrDto.city.trim(),
            district: addrDto.district?.trim() || '',
            state: addrDto.state?.trim() || '',
            pincode: cleanPincode,
            landmark: addrDto.landmark?.trim() || null,
            label: addrDto.label?.trim() || 'Home',
            isDefault: addressCount === 0,
          },
        });
        this.logger.log(
          `[OrdersService] Saved shipping address into user addresses database (id: ${matchedAddress.id})`,
        );
      }

      if (!selectedAddress) {
        selectedAddress = matchedAddress;
      }
    }

    // C. Fallback: Find user's default / latest saved address from DB
    if (!selectedAddress) {
      selectedAddress = await this.prisma.db.address.findFirst({
        where: { userId },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      });
      if (selectedAddress) {
        this.logger.log(
          `[OrdersService] Using default saved address from DB (id: ${selectedAddress.id})`,
        );
      }
    }

    // D. If STILL no address, fail gracefully — DO NOT attach fake fallback dummy address!
    if (!selectedAddress) {
      this.logger.error(
        `[OrdersService] No delivery address found or provided for user: ${userId}`,
      );
      throw new BadRequestException(
        'A valid delivery address is required to place an order. Please add a shipping address.',
      );
    }

    this.logger.log(
      `[OrdersService] Delivery address resolved for ${selectedAddress.fullName}, ${selectedAddress.city}, ${selectedAddress.pincode}`,
    );

    const shippingAddressSnapshot = {
      id: selectedAddress.id,
      fullName: selectedAddress.fullName,
      phoneNumber: selectedAddress.phoneNumber,
      altPhoneNumber: selectedAddress.altPhoneNumber || null,
      building: selectedAddress.building || null,
      street: selectedAddress.street,
      city: selectedAddress.city,
      district: selectedAddress.district || '',
      state: selectedAddress.state || '',
      pincode: selectedAddress.pincode,
      landmark: selectedAddress.landmark || null,
    };

    // 4. Generate order reference
    const orderNumber = generateBrandId('ORD');

    // ----------------- UNIFIED SECURE CHECKOUT (NO UNVERIFIED ORDERS IN ADMIN) -----------------
    // For COD: Collect ₹200 advance deposit via Razorpay. Remaining balance is due on delivery.
    // For PREPAY: Collect 100% of finalAmount via Razorpay.
    const COD_ADVANCE_AMOUNT = 200;
    const advanceAmount = isCod ? Math.min(COD_ADVANCE_AMOUNT, finalAmount) : finalAmount;
    const payableOnlineAmount = advanceAmount;
    const amountInPaisa = Math.round(payableOnlineAmount * 100);

    if (amountInPaisa < 100) {
      throw new BadRequestException('Payable amount must be at least ₹1 (100 paise)');
    }

    this.logger.log(
      `[OrdersService] Step 4: Initializing Razorpay Gateway Order for ${orderNumber} (${isCod ? `COD Advance ₹${String(advanceAmount)}` : `Full Online ₹${String(finalAmount)}`})`,
    );

    const rzpOrder = await this.razorpayService.createOrder({
      amountInPaisa,
      receipt: orderNumber,
      notes: {
        userId,
        orderNumber,
        paymentType: isCod ? 'COD_ADVANCE' : 'PREPAID',
        advanceAmount: String(advanceAmount),
        balanceDue: String(Math.max(0, finalAmount - advanceAmount)),
      },
    });

    try {
      const order = await this.prisma.db.order.create({
        data: {
          id: orderNumber,
          userId,
          orderNumber,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          paymentMethod: isCod ? PaymentMethod.COD : PaymentMethod.RAZORPAY,
          razorpayOrderId: rzpOrder.id,
          totalAmount,
          discountAmount,
          shippingFees,
          finalAmount,
          advanceAmount,
          shippingAddress: shippingAddressSnapshot,
          items: {
            create: itemsData,
          },
        },
        include: {
          items: true,
        },
      });

      this.logger.log(
        `[OrdersService] Step 5: DB Order created with Razorpay Order ID: ${rzpOrder.id}. Cart items retained until payment verification.`,
      );

      return {
        type: isCod ? 'COD' : 'ONLINE',
        order,
        order_id: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        advanceAmount,
        balanceDue: Math.max(0, finalAmount - advanceAmount),
        razorpay: {
          orderId: rzpOrder.id,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          keyId: this.razorpayService.getKeyId(),
        },
      };
    } catch (dbError: any) {
      this.logger.error(
        `[OrdersService] Database error initiating order: ${dbError.message}`,
        dbError.stack,
      );
      throw new BadRequestException(`Failed to initialize order: ${dbError.message}`);
    }
  }

  /**
   * Verify Razorpay Payment Signature
   * Validates authenticity, updates order status, and clears cart
   */
  async verifyPayment(userId: string, dto: VerifyPaymentDto) {
    const orderId = (dto.orderId || dto.order_id)!;
    const razorpayOrderId = (dto.razorpayOrderId || dto.razorpay_order_id)!;
    const razorpayPaymentId = (dto.razorpayPaymentId || dto.razorpay_payment_id)!;
    const razorpaySignature = (dto.razorpaySignature || dto.razorpay_signature)!;

    this.logger.log(`[OrdersService] ---------------- VERIFY PAYMENT STARTED ----------------`);
    this.logger.log(
      `[OrdersService] Verifying payment for orderId: ${orderId}, razorpayOrderId: ${razorpayOrderId}`,
    );

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new BadRequestException(
        'Missing required payment verification fields (order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature)',
      );
    }

    const order = await this.prisma.db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      this.logger.error(`[OrdersService] Order ${orderId} not found`);
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      this.logger.warn(
        `[OrdersService] Security warning: user ${userId} tried to verify order ${order.id} owned by ${order.userId}`,
      );
      throw new UnauthorizedException('You are not authorized to verify this order');
    }

    // Idempotency: if already CAPTURED, return early
    if (order.paymentStatus === PaymentStatus.CAPTURED) {
      this.logger.log(`[OrdersService] Order ${order.id} is already marked CAPTURED. Returning.`);
      return {
        success: true,
        order,
      };
    }

    // Verify order ID match
    if (order.razorpayOrderId && order.razorpayOrderId !== razorpayOrderId) {
      this.logger.error(
        `[OrdersService] Razorpay order mismatch: expected ${order.razorpayOrderId}, received ${razorpayOrderId}`,
      );
      throw new BadRequestException('Razorpay order reference mismatch');
    }

    // Verify cryptographic signature (HMAC-SHA256 with constant-time equality check)
    const isValid = this.razorpayService.verifyPaymentSignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValid) {
      this.logger.error(`[OrdersService] Signature verification FAILED for order ${order.id}`);
      await this.prisma.db.order.update({
        where: { id: order.id },
        data: { paymentStatus: PaymentStatus.FAILED },
      });
      throw new BadRequestException('Invalid payment signature. Payment verification failed.');
    }

    this.logger.log(
      `[OrdersService] Signature verified successfully! Updating order to STOCK_CHECK / AUTHORIZED (Manual Capture mode)`,
    );

    // Update order status to STOCK_CHECK & AUTHORIZED (ZERO gateway fee charged so far)
    const updatedOrder = await this.prisma.db.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.STOCK_CHECK,
        paymentStatus: PaymentStatus.AUTHORIZED,
        razorpayPaymentId: razorpayPaymentId,
        razorpaySignature: razorpaySignature,
      },
      include: { items: true },
    });

    // Clear user's cart in DB now that payment is confirmed
    this.logger.log(
      `[OrdersService] Clearing cart items for user ${userId} post-payment confirmation`,
    );
    await this.prisma.db.cartItem.deleteMany({
      where: { userId },
    });

    // Dispatch notifications
    try {
      void this.notificationsService.notifyNewOrder(updatedOrder);
    } catch (pushErr: unknown) {
      this.logger.warn(`[OrdersService] Push notification dispatch warning:`, pushErr);
    }

    this.logger.log(
      `[OrdersService] ---------------- PAYMENT VERIFIED & COMPLETED ----------------`,
    );
    return {
      success: true,
      order: updatedOrder,
    };
  }

  /**
   * Admin confirms physical stock exists -> captures payment from bank (2% fee charged only now)
   * Hardened with Database Conditional Locking & Automatic Gateway Reconciliation on Timeout
   */
  async confirmStockAndCapture(orderId: string) {
    this.logger.log(`[OrdersService] Confirming stock and capturing payment for order ${orderId}`);
    const order = await this.prisma.db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException(
        'Cannot confirm stock or capture payment for a cancelled order',
      );
    }

    // Idempotency check: if already confirmed and captured, return safely
    if (
      order.status === OrderStatus.STOCK_CONFIRMED &&
      order.paymentStatus === PaymentStatus.CAPTURED
    ) {
      this.logger.log(
        `[OrdersService] Order ${order.id} is already captured and confirmed. Idempotent return.`,
      );
      return order;
    }

    if (order.paymentStatus === PaymentStatus.CAPTURE_PENDING) {
      throw new ConflictException(
        'Payment capture is currently pending gateway confirmation. Do not retry capture until status is reconciled.',
      );
    }

    let newPaymentStatus = order.paymentStatus;

    // Online payment flow: Must be in AUTHORIZED state
    if (order.paymentMethod === PaymentMethod.RAZORPAY) {
      if (
        order.paymentStatus !== PaymentStatus.AUTHORIZED &&
        order.paymentStatus !== PaymentStatus.CAPTURED
      ) {
        throw new BadRequestException(
          `Cannot capture payment in current state: ${order.paymentStatus}. Must be in AUTHORIZED state.`,
        );
      }

      if (order.paymentStatus === PaymentStatus.AUTHORIZED && order.razorpayPaymentId) {
        // ATOMIC ROW LOCK: Atomically claim transition from STOCK_CHECK to avoid race conditions
        const lockClaim = await this.prisma.db.order.updateMany({
          where: {
            id: order.id,
            status: OrderStatus.STOCK_CHECK,
            paymentStatus: PaymentStatus.AUTHORIZED,
          },
          data: {
            status: OrderStatus.STOCK_CONFIRMED,
          },
        });

        if (lockClaim.count === 0) {
          // Another concurrent request or webhook already transitioned the order!
          const current = await this.prisma.db.order.findUnique({ where: { id: order.id } });
          if (
            current?.paymentStatus === PaymentStatus.CAPTURED &&
            current?.status === OrderStatus.STOCK_CONFIRMED
          ) {
            this.logger.log(
              `[OrdersService] Concurrent capture won by another worker. Returning order idempotently.`,
            );
            return current;
          }
          throw new BadRequestException(
            `Order cannot be captured: currently in state ${String(current?.status)} / ${String(current?.paymentStatus)}`,
          );
        }

        const amountInPaisa = Math.round(Number(order.finalAmount) * 100);

        try {
          await this.razorpayService.capturePayment(order.razorpayPaymentId, amountInPaisa, 'INR');
          newPaymentStatus = PaymentStatus.CAPTURED;
        } catch (captureErr: any) {
          this.logger.warn(
            `[OrdersService] Capture API threw error: ${captureErr?.message}. Reconciling state with Razorpay before failure...`,
          );

          // FinTech Resilience: Reconcile gateway status directly before assuming failure
          try {
            const gatewayPayment = await this.razorpayService.fetchPayment(order.razorpayPaymentId);
            if (gatewayPayment?.status === 'captured') {
              this.logger.log(
                `[OrdersService] Reconciled successfully: Razorpay confirms payment ${order.razorpayPaymentId} is CAPTURED.`,
              );
              newPaymentStatus = PaymentStatus.CAPTURED;
            } else {
              // Delayed Gateway Capture Edge Case:
              // Capture request timed out or was delayed. An immediate fetch still returns 'authorized' or undefined.
              // We MUST NOT roll back to STOCK_CHECK with AUTHORIZED status, as a subsequent stock confirmation
              // could trigger a duplicate capture or void an in-flight capture!
              // Instead, persist durable CAPTURE_PENDING state.
              await this.prisma.db.order.update({
                where: { id: order.id },
                data: {
                  status: OrderStatus.STOCK_CHECK,
                  paymentStatus: PaymentStatus.CAPTURE_PENDING,
                },
              });
              this.logger.warn(
                `[OrdersService] Order ${order.id} marked as CAPTURE_PENDING. Gateway reported status: ${gatewayPayment?.status}`,
              );
              throw new ConflictException(
                `Payment capture outcome uncertain (gateway status: ${gatewayPayment?.status}). Transitioned to CAPTURE_PENDING. Scheduled reconciliation worker will finalize state.`,
              );
            }
          } catch (reconcileErr: any) {
            if (reconcileErr instanceof ConflictException) {
              throw reconcileErr;
            }
            await this.prisma.db.order.update({
              where: { id: order.id },
              data: {
                status: OrderStatus.STOCK_CHECK,
                paymentStatus: PaymentStatus.CAPTURE_PENDING,
              },
            });
            this.logger.error(
              `[OrdersService] Reconcile attempt failed for ${order.razorpayPaymentId}: ${reconcileErr.message}. Marked as CAPTURE_PENDING.`,
            );
            throw new ConflictException(
              `Payment capture timed out and gateway reconciliation was unreachable. Order marked as CAPTURE_PENDING.`,
            );
          }
        }
      }
    }

    const updated = await this.prisma.db.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.STOCK_CONFIRMED,
        paymentStatus: newPaymentStatus,
      },
      include: { items: true },
    });

    try {
      void this.notificationsService.notifyOrderStatus(updated);
    } catch (e) {
      this.logger.warn('[OrdersService] Notification warning on stock confirmation', e);
    }

    return updated;
  }

  /**
   * Admin marks product OUT OF STOCK -> cancels order and voids authorization (ZERO gateway fee loss!)
   * Distinct State Tracking: Marks as VOIDED (Never labels an authorization void as a refund!)
   */
  async rejectStockAndVoid(orderId: string, reason = 'Item out of stock') {
    this.logger.log(`[OrdersService] Rejecting order ${orderId} due to: ${reason}`);
    const order = await this.prisma.db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Idempotency: if already cancelled, return
    if (order.status === OrderStatus.CANCELLED) {
      return order;
    }

    if (order.paymentStatus === PaymentStatus.CAPTURE_PENDING) {
      throw new ConflictException(
        'Cannot void order while payment capture is in CAPTURE_PENDING state. Payment status must be reconciled first.',
      );
    }

    if (order.paymentStatus === PaymentStatus.CAPTURED) {
      throw new BadRequestException(
        'Payment has already been captured. Please use the refund endpoint to issue a customer refund.',
      );
    }

    let newPaymentStatus = order.paymentStatus;

    // If online payment is in AUTHORIZED state, void it (0% fee charged to merchant)
    if (order.paymentStatus === PaymentStatus.AUTHORIZED && order.razorpayPaymentId) {
      try {
        await this.razorpayService.voidPayment(order.razorpayPaymentId);
        newPaymentStatus = PaymentStatus.VOIDED; // Distinct financial state: VOIDED, not REFUNDED
      } catch (err: any) {
        this.logger.error(
          `[OrdersService] CRITICAL: Failed to void payment ${order.razorpayPaymentId}: ${err.message}. Marking as VOID_PENDING for admin reconciliation.`,
        );
        newPaymentStatus = PaymentStatus.VOID_PENDING;
      }
    }

    const updated = await this.prisma.db.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.CANCELLED,
        paymentStatus: newPaymentStatus,
      },
      include: { items: true },
    });

    try {
      void this.notificationsService.notifyOrderStatus(updated);
    } catch (e) {
      this.logger.warn('[OrdersService] Notification warning on stock rejection', e);
    }

    return updated;
  }

  /**
   * Process a refund for a previously CAPTURED payment
   * Enforces Cumulative Refund Ceiling & Gateway Timeout Reconciliation
   */
  async refundCapturedOrder(orderId: string, amount?: number, reason?: string) {
    this.logger.log(`[OrdersService] Initiating refund for captured order ${orderId}`);
    const order = await this.prisma.db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (
      order.paymentStatus !== PaymentStatus.CAPTURED &&
      order.paymentStatus !== PaymentStatus.PARTIALLY_REFUNDED
    ) {
      throw new BadRequestException(
        `Cannot refund order in current payment state: ${order.paymentStatus}. Only CAPTURED or PARTIALLY_REFUNDED payments can be refunded.`,
      );
    }

    if (!order.razorpayPaymentId) {
      throw new BadRequestException('No Razorpay payment reference found on order.');
    }

    const maxAmount = Number(order.finalAmount);
    const currentRefunded = Number(order.refundedAmount || 0);
    const remainingRefundable = Math.max(0, maxAmount - currentRefunded);

    if (remainingRefundable <= 0) {
      throw new BadRequestException(
        'This order has already been fully refunded. No refundable balance remains.',
      );
    }

    const requestedAmount = amount !== undefined ? amount : remainingRefundable;
    if (requestedAmount <= 0) {
      throw new BadRequestException('Refund amount must be greater than zero.');
    }

    if (requestedAmount > remainingRefundable) {
      throw new BadRequestException(
        `Requested refund (₹${requestedAmount}) exceeds the remaining refundable balance (₹${remainingRefundable}).`,
      );
    }

    const newTotalRefunded = currentRefunded + requestedAmount;
    const isFullRefund = newTotalRefunded >= maxAmount;
    const amountInPaisa = Math.round(requestedAmount * 100);

    try {
      await this.razorpayService.refundPayment(order.razorpayPaymentId, amountInPaisa, {
        orderId: order.id,
        reason: reason || 'Customer return / admin refund',
      });

      // Atomic conditional update: prevents concurrent partial refund overruns
      const lockClaim = await this.prisma.db.order.updateMany({
        where: {
          id: order.id,
          paymentStatus: { in: [PaymentStatus.CAPTURED, PaymentStatus.PARTIALLY_REFUNDED] },
          refundedAmount: { lte: maxAmount - requestedAmount },
        },
        data: {
          refundedAmount: newTotalRefunded,
          paymentStatus: isFullRefund ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED,
          ...(isFullRefund ? { status: OrderStatus.CANCELLED } : {}),
        },
      });

      if (lockClaim.count === 0) {
        this.logger.error(
          `[OrdersService] Concurrent refund detected: remaining refundable balance is insufficient.`,
        );
        throw new ConflictException(
          'Concurrent refund conflict: remaining balance is insufficient.',
        );
      }

      const updated = {
        ...order,
        refundedAmount: newTotalRefunded,
        paymentStatus: isFullRefund ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED,
        status: isFullRefund ? OrderStatus.CANCELLED : order.status,
      };

      return {
        success: true,
        order: updated,
        refundedAmount: requestedAmount,
        totalRefunded: newTotalRefunded,
        isPartial: !isFullRefund,
      };
    } catch (err: any) {
      this.logger.warn(
        `[OrdersService] Refund API exception: ${err.message}. Reconciling with Razorpay before failure...`,
      );
      // Reconcile before failing
      try {
        const fetched: any = await this.razorpayService.fetchPayment(order.razorpayPaymentId);
        const gatewayRefunded = fetched?.amount_refunded
          ? Number(fetched.amount_refunded) / 100
          : 0;
        if (gatewayRefunded >= newTotalRefunded) {
          this.logger.log(
            `[OrdersService] Reconciled: Razorpay confirms refund processed on gateway.`,
          );
          const updated = await this.prisma.db.order.update({
            where: { id: order.id },
            data: {
              refundedAmount: gatewayRefunded,
              paymentStatus:
                gatewayRefunded >= maxAmount
                  ? PaymentStatus.REFUNDED
                  : PaymentStatus.PARTIALLY_REFUNDED,
              status: gatewayRefunded >= maxAmount ? OrderStatus.CANCELLED : order.status,
            },
            include: { items: true },
          });
          return {
            success: true,
            order: updated,
            refundedAmount: requestedAmount,
            totalRefunded: gatewayRefunded,
            isPartial: gatewayRefunded < maxAmount,
          };
        }
      } catch (reconcileErr) {
        this.logger.error(`[OrdersService] Could not reconcile refund:`, reconcileErr);
      }

      await this.prisma.db.order.update({
        where: { id: order.id },
        data: { paymentStatus: PaymentStatus.REFUND_PENDING },
      });
      throw new BadRequestException(`Refund gateway request failed: ${err.message}`);
    }
  }

  /**
   * Handle Razorpay Webhooks with Transactional PostgreSQL Inbox Pattern & Crash Recovery
   */
  async handleWebhook(
    payload: any,
    signature: string,
    rawBody?: Buffer | string,
    eventId?: string,
  ) {
    this.logger.log(
      `[OrdersService] Incoming Razorpay Webhook Event: ${payload?.event} (ID: ${eventId || 'N/A'})`,
    );

    // Strict Webhook Security: Signature and raw body are NON-NEGOTIABLE
    if (!signature) {
      this.logger.error(`[OrdersService] Webhook rejected: missing x-razorpay-signature header`);
      throw new UnauthorizedException('Missing webhook signature');
    }

    if (!rawBody) {
      this.logger.error(`[OrdersService] Webhook rejected: missing raw request body`);
      throw new BadRequestException(
        'Raw request body is required for cryptographic signature verification',
      );
    }

    const isValid = this.razorpayService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      this.logger.error(
        `[OrdersService] Webhook rejected: cryptographic signature verification failed`,
      );
      throw new UnauthorizedException('Invalid webhook signature');
    }

    // Transactional Inbox Pattern: Durably store event in PostgreSQL before mutating orders
    const resolvedEventId = eventId || payload?.event_id || payload?.id;
    if (resolvedEventId) {
      try {
        await this.prisma.db.webhookEvent.create({
          data: {
            id: resolvedEventId,
            event: payload?.event || 'unknown',
            status: 'PENDING',
            payload: payload || {},
            attempts: 1,
          },
        });
      } catch (dbErr: any) {
        // Unique constraint violation (P2002) means this event was already delivered
        if (dbErr?.code === 'P2002' || dbErr?.message?.includes('Unique constraint failed')) {
          const existing = await this.prisma.db.webhookEvent.findUnique({
            where: { id: resolvedEventId },
          });
          if (existing?.status === 'PROCESSED') {
            this.logger.log(
              `[OrdersService] PostgreSQL Inbox: Webhook event ${resolvedEventId} already PROCESSED. Skipping duplicate replay safely.`,
            );
            return { received: true, duplicate: true };
          }
          this.logger.log(
            `[OrdersService] PostgreSQL Inbox: Resuming webhook event ${resolvedEventId} (status: ${String(existing?.status)})`,
          );
        } else {
          this.logger.warn(`[OrdersService] Webhook event persistence notice: ${dbErr.message}`);
        }
      }
    }

    // Execute business processing
    try {
      if (resolvedEventId) {
        await this.prisma.db.webhookEvent.updateMany({
          where: { id: resolvedEventId },
          data: { status: 'PROCESSING' },
        });
      }

      await this.processWebhookEventLogic(payload);

      if (resolvedEventId) {
        await this.prisma.db.webhookEvent.updateMany({
          where: { id: resolvedEventId },
          data: { status: 'PROCESSED', processedAt: new Date() },
        });
      }

      return { received: true };
    } catch (processErr: any) {
      if (resolvedEventId) {
        await this.prisma.db.webhookEvent.updateMany({
          where: { id: resolvedEventId },
          data: { status: 'FAILED', lastError: processErr.message },
        });
      }
      throw processErr;
    }
  }

  /**
   * Internal Webhook Business Logic Processor
   */
  public async processWebhookEventLogic(payload: any) {
    const event = payload?.event;
    if (event === 'payment.authorized') {
      const paymentEntity = payload?.payload?.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      if (rzpOrderId) {
        const order = await this.prisma.db.order.findUnique({
          where: { razorpayOrderId: rzpOrderId },
        });

        if (order?.paymentStatus === PaymentStatus.PENDING) {
          this.logger.log(
            `[OrdersService] Webhook payment.authorized: marking order ${order.id} as STOCK_CHECK / AUTHORIZED`,
          );
          await this.prisma.db.order.update({
            where: { id: order.id },
            data: {
              status: OrderStatus.STOCK_CHECK,
              paymentStatus: PaymentStatus.AUTHORIZED,
              ...(paymentId ? { razorpayPaymentId: paymentId } : {}),
            },
          });

          await this.prisma.db.cartItem.deleteMany({
            where: { userId: order.userId },
          });
        }
      }
    } else if (event === 'order.paid' || event === 'payment.captured') {
      const paymentEntity = payload?.payload?.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id || payload?.payload?.order?.entity?.id;
      const paymentId = paymentEntity?.id;

      if (rzpOrderId) {
        const order = await this.prisma.db.order.findUnique({
          where: { razorpayOrderId: rzpOrderId },
          include: { items: true },
        });

        if (order && order.paymentStatus !== PaymentStatus.CAPTURED) {
          this.logger.log(`[OrdersService] Webhook marking order ${order.id} as CAPTURED`);
          const updated = await this.prisma.db.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: PaymentStatus.CAPTURED,
              ...(paymentId ? { razorpayPaymentId: paymentId } : {}),
            },
            include: { items: true },
          });

          await this.prisma.db.cartItem.deleteMany({
            where: { userId: order.userId },
          });

          try {
            void this.notificationsService.notifyNewOrder(updated);
          } catch (e) {
            this.logger.warn('[OrdersService] Webhook notification warning', e);
          }
        }
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = payload?.payload?.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id;
      if (rzpOrderId) {
        await this.prisma.db.order.updateMany({
          where: { razorpayOrderId: rzpOrderId, paymentStatus: PaymentStatus.PENDING },
          data: { paymentStatus: PaymentStatus.FAILED },
        });
      }
    } else if (event === 'refund.processed') {
      const paymentEntity = payload?.payload?.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id;
      if (rzpOrderId) {
        await this.prisma.db.order.updateMany({
          where: { razorpayOrderId: rzpOrderId },
          data: { paymentStatus: PaymentStatus.REFUNDED },
        });
      }
    }
  }

  /**
   * Payment Reconciliation & Expiry Report
   * Identifies gateway/database state discrepancies and expiring authorizations without executing unverified actions
   */
  async getReconciliationReport() {
    const now = new Date();
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // 1. Authorizations nearing expiry (between 48h and 72h old)
    const expiringAuthorizations = await this.prisma.db.order.findMany({
      where: {
        paymentStatus: PaymentStatus.AUTHORIZED,
        status: OrderStatus.STOCK_CHECK,
        createdAt: { lte: twoDaysAgo, gte: threeDaysAgo },
      },
      select: {
        id: true,
        orderNumber: true,
        razorpayPaymentId: true,
        createdAt: true,
        finalAmount: true,
      },
    });

    // 2. Expired authorizations (> 72h old)
    const expiredAuthorizations = await this.prisma.db.order.findMany({
      where: {
        paymentStatus: PaymentStatus.AUTHORIZED,
        status: OrderStatus.STOCK_CHECK,
        createdAt: { lt: threeDaysAgo },
      },
      select: {
        id: true,
        orderNumber: true,
        razorpayPaymentId: true,
        createdAt: true,
        finalAmount: true,
      },
    });

    // 3. Pending failure states (VOID_PENDING, REFUND_PENDING)
    const pendingInterventions = await this.prisma.db.order.findMany({
      where: {
        paymentStatus: { in: [PaymentStatus.VOID_PENDING, PaymentStatus.REFUND_PENDING] },
      },
      select: {
        id: true,
        orderNumber: true,
        paymentStatus: true,
        razorpayPaymentId: true,
        updatedAt: true,
      },
    });

    // 4. Stuck or failed webhook inbox records
    const unhandledWebhooks = await this.prisma.db.webhookEvent.findMany({
      where: {
        OR: [
          { status: 'FAILED' },
          { status: { in: ['PENDING', 'PROCESSING'] }, createdAt: { lt: fiveMinutesAgo } },
        ],
      },
      take: 50,
      orderBy: { createdAt: 'desc' },
    });

    return {
      generatedAt: now.toISOString(),
      summary: {
        expiringAuthorizationsCount: expiringAuthorizations.length,
        expiredAuthorizationsCount: expiredAuthorizations.length,
        pendingInterventionsCount: pendingInterventions.length,
        unhandledWebhooksCount: unhandledWebhooks.length,
      },
      expiringAuthorizations,
      expiredAuthorizations,
      pendingInterventions,
      unhandledWebhooks,
    };
  }

  async getOrderStats() {
    const confirmedCondition = {
      NOT: {
        AND: [{ status: OrderStatus.PENDING }, { paymentStatus: PaymentStatus.PENDING }],
      },
    };

    const [totalOrders, unplacedOnSellersCount, processingCount, shippedCount, deliveredCount] =
      await Promise.all([
        this.prisma.db.order.count({ where: confirmedCondition }),
        this.prisma.db.order.count({
          where: {
            ...confirmedCondition,
            status: {
              in: [OrderStatus.STOCK_CHECK, OrderStatus.STOCK_CONFIRMED],
            },
          },
        }),
        this.prisma.db.order.count({
          where: {
            ...confirmedCondition,
            status: OrderStatus.PROCESSING,
          },
        }),
        this.prisma.db.order.count({
          where: {
            ...confirmedCondition,
            status: OrderStatus.SHIPPED,
          },
        }),
        this.prisma.db.order.count({
          where: {
            ...confirmedCondition,
            status: OrderStatus.DELIVERED,
          },
        }),
      ]);

    return {
      totalOrders,
      unplacedCount: unplacedOnSellersCount,
      nonPlacedOnSellers: unplacedOnSellersCount,
      processingCount,
      shippedCount,
      deliveredCount,
    };
  }

  async findAll() {
    // Only return confirmed orders to Admin panel (hide abandoned/unpaid checkout attempts)
    const orders = await this.prisma.db.order.findMany({
      where: {
        NOT: {
          AND: [{ status: OrderStatus.PENDING }, { paymentStatus: PaymentStatus.PENDING }],
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        user: { select: { name: true, phone: true } },
      },
    });

    const allProductIds = orders
      .flatMap((o) => o.items.map((i) => i.productId))
      .filter((id) => id && !id.startsWith('prod-manual'));
    const allItemNames = orders
      .flatMap((o) => o.items)
      .map((i) => i.name)
      .filter(Boolean);

    const products =
      allProductIds.length > 0 || allItemNames.length > 0
        ? await this.prisma.db.product.findMany({
            where: {
              OR: [
                ...(allProductIds.length > 0 ? [{ id: { in: allProductIds } }] : []),
                ...(allItemNames.length > 0 ? [{ name: { in: allItemNames } }] : []),
              ],
            },
            select: {
              id: true,
              name: true,
              mainImage: true,
              promoImage: true,
              liveImages: true,
              quality: true,
              colors: true,
            },
          })
        : [];

    const productById = new Map(products.map((p) => [p.id, p]));
    const productByName = new Map(products.map((p) => [p.name.toLowerCase(), p]));

    return orders.map((order) => ({
      ...order,
      items: order.items.map((item) => {
        const prod = productById.get(item.productId) || productByName.get(item.name.toLowerCase());
        const prodImg = prod?.mainImage || prod?.promoImage || prod?.liveImages?.[0] || '';
        const resolvedImage =
          item.image && !item.image.includes('photo-1523381210434-271e8be1f52b')
            ? item.image
            : prodImg || '';
        return {
          ...item,
          image: resolvedImage,
          quality: prod?.quality ?? null,
          colors: prod?.colors ?? [],
        };
      }),
    }));
  }

  async findUserOrders(userId: string) {
    return this.prisma.db.order.findMany({
      where: {
        userId,
        NOT: {
          AND: [{ status: OrderStatus.PENDING }, { paymentStatus: PaymentStatus.PENDING }],
        },
      },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  async findOne(id: string) {
    const includeConfig = {
      items: {
        include: {
          seller: true,
        },
      },
      user: { select: { name: true, phone: true } },
    };

    const order =
      (await this.prisma.db.order.findUnique({
        where: { id },
        include: includeConfig,
      })) ||
      (await this.prisma.db.order.findUnique({
        where: { orderNumber: id },
        include: includeConfig,
      }));

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const productIds = order.items
      .map((i) => i.productId)
      .filter((id) => id && !id.startsWith('prod-manual'));
    const itemNames = order.items.map((i) => i.name).filter(Boolean);

    const products =
      productIds.length > 0 || itemNames.length > 0
        ? await this.prisma.db.product.findMany({
            where: {
              OR: [
                ...(productIds.length > 0 ? [{ id: { in: productIds } }] : []),
                ...(itemNames.length > 0 ? [{ name: { in: itemNames } }] : []),
              ],
            },
            select: {
              id: true,
              name: true,
              mainImage: true,
              promoImage: true,
              liveImages: true,
              sellerId: true,
              categoryId: true,
              category: { select: { id: true, name: true, slug: true } },
              seller: { select: { id: true, name: true, storeName: true } },
              quality: true,
              colors: true,
            },
          })
        : [];

    const productMap = new Map(products.map((p) => [p.id, p]));
    const productByNameMap = new Map(products.map((p) => [p.name.toLowerCase(), p]));

    const enrichedItems = order.items.map((item) => {
      const prod = productMap.get(item.productId) || productByNameMap.get(item.name.toLowerCase());
      const prodImg = prod?.mainImage || prod?.promoImage || prod?.liveImages?.[0] || '';
      const resolvedImage =
        item.image && !item.image.includes('photo-1523381210434-271e8be1f52b')
          ? item.image
          : prodImg || '';

      return {
        ...item,
        image: resolvedImage,
        productSellerId: prod?.sellerId ?? item.sellerId ?? null,
        categoryId: prod?.categoryId ?? null,
        categoryName: prod?.category?.name ?? null,
        quality: prod?.quality ?? null,
        colors: prod?.colors ?? [],
        product: prod ? { ...prod, image: resolvedImage } : null,
      };
    });

    return {
      ...order,
      items: enrichedItems,
    };
  }

  async updateOrder(id: string, dto: UpdateOrderDto) {
    this.logger.log(`[OrdersService] Updating order ${id} with: ${JSON.stringify(dto)}`);
    const existing =
      (await this.prisma.db.order.findUnique({
        where: { id },
        include: { items: true, user: true },
      })) ||
      (await this.prisma.db.order.findUnique({
        where: { orderNumber: id },
        include: { items: true, user: true },
      }));

    if (!existing) {
      throw new NotFoundException('Order not found');
    }

    const orderId = existing.id;

    await this.prisma.db.$transaction(async (tx) => {
      // 1. Update items if provided
      let calculatedSubtotal = Number(existing.totalAmount);
      if (dto.items && Array.isArray(dto.items)) {
        const incomingIds = dto.items.filter((i) => i.id).map((i) => i.id!);

        // Delete items that are no longer in the list
        await tx.orderItem.deleteMany({
          where: {
            orderId,
            id: { notIn: incomingIds },
          },
        });

        calculatedSubtotal = 0;
        for (const item of dto.items) {
          const itemPrice = item.price || 0;
          const itemQty = item.quantity || 1;
          calculatedSubtotal += itemPrice * itemQty;

          const itemSellerId = item.sellerId !== undefined ? item.sellerId : (dto.sellerId ?? null);

          if (item.id && existing.items.some((ei) => ei.id === item.id)) {
            // Update existing item
            await tx.orderItem.update({
              where: { id: item.id },
              data: {
                name: item.name,
                image: item.image ?? '',
                size: item.size ?? '',
                color: item.color ?? '',
                price: itemPrice,
                quantity: itemQty,
                sellerId: itemSellerId,
                ...(item.productId ? { productId: item.productId } : {}),
              },
            });
          } else {
            // Create new item
            await tx.orderItem.create({
              data: {
                orderId,
                productId:
                  item.productId ||
                  `prod-manual-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                name: item.name,
                image: item.image ?? '',
                size: item.size ?? '',
                color: item.color ?? '',
                price: itemPrice,
                quantity: itemQty,
                sellerId: itemSellerId,
              },
            });
          }
        }
      } else if (dto.sellerId !== undefined) {
        // If items list was not passed, but sellerId was updated
        const targetSellerId = dto.sellerId || null;
        await tx.orderItem.updateMany({
          where: { orderId },
          data: { sellerId: targetSellerId },
        });
      }

      // 2. Shipping Address & Customer snapshot
      let currentAddress = (existing.shippingAddress as Record<string, any>) || {};
      if (typeof currentAddress === 'string') {
        try {
          currentAddress = JSON.parse(currentAddress);
        } catch {
          currentAddress = {};
        }
      }

      const updatedAddress = {
        ...currentAddress,
        ...(dto.shippingAddress || {}),
      };

      if (dto.customer) {
        if (dto.customer.name) {
          updatedAddress.fullName = dto.customer.name;
        }
        if (dto.customer.phone) {
          updatedAddress.phoneNumber = dto.customer.phone;
        }
        if (dto.customer.altPhone !== undefined) {
          updatedAddress.altPhoneNumber = dto.customer.altPhone;
        }
      }

      // 3. Totals
      const totalAmount = dto.totalAmount !== undefined ? dto.totalAmount : calculatedSubtotal;
      const discountAmount =
        dto.discountAmount !== undefined ? dto.discountAmount : Number(existing.discountAmount);
      const shippingFees =
        dto.shippingFees !== undefined ? dto.shippingFees : Number(existing.shippingFees);
      const finalAmount =
        dto.finalAmount !== undefined
          ? dto.finalAmount
          : Math.max(0, totalAmount - discountAmount + shippingFees);

      // 4. Update Order record
      await tx.order.update({
        where: { id: orderId },
        data: {
          ...(dto.status ? { status: dto.status } : {}),
          ...(dto.paymentStatus ? { paymentStatus: dto.paymentStatus } : {}),
          ...(dto.paymentMethod ? { paymentMethod: dto.paymentMethod } : {}),
          ...(dto.trackingNumber !== undefined ? { trackingNumber: dto.trackingNumber } : {}),
          ...(dto.courierPartner !== undefined ? { courierPartner: dto.courierPartner } : {}),
          totalAmount,
          discountAmount,
          shippingFees,
          finalAmount,
          shippingAddress: updatedAddress,
        },
      });

      // 5. Update linked User record if customer name provided
      if (dto.customer?.name && existing.userId) {
        try {
          await tx.user.update({
            where: { id: existing.userId },
            data: {
              name: dto.customer.name,
            },
          });
        } catch (e) {
          this.logger.warn(`Could not update user name for user ${existing.userId}: ${String(e)}`);
        }
      }
    });

    const updated = await this.findOne(orderId);

    this.logger.log(
      `[OrdersService] Order ${orderId} updated completely. New status: ${updated.status}, items: ${updated.items?.length}, total: ${String(updated.finalAmount)}`,
    );

    if (dto.status && existing.status !== dto.status) {
      try {
        void this.notificationsService.notifyOrderStatus(updated);
      } catch (pushErr: unknown) {
        this.logger.warn(`[OrdersService] Push notification status dispatch warning:`, pushErr);
      }
    }

    return updated;
  }

  async remove(id: string) {
    const existing =
      (await this.prisma.db.order.findUnique({ where: { id } })) ||
      (await this.prisma.db.order.findUnique({ where: { orderNumber: id } }));

    if (!existing) {
      throw new NotFoundException('Order not found');
    }
    return this.prisma.db.order.delete({
      where: { id: existing.id },
    });
  }
}
