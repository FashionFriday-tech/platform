import { z } from 'zod';

export const SellerStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']);
export type SellerStatus = z.infer<typeof SellerStatusEnum>;

export const CreateSellerSchema = z.object({
  name: z.string().trim().min(2, 'Seller contact name must be at least 2 characters').max(100),
  storeName: z.string().trim().min(2, 'Store name must be at least 2 characters').max(100),
  email: z
    .union([z.string().trim().email('Invalid email address'), z.literal(''), z.null(), z.undefined()])
    .optional()
    .transform((val) => (val && typeof val === 'string' && val.trim() !== '' ? val.trim() : null)),
  phone: z.string().trim().min(5, 'Phone number is required').max(30),
  address: z
    .union([z.string().trim(), z.literal(''), z.null(), z.undefined()])
    .optional()
    .transform((val) => (val && typeof val === 'string' && val.trim() !== '' ? val.trim() : null)),
  website: z
    .union([z.string().trim(), z.literal(''), z.null(), z.undefined()])
    .optional()
    .transform((val) => (val && typeof val === 'string' && val.trim() !== '' ? val.trim() : null)),
  instagram: z
    .union([z.string().trim(), z.literal(''), z.null(), z.undefined()])
    .optional()
    .transform((val) => (val && typeof val === 'string' && val.trim() !== '' ? val.trim() : null)),
  status: SellerStatusEnum.default('ACTIVE'),
  categoryIds: z.array(z.string().min(1)).min(1, 'Select at least one category'),
});

export type CreateSellerInput = z.infer<typeof CreateSellerSchema>;

export const UpdateSellerSchema = CreateSellerSchema.partial();
export type UpdateSellerInput = z.infer<typeof UpdateSellerSchema>;

export interface SellerCategoryRef {
  id: string;
  name: string;
  slug: string;
  gender?: string;
}

export interface Seller {
  id: string;
  name: string;
  storeName: string;
  email?: string | null;
  phone: string;
  address?: string | null;
  website?: string | null;
  instagram?: string | null;
  status: SellerStatus;
  categories: SellerCategoryRef[];
  _count?: {
    products?: number;
    orderItems?: number;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}
