import { z } from "zod";

const AddressCore = z.object({
    label: z.enum(["HOME", "WORK", "OTHER"]).default("HOME"),

    isDefault: z.boolean().default(false),

    fullName: z.string().min(2, "Full name must be at least 2 characters"),

    phoneNumber: z.string().regex(/^\+91[6789]\d{9}$/, {
        message: "Phone must include +91 followed by valid 10-digit Indian mobile number",
    }),

    altPhoneNumber: z
        .string()
        .regex(/^\+91[6789]\d{9}$/)
        .optional(),

    building: z.string().optional(),

    street: z.string().min(2),

    city: z.string().min(2),

    district: z.string().min(2),

    state: z.string().min(2),

    pincode: z.string().regex(/^[1-9][0-9]{5}$/, {
        message: "Invalid Indian pincode",
    }),

    landmark: z.string().optional(),
});

export const AddressSchema = AddressCore.extend({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const CreateAddressSchema = AddressCore;

export const UpdateAddressSchema = AddressCore.partial();

/**
 * Types
 */
export type Address = z.infer<typeof AddressSchema>;
export type CreateAddressInput = z.infer<typeof CreateAddressSchema>;
export type UpdateAddressInput = z.infer<typeof UpdateAddressSchema>;
