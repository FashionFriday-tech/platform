import { z } from 'zod';

export const ProductStatusEnum = z.enum(['PENDING', 'DRAFT', 'PUBLISHED', 'REJECTED', 'ARCHIVED']);
export type ProductStatus = z.infer<typeof ProductStatusEnum>;


export const GenderEnum = z.enum(['MEN', 'WOMEN', 'UNISEX']);
export type Gender = z.infer<typeof GenderEnum>;

export const QualityEnum = z.enum([
  'UA',
  'SEMI_UA',
  '10A',
  '7A',
  '7AA',
  'STANDARD',
  'SURPLUS',
  'PREMIUM',
  'LUXURY',
]);
export type Quality = z.infer<typeof QualityEnum>;
