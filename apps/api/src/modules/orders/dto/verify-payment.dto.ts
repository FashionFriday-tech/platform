import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const verifyPaymentSchema = z
  .object({
    orderId: z.string().optional(),
    order_id: z.string().optional(),
    razorpayOrderId: z.string().optional(),
    razorpay_order_id: z.string().optional(),
    razorpayPaymentId: z.string().optional(),
    razorpay_payment_id: z.string().optional(),
    razorpaySignature: z.string().optional(),
    razorpay_signature: z.string().optional(),
  })
  .refine(
    (data) =>
      Boolean(data.orderId || data.order_id) &&
      Boolean(data.razorpayOrderId || data.razorpay_order_id) &&
      Boolean(data.razorpayPaymentId || data.razorpay_payment_id) &&
      Boolean(data.razorpaySignature || data.razorpay_signature),
    {
      message:
        'Missing required payment verification fields (order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature)',
    },
  );

export class VerifyPaymentDto extends createZodDto(verifyPaymentSchema) {}
