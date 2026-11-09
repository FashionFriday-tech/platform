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
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {/* Total Qualities */}
      <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-xs sm:p-5 dark:border-white/5 dark:bg-[#121212]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-black/50 dark:text-white/50">
            Total Qualities
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/5 text-black dark:bg-white/5 dark:text-white">
            <ShieldCheckIcon className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold text-black sm:text-3xl dark:text-white">
          {totalQualities}
        </p>
        <span className="mt-1 block text-[11px] text-black/40 dark:text-white/40">
          Active quality tiers
        </span>
      </div>

      {/* Footwear Qualities */}
      <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-xs sm:p-5 dark:border-white/5 dark:bg-[#121212]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-black/50 dark:text-white/50">
            Footwear Tiers
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <StarBadgeIcon className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold text-black sm:text-3xl dark:text-white">
          {footwearQualities}
        </p>
        <span className="mt-1 block text-[11px] text-black/40 dark:text-white/40">
          Including 6A, UA, Semi UA
        </span>
      </div>

      {/* Watch Qualities */}
      <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-xs sm:p-5 dark:border-white/5 dark:bg-[#121212]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-black/50 dark:text-white/50">Watch Tiers</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <ShieldCheckIcon className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold text-black sm:text-3xl dark:text-white">
          {watchQualities}
        </p>
        <span className="mt-1 block text-[11px] text-black/40 dark:text-white/40">
          Including 7AA, 10A, 7A
        </span>
      </div>

      {/* Products Mapped */}
      <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-xs sm:p-5 dark:border-white/5 dark:bg-[#121212]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-black/50 dark:text-white/50">
            Products Tagged
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <PackageIcon className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold text-black sm:text-3xl dark:text-white">
          {totalAssignedProducts}
        </p>
        <span className="mt-1 block text-[11px] text-black/40 dark:text-white/40">
          Across catalog inventory
        </span>
      </div>
    </div>
  );
}
