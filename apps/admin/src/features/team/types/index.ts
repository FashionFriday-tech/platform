import { type Role } from '@/contexts/AuthContext';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  joinedAt: string;
  updatedAt?: string;
  avatarUrl?: string;
}
export interface EditMemberUpdates {
  name: string;
  phone: string;
  role: Role;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
}

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  PRODUCT_MANAGER: 'Product Manager',
  SALES_MANAGER: 'Sales Manager',
  SALES_ADMIN: 'Sales Admin',
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  SUPER_ADMIN: 'Full access to all settings, team management, and modules.',
  PRODUCT_MANAGER: 'Can manage products, categories, collections, and campaigns.',
  SALES_MANAGER: 'Can view, edit and fulfill orders, and manage customers.',
  SALES_ADMIN: 'Can view, edit and fulfill orders, and manage customers.',
};

export type SortField = 'name' | 'role' | 'status' | 'joinedAt' | 'updatedAt';

export const MOCK_TEAM: TeamMember[] = [];
