import { z } from 'zod';
import { ProductSchema } from './product.schema';

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  rating: true,
  liveMatrix: true,
}).extend({
  status: z.literal('DRAFT').default('DRAFT'),
});
