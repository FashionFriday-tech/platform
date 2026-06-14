import React from 'react';

import { PackageIcon, ShieldCheckIcon, ShoppingBagIcon, UsersIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { type TeamMember } from '../types';

interface TeamStatsProps {
  team: TeamMember[];
}

export function TeamStats({ team }: TeamStatsProps) {
  const stats = [
    {
      title: 'Total Members',
      value: team.length,
      icon: UsersIcon,
      subLabel: 'ACTIVE TEAM',
      dotColor: 'bg-blue-400',
    },
    {
      title: 'Super Admins',
      value: team.filter((m) => m.role === 'SUPER_ADMIN').length,
      icon: ShieldCheckIcon,
      subLabel: 'FULL ACCESS',
      dotColor: 'bg-amber-400',
    },
    {
      title: 'Product Managers',
      value: team.filter((m) => m.role === 'PRODUCT_MANAGER').length,
      icon: PackageIcon,
      subLabel: 'CATALOG',
      dotColor: 'bg-purple-400',
    },
    {
      title: 'Sales Managers',
      value: team.filter((m) => m.role === 'SALES_MANAGER').length,
      icon: ShoppingBagIcon,
      subLabel: 'OPERATIONS',
      dotColor: 'bg-emerald-400',
    },
  ];

  return (
    <div className="scrollbar-hide flex w-full gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.04 }}
          className="group relative flex min-w-[200px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black via-[#0d0d10] to-[#1c1c24] px-4 py-3 text-white shadow-lg md:min-w-0 md:shrink dark:border-black/10 dark:bg-white dark:from-white dark:via-[#fafafa] dark:to-[#f0f0f0] dark:text-black dark:shadow-sm"
        >
          {/* Subtle Ambient Glow & Watermark Icon */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <stat.icon className="absolute -right-2 -bottom-2 h-16 w-16 text-white/[0.04] dark:text-black/[0.04]" />
            <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/[0.03] blur-xl dark:bg-black/[0.02]" />
          </div>

          {/* Top Row: Title & Mini Icon Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <dt className="text-[11px] font-bold tracking-wider text-white/70 uppercase dark:text-black/60">
              {stat.title}
            </dt>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-md dark:bg-black/5 dark:text-black">
              <stat.icon className="h-3 w-3" />
            </div>
          </div>

          {/* Bottom Row: Metric & Subtitle with Dot */}
          <div className="relative z-10 mt-2 flex items-baseline justify-between gap-2">
            <dd className="text-2xl font-black tracking-tight text-white md:text-3xl dark:text-black">
              {stat.value}
            </dd>
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${stat.dotColor}`} />
              <span className="text-[9px] font-bold tracking-widest text-white/40 uppercase dark:text-black/40">
                {stat.subLabel}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
