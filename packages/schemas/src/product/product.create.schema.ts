import { z } from 'zod';
import { ProductBaseSchema } from './product.base.schema';
import { InventorySchema } from './product.inventory.schema';

export const CreateProductSchema = ProductBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  inventory: InventorySchema,
  status: z.literal('DRAFT').default('DRAFT'),
});
