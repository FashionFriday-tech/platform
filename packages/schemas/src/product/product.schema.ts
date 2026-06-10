import { z } from 'zod';
import { ProductBaseSchema } from './product.base.schema';
import { InventorySchema } from './product.inventory.schema';

export const ProductSchema = ProductBaseSchema.extend({
  price: z.object({
    ogPrice: z.number().nonnegative(),
    sellingPrice: z.number().nonnegative(),
    gettingPrice: z.number().nonnegative(),
  }),
  inventory: InventorySchema,
  media: z.object({
    mainImage: z.string().url(),
    promoImage: z.string().url().optional(),
    liveImages: z.array(z.string().url()),
    youtubeId: z.string().optional(),
  }),
  liveMatrix: z.object({
    liveWatching: z.number().int(),
    liveSold: z.number().int(),
  }),
  marketing: z.object({
    collections: z.array(z.string()),
    isFeatured: z.boolean().default(false),
    seoTitle: z.string().max(70).optional(),
    seoDescription: z.string().optional(),
  }),
  rating: z.object({
    averageRating: z.number().default(4),
    totalReviews: z.number().int().default(0),
  }),
});

export type Product = z.infer<typeof ProductSchema>;
