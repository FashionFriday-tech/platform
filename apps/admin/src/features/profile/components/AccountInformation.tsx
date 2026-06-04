import React from 'react';

import { type User } from '@/contexts/AuthContext';

interface Props {
  user: User;
}

export function AccountInformation({ user }: Props) {
  return (
    <div className="scrollbar-hide flex flex-col overflow-y-auto rounded-3xl border border-white/60 bg-white/40 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/20">
      <h3 className="mb-6 flex items-center gap-3 text-xs font-bold tracking-widest text-black/40 uppercase dark:text-white/40">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        Account Information
      </h3>
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold tracking-wider text-black/40 uppercase dark:text-white/40">
            Email Address
          </label>
          <p className="text-lg font-medium text-black dark:text-white">
            {user.name.split(' ')[0].toLowerCase()}@fashionfriday.com
          </p>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold tracking-wider text-black/40 uppercase dark:text-white/40">
            Contact Number
          </label>
          <p className="text-lg font-medium text-black dark:text-white">
            {user.phone ?? '+1 (555) 000-0000'}
          </p>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold tracking-wider text-black/40 uppercase dark:text-white/40">
            Role Access
          </label>
          <div className="inline-flex items-center text-lg font-medium text-black dark:text-white">
            {user.role.replace('_', ' ')}
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold tracking-wider text-black/40 uppercase dark:text-white/40">
            Account Status
          </label>
          <div className="flex items-center gap-2.5 text-lg font-medium text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            Active
          </div>
        </div>
      </div>
    </div>
  );
}
