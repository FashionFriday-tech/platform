import { z } from 'zod';
import { UserBaseSchema } from './user.base.schema';
import { AdminPermissionEnum, UserRoleEnum } from './user.enums';

/**
 * Admin-specific immutable fields
 */
const AdminCore = z.object({
  role: UserRoleEnum.refine((role) => role === 'SUPER_ADMIN' || role === 'STAFF_ADMIN', {
    message: 'Invalid admin role',
  }),

  adminMeta: z.object({
    permissions: z.array(AdminPermissionEnum).default([]),
  }),
});

/**
 * Full DB representation
 */
export const AdminSchema = UserBaseSchema.merge(AdminCore);

/**
 * Create contract
 * Role allowed only at creation
 */
export const CreateAdminSchema = AdminCore;

/**
 * Update contract
 * Role should NOT be updatable
 */
export const UpdateAdminSchema = z.object({
  adminMeta: z
    .object({
      permissions: z.array(AdminPermissionEnum).optional(),
    })
    .optional(),
});

/**
 * Types
 */
export type Admin = z.infer<typeof AdminSchema>;
export type CreateAdminInput = z.infer<typeof CreateAdminSchema>;
export type UpdateAdminInput = z.infer<typeof UpdateAdminSchema>;
