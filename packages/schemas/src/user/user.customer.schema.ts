import { z } from "zod";
import { UserBaseSchema } from "./user.base.schema";
import { UserRoleEnum } from "./user.enums";

/**
 * Allowed customer roles
 */
const CustomerRoleSchema = UserRoleEnum.refine(
  (role) => role === "CUSTOMER" || role === "INFLUENCER",
  { message: "Invalid customer role" }
);

/**
 * Full DB representation
 */
export const CustomerSchema = UserBaseSchema.extend({
  role: CustomerRoleSchema,
});

/**
 * Create contract
 */
export const CreateCustomerSchema = z.object({
  role: CustomerRoleSchema,
});

/**
 * Update contract
 * (Role should NOT be freely updatable)
 */
export const UpdateCustomerSchema = z.object({}).strict();

/**
 * Types
 */
export type Customer = z.infer<typeof CustomerSchema>;
export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerSchema>;
