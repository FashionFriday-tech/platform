import { z } from "zod";
import { AccountStatusEnum } from "./user.enums";

export const UserBaseSchema = z.object({
    id: z.string().uuid(),

    name: z.string().min(4),

    email: z.string().email(),

    phone: z.string().regex(/^\+91[6789]\d{9}$/),

    isPhoneVerified: z.boolean().default(false),
    
    isEmailVerified: z.boolean().default(false),

    avatarUrl: z.string().url().optional(),

    accountStatus: AccountStatusEnum.default("ACTIVE"),

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
