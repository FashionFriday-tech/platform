import { z } from "zod";
import {
    WalletTypeEnum,
    WalletTransactionStatusEnum,
} from "./user.enums";

export const WalletSchema = z.object({
    userId: z.string().uuid(),
    refundBalance: z.number().default(0),
    rewardBalance: z.number().default(0),
});

export const WalletTransactionSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    type: WalletTypeEnum,
    amount: z.number().positive(),
    reason: z.string(),
    status: WalletTransactionStatusEnum,
    createdAt: z.coerce.date(),
});
