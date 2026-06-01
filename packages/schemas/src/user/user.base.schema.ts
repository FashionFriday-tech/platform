import { z } from 'zod';
import { AccountStatusEnum } from './user.enums';

/**
 * Core identity fields (editable by user)
 */
const UserIdentityCore = z.object({
  name: z.string().min(4, { message: 'Name must be at least 4 characters' }).trim(),

  email: z.string().email({ message: 'Invalid email address' }).toLowerCase().trim(),

  phone: z.string().regex(/^\+91[6-9]\d{9}$/, {
    message: 'Phone must include +91 followed by a valid 10-digit Indian mobile number',
  }),
});

/**
 * System-managed fields (NOT controlled by client)
 */
const UserSystemCore = z.object({
  id: z.string().uuid(),

  isPhoneVerified: z.boolean().default(false),
  isEmailVerified: z.boolean().default(false),

  accountStatus: AccountStatusEnum.default('ACTIVE'),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/**
 * Full DB representation
 */
export const UserBaseSchema = UserIdentityCore.merge(UserSystemCore);

/**
 * Create contract (client input)
 */
export const CreateUserBaseSchema = UserIdentityCore;

/**
 * Update contract (partial editable fields)
 */
export const UpdateUserBaseSchema = UserIdentityCore.partial();

/**
 * Types
 */
export type UserBase = z.infer<typeof UserBaseSchema>;
export type CreateUserBaseInput = z.infer<typeof CreateUserBaseSchema>;
export type UpdateUserBaseInput = z.infer<typeof UpdateUserBaseSchema>;
