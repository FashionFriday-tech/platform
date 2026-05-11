'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { CloseIcon, ShieldCheckIcon } from '@ff/ui';

import { type Role } from '@/contexts/AuthContext';

import { ROLE_DESCRIPTIONS, ROLE_LABELS, type TeamMember } from '../types';

interface EditMemberModalProps {
  member: TeamMember | null;
  onClose: () => void;
  onSave: (id: string, newRole: Role, newStatus: 'ACTIVE' | 'PENDING' | 'SUSPENDED') => void;
}

export function EditMemberModal({ member, onClose, onSave }: EditMemberModalProps) {
  const [selectedRole, setSelectedRole] = useState<Role>('SALES_MANAGER');
  const [status, setStatus] = useState<'ACTIVE' | 'PENDING' | 'SUSPENDED'>('ACTIVE');
  const [mounted, setMounted] = useState(false);

  const roles: Role[] = ['SUPER_ADMIN', 'PRODUCT_MANAGER', 'SALES_MANAGER'];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (member) {
      setSelectedRole(member.role);
      setStatus(member.status);
    }
  }, [member]);

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (member) {
      onSave(member.id, selectedRole, status);
    }
  };

  if (!member || !mounted) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#111111]">
        <div className="flex items-center justify-between border-b border-black/5 p-6 dark:border-white/5">
          <div>
            <h2 className="text-xl font-bold text-black dark:text-white">Edit Team Member</h2>
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">
              Manage role and access for {member.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <CloseIcon className="h-5 w-5 text-black/60 dark:text-white/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-black dark:text-white">
              Account Status
            </label>
            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  checked={status === 'ACTIVE'}
                  onChange={() => {
                    setStatus('ACTIVE');
                  }}
                  className="accent-black dark:accent-white"
                />
                <span className="text-sm text-black dark:text-white">Active</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  checked={status === 'PENDING'}
                  onChange={() => {
                    setStatus('PENDING');
                  }}
                  className="accent-black dark:accent-white"
                />
                <span className="text-sm text-black dark:text-white">Pending</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  checked={status === 'SUSPENDED'}
                  onChange={() => {
                    setStatus('SUSPENDED');
                  }}
                  className="accent-black dark:accent-white"
                />
                <span className="text-sm text-black dark:text-white">Suspended</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-black dark:text-white">Select Role</label>
            <div className="flex flex-col gap-3">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role);
                  }}
                  className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                    selectedRole === role
                      ? 'border-black bg-black/5 dark:border-white dark:bg-white/5'
                      : 'border-black/10 hover:border-black/30 dark:border-white/10 dark:hover:border-white/30'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      selectedRole === role
                        ? 'border-black dark:border-white'
                        : 'border-black/20 dark:border-white/20'
                    }`}
                  >
                    {selectedRole === role && (
                      <div className="h-2.5 w-2.5 rounded-full bg-black dark:bg-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-black dark:text-white">
                        // eslint-disable-next-line security/detect-object-injection
                        {ROLE_LABELS[role]}
                      </span>
                      {role === 'SUPER_ADMIN' && (
                        <ShieldCheckIcon className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-black/60 dark:text-white/60">
                      // eslint-disable-next-line security/detect-object-injection
                      {ROLE_DESCRIPTIONS[role]}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
