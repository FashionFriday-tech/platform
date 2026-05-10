'use client';

import React from 'react';
import { motion, Variants } from 'motion/react';
import { AnalyticsStats } from './AnalyticsStats';
import { RevenueChart } from './RevenueChart';
import { ConversionGauge } from './ConversionGauge';
import { RegionalOrdersMap } from './RegionalOrdersMap';
import { CustomerActivityRadial } from './CustomerActivityRadial';
import { CategoryDistribution } from './CategoryDistribution';
import { TopProductsChart } from './TopProductsChart';
import { TrafficSourcesFunnel } from './TrafficSourcesFunnel';
import { RealtimeOrderTicker } from './RealtimeOrderTicker';
import { CustomerRetentionHeatmap } from './CustomerRetentionHeatmap';
import { AOVTrendChart } from './AOVTrendChart';

export function AnalyticsView() {
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
        className="flex w-full flex-col gap-6 pb-12 px-6 pt-2"
      >
    

        {/* ──── KPI Cards ──── */}
        <motion.div variants={item}>
          <AnalyticsStats />
        </motion.div>

        {/* ──── Revenue + Conversion ──── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <motion.div variants={item} className="lg:col-span-2">
            <RevenueChart />
          </motion.div>
          <motion.div variants={item} className="lg:col-span-1">
            <ConversionGauge />
          </motion.div>
        </div>

        {/* ──── Section: Regional Orders Map ──── */}
        <motion.div variants={item} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 rounded-full bg-[#6a4fbb]" />
            <span className="text-xs font-bold uppercase tracking-widest text-black/30 dark:text-white/30">
              Geographic Insights
            </span>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <RegionalOrdersMap />
        </motion.div>

        {/* ──── Activity + Category + Traffic ──── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <motion.div variants={item}>
            <CustomerActivityRadial />
          </motion.div>
          <motion.div variants={item}>
            <CategoryDistribution />
          </motion.div>
          <motion.div variants={item}>
            <TrafficSourcesFunnel />
          </motion.div>
        </div>

        {/* ──── Section: Product & Retention ──── */}
        <motion.div variants={item} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 rounded-full bg-[#ec4899]" />
            <span className="text-xs font-bold uppercase tracking-widest text-black/30 dark:text-white/30">
              Product & Retention
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div variants={item}>
            <TopProductsChart />
          </motion.div>
          <motion.div variants={item}>
            <CustomerRetentionHeatmap />
          </motion.div>
        </div>

        {/* ──── AOV Trend ──── */}
        <motion.div variants={item}>
          <AOVTrendChart />
        </motion.div>

        {/* ──── Live Orders Ticker ──── */}
        <motion.div variants={item} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2 items-center justify-center">
              <div className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-black/30 dark:text-white/30">
              Live Activity
            </span>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <RealtimeOrderTicker />
        </motion.div>
      </motion.div>
    </div>
  );
}
