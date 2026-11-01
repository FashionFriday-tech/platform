import { ProductStatusEnum } from './product.enums';
import { ProductSchema } from './product.schema';

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  rating: true,
  liveMatrix: true,
}).extend({
  status: ProductStatusEnum.default('DRAFT'),
});
