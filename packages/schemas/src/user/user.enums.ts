import { z } from "zod";

/**
 * User Roles
 */
export const UserRoleEnum = z.enum([
  "SUPER_ADMIN",
  "STAFF_ADMIN",
  "SELLER",
  "CUSTOMER",
  "INFLUENCER",
]);
export type UserRole = z.infer<typeof UserRoleEnum>;

/**
 * Account Status
 */
export const AccountStatusEnum = z.enum([
  "ACTIVE",
  "SUSPENDED",
  "BANNED",
  "PENDING_VERIFICATION",
]);
export type AccountStatus = z.infer<typeof AccountStatusEnum>;

/**
 * Admin Permissions
 */
export const AdminPermissionEnum = z.enum([
  "ADD_PRODUCT",
  "APPROVE_PRODUCT",
  "ADD_REVIEW",
  "MANAGE_ORDERS",
  "VIEW_PROFIT",
  "MANAGE_SELLERS",
]);
export type AdminPermission = z.infer<typeof AdminPermissionEnum>;

/**
 * Wallet
 */
export const WalletTypeEnum = z.enum(["REFUND", "REWARD"]);
export type WalletType = z.infer<typeof WalletTypeEnum>;

export const WalletTransactionStatusEnum = z.enum([
  "PENDING",
  "COMPLETED",
  "FAILED",
]);
export type WalletTransactionStatus = z.infer<
  typeof WalletTransactionStatusEnum
>;

/**
 * Referral
 */
export const ReferralRewardStatusEnum = z.enum([
  "PENDING",
  "RELEASED",
  "CANCELLED",
]);
export type ReferralRewardStatus = z.infer<
  typeof ReferralRewardStatusEnum
>;
