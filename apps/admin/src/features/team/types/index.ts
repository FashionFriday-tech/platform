import { type Role } from '@/contexts/AuthContext';

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

export type SortField = 'name' | 'role' | 'status' | 'joinedAt' | 'updatedAt';

export const MOCK_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Jimmy Sullivan',
    email: 'jimmy@fashionfriday.com',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    joinedAt: '2025-01-15T00:00:00Z',
    updatedAt: '2026-05-01T10:30:00Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=jimmy',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.c@fashionfriday.com',
    role: 'PRODUCT_MANAGER',
    status: 'ACTIVE',
    joinedAt: '2025-02-20T00:00:00Z',
    updatedAt: '2026-04-12T09:15:00Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    email: 'marcus@fashionfriday.com',
    role: 'SALES_MANAGER',
    status: 'ACTIVE',
    joinedAt: '2025-03-10T00:00:00Z',
    updatedAt: '2026-03-10T14:20:00Z',
  },
  {
    id: '4',
    name: 'Emma Williams',
    email: 'emma.w@fashionfriday.com',
    role: 'SALES_MANAGER',
    status: 'PENDING',
    joinedAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z',
  },
];
