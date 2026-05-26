import { z } from 'zod';

export const CreateCollectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required'),
  slug: z.string().min(1, 'Slug is required'),
  image: z.string().optional().default(''),
  description: z.string().optional(),
});

export type CreateCollection = z.infer<typeof CreateCollectionSchema>;

export const UpdateCollectionSchema = CreateCollectionSchema.partial();
export type UpdateCollection = z.infer<typeof UpdateCollectionSchema>;
