import { z } from 'zod';
import { GenderEnum, QualityEnum } from './product.enums';

export const UpdateProductSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  brand: z.array(z.string()).optional(),
  categoryId: z.string().optional().nullable(),
  sellerId: z.string().optional().nullable(),
  sellerIds: z.array(z.string()).optional(),
  gender: GenderEnum.optional(),
  modelGroup: z.preprocess(
    (val) => (val === '' || val === null ? null : typeof val === 'string' ? val.trim() : val),
    z.string().optional().nullable(),
  ),
  status: z.enum(['PENDING', 'DRAFT', 'PUBLISHED', 'REJECTED', 'ARCHIVED']).optional(),
  collections: z.array(z.string()).optional(),
  price: z
    .object({
      ogPrice: z.coerce.number().nonnegative().optional().nullable(),
      sellingPrice: z.coerce.number().nonnegative().optional(),
      gettingPrice: z.coerce.number().nonnegative().optional().nullable(),
    })
    .optional(),
  inventory: z
    .object({
      totalStock: z.coerce.number().int().nonnegative().optional().nullable(),
      sku: z.string().optional(),
    })
    .optional(),
  media: z
    .object({
      mainImage: z.string().url().optional(),
      promoImage: z.preprocess(
        (val) => (val === '' ? null : val),
        z.string().url().optional().nullable(),
      ),
      liveImages: z.array(z.string().url()).optional(),
      youtubeId: z.preprocess(
        (val) => (val === '' ? null : val),
        z.string().optional().nullable(),
      ),
    })
    .optional(),
  attributes: z
    .object({
      colors: z.array(z.string()).optional(),
      quality: QualityEnum.optional(),
      sizes: z.array(z.string()).optional(),
      materials: z.array(z.string()).optional(),
      specs: z.record(z.string(), z.string()).optional(),
    })
    .optional(),
  marketing: z
    .object({
      collections: z.array(z.string()).optional(),
      isFeatured: z.boolean().optional(),
      seoTitle: z.string().max(70).optional().nullable(),
      seoDescription: z.string().optional().nullable(),
    })
    .optional(),
  liveMatrix: z
    .object({
      liveWatching: z.preprocess(
        (val) => (val === null || val === undefined || val === '' ? undefined : val),
        z.coerce.number().int().nonnegative().optional(),
      ),
      liveSold: z.preprocess(
        (val) => (val === null || val === undefined || val === '' ? undefined : val),
        z.coerce.number().int().nonnegative().optional(),
      ),
    })
    .optional(),
  rating: z
    .object({
      averageRating: z.preprocess(
        (val) => (val === null || val === undefined || val === '' ? undefined : val),
        z.coerce.number().min(0).max(5).optional(),
      ),
      totalReviews: z.preprocess(
        (val) => (val === null || val === undefined || val === '' ? undefined : val),
        z.coerce.number().int().nonnegative().optional(),
      ),
    })
    .optional(),
  liveWatching: z.preprocess(
    (val) => (val === null || val === undefined || val === '' ? undefined : val),
    z.coerce.number().int().nonnegative().optional(),
  ),
  liveSold: z.preprocess(
    (val) => (val === null || val === undefined || val === '' ? undefined : val),
    z.coerce.number().int().nonnegative().optional(),
  ),
  averageRating: z.preprocess(
    (val) => (val === null || val === undefined || val === '' ? undefined : val),
    z.coerce.number().min(0).max(5).optional(),
  ),
  totalReviews: z.preprocess(
    (val) => (val === null || val === undefined || val === '' ? undefined : val),
    z.coerce.number().int().nonnegative().optional(),
  ),
});
