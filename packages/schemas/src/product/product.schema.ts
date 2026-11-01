import { z } from 'zod';
import { ProductBaseSchema } from './product.base.schema';
import { InventorySchema } from './product.inventory.schema';

export const ProductSchema = ProductBaseSchema.extend({
  price: z.object({
    ogPrice: z.preprocess(
      (val) => (val === null || val === undefined || val === '' ? 0 : val),
      z.coerce.number().nonnegative().default(0),
    ),
    sellingPrice: z.coerce.number().nonnegative(),
    gettingPrice: z.preprocess(
      (val) => (val === null || val === undefined || val === '' ? 0 : val),
      z.coerce.number().nonnegative().default(0),
    ),
  }),
  inventory: InventorySchema,
  media: z.object({
    mainImage: z.string().url(),
    promoImage: z.preprocess(
      (val) => (val === null || val === undefined || val === '' ? undefined : val),
      z.string().url().optional(),
    ),
    liveImages: z.array(z.string().url()).default([]),
    youtubeId: z.preprocess(
      (val) => (val === null || val === undefined || val === '' ? undefined : val),
      z.string().optional(),
    ),
  }),
  liveMatrix: z.object({
    liveWatching: z.number().int().default(0),
    liveSold: z.number().int().default(0),
  }).default({ liveWatching: 0, liveSold: 0 }),
  marketing: z.object({
    collections: z.array(z.string()).default([]),
    isFeatured: z.boolean().default(false),
    seoTitle: z.preprocess(
      (val) => (val === null || val === undefined || val === '' ? undefined : val),
      z.string().max(70).optional(),
    ),
    seoDescription: z.preprocess(
      (val) => (val === null || val === undefined || val === '' ? undefined : val),
      z.string().optional(),
    ),
  }).default({ collections: [], isFeatured: false }),
  rating: z.object({
    averageRating: z.number().default(4),
    totalReviews: z.number().int().default(0),
  }).default({ averageRating: 4, totalReviews: 0 }),
});

export type Product = z.infer<typeof ProductSchema>;
