import { z } from 'zod';
import { ProductStatusEnum } from './product.enums';
import { ProductSchema } from './product.schema';

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  rating: true,
  liveMatrix: true,
}).extend({
  status: ProductStatusEnum.default('DRAFT'),
  liveMatrix: z
    .object({
      liveWatching: z.preprocess(
        (val) => (val === null || val === undefined || val === '' ? 0 : val),
        z.coerce.number().int().nonnegative().default(0),
      ),
      liveSold: z.preprocess(
        (val) => (val === null || val === undefined || val === '' ? 0 : val),
        z.coerce.number().int().nonnegative().default(0),
      ),
    })
    .default({ liveWatching: 0, liveSold: 0 }),
  rating: z
    .object({
      averageRating: z.preprocess(
        (val) => (val === null || val === undefined || val === '' ? 4.5 : val),
        z.coerce.number().min(0).max(5).default(4.5),
      ),
      totalReviews: z.preprocess(
        (val) => (val === null || val === undefined || val === '' ? 0 : val),
        z.coerce.number().int().nonnegative().default(0),
      ),
    })
    .default({ averageRating: 4.5, totalReviews: 0 }),
});
