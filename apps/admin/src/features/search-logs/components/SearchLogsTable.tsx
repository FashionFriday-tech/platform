'use client';

import React from 'react';

import { CalendarIcon, InfoIcon, MailIcon, SearchIcon, UserIcon } from '@ff/ui';

import type { SearchLog } from '../hooks/useSearchLogs';

interface SearchLogsTableProps {
  logs: SearchLog[];
  isLoading: boolean;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export function SearchLogsTable({ logs, isLoading }: SearchLogsTableProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-slate-50/50 p-2.5 shadow-xs dark:border-white/10 dark:bg-black/20">
      <div className="scrollbar-hide flex-1 overflow-x-auto overflow-y-auto">
        <div className="flex min-w-[850px] flex-col gap-2.5 pb-2">
          {/* Sticky Header */}
          <div className="sticky top-0 z-20 pb-0.5">
            <div className="grid grid-cols-[minmax(220px,2.5fr)_minmax(220px,2fr)_minmax(160px,1.5fr)_minmax(120px,1fr)] items-center rounded-xl border border-black/10 bg-black px-6 py-3.5 text-white shadow-md dark:border-white/10 dark:bg-white dark:text-black">
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Search Query
              </div>
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                User
              </div>
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Email
              </div>
              <div className="text-right text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Date &amp; Time
              </div>
            </div>
          </div>

          {/* Body */}
          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-black/10 bg-white shadow-xs dark:border-white/10 dark:bg-[#141417]">
              <div className="flex flex-col items-center gap-2 text-black/40 dark:text-white/40">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-black dark:border-white/10 dark:border-t-white" />
                <span className="text-sm">Loading search logs...</span>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-black/10 bg-white p-8 text-center shadow-xs dark:border-white/10 dark:bg-[#141417]">
              <InfoIcon className="h-8 w-8 text-black/30 dark:text-white/30" />
              <span className="text-base font-semibold text-black dark:text-white">No searches yet</span>
              <span className="text-xs text-black/50 dark:text-white/50">
                Searches from the storefront will appear here automatically.
              </span>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="group grid grid-cols-[minmax(220px,2.5fr)_minmax(220px,2fr)_minmax(160px,1.5fr)_minmax(120px,1fr)] items-center rounded-xl border border-black/5 bg-white px-6 py-3.5 text-black shadow-xs transition-all duration-200 hover:border-black/15 hover:shadow-md dark:border-white/10 dark:bg-[#141417] dark:text-white dark:hover:border-white/20"
              >
                {/* Query */}
                <div className="flex items-center gap-2.5 pr-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
                    <SearchIcon className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate text-sm font-semibold text-black dark:text-white">
                    {log.query}
                  </span>
                </div>

                {/* User */}
                <div className="flex items-center gap-2.5 pr-4">
                  {log.user ? (
                    <>
                      {/* Avatar initial */}
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-[11px] font-black text-white dark:bg-white dark:text-black">
                        {log.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-black dark:text-white">
                          {log.user.name}
                        </p>
                        {log.user.phone && (
                          <p className="truncate text-[10px] text-black/40 dark:text-white/40">
                            {log.user.phone}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/10">
                        <UserIcon className="h-3.5 w-3.5 text-black/40 dark:text-white/40" />
                      </div>
                      <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/20">
                        Guest
                      </span>
                    </>
                  )}
                </div>

                {/* Email */}
                <div className="flex items-center gap-1.5 pr-4 truncate">
                  {log.user?.email ? (
                    <>
                      <MailIcon className="h-3.5 w-3.5 shrink-0 text-black/30 dark:text-white/30" />
                      <span className="truncate text-xs text-black/60 dark:text-white/60">
                        {log.user.email}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-black/25 italic dark:text-white/25">—</span>
                  )}
                </div>

                {/* Date */}
                <div className="flex items-center justify-end gap-1.5">
                  <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-black/30 dark:text-white/30" />
                  <span className="text-xs text-black/50 dark:text-white/50">
                    {formatDate(log.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
