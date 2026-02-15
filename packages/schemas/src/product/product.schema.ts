import { z } from 'zod';
import { ProductBaseSchema } from './product.base.schema';
import { InventorySchema } from './product.inventory.schema';

export const ProductSchema = ProductBaseSchema.extend({
  price: z.object({
    ogPrice: z.number().int().nonnegative(),
    sellingPrice: z.number().int().nonnegative(),
    gettingPrice: z.number().int().nonnegative(),
  }),
  inventory: InventorySchema,
});

export type Product = z.infer<typeof ProductSchema>;
