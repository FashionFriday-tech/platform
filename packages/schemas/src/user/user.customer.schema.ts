import { z } from "zod";
import { UserBaseSchema } from "./user.base.schema";

export const CustomerSchema = UserBaseSchema.extend({
    role: z.literal("CUSTOMER, INFLUENCER"),
});
