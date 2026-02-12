import { z } from "zod";
import { UserBaseSchema } from "./user.base.schema";

export const SellerSchema = UserBaseSchema.extend({
    role: z.literal("SELLER"),

    sellerProfile: z.object({
        storeName: z.string(),
        isVerified: z.boolean().default(false),
    }),
});
