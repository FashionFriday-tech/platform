import { z } from 'zod';

export const ColorSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, 'Color name is required'),
  hex: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Valid hex code required (e.g. #000000)'),
  createdAt: z.date().or(z.string()).optional(),
  updatedAt: z.date().or(z.string()).optional(),
});

export const CreateColorSchema = z.object({
  name: z.string().trim().min(1, 'Color name is required'),
  hex: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Valid hex code required (e.g. #000000)'),
});

export const UpdateColorSchema = CreateColorSchema.partial();

export type Color = z.infer<typeof ColorSchema>;
export type CreateColorInput = z.infer<typeof CreateColorSchema>;
export type UpdateColorInput = z.infer<typeof UpdateColorSchema>;
