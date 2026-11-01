import { z } from 'zod';
import { ProductStatusEnum, GenderEnum, QualityEnum } from './product.enums';

export const ProductBaseSchema = z.object({
  id: z.string(),

  name: z.string().min(3).max(200).trim(),

  slug: z.string().regex(/^[a-z0-9-]+$/),

  description: z.string().min(10),

  brand: z.array(z.string()).default([]),

  status: ProductStatusEnum,

  categoryId: z.string().min(1),
  sellerId: z.preprocess(
    (val) => (val === null || val === undefined || val === '' ? undefined : val),
    z.string().optional(),
  ),
  sellerIds: z.preprocess(
    (val) => (Array.isArray(val) ? val.filter(Boolean) : val ? [val] : []),
    z.array(z.string()).default([]),
  ),

  gender: GenderEnum,

  attributes: z.object({
    colors: z.array(z.string()).default([]),
    quality: QualityEnum,
    sizes: z.array(z.string()).default([]),
  }),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
