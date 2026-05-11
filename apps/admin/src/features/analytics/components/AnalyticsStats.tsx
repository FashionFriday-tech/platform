'use client';

import React from 'react';

import { PackageIcon, ShoppingBagIcon, TagIcon, UsersIcon } from '@ff/ui';
import { motion } from 'motion/react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

import { STAT_SPARKLINES } from '../types';

const STATS = [
  {
    id: 1,
    title: 'Total Revenue',
    value: '₹6,12,917',
    trend: '+12.08%',
    trendUp: true,
    description: 'vs last month',
    icon: TagIcon,
    gradient: 'from-violet-600 to-purple-700',
    accentColor: '#6a4fbb',
    sparkData: STAT_SPARKLINES.revenue,
    isPrimary: true,
  },
  {
    id: 2,
    title: 'Total Orders',
    value: '34,760',
    trend: '+8.4%',
    trendUp: true,
    description: 'vs last month',
    icon: ShoppingBagIcon,
    gradient: 'from-blue-500 to-cyan-500',
    accentColor: '#3b82f6',
    sparkData: STAT_SPARKLINES.orders,
    isPrimary: false,
  },
  {
    id: 3,
    title: 'Site Visits',
    value: '14,987',
    trend: '-1.08%',
    trendUp: false,
    description: 'vs last month',
    icon: UsersIcon,
    gradient: 'from-pink-500 to-rose-500',
    accentColor: '#ec4899',
    sparkData: STAT_SPARKLINES.visits,
    isPrimary: false,
  },
  {
    id: 4,
    title: 'Units Sold',
    value: '12,987',
    trend: '+5.7%',
    trendUp: true,
    description: 'vs last month',
    icon: PackageIcon,
    gradient: 'from-emerald-500 to-teal-500',
    accentColor: '#22c55e',
    sparkData: STAT_SPARKLINES.units,
    isPrimary: false,
  },
];

export function AnalyticsStats() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 24 }}
          className={`group relative overflow-hidden rounded-2xl p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
            stat.isPrimary
              ? 'bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white shadow-purple-500/25'
              : 'border border-black/[0.06] bg-white dark:border-white/[0.08] dark:bg-[#1a1a1a]'
          }`}
        >
          {/* Decorative gradient orb */}
          <div
            className={`absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-20 blur-2xl ${
              stat.isPrimary ? 'bg-white' : ''
            }`}
            style={!stat.isPrimary ? { backgroundColor: stat.accentColor } : undefined}
          />

          <div className="relative flex items-start justify-between">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-md ${
                stat.isPrimary ? 'bg-white/20 shadow-black/10' : 'shadow-sm'
              }`}
              style={
                !stat.isPrimary
                  ? {
                      backgroundColor: `${stat.accentColor}15`,
                      boxShadow: `0 4px 12px ${stat.accentColor}15`,
                    }
                  : undefined
              }
            >
              <stat.icon
                className={`h-5 w-5 ${stat.isPrimary ? 'text-white' : ''}`}
                style={!stat.isPrimary ? { color: stat.accentColor } : undefined}
              />
            </div>
            <div
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                stat.isPrimary
                  ? stat.trendUp
                    ? 'bg-white/20 text-white'
                    : 'bg-red-400/30 text-red-100'
                  : stat.trendUp
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'
              }`}
            >
              <svg
                className={`h-3 w-3 ${stat.trendUp ? '' : 'rotate-180'}`}
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M6 2.5V9.5M6 2.5L9 5.5M6 2.5L3 5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {stat.trend}
            </div>
          </div>

          <div className="relative mt-4">
            <p
              className={`text-[13px] font-semibold ${
                stat.isPrimary ? 'text-white/70' : 'text-black/50 dark:text-white/50'
              }`}
            >
              {stat.title}
            </p>
            <p
              className={`mt-1 text-[28px] leading-tight font-black tracking-tight ${
                stat.isPrimary ? 'text-white' : 'text-black dark:text-white'
              }`}
            >
              {stat.value}
            </p>
          </div>

          {/* Sparkline */}
          <div className="relative mt-3 h-11 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stat.sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`spark-${stat.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={stat.isPrimary ? '#ffffff' : stat.accentColor}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor={stat.isPrimary ? '#ffffff' : stat.accentColor}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={stat.isPrimary ? '#ffffff' : stat.accentColor}
                  strokeWidth={2}
                  fill={`url(#spark-${stat.id})`}
                  animationDuration={1200}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p
            className={`mt-1 text-[11px] font-medium ${
              stat.isPrimary ? 'text-white/50' : 'text-black/35 dark:text-white/35'
            }`}
          >
            {stat.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
