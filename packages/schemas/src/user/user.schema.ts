import { z } from "zod";
import { CustomerSchema } from "./user.customer.schema";
import { SellerSchema } from "./user.seller.schema";
import { AdminSchema } from "./user.admin.schema";

export const UserSchema = z.discriminatedUnion("role", [
    CustomerSchema,
    SellerSchema,
    AdminSchema,
]);

export type User = z.infer<typeof UserSchema>;
