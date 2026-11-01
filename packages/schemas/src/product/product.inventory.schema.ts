import { z } from 'zod';

export const InventorySchema = z.object({
  totalStock: z.preprocess(
    (val) => (val === null || val === undefined || val === '' ? 0 : val),
    z.coerce.number().int().nonnegative().default(0),
  ),
});
