'use client';

import React, { useMemo } from 'react';

import { ActivityIcon, MessageSquareIcon, StarIcon, VerifiedUserIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { type Review } from '../types';

export function ReviewStats({ reviews }: { reviews: Review[] }) {
  const totalReviews = reviews.length;
  const avgRating = (
    reviews.reduce((acc, curr) => acc + curr.rating, 0) / (totalReviews || 1)
  ).toFixed(1);

  const recentReviews = useMemo(() => {
    // 30 days in milliseconds
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    return reviews.filter((r) => now - new Date(r.date).getTime() < thirtyDaysMs).length;
  }, [reviews]);

  const verifiedReviews = reviews.filter((r) => r.isVerified).length;
  const unverifiedReviews = totalReviews - verifiedReviews;

  const stats = [
    {
      name: 'Total Reviews',
      value: totalReviews.toString(),
      icon: MessageSquareIcon,
      subLabel: 'ALL TIME',
      dotColor: 'bg-blue-400',
    },
    {
      name: 'Average Rating',
      value: avgRating,
      icon: StarIcon,
      subLabel: 'OUT OF 5.0',
      dotColor: 'bg-amber-400',
    },
    {
      name: 'Recent Reviews',
      value: recentReviews.toString(),
      icon: ActivityIcon,
      subLabel: 'LAST 30 DAYS',
      dotColor: 'bg-emerald-400',
    },
    {
      name: 'Not Verified',
      value: unverifiedReviews.toString(),
      icon: VerifiedUserIcon,
      subLabel: 'UNVERIFIED',
      dotColor: 'bg-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.04 }}
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black via-[#0d0d10] to-[#1c1c24] px-4 py-3 text-white shadow-lg dark:border-black/10 dark:bg-white dark:from-white dark:via-[#fafafa] dark:to-[#f0f0f0] dark:text-black dark:shadow-sm"
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
