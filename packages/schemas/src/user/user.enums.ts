import { z } from "zod";

export const UserRoleEnum = z.enum([
    "SUPER_ADMIN",
    "STAFF_ADMIN",
    "SELLER",
    "CUSTOMER",
    "INFLUENCER",
]);

export const AccountStatusEnum = z.enum([
    "ACTIVE",
    "SUSPENDED",
    "BANNED",
    "PENDING_VERIFICATION",
]);

export const AdminPermissionEnum = z.enum([
    "ADD_PRODUCT",
    "APPROVE_PRODUCT",
    "ADD_REVIEW",
    "MANAGE_ORDERS",
    "VIEW_PROFIT",
    "MANAGE_SELLERS",
]);

export const WalletTypeEnum = z.enum(["REFUND", "REWARD"]);

export const WalletTransactionStatusEnum = z.enum([
    "PENDING",
    "COMPLETED",
    "FAILED",
]);

export const ReferralRewardStatusEnum = z.enum([
    "PENDING",
    "RELEASED",
    "CANCELLED",
]);
