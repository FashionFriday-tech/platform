import React from 'react';

import { type Brand } from '@ff/schemas';
import {
  EyeIcon,
  HangerCategoryIcon,
  ShoeCategoryIcon,
  ShoppingBagIcon,
  StarBadgeIcon,
  WatchIcon,
} from '@ff/ui';
import { motion } from 'motion/react';

interface BrandStatsProps {
  brands: Brand[];
}

export function BrandStats({ brands }: BrandStatsProps) {
  const getCategoryCount = (category: string) =>
    brands.filter((b) => (b.categories as string[]).includes(category)).length;

  const stats = [
    {
      name: 'Total Brands',
      value: brands.length,
      icon: StarBadgeIcon,
      subLabel: 'ALL PARTNERS',
      dotColor: 'bg-blue-400',
    },
    {
      name: 'Clothing',
      value: getCategoryCount('clothing'),
      icon: HangerCategoryIcon,
      subLabel: 'APPAREL',
      dotColor: 'bg-pink-400',
    },
    {
      name: 'Footwear',
      value: getCategoryCount('footwear'),
      icon: ShoeCategoryIcon,
      subLabel: 'SHOES',
      dotColor: 'bg-orange-400',
    },
    {
      name: 'Watches',
      value: getCategoryCount('watch'),
      icon: WatchIcon,
      subLabel: 'TIMEPIECES',
      dotColor: 'bg-cyan-400',
    },
    {
      name: 'Accessories',
      value: getCategoryCount('accessories'),
      icon: ShoppingBagIcon,
      subLabel: 'GEAR',
      dotColor: 'bg-rose-400',
    },
    {
      name: 'Eyewear',
      value: getCategoryCount('eyewear'),
      icon: EyeIcon,
      subLabel: 'OPTICAL',
      dotColor: 'bg-emerald-400',
    },
  ];

  return (
    <div className="scrollbar-hide flex w-full gap-3 overflow-x-auto pb-2">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.04 }}
          className="group relative flex min-w-[190px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black via-[#0d0d10] to-[#1c1c24] px-4 py-3 text-white shadow-lg dark:border-black/10 dark:bg-white dark:from-white dark:via-[#fafafa] dark:to-[#f0f0f0] dark:text-black dark:shadow-sm"
        >
          {/* Subtle Ambient Glow & Watermark Icon */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <stat.icon className="absolute -right-2 -bottom-2 h-16 w-16 text-white/[0.04] dark:text-black/[0.04]" />
            <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/[0.03] blur-xl dark:bg-black/[0.02]" />
          </div>

          {/* Top Row: Title & Mini Icon Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <dt className="text-[11px] font-bold tracking-wider text-white/70 uppercase dark:text-black/60">
              {stat.name}
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
