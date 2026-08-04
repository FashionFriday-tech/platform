'use client';

import React from 'react';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  iconColorClass?: string;
  iconBgClass?: string;
  href?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  badge?: string;
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  href,
  trend,
  trendValue,
  badge,
  isLoading,
}: StatCardProps) {
  const cardContent = (
    <div className="group relative flex h-full min-w-[240px] shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-black/5 bg-white p-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-black/15 hover:shadow-xl sm:p-6 md:min-w-0 md:shrink dark:border-white/10 dark:bg-[#141417] dark:hover:border-white/20 dark:hover:shadow-2xl">
      {/* Ambient background decoration */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br from-black/[0.03] to-transparent blur-2xl transition-transform duration-500 group-hover:scale-125 dark:from-white/[0.04]" />
      <Icon className="pointer-events-none absolute -right-2 -bottom-2 h-20 w-20 text-black/[0.03] transition-transform duration-500 group-hover:scale-110 dark:text-white/[0.03]" />

      {/* Header: Title + Icon Badge */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <span className="text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold text-black/70 dark:bg-white/10 dark:text-white/70">
              {badge}
            </span>
          )}
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-black/5 text-black transition-colors group-hover:bg-black group-hover:text-white dark:bg-white/10 dark:text-white dark:group-hover:bg-white dark:group-hover:text-black">
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Metric Row */}
      <div className="relative z-10 mt-4 flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-2">
          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-black/10 dark:bg-white/10" />
          ) : (
            <span className="font-mono text-3xl font-extrabold tracking-tight text-black dark:text-white">
              {value}
            </span>
          )}

          {trendValue && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                trend === 'up'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                  : trend === 'down'
                    ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                    : 'bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60'
              }`}
            >
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trendValue}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-xs font-medium text-black/60 dark:text-white/60">{subtitle}</p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full min-w-[240px] shrink-0 md:min-w-0 md:shrink">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
