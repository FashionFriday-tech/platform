'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { CloseIcon, ShieldCheckIcon } from '@ff/ui';

import { type Role, useAuth } from '@/contexts/AuthContext';
import { PinStorage } from '@/lib/security/pin-storage';

import { ROLE_DESCRIPTIONS, ROLE_LABELS, type TeamMember } from '../types';

interface EditMemberModalProps {
  member: TeamMember | null;
  onClose: () => void;
  onSave: (id: string, newRole: Role, newStatus: 'ACTIVE' | 'PENDING' | 'SUSPENDED') => void;
}

export function EditMemberModal({ member, onClose, onSave }: EditMemberModalProps) {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  const [selectedRole, setSelectedRole] = useState<Role>('SALES_MANAGER');
  const [status, setStatus] = useState<'ACTIVE' | 'PENDING' | 'SUSPENDED'>('ACTIVE');
  const [mounted, setMounted] = useState(false);

  const [pinInput, setPinInput] = useState('');
  const [isUpdatingPin, setIsUpdatingPin] = useState(false);
  const [pinMessage, setPinMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  );

  const roles: Role[] = ['SUPER_ADMIN', 'PRODUCT_MANAGER', 'SALES_MANAGER'];

  useEffect(() => {
    setMounted(true);
    if (member) {
      setSelectedRole(member.role);
      setStatus(member.status);
      setPinInput('');
      setPinMessage(null);
    }
  }, [member]);

  const handlePinUpdate = async () => {
    if (!member || pinInput.length !== 4) {
      return;
    }
    setIsUpdatingPin(true);
    setPinMessage(null);
    try {
      const adminPhone = currentUser?.phone || '9999999999';
      const targetPhone = member.phone || member.email;
      const res = await PinStorage.updateBackendPin(adminPhone, targetPhone, pinInput);
      setPinMessage({
        type: 'success',
        text: res.message || 'PIN updated & encrypted successfully!',
      });
      setPinInput('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update PIN';
      setPinMessage({ type: 'error', text: message });
    } finally {
      setIsUpdatingPin(false);
    }
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
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

          {/* 4-Digit Security PIN Management (Super Admin Exclusive) */}
          <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-neutral-50 p-4 dark:border-white/10 dark:bg-neutral-900/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-black dark:text-white">
                    4-Digit Security PIN
                  </span>
                  <span className="rounded-md bg-neutral-200 px-1.5 py-0.5 text-[10px] font-bold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                    Encrypted
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-black/60 dark:text-white/60">
                  {isSuperAdmin
                    ? 'Only Super Admins can update this member’s lock screen PIN.'
                    : 'Restricted: Only Super Admin can change security PINs.'}
                </p>
              </div>
            </div>

            {isSuperAdmin ? (
              <div className="mt-2 flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setPinInput(val);
                      setPinMessage(null);
                    }}
                    placeholder="Enter new 4 digits (e.g. 1234)"
                    className="flex-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-center font-mono text-sm tracking-widest text-black placeholder:text-black/30 focus:border-black focus:outline-none dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:placeholder:text-white/30 dark:focus:border-white"
                  />
                  <button
                    type="button"
                    disabled={isUpdatingPin || pinInput.length !== 4}
                    onClick={handlePinUpdate}
                    className="rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white transition-opacity hover:bg-black/80 disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-white/80"
                  >
                    {isUpdatingPin ? 'Saving...' : 'Update PIN'}
                  </button>
                </div>
                {pinMessage && (
                  <p
                    className={`text-xs font-medium ${
                      pinMessage.type === 'success' ? 'text-emerald-500' : 'text-rose-500'
                    }`}
                  >
                    {pinMessage.text}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-1 rounded-xl bg-black/5 p-2.5 text-xs text-black/50 dark:bg-white/5 dark:text-white/50">
                You do not have permission to modify security credentials.
              </div>
            )}
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
