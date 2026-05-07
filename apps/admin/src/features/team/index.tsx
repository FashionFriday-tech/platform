'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PlusIcon, SearchIcon, ShieldCheckIcon, MailIcon } from '@ff/ui';
import { TeamMember, ROLE_LABELS } from './types';
import { InviteMemberModal } from './components/InviteMemberModal';
import { EditMemberModal } from './components/EditMemberModal';
import { TeamStats } from './components/TeamStats';
import { Role } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { CustomSelect } from '../../components/ui/CustomSelect';

// Mock initial data
const MOCK_TEAM: TeamMember[] = [
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

type SortField = 'name' | 'role' | 'status' | 'joinedAt' | 'updatedAt';

export function TeamManagementView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [team, setTeam] = useState<TeamMember[]>(MOCK_TEAM);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('action') === 'invite') {
      setIsInviteModalOpen(true);
    }
  }, [searchParams]);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  
  const [sortField, setSortField] = useState<SortField>('joinedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ACTIVE' | 'PENDING' | 'SUSPENDED'>('all');

  const roleOptions = [
    { label: 'All Roles', value: 'all' },
    { label: 'Super Admins', value: 'SUPER_ADMIN' },
    { label: 'Product Managers', value: 'PRODUCT_MANAGER' },
    { label: 'Sales Managers', value: 'SALES_MANAGER' },
  ];

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Suspended', value: 'SUSPENDED' },
  ];

  const handleSort = (field: SortField) => {
    if (field === 'role' || field === 'status') return; // Disable sorting for role and status headers
    
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedTeam = useMemo(() => {
    let result = team.filter(
      (member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (roleFilter !== 'all') {
      result = result.filter(m => m.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter(m => m.status === statusFilter);
    }

    return result.sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (sortField === 'joinedAt') {
        return sortDirection === 'asc' 
          ? new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
          : new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
      }
      if (sortField === 'updatedAt') {
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
      }
      return 0;
    });
  }, [team, searchQuery, roleFilter, statusFilter, sortField, sortDirection]);

  const handleInvite = (email: string, role: Role) => {
    const now = new Date().toISOString();
    const newMember: TeamMember = {
      id: Math.random().toString(),
      name: email.split('@')[0],
      email,
      role,
      status: 'PENDING',
      joinedAt: now,
      updatedAt: now,
    };
    setTeam([...team, newMember]);
    setIsInviteModalOpen(false);
  };

  const handleEditSave = (id: string, newRole: Role, newStatus: 'ACTIVE' | 'PENDING' | 'SUSPENDED') => {
    setTeam(team.map(member => 
      member.id === id 
        ? { ...member, role: newRole, status: newStatus, updatedAt: new Date().toISOString() } 
        : member
    ));
    setEditingMemberId(null);
  };

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 border-orange-500/20';
      case 'PRODUCT_MANAGER':
        return 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/20';
      case 'SALES_MANAGER':
        return 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 border-green-500/20';
      default:
        return 'bg-black/5 text-black dark:bg-white/5 dark:text-white border-black/10 dark:border-white/10';
    }
  };

  const editingMember = team.find(m => m.id === editingMemberId) || null;

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden px-6 pb-6">
      <div className="shrink-0 mt-2">
        <TeamStats team={team} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-50 flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-4 xl:flex-row xl:items-center xl:justify-between dark:border-white/5 dark:bg-[#111111]"
        >
          <div className="relative max-w-md flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <SearchIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
            </div>
            <input
              type="text"
              placeholder="Search team members by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-11 text-sm text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <CustomSelect
              options={roleOptions}
              value={roleFilter}
              onChange={(val) => setRoleFilter(val as any)}
              className="w-48 z-50"
            />

            <CustomSelect
              options={statusOptions}
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as any)}
              className="w-40 z-50"
            />

            <button 
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center space-x-2 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Invite Member</span>
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key="team-table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-h-0 overflow-hidden flex flex-col rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#111111]"
          >
            <div className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-hide">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 z-10 border-b border-black/5 bg-[#f8f9fa] text-xs font-semibold uppercase tracking-wider text-black/60 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/60">
                  <tr>
                    <th 
                      className="cursor-pointer px-6 py-4 hover:bg-black/5 dark:hover:bg-white/5"
                      onClick={() => handleSort('name')}
                    >
                      Employee {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-4 min-w-[150px]">
                      Role
                    </th>
                    <th className="px-6 py-4 min-w-[150px]">
                      Status
                    </th>
                    <th 
                      className="cursor-pointer px-6 py-4 hover:bg-black/5 dark:hover:bg-white/5"
                      onClick={() => handleSort('joinedAt')}
                    >
                      Joined {sortField === 'joinedAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="cursor-pointer px-6 py-4 hover:bg-black/5 dark:hover:bg-white/5"
                      onClick={() => handleSort('updatedAt')}
                    >
                      Updated {sortField === 'updatedAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {filteredAndSortedTeam.map((member) => (
                    <tr key={member.id} className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/10 font-bold text-black dark:bg-white/10 dark:text-white">
                            {member.avatarUrl ? (
                              <img src={member.avatarUrl} alt={member.name} className="h-full w-full object-cover" />
                            ) : (
                              member.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-black dark:text-white">{member.name}</div>
                            <div className="text-xs text-black/60 dark:text-white/60">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 min-w-[150px]">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${getRoleBadgeColor(member.role)}`}>
                          {member.role === 'SUPER_ADMIN' && <ShieldCheckIcon className="h-3 w-3" />}
                          {ROLE_LABELS[member.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4 min-w-[150px]">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
                          member.status === 'ACTIVE' 
                            ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                            : member.status === 'PENDING'
                            ? 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400'
                            : 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                        }`}>
                          {member.status === 'PENDING' && <MailIcon className="h-3 w-3" />}
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-black/60 dark:text-white/60">
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-black/60 dark:text-white/60">
                        {member.updatedAt ? new Date(member.updatedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setEditingMemberId(member.id)}
                          className="rounded-lg p-2 text-sm font-semibold text-black/60 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredAndSortedTeam.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-black/60 dark:text-white/60">
                        No team members found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {isInviteModalOpen && (
        <InviteMemberModal 
          onClose={() => setIsInviteModalOpen(false)} 
          onInvite={handleInvite} 
        />
      )}
      
      <EditMemberModal
        member={editingMember}
        onClose={() => setEditingMemberId(null)}
        onSave={handleEditSave}
      />
    </div>
  );
}
