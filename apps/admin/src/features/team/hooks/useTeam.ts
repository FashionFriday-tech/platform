'use client';

import { useMemo, useState } from 'react';

import { type Role } from '@/contexts/AuthContext';

import { MOCK_TEAM, type SortField, type TeamMember } from '../types';

export function useTeam() {
  const [team, setTeam] = useState<TeamMember[]>(MOCK_TEAM);
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

  const handleInvite = (email: string, role: Role) => {
    const newMember: TeamMember = {
      id: String(Date.now()),
      name: email
        .split('@')[0]
        .split(/[._-]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      email,
      role,
      status: 'PENDING',
      joinedAt: new Date().toISOString(),
    };
    setTeam((prev) => [...prev, newMember]);
    setIsInviteModalOpen(false);
  };

  const handleEditSave = (id: string, role: Role, status: 'ACTIVE' | 'PENDING' | 'SUSPENDED') => {
    setTeam((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, role, status, updatedAt: new Date().toISOString() } : m,
      ),
    );
    setEditingMemberId(null);
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

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
      );
    }

    if (roleFilter !== 'ALL') {
      result = result.filter((m) => m.role === roleFilter);
    }

    if (statusFilter !== 'ALL') {
      result = result.filter((m) => m.status === statusFilter);
    }

    result.sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    return result;
  }, [team, searchQuery, roleFilter, statusFilter, sortField, sortDirection]);

  return {
    team,
    searchQuery,
    setSearchQuery,
    isInviteModalOpen,
    setIsInviteModalOpen,
    setEditingMemberId,
    sortField,
    sortDirection,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    roleOptions,
    statusOptions,
    handleSort,
    filteredAndSortedTeam,
    handleInvite,
    handleEditSave,
    getRoleBadgeColor,
    editingMember,
  };
}
