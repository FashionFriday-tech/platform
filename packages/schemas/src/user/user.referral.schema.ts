import { z } from 'zod';
import { ReferralRewardStatusEnum } from './user.enums';

/**
 * Referral (per user)
 */
export const ReferralSchema = z.object({
  id: z.string().uuid(),

  userId: z.string().uuid(),

  referralCode: z.string().min(4).max(20).trim(),

  referredBy: z.string().uuid().nullable(),

  totalReferrals: z.number().int().nonnegative().default(0),

  totalEarned: z.number().nonnegative().default(0),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Referral = z.infer<typeof ReferralSchema>;

/**
 * Referral Reward (per successful order)
 */
export const ReferralRewardSchema = z.object({
  id: z.string().uuid(),

  referrerId: z.string().uuid(),
  referredUserId: z.string().uuid(),
  orderId: z.string().uuid(),

  rewardAmount: z.number().positive(),

  status: ReferralRewardStatusEnum,

  releasedAt: z.coerce.date().nullable().optional(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type ReferralReward = z.infer<typeof ReferralRewardSchema>;
