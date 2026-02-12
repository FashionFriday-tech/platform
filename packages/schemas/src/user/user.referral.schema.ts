import { z } from "zod";
import { ReferralRewardStatusEnum } from "./user.enums";

export const ReferralSchema = z.object({
    userId: z.string().uuid(),
    referralCode: z.string(),
    referredBy: z.string().uuid().nullable(),
    totalReferrals: z.number().default(0),
    totalEarned: z.number().default(0),
});

export const ReferralRewardSchema = z.object({
    id: z.string().uuid(),
    referrerId: z.string().uuid(),
    referredUserId: z.string().uuid(),
    orderId: z.string().uuid(),
    rewardAmount: z.number(),
    status: ReferralRewardStatusEnum,
    releasedAt: z.coerce.date().optional(),
});
