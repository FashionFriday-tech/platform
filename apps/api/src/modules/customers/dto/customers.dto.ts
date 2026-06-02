import { CreateCustomerAdminSchema } from '@ff/schemas';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class CreateCustomerDto extends createZodDto(CreateCustomerAdminSchema) {}

export const CreateCustomerOrderSchema = z.object({
  productName: z.string().min(3),
  size: z.string().min(1),
  color: z.string().min(1),
  price: z.number().min(0.01),
  quantity: z.number().int().min(1),
  paymentMethod: z.enum(['COD', 'RAZORPAY', 'STRIPE', 'WALLET']),
  paymentStatus: z.enum(['PENDING', 'SUCCESS', 'FAILED']),
  addressLine: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  pinCode: z.string().regex(/^\d{6}$/, { message: 'Pin code must be 6 digits' }),
});

export class CreateCustomerOrderDto extends createZodDto(CreateCustomerOrderSchema) {}
