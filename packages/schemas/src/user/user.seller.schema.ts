import { z } from 'zod';
import { UserBaseSchema } from './user.base.schema';

/**
 * Seller Schema
 */
export const SellerSchema = UserBaseSchema.extend({
  role: z.literal('SELLER'),

  sellerProfile: z.object({
    storeName: z
      .string()
      .min(3, 'Store name must be at least 3 characters')
      .max(100, 'Store name too long')
      .trim(),

    isVerified: z.boolean().default(false),

    description: z.string().max(500).optional(),

    logoUrl: z.string().url().optional(),

    totalSales: z.number().int().nonnegative().default(0),

    rating: z.number().min(0).max(5).default(0),

    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  }),
});

export type Seller = z.infer<typeof SellerSchema>;
