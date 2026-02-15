import { z } from 'zod';

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  userId: z.string().uuid(),
  userName: z.string().min(4),
  userAvatar: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  productImage: z.string().url().optional(),
  createdAt: z.date(),
});

export type Review = z.infer<typeof ReviewSchema>;
