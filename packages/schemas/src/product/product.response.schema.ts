import { z } from 'zod';
import { ProductBaseSchema } from './product.base.schema';

export const ProductPublicResponseSchema = ProductBaseSchema.extend({
  price: z.object({
    ogPrice: z.preprocess(
      (val) => (val === null || val === undefined || val === '' ? undefined : val),
      z.coerce.number().optional(),
    ),
    sellingPrice: z.coerce.number(),
  }),
});
