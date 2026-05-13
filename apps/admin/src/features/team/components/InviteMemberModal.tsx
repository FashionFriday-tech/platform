'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { CloseIcon, MailIcon, ShieldCheckIcon } from '@ff/ui';

import { type Role } from '@/contexts/AuthContext';

import { ROLE_DESCRIPTIONS, ROLE_LABELS } from '../types';

interface InviteMemberModalProps {
  onClose: () => void;
  onInvite: (email: string, role: Role) => void;
}

export function InviteMemberModal({ onClose, onInvite }: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('SALES_MANAGER');
  const [mounted, setMounted] = useState(false);

  const roles: Role[] = ['SUPER_ADMIN', 'PRODUCT_MANAGER', 'SALES_MANAGER'];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onInvite(email, selectedRole);
    }
  };

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#111111]">
        <div className="flex items-center justify-between border-b border-black/5 p-6 dark:border-white/5">
          <div>
            <h2 className="text-xl font-bold text-black dark:text-white">Invite Team Member</h2>
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">
              Send an invitation to join the admin workspace.
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
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-black dark:text-white">
              Email Address
            </label>
            <div className="relative flex items-center">
              <MailIcon className="absolute left-4 h-5 w-5 text-black/40 dark:text-white/40" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="colleague@fashionfriday.com"
                className="w-full rounded-xl border border-black/10 bg-transparent py-3 pr-4 pl-12 text-sm text-black outline-none focus:border-black/30 dark:border-white/10 dark:text-white dark:focus:border-white/30"
              />
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
                        {ROLE_LABELS[role]}
                      </span>
                      {role === 'SUPER_ADMIN' && (
                        <ShieldCheckIcon className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-black/60 dark:text-white/60">
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
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
