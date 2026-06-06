import { z } from 'zod';

export const AddToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  size: z.string().default('Standard'),
  color: z.string().default('Standard'),
  quantity: z.number().int().positive().default(1),
});

export const UpdateCartQuantitySchema = z.object({
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
});

export const SyncCartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  size: z.string().default('Standard'),
  color: z.string().default('Standard'),
  quantity: z.number().int().positive().default(1),
});

export const SyncCartSchema = z.object({
  items: z.array(SyncCartItemSchema).default([]),
});

export const CartItemProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  brand: z.array(z.string()).default([]),
  ogPrice: z.number(),
  sellingPrice: z.number(),
  mainImage: z.string(),
  totalStock: z.number().default(0),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  status: z.string().default('PUBLISHED'),
});

export const CartItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  size: z.string(),
  color: z.string(),
  quantity: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  product: CartItemProductSchema.optional().nullable(),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type UpdateCartQuantityInput = z.infer<typeof UpdateCartQuantitySchema>;
export type SyncCartItemInput = z.infer<typeof SyncCartItemSchema>;
export type SyncCartInput = z.infer<typeof SyncCartSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
