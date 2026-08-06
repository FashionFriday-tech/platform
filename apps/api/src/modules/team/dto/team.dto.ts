import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export enum TeamRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  PRODUCT_MANAGER = 'PRODUCT_MANAGER',
  SALES_MANAGER = 'SALES_MANAGER',
}

export const InviteTeamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be a valid 10-digit mobile number'),
  email: z.string().email('Must be a valid email address'),
  role: z.nativeEnum(TeamRole),
});

export class InviteTeamMemberDto extends createZodDto(InviteTeamMemberSchema) {}

export const UpdateTeamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be a valid 10-digit mobile number').optional(),
  role: z.nativeEnum(TeamRole).optional(),
  status: z.enum(['ACTIVE', 'PENDING', 'SUSPENDED']).optional(),
});

export class UpdateTeamMemberDto extends createZodDto(UpdateTeamMemberSchema) {}

