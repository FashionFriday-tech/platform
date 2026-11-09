'use client';

import React from 'react';

import { PackageIcon, ShieldCheckIcon, StarBadgeIcon } from '@ff/ui';

import { type QualityItem } from '../types';

interface QualityStatsProps {
  qualities: QualityItem[];
}

export function QualityStats({ qualities }: QualityStatsProps) {
  const totalQualities = qualities.length;

  const footwearQualities = qualities.filter((q) =>
    q.categories.some((c) => {
      const lower = c.toLowerCase();
      return lower.includes('footwear') || lower.includes('sneak') || lower.includes('shoe');
    }),
  ).length;

  const watchQualities = qualities.filter((q) =>
    q.categories.some((c) => c.toLowerCase().includes('watch')),
  ).length;

  const totalAssignedProducts = qualities.reduce((sum, q) => sum + (q.productCount ?? 0), 0);

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
      {/* Total Qualities */}
      <div className="flex flex-col justify-between rounded-2xl border border-black/5 bg-white p-3 shadow-xs sm:p-4 md:p-5 dark:border-white/5 dark:bg-[#121212]">
        <div className="flex items-center justify-between gap-1">
          <span className="truncate text-[11px] font-medium text-black/50 sm:text-xs dark:text-white/50">
            Total Qualities
          </span>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-black/5 text-black sm:h-8 sm:w-8 dark:bg-white/5 dark:text-white">
            <ShieldCheckIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
        </div>
        <p className="mt-1.5 text-xl font-bold text-black sm:mt-2 sm:text-2xl lg:text-3xl dark:text-white">
          {totalQualities}
        </p>
        <span className="mt-0.5 block truncate text-[10px] text-black/40 sm:mt-1 sm:text-[11px] dark:text-white/40">
          Active quality tiers
        </span>
      </div>

      {/* Footwear Qualities */}
      <div className="flex flex-col justify-between rounded-2xl border border-black/5 bg-white p-3 shadow-xs sm:p-4 md:p-5 dark:border-white/5 dark:bg-[#121212]">
        <div className="flex items-center justify-between gap-1">
          <span className="truncate text-[11px] font-medium text-black/50 sm:text-xs dark:text-white/50">
            Footwear Tiers
          </span>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 sm:h-8 sm:w-8 dark:text-blue-400">
            <StarBadgeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
        </div>
        <p className="mt-1.5 text-xl font-bold text-black sm:mt-2 sm:text-2xl lg:text-3xl dark:text-white">
          {footwearQualities}
        </p>
        <span className="mt-0.5 block truncate text-[10px] text-black/40 sm:mt-1 sm:text-[11px] dark:text-white/40">
          Including 6A, UA, Semi UA
        </span>
      </div>

      {/* Watch Qualities */}
      <div className="flex flex-col justify-between rounded-2xl border border-black/5 bg-white p-3 shadow-xs sm:p-4 md:p-5 dark:border-white/5 dark:bg-[#121212]">
        <div className="flex items-center justify-between gap-1">
          <span className="truncate text-[11px] font-medium text-black/50 sm:text-xs dark:text-white/50">
            Watch Tiers
          </span>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 sm:h-8 sm:w-8 dark:text-amber-400">
            <ShieldCheckIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
        </div>
        <p className="mt-1.5 text-xl font-bold text-black sm:mt-2 sm:text-2xl lg:text-3xl dark:text-white">
          {watchQualities}
        </p>
        <span className="mt-0.5 block truncate text-[10px] text-black/40 sm:mt-1 sm:text-[11px] dark:text-white/40">
          Including 7AA, 10A, 7A
        </span>
      </div>

      {/* Products Mapped */}
      <div className="flex flex-col justify-between rounded-2xl border border-black/5 bg-white p-3 shadow-xs sm:p-4 md:p-5 dark:border-white/5 dark:bg-[#121212]">
        <div className="flex items-center justify-between gap-1">
          <span className="truncate text-[11px] font-medium text-black/50 sm:text-xs dark:text-white/50">
            Products Tagged
          </span>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 sm:h-8 sm:w-8 dark:text-emerald-400">
            <PackageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
        </div>
        <p className="mt-1.5 text-xl font-bold text-black sm:mt-2 sm:text-2xl lg:text-3xl dark:text-white">
          {totalAssignedProducts}
        </p>
        <span className="mt-0.5 block truncate text-[10px] text-black/40 sm:mt-1 sm:text-[11px] dark:text-white/40">
          Across catalog inventory
        </span>
      </div>
    </div>
  );
}
