'use client';

import React from 'react';

import { motion, type Variants } from 'motion/react';

import { useAnalytics } from '../hooks/useAnalytics';
import { AnalyticsStats } from './AnalyticsStats';
import { AovTrendChart } from './AovTrendChart';
import { CategoryDistribution } from './CategoryDistribution';
import { ConversionGauge } from './ConversionGauge';
import { CustomerActivityRadial } from './CustomerActivityRadial';
import { CustomerRetentionHeatmap } from './CustomerRetentionHeatmap';
import { RealtimeOrderTicker } from './RealtimeOrderTicker';
import { RegionalOrdersMap } from './RegionalOrdersMap';
import { RevenueChart } from './RevenueChart';
import { TopProductsChart } from './TopProductsChart';
import { TrafficSourcesFunnel } from './TrafficSourcesFunnel';

export function AnalyticsView() {
  const { analytics, isRefreshing, timeAgoText, refresh } = useAnalytics();

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="scrollbar-hide flex h-full flex-col overflow-y-auto">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex w-full flex-col gap-6 px-3 pt-2 pb-12 sm:px-6"
      >
        {/* ──── Live Control Header ──── */}
        <motion.div
          variants={item}
          className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-white/5 dark:bg-[#111111]"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-black sm:text-base dark:text-white">
                  Real-time Store Analytics
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  LIVE STREAM
                </span>
                {analytics?.cached && (
                  <span className="hidden rounded-full bg-[#6a4fbb]/10 px-2 py-0.5 text-[10px] font-bold text-[#6a4fbb] sm:inline-block">
                    In-Memory TTL Cache
                  </span>
                )}
              </div>
              <p className="text-xs text-black/40 dark:text-white/40">
                Low compute, zero-lag streaming • Synced {timeAgoText}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                void refresh();
              }}
              disabled={isRefreshing}
              className="flex items-center gap-2 rounded-xl border border-black/10 bg-[#f8f9fa] px-3.5 py-2 text-xs font-semibold text-black transition-all hover:bg-black/5 active:scale-95 disabled:opacity-50 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-white/5"
            >
              <svg
                className={`h-3.5 w-3.5 text-black/60 dark:text-white/60 ${
                  isRefreshing ? 'animate-spin text-[#6a4fbb]' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>{isRefreshing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </motion.div>

        {/* ──── KPI Cards ──── */}
        <motion.div variants={item}>
          <AnalyticsStats kpis={analytics?.kpis} />
        </motion.div>

        {/* ──── Revenue + Conversion ──── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <motion.div variants={item} className="lg:col-span-2">
            <RevenueChart trendData={analytics?.revenueTrend} />
          </motion.div>
          <motion.div variants={item} className="lg:col-span-1">
            <ConversionGauge conversion={analytics?.conversion} />
          </motion.div>
        </div>

        {/* ──── Section: Regional Orders Map ──── */}
        <motion.div variants={item} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 rounded-full bg-[#6a4fbb]" />
            <span className="text-xs font-bold tracking-widest text-black/30 uppercase dark:text-white/30">
              Geographic Insights
            </span>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <RegionalOrdersMap stateOrders={analytics?.stateOrders} />
        </motion.div>

        {/* ──── Activity + Category + Traffic ──── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <motion.div variants={item}>
            <CustomerActivityRadial activity={analytics?.customerActivity} />
          </motion.div>
          <motion.div variants={item}>
            <CategoryDistribution categoryData={analytics?.categoryDistribution} />
          </motion.div>
          <motion.div variants={item}>
            <TrafficSourcesFunnel sources={analytics?.trafficSources} />
          </motion.div>
        </div>

        {/* ──── Section: Product & Retention ──── */}
        <motion.div variants={item} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 rounded-full bg-[#ec4899]" />
            <span className="text-xs font-bold tracking-widest text-black/30 uppercase dark:text-white/30">
              Product & Retention
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div variants={item}>
            <TopProductsChart topProducts={analytics?.topProducts} />
          </motion.div>
          <motion.div variants={item}>
            <CustomerRetentionHeatmap retentionData={analytics?.customerRetention} />
          </motion.div>
        </div>

        {/* ──── AOV Trend ──── */}
        <motion.div variants={item}>
          <AovTrendChart aovData={analytics?.aovTrend} />
        </motion.div>

        {/* ──── Live Orders Ticker ──── */}
        <motion.div variants={item} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2 items-center justify-center">
              <div className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs font-bold tracking-widest text-black/30 uppercase dark:text-white/30">
              Live Activity
            </span>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <RealtimeOrderTicker liveOrders={analytics?.liveOrders} />
        </motion.div>
      </motion.div>
    </div>
  );
}
