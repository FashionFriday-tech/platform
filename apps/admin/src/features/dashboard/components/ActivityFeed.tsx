'use client';

import React from 'react';
import Link from 'next/link';

import { ChevronRightIcon, PackageIcon, ShoppingBagIcon, UsersIcon } from '@ff/ui';

import { type DashboardActivity } from '../hooks/useDashboardData';

interface ActivityFeedProps {
  activities: DashboardActivity[];
  isLoading?: boolean;
}

export function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  return (
    <div className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-black/5 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#141417]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-black dark:text-white">Live Activity Feed</h2>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </div>
          <p className="mt-0.5 text-xs text-black/60 dark:text-white/60">
            Real-time orders, catalog updates, and customer actions
          </p>
        </div>
        <Link
          href="/activity"
          className="group inline-flex items-center gap-1 rounded-xl bg-black/5 px-3 py-1.5 text-xs font-semibold text-black transition-all hover:bg-black hover:text-white dark:bg-white/10 dark:text-white dark:hover:bg-white dark:hover:text-black"
        >
          <span>View All</span>
          <ChevronRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Activity Timeline List */}
      <div className="mt-4 flex flex-1 flex-col divide-y divide-black/5 dark:divide-y dark:divide-white/5">
        {isLoading && activities.length === 0 ? (
          <div className="flex flex-col gap-3 py-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex animate-pulse items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-black/10 dark:bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-3/4 rounded bg-black/10 dark:bg-white/10" />
                  <div className="h-2.5 w-1/2 rounded bg-black/5 dark:bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center p-6 text-center">
            <ShoppingBagIcon className="mb-2 h-8 w-8 text-black/20 dark:text-white/20" />
            <p className="text-sm font-semibold text-black/60 dark:text-white/60">
              No recent store activities recorded yet
            </p>
            <p className="mt-1 text-xs text-black/40 dark:text-white/40">
              New orders and inventory updates will appear here live
            </p>
          </div>
        ) : (
          activities.slice(0, 6).map((activity) => {
            const isOrder = activity.type === 'order';
            const isProduct = activity.type === 'product';
            const targetHref = isOrder ? '/orders' : isProduct ? '/products' : '/customers';

            return (
              <Link
                key={activity.id}
                href={targetHref}
                className="group -mx-2 flex items-center justify-between gap-3 rounded-2xl p-3 transition-all hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {/* Category Icon Badge */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-xs ${
                      isOrder
                        ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : isProduct
                          ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                          : 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400'
                    }`}
                  >
                    {isOrder && <ShoppingBagIcon className="h-5 w-5" />}
                    {isProduct && <PackageIcon className="h-5 w-5" />}
                    {!isOrder && !isProduct && <UsersIcon className="h-5 w-5" />}
                  </div>

                  {/* Title & Description */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-black transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {activity.title}
                    </p>
                    <p className="truncate text-xs text-black/50 dark:text-white/50">
                      {activity.description}
                    </p>
                  </div>
                </div>

                {/* Right: Time badge */}
                <div className="shrink-0 text-right">
                  <span className="font-mono text-[11px] font-semibold text-black/40 dark:text-white/40">
                    {activity.timeAgo}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
