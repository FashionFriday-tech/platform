'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { type Role, useAuth } from '@/contexts/AuthContext';

import { type EditMemberUpdates, MOCK_TEAM, type SortField, type TeamMember } from '../types';

const STORAGE_TEAM_KEY = 'ff_admin_team_members';
const STORAGE_INVITED_KEY = 'ff_admin_invited_team';
const STORAGE_CLEAN_KEY = 'ff_admin_team_v5_single_admin';

export interface InvitePayload {
  name: string;
  phone: string;
  email: string;
  role: Role;
}

export function useTeam() {
  const { user: currentUser, updateUser } = useAuth();
  const [team, setTeam] = useState<TeamMember[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        // Enforce cleanup of legacy mock team members in old PWA installs
        if (!localStorage.getItem(STORAGE_CLEAN_KEY)) {
          localStorage.removeItem(STORAGE_TEAM_KEY);
          localStorage.removeItem(STORAGE_INVITED_KEY);
          localStorage.setItem(STORAGE_CLEAN_KEY, 'true');
          return MOCK_TEAM;
        }

        const stored = localStorage.getItem(STORAGE_TEAM_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as TeamMember[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // ignore
      }
    }
    return MOCK_TEAM;
  });

  // Fetch live team members from database API on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    fetch(`${apiUrl}/admin/team`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTeam(data as TeamMember[]);
        }
      })
      .catch(() => null);
  }, []);

  // Sync team updates to local storage and sync invited phone list
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(STORAGE_TEAM_KEY, JSON.stringify(team));
      const invitedList = team
        .filter((m) => m.phone)
        .map((m) => ({ phone: m.phone, name: m.name, role: m.role }));
      localStorage.setItem(STORAGE_INVITED_KEY, JSON.stringify(invitedList));
    } catch {
      // ignore
    }
  }, [team]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | Role>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TeamMember['status']>('ALL');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const roleOptions = [
    { label: 'All Roles', value: 'ALL' },
    { label: 'Super Admin', value: 'SUPER_ADMIN' },
    { label: 'Product Manager', value: 'PRODUCT_MANAGER' },
    { label: 'Sales Manager', value: 'SALES_MANAGER' },
  ];

  const statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Suspended', value: 'SUSPENDED' },
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleInvite = (param: string | InvitePayload, legacyRole?: Role, legacyName?: string) => {
    let name: string;
    let phone: string;
    let email: string;
    let role: Role;

    if (typeof param === 'object') {
      name = param.name;
      phone = param.phone.replace(/\D/g, '');
      email = param.email.trim().toLowerCase();
      role = param.role;
    } else {
      const isPhone = /^\+?[0-9]{10,12}$/.test(param.replace(/\s+/g, ''));
      phone = isPhone ? param.replace(/\D/g, '') : '';
      email = !isPhone ? param : `${phone}@fashionfriday.com`;
      name = legacyName || (phone ? `Team Member (+91 ${phone})` : email.split('@')[0]);
      role = legacyRole || 'SALES_MANAGER';
    }

    const newMember: TeamMember = {
      id: String(Date.now()),
      name,
      email,
      phone,
      role,
      status: 'ACTIVE',
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTeam((prev) => [...prev, newMember]);
    setIsInviteModalOpen(false);

    // Sync to backend database API in background
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    fetch(`${apiUrl}/admin/team`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, role }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created?.id) {
          setTeam((prev) =>
            prev.map((m) => (m.id === newMember.id ? { ...m, id: created.id } : m)),
          );
        }
      })
      .catch(() => null);
  };

  const handleDeleteMember = (id: string) => {
    const member = team.find((m) => m.id === id);
    if (member?.phone?.replace(/\D/g, '') === '7558969093' && member?.role === 'SUPER_ADMIN') {
      return;
    }

    setTeam((prev) => prev.filter((m) => m.id !== id));

    // Sync deletion to backend database API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    fetch(`${apiUrl}/admin/team/${id}`, {
      method: 'DELETE',
    }).catch(() => null);
  };

  const handleEditSave = (id: string, updates: EditMemberUpdates) => {
    const existing = team.find((m) => m.id === id);
    setTeam((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              name: updates.name,
              phone: updates.phone,
              role: updates.role,
              status: updates.status,
              updatedAt: new Date().toISOString(),
            }
          : m,
      ),
    );
    setEditingMemberId(null);

    // If current logged-in admin edited their own record, update context
    const currentCleanPhone = currentUser?.phone?.replace(/\D/g, '').slice(-10);
    const existingCleanPhone = existing?.phone?.replace(/\D/g, '').slice(-10);
    if (
      currentUser &&
      ((currentCleanPhone && currentCleanPhone === existingCleanPhone) ||
        currentUser.name === existing?.name)
    ) {
      updateUser({
        name: updates.name,
        phone: updates.phone,
        role: updates.role,
      });
    }

    // Sync edit to backend database API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    fetch(`${apiUrl}/admin/team/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          toast.error(err.message || 'Failed to update member in database');
          return;
        }
        const updated = await res.json();
        if (updated?.id) {
          setTeam((prev) =>
            prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m)),
          );
        }
        toast.success('Admin details updated successfully');
      })
      .catch(() => {
        toast.error('Network error updating member');
      });
  };

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400';
      case 'PRODUCT_MANAGER':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400';
      case 'SALES_MANAGER':
        return 'bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/20 dark:text-green-400';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };

  const editingMember = useMemo(() => {
    return team.find((m) => m.id === editingMemberId) ?? null;
  }, [team, editingMemberId]);

  const filteredAndSortedTeam = useMemo(() => {
    let result = [...team];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.phone?.includes(q),
      );
    }

    if (roleFilter !== 'ALL') {
      result = result.filter((m) => m.role === roleFilter);
    }

    if (statusFilter !== 'ALL') {
      result = result.filter((m) => m.status === statusFilter);
    }

    result.sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
      }
      if (typeof bVal === 'string') {
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [team, searchQuery, roleFilter, statusFilter, sortField, sortDirection]);

  return {
    team,
    setTeam,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    isInviteModalOpen,
    setIsInviteModalOpen,
    editingMemberId,
    setEditingMemberId,
    sortField,
    sortDirection,
    roleOptions,
    statusOptions,
    handleSort,
    handleInvite,
    handleDeleteMember,
    handleEditSave,
    getRoleBadgeColor,
    editingMember,
    filteredAndSortedTeam,
  };
}
