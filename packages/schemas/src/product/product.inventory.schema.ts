import { z } from 'zod';

export const InventorySchema = z.object({
  totalStock: z.number().int().nonnegative(),
});
