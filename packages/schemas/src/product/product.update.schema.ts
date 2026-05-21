import { z } from 'zod';
import { ProductCategoryEnum, GenderEnum, QualityEnum } from './product.enums';

export const UpdateProductSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  brand: z.array(z.string()).optional(),
  category: ProductCategoryEnum.optional(),
  gender: GenderEnum.optional(),
  status: z.enum(['PENDING', 'DRAFT', 'PUBLISHED', 'REJECTED', 'ARCHIVED']).optional(),
  price: z.object({
    ogPrice: z.number().int().nonnegative().optional(),
    sellingPrice: z.number().int().nonnegative().optional(),
    gettingPrice: z.number().int().nonnegative().optional(),
  }).optional(),
  inventory: z.object({
    totalStock: z.number().int().nonnegative().optional(),
    sku: z.string().optional(),
  }).optional(),
  media: z.object({
    mainImage: z.string().url().optional(),
    promoImage: z.string().url().optional(),
    liveImages: z.array(z.string().url()).optional(),
    youtubeId: z.string().optional(),
  }).optional(),
  attributes: z.object({
    colors: z.array(z.string()).optional(),
    quality: QualityEnum.optional(),
    sizes: z.array(z.string()).optional(),
    materials: z.array(z.string()).optional(),
    specs: z.record(z.string(), z.string()).optional(),
  }).optional(),
  marketing: z.object({
    collections: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    seoTitle: z.string().max(70).optional(),
    seoDescription: z.string().optional(),
  }).optional(),
});
