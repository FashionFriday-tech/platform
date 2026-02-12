import { z } from "zod";
import { UserBaseSchema } from "./user.base.schema";
import { AdminPermissionEnum } from "./user.enums";

export const AdminSchema = UserBaseSchema.extend({
    role: z.enum(["SUPER_ADMIN", "STAFF_ADMIN"]),

    adminMeta: z.object({
        permissions: z.array(AdminPermissionEnum).default([]),
    }),
});
