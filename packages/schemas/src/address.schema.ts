import { z } from 'zod';

/**
 * 3. Address Schema
 * Structured for multiple addresses; optional for Admin/Staff.
 */
export const AddressSchema = z.object({
  id: z.string().uuid(),
  label: z.string().default('Home'),
  isDefault: z.boolean().default(false),
  fullName: z.string().min(2),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  AltPhoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/)
    .optional(),
  building: z.string().optional(),
  street: z.string(),
  city: z.string(),
  district: z.string(),
  state: z.string(),
  pincode: z.string().length(6),
  landmark: z.string().optional(),
});
