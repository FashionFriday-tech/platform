'use client';

import React from 'react';

import {
  ActivityIcon,
  BoxIcon,
  CheckCircleIcon,
  PackageIcon,
  RefreshCcwIcon,
  ShoppingBagIcon,
  TruckIcon,
  UsersIcon,
} from '@ff/ui';
import { motion } from 'motion/react';

import { useDashboard } from '../hooks/useDashboard';
import { useDashboardData } from '../hooks/useDashboardData';
import { ActivityFeed } from './ActivityFeed';
import { QuickActions } from './QuickActions';
import { StatCard } from './StatCard';

export function DashboardView() {
  const { user, hasAccess, container, item } = useDashboard();
  const { stats, activities, isLoading, isRefreshing, lastFetched, refresh } = useDashboardData();

  const formattedTime = lastFetched
    ? lastFetched.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Syncing...';

  return (
    <div className="scrollbar-hide flex h-full w-full flex-col overflow-x-hidden overflow-y-auto px-6 pt-6 pb-12">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex w-full max-w-7xl flex-col gap-8"
      >
        {/* Welcome & Sync Header */}
        <motion.div
          variants={item}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">
              Welcome back, {user.name.split(' ')[0]}
            </h1>
            <p className="text-sm font-medium text-black/60 dark:text-white/60">
              Live operations and performance dashboard for your store.
            </p>
          </div>

          {/* Real-time DB Sync Status Bar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-black/5 bg-white/80 px-3.5 py-2 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-[#141417]/80">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-black/80 dark:text-white/80">
                Live DB Sync
              </span>
              <span className="hidden text-xs text-black/40 dark:text-white/40 md:inline">•</span>
              <span className="hidden font-mono text-xs text-black/50 dark:text-white/50 md:inline">
                {formattedTime}
              </span>
            </div>

            <button
              type="button"
              onClick={refresh}
              disabled={isRefreshing}
              title="Refresh live data"
              className="group flex h-9 w-9 items-center justify-center rounded-2xl border border-black/5 bg-white text-black/70 shadow-xs transition-all hover:bg-black hover:text-white active:scale-95 disabled:opacity-50 dark:border-white/10 dark:bg-[#141417] dark:text-white/70 dark:hover:bg-white dark:hover:text-black"
            >
              <RefreshCcwIcon
                className={`h-4 w-4 transition-transform duration-500 ${
                  isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'
                }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Primary Dynamic Metric Cards */}
        <motion.div
          variants={item}
          className="scrollbar-hide flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 lg:grid-cols-4"
        >
          {hasAccess(['SUPER_ADMIN', 'SALES_MANAGER']) && (
            <StatCard
              title="Total Revenue"
              value={`₹${(stats.totalSales || 0).toLocaleString('en-IN')}`}
              subtitle={
                stats.salesGrowthPercentage >= 0
                  ? `+${stats.salesGrowthPercentage}% vs last week`
                  : `${stats.salesGrowthPercentage}% vs last week`
              }
              icon={ActivityIcon}
              iconBgClass="bg-emerald-500/10 dark:bg-emerald-500/20"
              iconColorClass="text-emerald-600 dark:text-emerald-400"
              trend={stats.salesGrowthPercentage >= 0 ? 'up' : 'down'}
              isLoading={isLoading && stats.totalSales === 0}
            />
          )}

          {hasAccess(['SUPER_ADMIN', 'SALES_MANAGER']) && (
            <StatCard
              title="Pending Orders"
              value={String(stats.pendingOrders || 0)}
              subtitle={`${stats.shippedOrders || 0} dispatched • ${stats.deliveredOrders || 0} delivered`}
              icon={ShoppingBagIcon}
              iconBgClass="bg-orange-500/10 dark:bg-orange-500/20"
              iconColorClass="text-orange-600 dark:text-orange-400"
              href="/orders?status=PENDING"
              trend={stats.pendingOrders > 0 ? 'neutral' : 'up'}
              isLoading={isLoading && stats.totalOrders === 0}
            />
          )}

          {hasAccess(['SUPER_ADMIN', 'PRODUCT_MANAGER']) && (
            <StatCard
              title="Stock Alerts"
              value={String(stats.lowStockCount || 0)}
              subtitle={
                stats.lowStockCount > 0
                  ? 'Items require restock'
                  : 'All inventory in stock'
              }
              icon={PackageIcon}
              iconBgClass={
                stats.lowStockCount > 0
                  ? 'bg-rose-500/10 dark:bg-rose-500/20'
                  : 'bg-blue-500/10 dark:bg-blue-500/20'
              }
              iconColorClass={
                stats.lowStockCount > 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-blue-600 dark:text-blue-400'
              }
              href="/products"
              trend={stats.lowStockCount > 0 ? 'down' : 'up'}
              isLoading={isLoading && stats.totalProducts === 0}
            />
          )}

          {hasAccess(['SUPER_ADMIN', 'SALES_MANAGER']) && (
            <StatCard
              title="Total Customers"
              value={String(stats.totalCustomers || 0)}
              subtitle={`${stats.totalSellers || 0} registered sellers`}
              icon={UsersIcon}
              iconBgClass="bg-purple-500/10 dark:bg-purple-500/20"
              iconColorClass="text-purple-600 dark:text-purple-400"
              href="/customers"
              trend="up"
              isLoading={isLoading && stats.totalCustomers === 0}
            />
          )}
        </motion.div>

        {/* Secondary Real-time Operational Metrics Strip */}
        <motion.div
          variants={item}
          className="grid grid-cols-2 gap-3 rounded-3xl border border-black/5 bg-white/60 p-4 shadow-xs backdrop-blur-md sm:grid-cols-4 sm:gap-4 sm:p-5 dark:border-white/10 dark:bg-[#141417]/60"
        >
          <div className="flex items-center gap-3 rounded-2xl bg-black/[0.02] p-3 dark:bg-white/[0.02]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <ShoppingBagIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-black/50 dark:text-white/50">Total Orders</p>
              <p className="font-mono text-base font-bold text-black dark:text-white">
                {stats.totalOrders}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-black/[0.02] p-3 dark:bg-white/[0.02]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <TruckIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-black/50 dark:text-white/50">In Transit</p>
              <p className="font-mono text-base font-bold text-black dark:text-white">
                {stats.shippedOrders}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-black/[0.02] p-3 dark:bg-white/[0.02]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <CheckCircleIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-black/50 dark:text-white/50">Delivered</p>
              <p className="font-mono text-base font-bold text-black dark:text-white">
                {stats.deliveredOrders}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-black/[0.02] p-3 dark:bg-white/[0.02]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <BoxIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-black/50 dark:text-white/50">Active Products</p>
              <p className="font-mono text-base font-bold text-black dark:text-white">
                {stats.totalProducts}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Operational Grid: Live Activity Feed & Quick Actions */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          <motion.div variants={item} className="h-full lg:col-span-2">
            <ActivityFeed activities={activities} isLoading={isLoading} />
          </motion.div>
          <motion.div variants={item} className="h-full lg:col-span-1">
            <QuickActions />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
