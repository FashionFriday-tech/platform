import { OrderStatus, PaymentMethod, PaymentStatus } from '@ff/database';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../../database/prisma.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { OrdersService } from '../orders.service';
import { RazorpayService } from '../services/razorpay.service';

describe('OrdersService - Comprehensive Final Payment & Security Tests', () => {
  let service: OrdersService;
  let prismaMock: any;
  let razorpayMock: any;
  let notificationsMock: any;

  beforeEach(async () => {
    prismaMock = {
      db: {
        $transaction: jest.fn((cb) => cb(prismaMock.db)),
        order: {
          findUnique: jest.fn(),
          findMany: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          updateMany: jest.fn().mockResolvedValue({ count: 1 }),
          delete: jest.fn(),
          deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
          count: jest.fn(),
        },
        orderItem: {
          create: jest.fn(),
          update: jest.fn(),
          deleteMany: jest.fn(),
          updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        },
        user: {
          update: jest.fn(),
        },
        cartItem: {
          findMany: jest.fn(),
          deleteMany: jest.fn(),
        },
        address: {
          findUnique: jest.fn(),
          findFirst: jest.fn(),
          create: jest.fn(),
          count: jest.fn(),
        },
        product: {
          findMany: jest.fn().mockResolvedValue([]),
        },
        webhookEvent: {
          create: jest.fn(),
          findUnique: jest.fn(),
          findMany: jest.fn().mockResolvedValue([]),
          update: jest.fn(),
          updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        },
      },
    };

    razorpayMock = {
      getKeyId: jest.fn().mockReturnValue('rzp_test_mockKeyId'),
      createOrder: jest.fn().mockResolvedValue({
        id: 'order_rzp_mock123',
        amount: 20000,
        currency: 'INR',
      }),
      capturePayment: jest.fn(),
      voidPayment: jest.fn(),
      refundPayment: jest.fn(),
      fetchPayment: jest.fn(),
      verifyPaymentSignature: jest.fn(),
      verifyWebhookSignature: jest.fn(),
    };

    notificationsMock = {
      notifyNewOrder: jest.fn(),
      notifyOrderStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: RazorpayService, useValue: razorpayMock },
        { provide: NotificationsService, useValue: notificationsMock },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  describe('1. Payment Authorization & Signature Verification', () => {
    const mockOrder = {
      id: 'ORD-12345',
      userId: 'user-001',
      orderNumber: 'ORD-12345',
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.RAZORPAY,
      razorpayOrderId: 'order_rzp_123',
      finalAmount: 1500,
      items: [],
    };

    it('should successfully verify payment signature and transition to STOCK_CHECK / AUTHORIZED', async () => {
      prismaMock.db.order.findUnique.mockResolvedValue(mockOrder);
      razorpayMock.verifyPaymentSignature.mockReturnValue(true);
      prismaMock.db.order.update.mockResolvedValue({
        ...mockOrder,
        status: OrderStatus.STOCK_CHECK,
        paymentStatus: PaymentStatus.AUTHORIZED,
        razorpayPaymentId: 'pay_rzp_999',
      });

      const result = await service.verifyPayment('user-001', {
        orderId: 'ORD-12345',
        razorpayOrderId: 'order_rzp_123',
        razorpayPaymentId: 'pay_rzp_999',
        razorpaySignature: 'valid_signature_hash',
      });

      expect(result.success).toBe(true);
      expect(prismaMock.db.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'ORD-12345' },
          data: expect.objectContaining({
            status: OrderStatus.STOCK_CHECK,
            paymentStatus: PaymentStatus.AUTHORIZED,
            razorpayPaymentId: 'pay_rzp_999',
          }),
        }),
      );
      expect(prismaMock.db.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-001' },
      });
    });

    it('should reject invalid payment signatures and mark order paymentStatus as FAILED', async () => {
      prismaMock.db.order.findUnique.mockResolvedValue(mockOrder);
      razorpayMock.verifyPaymentSignature.mockReturnValue(false);

      await expect(
        service.verifyPayment('user-001', {
          orderId: 'ORD-12345',
          razorpayOrderId: 'order_rzp_123',
          razorpayPaymentId: 'pay_rzp_999',
          razorpaySignature: 'forged_signature',
        }),
      ).rejects.toThrow(BadRequestException);

      expect(prismaMock.db.order.update).toHaveBeenCalledWith({
        where: { id: 'ORD-12345' },
        data: { paymentStatus: PaymentStatus.FAILED },
      });
      expect(prismaMock.db.cartItem.deleteMany).not.toHaveBeenCalled();
    });

    it('should prevent IDOR: user cannot verify another user’s order', async () => {
      prismaMock.db.order.findUnique.mockResolvedValue(mockOrder);

      await expect(
        service.verifyPayment('attacker-user-id', {
          orderId: 'ORD-12345',
          razorpayOrderId: 'order_rzp_123',
          razorpayPaymentId: 'pay_rzp_999',
          razorpaySignature: 'valid_signature_hash',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('2. Payment Capture Atomicity & Gateway Reconciliation', () => {
    const authorizedOrder = {
      id: 'ORD-CAPTURE-1',
      orderNumber: 'ORD-CAPTURE-1',
      status: OrderStatus.STOCK_CHECK,
      paymentStatus: PaymentStatus.AUTHORIZED,
      paymentMethod: PaymentMethod.RAZORPAY,
      razorpayPaymentId: 'pay_auth_capture_1',
      finalAmount: 2500,
      items: [],
    };

    it('should atomically claim lock and capture funds from Razorpay', async () => {
      prismaMock.db.order.findUnique.mockResolvedValue(authorizedOrder);
      prismaMock.db.order.updateMany.mockResolvedValue({ count: 1 });
      razorpayMock.capturePayment.mockResolvedValue({
        id: 'pay_auth_capture_1',
        status: 'captured',
      });
      prismaMock.db.order.update.mockResolvedValue({
        ...authorizedOrder,
        status: OrderStatus.STOCK_CONFIRMED,
        paymentStatus: PaymentStatus.CAPTURED,
      });

      const result = await service.confirmStockAndCapture('ORD-CAPTURE-1');

      expect(prismaMock.db.order.updateMany).toHaveBeenCalledWith({
        where: {
          id: 'ORD-CAPTURE-1',
          status: OrderStatus.STOCK_CHECK,
          paymentStatus: PaymentStatus.AUTHORIZED,
        },
        data: {
          status: OrderStatus.STOCK_CONFIRMED,
        },
      });
      expect(razorpayMock.capturePayment).toHaveBeenCalledWith('pay_auth_capture_1', 250000, 'INR');
      expect(result.paymentStatus).toBe(PaymentStatus.CAPTURED);
    });

    it('should prevent double-capture race: if lock count is 0 and order was captured by peer, returns idempotently', async () => {
      prismaMock.db.order.findUnique
        .mockResolvedValueOnce(authorizedOrder) // Initial read
        .mockResolvedValueOnce({
          ...authorizedOrder,
          status: OrderStatus.STOCK_CONFIRMED,
          paymentStatus: PaymentStatus.CAPTURED,
        }); // Post-collision read

      // Lock claim fails (count = 0) because another concurrent request already updated it
      prismaMock.db.order.updateMany.mockResolvedValue({ count: 0 });

      const result = await service.confirmStockAndCapture('ORD-CAPTURE-1');

      expect(razorpayMock.capturePayment).not.toHaveBeenCalled();
      expect(result.status).toBe(OrderStatus.STOCK_CONFIRMED);
      expect(result.paymentStatus).toBe(PaymentStatus.CAPTURED);
    });

    it('should reconcile gateway state if capture throws exception (Never miss a successful gateway capture)', async () => {
      prismaMock.db.order.findUnique.mockResolvedValue(authorizedOrder);
      prismaMock.db.order.updateMany.mockResolvedValue({ count: 1 });
      razorpayMock.capturePayment.mockRejectedValue(new Error('Gateway response timeout'));
      razorpayMock.fetchPayment.mockResolvedValue({ id: 'pay_auth_capture_1', status: 'captured' });
      prismaMock.db.order.update.mockResolvedValue({
        ...authorizedOrder,
        status: OrderStatus.STOCK_CONFIRMED,
        paymentStatus: PaymentStatus.CAPTURED,
      });

      const result = await service.confirmStockAndCapture('ORD-CAPTURE-1');

      expect(razorpayMock.fetchPayment).toHaveBeenCalledWith('pay_auth_capture_1');
      expect(result.status).toBe(OrderStatus.STOCK_CONFIRMED);
      expect(result.paymentStatus).toBe(PaymentStatus.CAPTURED);
    });

    it('should reject capture on cancelled orders', async () => {
      prismaMock.db.order.findUnique.mockResolvedValue({
        ...authorizedOrder,
        status: OrderStatus.CANCELLED,
      });

      await expect(service.confirmStockAndCapture('ORD-CAPTURE-1')).rejects.toThrow(
        BadRequestException,
      );
      expect(razorpayMock.capturePayment).not.toHaveBeenCalled();
    });
  });

  describe('3. Distinct State Tracking: Authorization Void vs Refund', () => {
    const authorizedOrder = {
      id: 'ORD-OUT-OF-STOCK',
      orderNumber: 'ORD-OUT-OF-STOCK',
      status: OrderStatus.STOCK_CHECK,
      paymentStatus: PaymentStatus.AUTHORIZED,
      paymentMethod: PaymentMethod.RAZORPAY,
      razorpayPaymentId: 'pay_auth_void_123',
      finalAmount: 1200,
      items: [],
    };

    it('should release the bank authorization at ₹0 fee and set state to VOIDED (Never label void as refund)', async () => {
      prismaMock.db.order.findUnique.mockResolvedValue(authorizedOrder);
      razorpayMock.voidPayment.mockResolvedValue({ id: 'pay_auth_void_123', status: 'voided' });
      prismaMock.db.order.update.mockResolvedValue({
        ...authorizedOrder,
        status: OrderStatus.CANCELLED,
        paymentStatus: PaymentStatus.VOIDED,
      });

      const result = await service.rejectStockAndVoid(
        'ORD-OUT-OF-STOCK',
        'Out of stock at supplier',
      );

      expect(razorpayMock.voidPayment).toHaveBeenCalledWith('pay_auth_void_123');
      expect(result.status).toBe(OrderStatus.CANCELLED);
      expect(result.paymentStatus).toBe(PaymentStatus.VOIDED);
    });

    it('should mark VOID_PENDING if gateway void fails (never mask failure as successful void)', async () => {
      prismaMock.db.order.findUnique.mockResolvedValue(authorizedOrder);
      razorpayMock.voidPayment.mockRejectedValue(new Error('Gateway timeout'));
      prismaMock.db.order.update.mockResolvedValue({
        ...authorizedOrder,
        status: OrderStatus.CANCELLED,
        paymentStatus: PaymentStatus.VOID_PENDING,
      });

      const result = await service.rejectStockAndVoid('ORD-OUT-OF-STOCK', 'Out of stock');

      expect(prismaMock.db.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: OrderStatus.CANCELLED,
            paymentStatus: PaymentStatus.VOID_PENDING,
          }),
        }),
      );
      expect(result.paymentStatus).toBe(PaymentStatus.VOID_PENDING);
    });

    it('should block void if payment was already captured (forces refund endpoint)', async () => {
      prismaMock.db.order.findUnique.mockResolvedValue({
        ...authorizedOrder,
        paymentStatus: PaymentStatus.CAPTURED,
      });

      await expect(service.rejectStockAndVoid('ORD-OUT-OF-STOCK')).rejects.toThrow(
        BadRequestException,
      );
      expect(razorpayMock.voidPayment).not.toHaveBeenCalled();
    });
  });

  describe('4. Post-Capture Refunds (Full, Partial & Cumulative Limits)', () => {
    const capturedOrder = {
      id: 'ORD-CAPTURED-REFUND',
      orderNumber: 'ORD-CAPTURED-REFUND',
      status: OrderStatus.STOCK_CONFIRMED,
      paymentStatus: PaymentStatus.CAPTURED,
      paymentMethod: PaymentMethod.RAZORPAY,
      razorpayPaymentId: 'pay_captured_777',
      finalAmount: 3000,
      refundedAmount: 0,
      items: [],
    };

    it('should successfully execute a full refund and mark order REFUNDED & CANCELLED', async () => {
      prismaMock.db.order.findUnique.mockResolvedValue(capturedOrder);
      razorpayMock.refundPayment.mockResolvedValue({ id: 'rfnd_123', status: 'processed' });
      prismaMock.db.order.update.mockResolvedValue({
        ...capturedOrder,
        status: OrderStatus.CANCELLED,
        paymentStatus: PaymentStatus.REFUNDED,
        refundedAmount: 3000,
      });

      const result = await service.refundCapturedOrder(
        'ORD-CAPTURED-REFUND',
        3000,
        'Customer return',
      );

      expect(razorpayMock.refundPayment).toHaveBeenCalledWith(
        'pay_captured_777',
        300000,
        expect.objectContaining({ orderId: 'ORD-CAPTURED-REFUND' }),
      );
      expect(result.success).toBe(true);
      expect(result.isPartial).toBe(false);
      expect(result.order.paymentStatus).toBe(PaymentStatus.REFUNDED);
    });

    it('should successfully execute a partial refund and mark order PARTIALLY_REFUNDED', async () => {
      prismaMock.db.order.findUnique.mockResolvedValue(capturedOrder);
      razorpayMock.refundPayment.mockResolvedValue({ id: 'rfnd_part_456', status: 'processed' });
      prismaMock.db.order.update.mockResolvedValue({
        ...capturedOrder,
        status: OrderStatus.STOCK_CONFIRMED,
        paymentStatus: PaymentStatus.PARTIALLY_REFUNDED,
        refundedAmount: 1000,
      });

      const result = await service.refundCapturedOrder(
        'ORD-CAPTURED-REFUND',
        1000,
        'Partial return',
      );

      expect(razorpayMock.refundPayment).toHaveBeenCalledWith(
        'pay_captured_777',
        100000,
        expect.anything(),
      );
      expect(result.success).toBe(true);
      expect(result.isPartial).toBe(true);
      expect(result.order.paymentStatus).toBe(PaymentStatus.PARTIALLY_REFUNDED);
    });

    it('should reject refund if requested amount exceeds remaining refundable balance', async () => {
      const partiallyRefundedOrder = {
        ...capturedOrder,
        finalAmount: 3000,
        refundedAmount: 2500, // Remaining balance is ₹500
        paymentStatus: PaymentStatus.PARTIALLY_REFUNDED,
      };
      prismaMock.db.order.findUnique.mockResolvedValue(partiallyRefundedOrder);

      // Attempting to refund ₹600 when only ₹500 is left
      await expect(
        service.refundCapturedOrder('ORD-CAPTURED-REFUND', 600, 'Excess refund'),
      ).rejects.toThrow(BadRequestException);

      expect(razorpayMock.refundPayment).not.toHaveBeenCalled();
    });
  });

  describe('5. Persistent Webhook Inbox Pattern & Deduplication', () => {
    const rawBodyBuffer = Buffer.from(JSON.stringify({ event: 'payment.authorized' }));

    it('should reject webhooks without x-razorpay-signature with 401 Unauthorized', async () => {
      await expect(
        service.handleWebhook({ event: 'payment.authorized' }, '', rawBodyBuffer),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject webhooks with forged signature with 401 Unauthorized', async () => {
      razorpayMock.verifyWebhookSignature.mockReturnValue(false);

      await expect(
        service.handleWebhook({ event: 'payment.authorized' }, 'invalid_sig', rawBodyBuffer),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should durably persist webhook event in PostgreSQL inbox before processing', async () => {
      razorpayMock.verifyWebhookSignature.mockReturnValue(true);
      prismaMock.db.webhookEvent.create.mockResolvedValue({
        id: 'evt_unique_1',
        status: 'PENDING',
      });
      prismaMock.db.order.findUnique.mockResolvedValue({
        id: 'ORD-HOOK-1',
        userId: 'user-hook',
        paymentStatus: PaymentStatus.PENDING,
      });

      const payload = {
        event: 'payment.authorized',
        payload: {
          payment: {
            entity: { id: 'pay_hook_999', order_id: 'order_hook_123' },
          },
        },
      };

      const result = await service.handleWebhook(
        payload,
        'valid_sig',
        rawBodyBuffer,
        'evt_unique_1',
      );

      expect(result.received).toBe(true);
      expect(prismaMock.db.webhookEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ id: 'evt_unique_1', status: 'PENDING' }),
        }),
      );
      expect(prismaMock.db.webhookEvent.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'evt_unique_1' },
          data: expect.objectContaining({ status: 'PROCESSED' }),
        }),
      );
    });

    it('should gracefully handle PostgreSQL P2002 unique constraint (Multi-instance webhook deduplication)', async () => {
      razorpayMock.verifyWebhookSignature.mockReturnValue(true);
      prismaMock.db.webhookEvent.create.mockRejectedValue({
        code: 'P2002',
        message: 'Unique constraint failed',
      });
      prismaMock.db.webhookEvent.findUnique.mockResolvedValue({
        id: 'evt_collision_test',
        status: 'PROCESSED',
      });

      const payload = {
        event: 'payment.authorized',
        payload: { payment: { entity: { id: 'pay_1', order_id: 'order_1' } } },
      };

      const result = await service.handleWebhook(
        payload,
        'valid_sig',
        rawBodyBuffer,
        'evt_collision_test',
      );

      expect(result.received).toBe(true);
      expect(result.duplicate).toBe(true);
      expect(prismaMock.db.order.findUnique).not.toHaveBeenCalled();
    });
  });

  describe('6. Reconciliation & Expiry Report', () => {
    it('should identify expiring authorizations, expired authorizations, and pending intervention states', async () => {
      prismaMock.db.order.findMany
        .mockResolvedValueOnce([
          { id: 'ORD-EXPIRING', orderNumber: 'ORD-EXPIRING', finalAmount: 1500 },
        ])
        .mockResolvedValueOnce([
          { id: 'ORD-EXPIRED', orderNumber: 'ORD-EXPIRED', finalAmount: 2200 },
        ])
        .mockResolvedValueOnce([
          {
            id: 'ORD-VOID-PENDING',
            orderNumber: 'ORD-VOID-PENDING',
            paymentStatus: PaymentStatus.VOID_PENDING,
          },
        ]);
      prismaMock.db.webhookEvent.findMany.mockResolvedValueOnce([
        { id: 'evt_stuck', status: 'FAILED' },
      ]);

      const report = await service.getReconciliationReport();

      expect(report.summary.expiringAuthorizationsCount).toBe(1);
      expect(report.summary.expiredAuthorizationsCount).toBe(1);
      expect(report.summary.pendingInterventionsCount).toBe(1);
      expect(report.summary.unhandledWebhooksCount).toBe(1);
      expect(report.expiringAuthorizations[0].id).toBe('ORD-EXPIRING');
      expect(report.pendingInterventions[0].id).toBe('ORD-VOID-PENDING');
      expect(report.unhandledWebhooks[0].id).toBe('evt_stuck');
    });
  });

  describe('7. Complete Order Modification by Admin (Super Admin & Sales Admin)', () => {
    it('should completely update order items, customer, address, pricing, and fulfillment', async () => {
      const existingOrder = {
        id: 'ORD-EDIT-1',
        orderNumber: 'ORD-EDIT-1',
        userId: 'USER-1',
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: PaymentMethod.COD,
        totalAmount: 1000,
        discountAmount: 0,
        shippingFees: 200,
        finalAmount: 1200,
        shippingAddress: {
          fullName: 'Old Customer',
          phoneNumber: '9876543210',
          street: 'Old Street',
          city: 'Old City',
          state: 'Old State',
          pincode: '400001',
        },
        items: [
          {
            id: 'ITEM-1',
            orderId: 'ORD-EDIT-1',
            productId: 'PROD-1',
            name: 'Original Dress',
            image: 'https://example.com/dress.jpg',
            size: 'M',
            color: 'Red',
            price: 1000,
            quantity: 1,
            sellerId: null,
          },
        ],
        user: { name: 'Old Customer', phone: '9876543210' },
      };

      // Mock finding the order
      prismaMock.db.order.findUnique
        .mockResolvedValueOnce(existingOrder) // for updateOrder
        .mockResolvedValueOnce({
          ...existingOrder,
          status: OrderStatus.PROCESSING,
          courierPartner: 'Delhivery',
          trackingNumber: 'DEL-999',
          totalAmount: 1800,
          discountAmount: 100,
          shippingFees: 0,
          finalAmount: 1700,
          shippingAddress: {
            fullName: 'New Customer',
            phoneNumber: '9123456789',
            street: 'New Street 42',
            city: 'New City',
            state: 'New State',
            pincode: '560001',
          },
          items: [
            {
              id: 'ITEM-1',
              productId: 'PROD-1',
              name: 'Updated Dress',
              image: 'https://example.com/dress.jpg',
              size: 'L',
              color: 'Blue',
              price: 1200,
              quantity: 1,
              sellerId: 'SELLER-1',
            },
            {
              id: 'ITEM-2',
              productId: 'PROD-2',
              name: 'New Scarf',
              image: 'https://example.com/scarf.jpg',
              size: 'Free Size',
              color: 'Gold',
              price: 600,
              quantity: 1,
              sellerId: 'SELLER-1',
            },
          ],
        }); // for findOne after update

      const updatePayload: any = {
        status: OrderStatus.PROCESSING,
        courierPartner: 'Delhivery',
        trackingNumber: 'DEL-999',
        sellerId: 'SELLER-1',
        customer: {
          name: 'New Customer',
          phone: '9123456789',
        },
        shippingAddress: {
          fullName: 'New Customer',
          phoneNumber: '9123456789',
          street: 'New Street 42',
          city: 'New City',
          state: 'New State',
          pincode: '560001',
        },
        discountAmount: 100,
        shippingFees: 0,
        items: [
          {
            id: 'ITEM-1',
            productId: 'PROD-1',
            name: 'Updated Dress',
            image: 'https://example.com/dress.jpg',
            size: 'L',
            color: 'Blue',
            price: 1200,
            quantity: 1,
            sellerId: 'SELLER-1',
          },
          {
            name: 'New Scarf',
            image: 'https://example.com/scarf.jpg',
            size: 'Free Size',
            color: 'Gold',
            price: 600,
            quantity: 1,
            sellerId: 'SELLER-1',
          },
        ],
      };

      const result = await service.updateOrder('ORD-EDIT-1', updatePayload);

      expect(prismaMock.db.orderItem.deleteMany).toHaveBeenCalled();
      expect(prismaMock.db.orderItem.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'ITEM-1' },
          data: expect.objectContaining({
            name: 'Updated Dress',
            size: 'L',
            color: 'Blue',
            price: 1200,
          }),
        }),
      );
      expect(prismaMock.db.orderItem.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'New Scarf',
            price: 600,
            quantity: 1,
          }),
        }),
      );
      expect(prismaMock.db.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'ORD-EDIT-1' },
          data: expect.objectContaining({
            status: OrderStatus.PROCESSING,
            courierPartner: 'Delhivery',
            trackingNumber: 'DEL-999',
            totalAmount: 1800,
            discountAmount: 100,
            shippingFees: 0,
            finalAmount: 1700,
          }),
        }),
      );
      expect(result.finalAmount).toBe(1700);
      expect(result.items.length).toBe(2);
    });

    it('should auto-void authorization and update paymentStatus to VOIDED when order status is updated to CANCELLED', async () => {
      const existingOrder = {
        id: 'ORD-CANCEL-1',
        orderNumber: 'ORD-CANCEL-1',
        status: OrderStatus.STOCK_CHECK,
        paymentStatus: PaymentStatus.AUTHORIZED,
        razorpayPaymentId: 'pay_auth_cancel_1',
        totalAmount: 1000,
        discountAmount: 0,
        shippingFees: 0,
        finalAmount: 1000,
        shippingAddress: { fullName: 'Test User' },
        items: [],
      };

      prismaMock.db.order.findUnique.mockResolvedValue(existingOrder as any);
      prismaMock.db.$transaction.mockImplementation(async (cb: any) =>
        cb({
          order: prismaMock.db.order,
          orderItem: prismaMock.db.orderItem,
          user: prismaMock.db.user,
        }),
      );

      await service.updateOrder('ORD-CANCEL-1', {
        status: OrderStatus.CANCELLED,
      });

      expect(razorpayMock.voidPayment).toHaveBeenCalledWith('pay_auth_cancel_1');
      expect(prismaMock.db.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'ORD-CANCEL-1' },
          data: expect.objectContaining({
            status: OrderStatus.CANCELLED,
            paymentStatus: PaymentStatus.VOIDED,
          }),
        }),
      );
    });

    it('should void payment authorization before deleting order in remove', async () => {
      const existingOrder = {
        id: 'ORD-DEL-1',
        orderNumber: 'ORD-DEL-1',
        status: OrderStatus.STOCK_CHECK,
        paymentStatus: PaymentStatus.AUTHORIZED,
        razorpayPaymentId: 'pay_auth_del_1',
      };

      prismaMock.db.order.findUnique.mockResolvedValue(existingOrder as any);
      prismaMock.db.order.delete.mockResolvedValue(existingOrder as any);

      await service.remove('ORD-DEL-1');

      expect(razorpayMock.voidPayment).toHaveBeenCalledWith('pay_auth_del_1');
      expect(prismaMock.db.order.delete).toHaveBeenCalledWith({
        where: { id: 'ORD-DEL-1' },
      });
    });
  });

  describe('8. Address Resolution & Persistence in createOrder', () => {
    const mockCartItem = {
      id: 'cart-1',
      userId: 'user-addr-1',
      productId: 'prod-1',
      quantity: 1,
      size: 'M',
      color: 'Black',
      product: {
        id: 'prod-1',
        name: 'Classic Shirt',
        sellingPrice: 999,
        mainImage: '/img.jpg',
        isCodAvailable: true,
      },
    };

    it('should save shippingAddress into user address database and use it on the order', async () => {
      prismaMock.db.cartItem.findMany.mockResolvedValue([mockCartItem]);
      prismaMock.db.address.findFirst.mockResolvedValue(null);
      prismaMock.db.address.count.mockResolvedValue(0);
      prismaMock.db.address.create.mockResolvedValue({
        id: 'addr-created-1',
        userId: 'user-addr-1',
        fullName: 'Rahul Sharma',
        phoneNumber: '9876543210',
        altPhoneNumber: null,
        building: 'Flat 402',
        street: 'MG Road',
        city: 'Bengaluru',
        district: 'Bengaluru Urban',
        state: 'Karnataka',
        pincode: '560001',
        landmark: 'Metro Station',
        label: 'Home',
        isDefault: true,
      });

      prismaMock.db.order.create.mockImplementation((args: any) => ({
        ...args.data,
        id: 'ORD-ADDR-TEST',
      }));

      const res = await service.createOrder('user-addr-1', {
        paymentMethod: PaymentMethod.COD,
        shippingAddress: {
          fullName: 'Rahul Sharma',
          phoneNumber: '9876543210',
          street: 'MG Road',
          city: 'Bengaluru',
          district: 'Bengaluru Urban',
          state: 'Karnataka',
          pincode: '560001',
          building: 'Flat 402',
          landmark: 'Metro Station',
          label: 'Home',
        },
      });

      expect(prismaMock.db.address.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-addr-1',
            fullName: 'Rahul Sharma',
            district: 'Bengaluru Urban',
            state: 'Karnataka',
            pincode: '560001',
          }),
        }),
      );

      expect(prismaMock.db.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            shippingAddress: expect.objectContaining({
              fullName: 'Rahul Sharma',
              district: 'Bengaluru Urban',
              state: 'Karnataka',
              pincode: '560001',
            }),
          }),
        }),
      );
      expect(res.type).toBe('COD');
    });

    it('should reject order creation if no address is provided and none exists in DB', async () => {
      prismaMock.db.cartItem.findMany.mockResolvedValue([mockCartItem]);
      prismaMock.db.address.findFirst.mockResolvedValue(null);

      await expect(
        service.createOrder('user-addr-2', {
          paymentMethod: PaymentMethod.COD,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('9. Cash on Delivery (COD) Advance Deposit & Unconfirmed Order Isolation', () => {
    const codCartItem = {
      id: 'cart-cod-1',
      userId: 'user-cod-1',
      productId: 'prod-1',
      quantity: 1,
      size: 'M',
      color: 'Black',
      product: {
        id: 'prod-1',
        name: 'Classic Shirt',
        sellingPrice: 999,
        mainImage: '/img.jpg',
        isCodAvailable: true,
      },
    };

    it('should create Razorpay order for ₹200 advance deposit on COD checkout and retain cart', async () => {
      prismaMock.db.cartItem.findMany.mockResolvedValue([codCartItem]);
      prismaMock.db.address.findFirst.mockResolvedValue({
        id: 'addr-cod-1',
        userId: 'user-cod-1',
        fullName: 'Aman Verma',
        phoneNumber: '9876543210',
        street: 'Brigade Road',
        city: 'Bengaluru',
        pincode: '560025',
      });

      prismaMock.db.order.create.mockImplementation((args: any) => ({
        ...args.data,
        id: 'ORD-COD-ADVANCE',
      }));

      const res = await service.createOrder('user-cod-1', {
        paymentMethod: PaymentMethod.COD,
        addressId: 'addr-cod-1',
      });

      // Verify Razorpay order was initiated for ₹200 (20,000 paise)
      expect(razorpayMock.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          amountInPaisa: 20000,
          notes: expect.objectContaining({
            paymentType: 'COD_ADVANCE',
            advanceAmount: '200',
          }),
        }),
      );

      // Verify DB Order created with PENDING / PENDING and advanceAmount = 200
      expect(prismaMock.db.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: OrderStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING,
            paymentMethod: PaymentMethod.COD,
            advanceAmount: 200,
          }),
        }),
      );

      // Verify cart was NOT cleared before payment verification
      expect(prismaMock.db.cartItem.deleteMany).not.toHaveBeenCalled();

      expect(res.type).toBe('COD');
      expect(res.advanceAmount).toBe(200);
      expect(res.razorpay).toBeDefined();
    });

    it('should block COD checkout if any product does not support COD', async () => {
      prismaMock.db.cartItem.findMany.mockResolvedValue([
        {
          id: 'cart-item-prepaid-only',
          userId: 'user-cod-1',
          productId: 'prod-prepaid',
          quantity: 1,
          size: 'L',
          color: 'Blue',
          product: {
            id: 'prod-prepaid',
            name: 'Prepaid Exclusive Tee',
            sellingPrice: 1999,
            isCodAvailable: false,
          },
        },
      ]);

      await expect(
        service.createOrder('user-cod-1', {
          paymentMethod: PaymentMethod.COD,
          shippingAddress: {
            fullName: 'Amit Kumar',
            phoneNumber: '9876543210',
            street: 'MG Road',
            city: 'Bengaluru',
            district: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560001',
          },
        }),
      ).rejects.toThrow('Cash on Delivery is not available for "Prepaid Exclusive Tee"');
    });

    it('should isolate and exclude unconfirmed (PENDING / PENDING) checkouts from Admin panel', async () => {
      prismaMock.db.order.findMany.mockResolvedValue([]);

      await service.findAll();

      expect(prismaMock.db.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            NOT: {
              AND: [{ status: OrderStatus.PENDING }, { paymentStatus: PaymentStatus.PENDING }],
            },
          },
        }),
      );
    });

    it('should isolate and exclude unconfirmed (PENDING / PENDING) checkouts from user orders and stats', async () => {
      prismaMock.db.order.count.mockResolvedValue(0);
      prismaMock.db.order.findMany.mockResolvedValue([]);

      await service.getOrderStats();
      await service.findUserOrders('user-test-1');

      expect(prismaMock.db.order.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            NOT: {
              AND: [{ status: OrderStatus.PENDING }, { paymentStatus: PaymentStatus.PENDING }],
            },
          }),
        }),
      );

      expect(prismaMock.db.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'user-test-1',
            NOT: {
              AND: [{ status: OrderStatus.PENDING }, { paymentStatus: PaymentStatus.PENDING }],
            },
          }),
        }),
      );
    });

    it('should delete unconfirmed pending order when cancelPendingOrder is called', async () => {
      prismaMock.db.order.findUnique.mockResolvedValue({
        id: 'ord-pending-1',
        userId: 'user-test-1',
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      } as any);
      prismaMock.db.order.delete.mockResolvedValue({} as any);

      const res = await service.cancelPendingOrder('ord-pending-1', 'user-test-1');

      expect(res.success).toBe(true);
      expect(prismaMock.db.order.delete).toHaveBeenCalledWith({
        where: { id: 'ord-pending-1' },
      });
    });

    it('should clean up stale unconfirmed pending orders for user when createOrder is initiated', async () => {
      prismaMock.db.cartItem.findMany.mockResolvedValue([codCartItem]);
      prismaMock.db.address.findFirst.mockResolvedValue({
        id: 'addr-cod-1',
        userId: 'user-cod-1',
        fullName: 'Aman Verma',
        phoneNumber: '9876543210',
        street: 'Brigade Road',
        city: 'Bengaluru',
        pincode: '560025',
      });
      prismaMock.db.order.deleteMany.mockResolvedValue({ count: 1 } as any);
      prismaMock.db.order.create.mockResolvedValue({
        id: 'ORD-NEW-1',
        orderNumber: 'ORD-NEW-1',
        finalAmount: 999,
        items: [],
      } as any);

      await service.createOrder('user-cod-1', {
        paymentMethod: PaymentMethod.COD,
        addressId: 'addr-cod-1',
      });

      expect(prismaMock.db.order.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-cod-1',
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
        },
      });
    });
  });
});
