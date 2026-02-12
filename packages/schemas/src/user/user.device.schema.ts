import { z } from "zod";

export const DeviceSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    deviceId: z.string(),
    deviceName: z.string(),
    lastLogin: z.coerce.date(),
    isActive: z.boolean().default(true),
});
