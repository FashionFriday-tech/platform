'use client';

import React from 'react';
import { useMemo } from 'react';

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
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      name: 'Average Rating',
      value: avgRating,
      icon: StarIcon,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-500/10',
    },
    {
      name: 'Recent Reviews',
      value: recentReviews.toString(),
      icon: ActivityIcon,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-500/10',
    },
    {
      name: 'Not Verified',
      value: unverifiedReviews.toString(),
      icon: VerifiedUserIcon,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-[#111111]"
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
          >
            <stat.icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-black/60 dark:text-white/60">{stat.name}</p>
            <p className="text-2xl font-bold tracking-tight text-black dark:text-white">
              {stat.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
