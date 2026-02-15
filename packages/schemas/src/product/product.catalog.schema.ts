import { z } from 'zod';
import { QualityEnum } from './product.enums';

export const ProductCatalogItemSchema = z.object({
  id: z.string().uuid(),

  name: z.string(),

  slug: z.string(),

  mainImage: z.string().url(),

  sellingPrice: z.number().int(),

  ogPrice: z.number().int(),

  quality: QualityEnum,

  averageRating: z.number().min(0).max(5),

  isFeatured: z.boolean(),
});

export type ProductCatalogItem = z.infer<typeof ProductCatalogItemSchema>;
