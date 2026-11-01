import { z } from 'zod';
import { QualityEnum } from './product.enums';

export const ProductCatalogItemSchema = z.object({
  id: z.string(),

  name: z.string(),

  slug: z.string(),

  mainImage: z.string().url(),

  sellingPrice: z.coerce.number(),

  ogPrice: z.preprocess(
    (val) => (val === null || val === undefined || val === '' ? undefined : val),
    z.coerce.number().optional(),
  ),

  quality: QualityEnum,

  averageRating: z.number().min(0).max(5),

  isFeatured: z.boolean(),
});

export type ProductCatalogItem = z.infer<typeof ProductCatalogItemSchema>;
