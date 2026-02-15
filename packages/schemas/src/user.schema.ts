import { z } from 'zod';
import { AddressSchema } from './address.schema';

export const AdminPermission = z.enum([
  'CREATE_PRODUCT',
  'APPROVE_PRODUCT',
  'CREATE_REVIEW',
  'MANAGE_ORDERS',
  'VIEW_PROFIT',
  'MANAGE_SELLERS',
]);

export const UserRole = z.enum(['SUPER_ADMIN', 'STAFF_ADMIN', 'SELLER', 'CUSTOMER']);

/**
 * Shared fields for every user type
 */
const BaseUser = z.object({
  id: z.string().uuid(),

  // Specifically for Indian numbers (10 digits starting with 6-9)
  phone: z.string().regex(/^\+91[6789]\d{9}$/, {
    message: 'Phone must include +91 followed by your 10-digit mobile number',
  }),

  isPhoneVerified: z.boolean().default(false),
  name: z.string().min(4, { message: 'Name must be at least 4 characters' }),

  // Email validation
  email: z.string().email({ message: 'Invalid email address' }),

  avatarUrl: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Device detail schema - restricted to Admins and Sellers for security
 */
const DeviceSchema = z.object({
  deviceId: z.string(),
  deviceName: z.string(),
  lastLogin: z.date(),
  isActive: z.boolean().default(true),
});

/**
 * Final Optimized User Schema
 */
export const UserSchema = z.discriminatedUnion('role', [
  // CUSTOMER: Focus on multiple addresses
  BaseUser.extend({
    role: z.literal('CUSTOMER'),
    addresses: z.array(AddressSchema).default([]),
  }),

  // ADMINS: Focus on permissions and device security
  BaseUser.extend({
    role: z.enum(['SUPER_ADMIN', 'STAFF_ADMIN']),
    adminMeta: z.object({
      permissions: z.array(AdminPermission).default([]),
      devices: z.array(DeviceSchema).default([]),
    }),
  }),

  // SELLER: Focus on store info, single location, and device security
  BaseUser.extend({
    role: z.literal('SELLER'),
    sellerProfile: z.object({
      storeName: z.string(),
      isVerified: z.boolean().default(false),
      location: AddressSchema, // Single address for seller location
      devices: z.array(DeviceSchema).default([]),
    }),
  }),
]);

export type User = z.infer<typeof UserSchema>;
