'use client';

import Image from 'next/image';

import { MailIcon, PlusIcon, SearchIcon, ShieldCheckIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { type Role } from '@/contexts/AuthContext';

import { CustomSelect } from '../../../components/ui/CustomSelect';
import { useTeam } from '../hooks/useTeam';
import { type TeamMember } from '../types';
import { ROLE_LABELS } from '../types';
import { EditMemberModal } from './EditMemberModal';
import { InviteMemberModal } from './InviteMemberModal';
import { TeamStats } from './TeamStats';

export function TeamManagementView() {
  const {
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
  } = useTeam();

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      <TeamStats team={team} />

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
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-11 text-sm text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <CustomSelect
              options={roleOptions}
              value={roleFilter}
              onChange={(val) => {
                setRoleFilter(val as Role | 'ALL');
              }}
              className="z-50 w-48"
            />

            <CustomSelect
              options={statusOptions}
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val as TeamMember['status'] | 'ALL');
              }}
              className="z-50 w-40"
            />

            <button
              onClick={() => {
                setIsInviteModalOpen(true);
              }}
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
            className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-black/10 bg-slate-50/50 p-2.5 shadow-xs dark:border-white/10 dark:bg-black/20"
          >
            <div className="scrollbar-hide flex-1 overflow-x-auto overflow-y-auto">
              <div className="flex min-w-[900px] flex-col gap-2.5 pb-2">
                {/* Header Tab - Fixed / Sticky on Top (Black in Light Mode) */}
                <div className="sticky top-0 z-20 pb-0.5">
                  <div className="grid grid-cols-[minmax(220px,2fr)_minmax(160px,1.3fr)_minmax(130px,1fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(80px,0.7fr)] items-center rounded-xl border border-black/10 bg-black px-6 py-3.5 text-white shadow-md backdrop-blur-md dark:border-white/10 dark:bg-white dark:text-black dark:shadow-sm">
                    <div
                      className="group flex cursor-pointer items-center gap-1.5 font-semibold tracking-wider transition-colors select-none"
                      onClick={() => {
                        handleSort('name');
                      }}
                    >
                      <span className="text-xs text-white/60 uppercase group-hover:text-white dark:text-black/60 dark:group-hover:text-black">
                        Employee
                      </span>
                      {sortField === 'name' && (
                        <span className="text-xs font-bold text-white dark:text-black">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                      Role
                    </div>
                    <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                      Status
                    </div>
                    <div
                      className="group flex cursor-pointer items-center gap-1.5 font-semibold tracking-wider transition-colors select-none"
                      onClick={() => {
                        handleSort('joinedAt');
                      }}
                    >
                      <span className="text-xs text-white/60 uppercase group-hover:text-white dark:text-black/60 dark:group-hover:text-black">
                        Joined
                      </span>
                      {sortField === 'joinedAt' && (
                        <span className="text-xs font-bold text-white dark:text-black">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                    <div
                      className="group flex cursor-pointer items-center gap-1.5 font-semibold tracking-wider transition-colors select-none"
                      onClick={() => {
                        handleSort('updatedAt');
                      }}
                    >
                      <span className="text-xs text-white/60 uppercase group-hover:text-white dark:text-black/60 dark:group-hover:text-black">
                        Updated
                      </span>
                      {sortField === 'updatedAt' && (
                        <span className="text-xs font-bold text-white dark:text-black">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                    <div className="text-right text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                      Actions
                    </div>
                  </div>
                </div>

                {/* Row Tabs (White in Light Mode) */}
                {filteredAndSortedTeam.length === 0 ? (
                  <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-black/10 bg-white p-8 text-center shadow-xs dark:border-white/10 dark:bg-[#141417]">
                    <p className="text-sm font-semibold text-black/60 dark:text-white/60">
                      No team members found matching your search.
                    </p>
                  </div>
                ) : (
                  filteredAndSortedTeam.map((member) => (
                    <div
                      key={member.id}
                      className="group grid grid-cols-[minmax(220px,2fr)_minmax(160px,1.3fr)_minmax(130px,1fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(80px,0.7fr)] items-center rounded-xl border border-black/5 bg-white px-6 py-3.5 text-black shadow-xs transition-all duration-200 hover:border-black/15 hover:shadow-md active:scale-[0.995] dark:border-white/10 dark:bg-[#141417] dark:text-white dark:shadow-sm dark:hover:border-white/20"
                    >
                      {/* Employee Info */}
                      <div className="flex min-w-0 items-center gap-3 pr-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/10 font-bold text-black dark:bg-white/10 dark:text-white">
                          {member.avatarUrl ? (
                            <Image
                              src={member.avatarUrl}
                              alt={member.name}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          ) : (
                            member.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-black dark:text-white">
                            {member.name}
                          </div>
                          <div className="truncate text-xs text-black/60 dark:text-white/60">
                            {member.email}
                          </div>
                        </div>
                      </div>

                      {/* Role */}
                      <div className="pr-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${getRoleBadgeColor(member.role)}`}
                        >
                          {member.role === 'SUPER_ADMIN' && <ShieldCheckIcon className="h-3 w-3" />}
                          {ROLE_LABELS[member.role]}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="pr-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
                            member.status === 'ACTIVE'
                              ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                              : member.status === 'PENDING'
                                ? 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400'
                                : 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                          }`}
                        >
                          {member.status === 'PENDING' && <MailIcon className="h-3 w-3" />}
                          {member.status}
                        </span>
                      </div>

                      {/* Joined */}
                      <div className="text-xs font-medium text-black/60 dark:text-white/60">
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </div>

                      {/* Updated */}
                      <div className="text-xs font-medium text-black/60 dark:text-white/60">
                        {member.updatedAt ? new Date(member.updatedAt).toLocaleDateString() : 'N/A'}
                      </div>

                      {/* Actions */}
                      <div className="text-right">
                        <button
                          onClick={() => {
                            setEditingMemberId(member.id);
                          }}
                          className="rounded-lg p-2 text-sm font-semibold text-black/60 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {isInviteModalOpen && (
        <InviteMemberModal
          onClose={() => {
            setIsInviteModalOpen(false);
          }}
          onInvite={handleInvite}
        />
      )}

      <EditMemberModal
        member={editingMember}
        onClose={() => {
          setEditingMemberId(null);
        }}
        onSave={handleEditSave}
      />
    </div>
  );
}
