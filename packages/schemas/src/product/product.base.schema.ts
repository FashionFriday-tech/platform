import { z } from 'zod';
import { ProductStatusEnum, GenderEnum, QualityEnum } from './product.enums';

export const ProductBaseSchema = z.object({
  id: z.string().uuid(),

  name: z.string().min(3).max(200).trim(),

  slug: z.string().regex(/^[a-z0-9-]+$/),

  description: z.string().min(10),

  brand: z.array(z.string()).min(1),

  status: ProductStatusEnum,

  categoryId: z.string().uuid(),
  sellerId: z.string().uuid().optional().nullable(),

  gender: GenderEnum,

  attributes: z.object({
    colors: z.array(z.string()).min(1),
    quality: QualityEnum,
    sizes: z.array(z.string()).min(1),
  }),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
