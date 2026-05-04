'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-col gap-8 rounded-2xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#111]">
        <div className="flex items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-black/10 text-3xl font-bold text-black dark:bg-white/10 dark:text-white">
            {user.initials}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">{user.name}</h1>
            <p className="mt-1 text-lg font-medium text-black/60 dark:text-white/60">
              {user.role.replace('_', ' ')}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-black/5 bg-black/[0.02] p-6 dark:border-white/5 dark:bg-white/[0.02]">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-black/50 dark:text-white/50">
              Account Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-black/40 dark:text-white/40">Email</label>
                <p className="font-medium">{user.name.split(' ')[0].toLowerCase()}@fashionfriday.com</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-black/40 dark:text-white/40">Role</label>
                <p className="font-medium">{user.role.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-black/40 dark:text-white/40">Status</label>
                <p className="font-medium text-green-600 dark:text-green-400">Active</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-black/5 bg-black/[0.02] p-6 dark:border-white/5 dark:bg-white/[0.02]">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-black/50 dark:text-white/50">
              Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-xs text-black/50 dark:text-white/50">Receive daily summaries</p>
                </div>
                <div className="h-6 w-10 rounded-full bg-black/20 dark:bg-white/20 relative">
                  <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white dark:bg-black"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-black/50 dark:text-white/50">Enhanced account security</p>
                </div>
                <div className="h-6 w-10 rounded-full bg-black/20 dark:bg-white/20 relative">
                  <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white dark:bg-black"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
