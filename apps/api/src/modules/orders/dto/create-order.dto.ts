import { PaymentMethod } from '@ff/database';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createOrderSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod),
  addressId: z.string().optional(),
});

export class CreateOrderDto extends createZodDto(createOrderSchema) {}
