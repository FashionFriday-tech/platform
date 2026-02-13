import { z } from "zod";
import { CustomerSchema } from "./user.customer.schema";
import { SellerSchema } from "./user.seller.schema";
import { AdminSchema } from "./user.admin.schema";

/**
 * Polymorphic User Schema
 * Discriminated by `role`
 */
export const UserSchema = z.discriminatedUnion("role", [
  CustomerSchema,
  SellerSchema,
  AdminSchema,
]);

export type User = z.infer<typeof UserSchema>;

/**
 * Individual Role Types (Helpful for services)
 */
export type CustomerUser = z.infer<typeof CustomerSchema>;
export type SellerUser = z.infer<typeof SellerSchema>;
export type AdminUser = z.infer<typeof AdminSchema>;
