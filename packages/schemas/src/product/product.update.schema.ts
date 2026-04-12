import { CreateProductSchema } from './product.create.schema';

export const UpdateProductSchema = CreateProductSchema.partial();
