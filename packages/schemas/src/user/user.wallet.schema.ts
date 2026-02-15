import { z } from 'zod';
import { WalletTypeEnum, WalletTransactionStatusEnum } from './user.enums';

/**
 * Wallet (per user)
 */
export const WalletSchema = z.object({
  id: z.string().uuid(),

  userId: z.string().uuid(),

  refundBalance: z.number().nonnegative().default(0),

  rewardBalance: z.number().nonnegative().default(0),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Wallet = z.infer<typeof WalletSchema>;

/**
 * Wallet Transaction (ledger entry)
 */
export const WalletTransactionSchema = z.object({
  id: z.string().uuid(),

  userId: z.string().uuid(),

  type: WalletTypeEnum,

  amount: z.number().positive(),

  reason: z.string().min(3).max(255).trim(),

  status: WalletTransactionStatusEnum,

  referenceId: z.string().uuid().optional(), // orderId / refundId etc.

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

export type WalletTransaction = z.infer<typeof WalletTransactionSchema>;
