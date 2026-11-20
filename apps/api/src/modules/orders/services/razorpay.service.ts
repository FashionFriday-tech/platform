import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import Razorpay from 'razorpay';

export interface CreateRazorpayOrderParams {
  amountInPaisa: number; // Amount in smallest unit (1 INR = 100 Paisa)
  receipt: string;
  notes?: Record<string, string>;
}

@Injectable()
export class RazorpayService {
  private readonly logger = new Logger(RazorpayService.name);
  private instance: Razorpay | null = null;
  private readonly keyId: string;
  private readonly keySecret: string;
  private readonly webhookSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.keyId =
      this.configService.get<string>('RAZORPAY_KEY_ID') || process.env.RAZORPAY_KEY_ID || '';
    this.keySecret =
      this.configService.get<string>('RAZORPAY_KEY_SECRET') ||
      process.env.RAZORPAY_KEY_SECRET ||
      '';
    this.webhookSecret =
      this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET') ||
      process.env.RAZORPAY_WEBHOOK_SECRET ||
      '';

    if (this.keyId && this.keySecret) {
      try {
        this.instance = new Razorpay({
          key_id: this.keyId,
          key_secret: this.keySecret,
        });
        this.logger.log(
          `[RazorpayService] Razorpay client initialized successfully (Key ID: ${this.keyId.substring(0, 8)}...)`,
        );
      } catch (err: any) {
        this.logger.error(`[RazorpayService] Failed to initialize Razorpay SDK: ${err.message}`);
      }
    } else {
      this.logger.warn(
        `[RazorpayService] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set. Razorpay is running in unconfigured mode.`,
      );
    }
  }

  public isConfigured(): boolean {
    return Boolean(this.instance && this.keyId && this.keySecret);
  }

  public getKeyId(): string {
    return this.keyId;
  }

  /**
   * Create an Order with Razorpay
   */
  async createOrder(
    params: CreateRazorpayOrderParams,
  ): Promise<{ id: string; amount: number; currency: string }> {
    if (!this.instance) {
      this.logger.error(
        `[RazorpayService] Cannot create Razorpay order: Razorpay credentials are not configured`,
      );
      throw new Error('Payment gateway is not configured. Please check server credentials.');
    }

    try {
      this.logger.log(
        `[RazorpayService] Creating order on Razorpay with MANUAL CAPTURE (capture=false): amount=${params.amountInPaisa} paisa, receipt=${params.receipt}`,
      );
      const order = await this.instance.orders.create({
        amount: params.amountInPaisa,
        currency: 'INR',
        receipt: params.receipt,
        payment_capture: false, // MANUAL CAPTURE: Keep in AUTHORIZED state until stock is confirmed (ZERO fee if cancelled)
        notes: params.notes || {},
      });

      this.logger.log(`[RazorpayService] Razorpay order created successfully: ${order.id}`);
      return {
        id: order.id,
        amount: Number(order.amount),
        currency: order.currency,
      };
    } catch (error: any) {
      this.logger.error(
        `[RazorpayService] Razorpay order creation failed: ${error?.error?.description || error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Fetch current payment status directly from Razorpay Gateway
   * Essential for reconciliation and verifying gateway state before retry
   */
  async fetchPayment(paymentId: string) {
    if (!this.instance) {
      this.logger.log(`[RazorpayService] Mock fetch for payment ${paymentId}`);
      return { id: paymentId, status: 'authorized' };
    }

    try {
      this.logger.log(`[RazorpayService] Fetching payment details from Razorpay: ${paymentId}`);
      const payment = await this.instance.payments.fetch(paymentId);
      return payment;
    } catch (err: any) {
      this.logger.error(
        `[RazorpayService] Error fetching payment ${paymentId}: ${err?.error?.description || err.message}`,
      );
      throw err;
    }
  }

  /**
   * Capture an Authorized Payment after stock is confirmed
   * 2% gateway fee is charged ONLY when this is called
   */
  async capturePayment(paymentId: string, amountInPaisa: number, currency = 'INR') {
    if (!this.instance) {
      this.logger.log(`[RazorpayService] Mock capture for payment ${paymentId}`);
      return { id: paymentId, status: 'captured' };
    }

    try {
      this.logger.log(
        `[RazorpayService] Capturing payment ${paymentId} for amount ${amountInPaisa} paisa`,
      );
      const response = await this.instance.payments.capture(paymentId, amountInPaisa, currency);
      return response;
    } catch (err: any) {
      this.logger.error(
        `[RazorpayService] Error capturing payment ${paymentId}: ${err?.error?.description || err.message}`,
      );
      throw err;
    }
  }

  /**
   * Void/Cancel an Authorized Payment for out-of-stock orders
   * ZERO gateway fees are charged because funds were never settled!
   */
  async voidPayment(paymentId: string) {
    if (!this.instance) {
      this.logger.log(`[RazorpayService] Mock void for payment ${paymentId}`);
      return { id: paymentId, status: 'voided' };
    }

    try {
      this.logger.log(`[RazorpayService] Voiding authorized payment ${paymentId}`);
      // An uncaptured payment refunded before capture acts as a network void with zero fees
      const response = await (this.instance.payments as any).refund(paymentId);
      return response;
    } catch (err: any) {
      this.logger.error(
        `[RazorpayService] Error voiding payment ${paymentId}: ${err?.error?.description || err.message}`,
      );
      throw err;
    }
  }

  /**
   * Issue a Refund for a Captured Payment
   */
  async refundPayment(paymentId: string, amountInPaisa?: number, notes?: Record<string, string>) {
    if (!this.instance) {
      this.logger.log(`[RazorpayService] Mock refund for payment ${paymentId}`);
      return { id: `rfnd_mock_${Date.now()}`, status: 'processed', amount: amountInPaisa };
    }

    try {
      this.logger.log(
        `[RazorpayService] Refunding payment ${paymentId} for amount ${amountInPaisa || 'full'}`,
      );
      const params: any = {};
      if (amountInPaisa) {
        params.amount = amountInPaisa;
      }
      if (notes) {
        params.notes = notes;
      }

      const response = await (this.instance.payments as any).refund(paymentId, params);
      return response;
    } catch (err: any) {
      this.logger.error(
        `[RazorpayService] Error refunding payment ${paymentId}: ${err?.error?.description || err.message}`,
      );
      throw err;
    }
  }

  /**
   * Fetch all refunds associated with a Razorpay payment
   */
  async fetchPaymentRefunds(paymentId: string) {
    if (!this.instance) {
      this.logger.log(`[RazorpayService] Mock fetch refunds for payment ${paymentId}`);
      return {
        count: 1,
        items: [
          {
            id: `rfnd_mock_${Date.now()}`,
            amount: 100,
            status: 'processed',
            created_at: Math.floor(Date.now() / 1000) - 3600,
            acquirer_data: { rrn: '668616601255' },
          },
        ],
      };
    }

    try {
      this.logger.log(`[RazorpayService] Fetching refunds for payment ${paymentId}`);
      const refunds = await (this.instance.payments as any).fetchMultipleRefund(paymentId);
      return refunds;
    } catch (err: any) {
      this.logger.error(
        `[RazorpayService] Error fetching refunds for payment ${paymentId}: ${err?.error?.description || err.message}`,
      );
      return null;
    }
  }

  /**
   * Verify Payment Signature using HMAC-SHA256 with Constant-Time Comparison
   * Prevents timing attacks
   */
  verifyPaymentSignature(params: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): boolean {
    if (!this.keySecret) {
      this.logger.error(`[RazorpayService] RAZORPAY_KEY_SECRET missing. Cannot verify signature.`);
      return false;
    }

    try {
      const payload = `${params.orderId}|${params.paymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(payload)
        .digest('hex');

      const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
      const receivedBuffer = Buffer.from(params.signature, 'utf8');

      if (expectedBuffer.length !== receivedBuffer.length) {
        this.logger.warn(`[RazorpayService] Signature length mismatch.`);
        return false;
      }

      const isValid = crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
      if (!isValid) {
        this.logger.warn(
          `[RazorpayService] Payment signature mismatch for order ${params.orderId}`,
        );
      }
      return isValid;
    } catch (err: any) {
      this.logger.error(`[RazorpayService] Error verifying signature: ${err.message}`);
      return false;
    }
  }

  /**
   * Verify Webhook Signature
   */
  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean {
    if (!this.webhookSecret) {
      this.logger.warn(`[RazorpayService] RAZORPAY_WEBHOOK_SECRET not set.`);
      return false;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(rawBody)
        .digest('hex');

      const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
      const receivedBuffer = Buffer.from(signature, 'utf8');

      if (expectedBuffer.length !== receivedBuffer.length) {
        return false;
      }

      return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
    } catch (err: any) {
      this.logger.error(`[RazorpayService] Webhook verification error: ${err.message}`);
      return false;
    }
  }
}
