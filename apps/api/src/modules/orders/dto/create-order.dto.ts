import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { PaymentMethod } from '@ff/database';

const createOrderSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod),
});

export class CreateOrderDto extends createZodDto(createOrderSchema) {}
