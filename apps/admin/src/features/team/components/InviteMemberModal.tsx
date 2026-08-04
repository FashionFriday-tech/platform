'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { CloseIcon, ShieldCheckIcon } from '@ff/ui';

import { type Role } from '@/contexts/AuthContext';

import { ROLE_LABELS } from '../types';

interface InviteMemberModalProps {
  onClose: () => void;
  onInvite: (data: { name: string; phone: string; email: string; role: Role }) => void;
}

const ROLE_NOTIFICATION_INFO: Record<Role, string> = {
  SUPER_ADMIN: 'Full system control. Receives ALL notifications (orders, stock, updates).',
  PRODUCT_MANAGER:
    'Receives ONLY product & inventory notifications (low stock & catalogue updates).',
  SALES_MANAGER: 'Receives ONLY sales & order notifications (new orders & order updates).',
};

export function InviteMemberModal({ onClose, onInvite }: InviteMemberModalProps) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('SALES_MANAGER');
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState('');

  const roles: Role[] = ['PRODUCT_MANAGER', 'SALES_MANAGER', 'SUPER_ADMIN'];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter the full name.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    onInvite({
      name: name.trim(),
      phone: cleanPhone,
      email: trimmedEmail,
      role: selectedRole,
    });
  };

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#111111]">
        <div className="flex items-center justify-between border-b border-black/5 p-6 dark:border-white/5">
          <div>
            <h2 className="text-xl font-bold text-black dark:text-white">
              Invite Admin / Team Member
            </h2>
            <p className="mt-1 text-xs text-black/60 dark:text-white/60">
              Add a new staff member with name, phone number, email, and designated role.
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold tracking-wider text-black uppercase dark:text-white">
              Full Name *
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="e.g. fredy "
              className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm text-black outline-none focus:border-black/30 dark:border-white/10 dark:text-white dark:focus:border-white/30"
            />
          </div>

          {/* Mobile Phone Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold tracking-wider text-black uppercase dark:text-white">
              Mobile Phone Number *
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 font-mono text-xs font-bold text-black/60 dark:text-white/60">
                +91
              </span>
              <input
                required
                type="tel"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                placeholder="7558969093"
                className="w-full rounded-xl border border-black/10 bg-transparent py-2.5 pr-4 pl-14 font-mono text-sm text-black outline-none focus:border-black/30 dark:border-white/10 dark:text-white dark:focus:border-white/30"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold tracking-wider text-black uppercase dark:text-white">
              Work Email ID *
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="fredy@fashionfriday.com"
              className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm text-black outline-none focus:border-black/30 dark:border-white/10 dark:text-white dark:focus:border-white/30"
            />
          </div>

          {/* Role / Position Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold tracking-wider text-black uppercase dark:text-white">
              Position / Role &amp; Notification Scope *
            </label>
            <div className="flex flex-col gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-left transition-all ${selectedRole === role
                    ? 'border-black bg-black/5 dark:border-white dark:bg-white/5'
                    : 'border-black/10 hover:border-black/30 dark:border-white/10 dark:hover:border-white/30'
                    }`}
                >
                  <div
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${selectedRole === role
                      ? 'border-black dark:border-white'
                      : 'border-black/20 dark:border-white/20'
                      }`}
                  >
                    {selectedRole === role && (
                      <div className="h-2 w-2 rounded-full bg-black dark:bg-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-black dark:text-white">
                        {ROLE_LABELS[role]}
                      </span>
                      {role === 'SUPER_ADMIN' && (
                        <ShieldCheckIcon className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-black/60 dark:text-white/60">
                      {ROLE_NOTIFICATION_INFO[role]}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl px-4 py-3 text-xs font-bold text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-black px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
            >
              Add Team Member
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
