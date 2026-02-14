import { z } from "zod";
import { ProductBaseSchema } from "./product.base.schema";

export const ProductPublicResponseSchema = ProductBaseSchema.extend({
    price: z.object({
        ogPrice: z.number().int(),
        sellingPrice: z.number().int(),
    }),
});
