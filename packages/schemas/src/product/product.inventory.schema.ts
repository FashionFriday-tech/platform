import { z } from 'zod';

export const SellerInventorySchema = z.object({
  sellerId: z.string().uuid(),
  gettingPrice: z.number().int().nonnegative(), // use cents
  stock: z.number().int().nonnegative(),
  isVerified: z.boolean().default(false),
});

export const InventorySchema = z.object({
  sellers: z.array(SellerInventorySchema).min(1),
  totalStock: z.number().int().nonnegative(),
  sku: z.string().optional(),
});
