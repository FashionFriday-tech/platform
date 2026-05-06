'use client';

import React from 'react';
import { motion } from 'motion/react';
import { mockReviews } from '../../customers/data/mock-reviews';
import { 
  StarIcon, 
  MessageSquareIcon, 
  ActivityIcon,
  StarFilledIcon
} from '@ff/ui';

export function ReviewStats() {
  const totalReviews = mockReviews.length;
  const avgRating = (mockReviews.reduce((acc, curr) => acc + curr.rating, 0) / (totalReviews || 1)).toFixed(1);
  const fiveStarReviews = mockReviews.filter(r => r.rating === 5).length;
  const recentReviews = mockReviews.filter(r => new Date(r.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;

  const stats = [
    {
      name: 'Total Reviews',
      value: totalReviews.toString(),
      icon: MessageSquareIcon,
      bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
      subLabel: 'ALL TIME',
    },
    {
      name: 'Average Rating',
      value: avgRating,
      icon: StarIcon,
      bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      subLabel: 'OUT OF 5.0',
    },
    {
      name: '5-Star Ratings',
      value: fiveStarReviews.toString(),
      icon: StarFilledIcon,
      bg: 'bg-gradient-to-br from-purple-400 to-purple-600',
      subLabel: 'EXCELLENT',
    },
    {
      name: 'Recent Reviews',
      value: recentReviews.toString(),
      icon: ActivityIcon,
      bg: 'bg-gradient-to-br from-green-400 to-green-600',
      subLabel: 'LAST 30 DAYS',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
          className={`group relative overflow-hidden rounded-[20px] p-6 text-white shadow-lg aspect-[1.586] ${stat.bg}`}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <stat.icon className="absolute -bottom-4 -right-4 h-24 w-24 sm:h-28 sm:w-28 text-white opacity-[0.1]" />
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white opacity-[0.08] blur-2xl"></div>
          </div>
          
          <div className="relative z-10 flex h-full flex-col justify-between">
            {/* Top row: Title */}
            <div className="flex items-start justify-between">
              <dt className="text-base font-extrabold tracking-wider text-white drop-shadow-sm pr-2">
                {stat.name}
              </dt>
            </div>
            
            {/* Middle: Big Number */}
            <dd className="text-3xl font-bold tracking-tight md:text-4xl">
              {stat.value}
            </dd>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
