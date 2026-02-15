import { z } from 'zod';

/**
 * Device identity fields (client-provided)
 */
const DeviceIdentityCore = z.object({
  deviceId: z.string().min(10, { message: 'Device ID must be at least 10 characters' }),

  deviceName: z.string().min(2, { message: 'Device name must be at least 2 characters' }).trim(),

  platform: z.enum(['WEB', 'ANDROID', 'IOS']).optional(),

  userAgent: z.string().optional(),

  ipAddress: z.string().ip({ message: 'Invalid IP address' }).optional(),
});

/**
 * System-managed fields (DB only)
 */
const DeviceSystemCore = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),

  lastLogin: z.coerce.date(),

  isActive: z.boolean().default(true),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/**
 * Full DB representation
 */
export const DeviceSchema = DeviceIdentityCore.merge(DeviceSystemCore);

/**
 * Create contract (when device first registers)
 */
export const CreateDeviceSchema = DeviceIdentityCore.extend({
  userId: z.string().uuid(),
});

/**
 * Update contract (only specific fields editable)
 */
export const UpdateDeviceSchema = z.object({
  deviceName: z.string().min(2).optional(),
  isActive: z.boolean().optional(),
});

/**
 * Types
 */
export type Device = z.infer<typeof DeviceSchema>;
export type CreateDeviceInput = z.infer<typeof CreateDeviceSchema>;
export type UpdateDeviceInput = z.infer<typeof UpdateDeviceSchema>;
