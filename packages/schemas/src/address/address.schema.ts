import { z } from 'zod';

export const AddressCoreSchema = z.object({
  label: z.string().default('Home'),
  isDefault: z.boolean().default(false),
  fullName: z.string().min(1, 'Full name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  altPhoneNumber: z.string().optional().nullable(),
  building: z.string().optional().nullable(),
  street: z.string().min(1, 'Street/Area is required'),
  city: z.string().min(1, 'City is required'),
  district: z.string().default('Malappuram'),
  state: z.string().default('Kerala'),
  pincode: z.string().min(1, 'Pincode is required'),
  landmark: z.string().optional().nullable(),
});

export const AddressSchema = AddressCoreSchema.extend({
  id: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const CreateAddressSchema = AddressCoreSchema;

export const UpdateAddressSchema = AddressCoreSchema.partial();

/**
 * Types
 */
export type Address = z.infer<typeof AddressSchema>;
export type CreateAddressInput = z.infer<typeof CreateAddressSchema>;
export type UpdateAddressInput = z.infer<typeof UpdateAddressSchema>;
