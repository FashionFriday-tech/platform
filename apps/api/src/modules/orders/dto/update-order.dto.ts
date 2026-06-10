import { OrderStatus } from '@ff/database';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  trackingNumber: z.string().optional(),
  courierPartner: z.string().optional(),
  sellerId: z.string().optional().nullable(),
});

export class UpdateOrderDto extends createZodDto(updateOrderSchema) {}
