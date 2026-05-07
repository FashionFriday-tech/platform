import { Role } from '@/contexts/AuthContext';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  joinedAt: string;
  updatedAt?: string;
  avatarUrl?: string;
}

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  PRODUCT_MANAGER: 'Product Manager',
  SALES_MANAGER: 'Sales Manager',
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  SUPER_ADMIN: 'Full access to all settings, team management, and modules.',
  PRODUCT_MANAGER: 'Can manage products, categories, collections, and campaigns.',
  SALES_MANAGER: 'Can view and fulfill orders, and manage customers.',
};
