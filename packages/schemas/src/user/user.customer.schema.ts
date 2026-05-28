import { z } from 'zod';
import { UserBaseSchema } from './user.base.schema';
import { UserRoleEnum } from './user.enums';

/**
 * Allowed customer roles
 */
const CustomerRoleSchema = UserRoleEnum.refine(
  (role) => role === 'CUSTOMER' || role === 'INFLUENCER',
  { message: 'Invalid customer role' },
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

/**
 * Validate customer creation input from admin panel
 */
export const CreateCustomerAdminSchema = z.object({
  name: z.string().min(4, { message: 'Name must be at least 4 characters' }).trim(),
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, {
    message: 'Phone must include +91 followed by a valid 10-digit Indian mobile number',
  }),
});
export type CreateCustomerAdminInput = z.infer<typeof CreateCustomerAdminSchema>;
