import { z } from 'zod';

export const WishlistProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  ogPrice: z.union([z.number(), z.string()]),
  sellingPrice: z.union([z.number(), z.string()]),
  mainImage: z.string(),
  brand: z.array(z.string()).optional(),
  totalStock: z.number().optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
});

export const WishlistItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  createdAt: z.union([z.string(), z.date()]),
  product: WishlistProductSchema.optional(),
});

export const SyncWishlistDtoSchema = z.object({
  productIds: z.array(z.string().uuid()).max(100, 'Cannot sync more than 100 items at once'),
});

export const ToggleWishlistResponseSchema = z.object({
  isWishlisted: z.boolean(),
  productId: z.string(),
  message: z.string(),
});

export type WishlistProduct = z.infer<typeof WishlistProductSchema>;
export type WishlistItem = z.infer<typeof WishlistItemSchema>;
export type SyncWishlistDto = z.infer<typeof SyncWishlistDtoSchema>;
export type ToggleWishlistResponse = z.infer<typeof ToggleWishlistResponseSchema>;
