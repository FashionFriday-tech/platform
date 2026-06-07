import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { OrderStatus } from '@ff/database';

const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  trackingNumber: z.string().optional(),
  courierPartner: z.string().optional(),
});

export class UpdateOrderDto extends createZodDto(updateOrderSchema) {}
