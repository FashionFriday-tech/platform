import { z } from 'zod';

export const ProductQualitySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, 'Quality name is required'),
  description: z.string().trim().optional().nullable(),
  categories: z.array(z.string()).default([]),
  position: z.number().int().optional(),
  productCount: z.number().int().optional(),
  createdAt: z.date().or(z.string()).optional(),
  updatedAt: z.date().or(z.string()).optional(),
});

export const CreateProductQualitySchema = z.object({
  name: z.string().trim().min(1, 'Quality name is required'),
  description: z.string().trim().optional().nullable(),
  categories: z.array(z.string()).default([]),
  position: z.number().int().optional(),
});

export const UpdateProductQualitySchema = CreateProductQualitySchema.partial();

export type ProductQuality = z.infer<typeof ProductQualitySchema>;
export type CreateProductQualityInput = z.infer<typeof CreateProductQualitySchema>;
export type UpdateProductQualityInput = z.infer<typeof UpdateProductQualitySchema>;
