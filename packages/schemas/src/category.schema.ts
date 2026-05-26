import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Slug is required'),
  image: z.string().optional().default(''),
  gender: z.enum(['MEN', 'WOMEN', 'UNISEX']),
});


export type CreateCategory = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = CreateCategorySchema.partial();
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;
