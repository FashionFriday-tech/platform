'use client';

import React from 'react';
import { motion, Variants } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import { ActivityIcon, ShoppingBagIcon, PackageIcon, UsersIcon } from '@ff/ui';
import { StatCard } from './components/StatCard';
import { QuickActions } from './components/QuickActions';
import { ActivityFeed } from './components/ActivityFeed';

export function DashboardView() {
  const { user } = useAuth();
  const role = user.role;

  const hasAccess = (allowedRoles: string[]) => allowedRoles.includes(role);

  // Animation variants
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden px-6 pb-12 pt-6 scrollbar-hide">
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex w-full max-w-7xl flex-col gap-8"
      >
        {/* Welcome Section */}
        <motion.div variants={item} className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-black/60 dark:text-white/60">
            Here's what's happening with your store today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={item} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {hasAccess(['SUPER_ADMIN', 'SALES_MANAGER']) && (
            <StatCard
              title="Total Sales"
              value="₹1,24,500"
              subtitle="+14.5% from yesterday"
              icon={ActivityIcon}
              iconBgClass="bg-emerald-500/10 dark:bg-emerald-500/20"
              iconColorClass="text-emerald-600 dark:text-emerald-400"
              trend="up"
            />
          )}

          {hasAccess(['SUPER_ADMIN', 'SALES_MANAGER']) && (
            <StatCard
              title="Pending Orders"
              value="16"
              subtitle="Needs fulfillment"
              icon={ShoppingBagIcon}
              iconBgClass="bg-orange-500/10 dark:bg-orange-500/20"
              iconColorClass="text-orange-600 dark:text-orange-400"
              href="/orders"
              trend="neutral"
            />
          )}

          {hasAccess(['SUPER_ADMIN', 'PRODUCT_MANAGER']) && (
            <StatCard
              title="Low Stock"
              value="24"
              subtitle="Products need restock"
              icon={PackageIcon}
              iconBgClass="bg-blue-500/10 dark:bg-blue-500/20"
              iconColorClass="text-blue-600 dark:text-blue-400"
              href="/products"
              trend="down"
            />
          )}

          {hasAccess(['SUPER_ADMIN', 'SALES_MANAGER']) && (
            <StatCard
              title="New Customers"
              value="48"
              subtitle="+5.2% from last week"
              icon={UsersIcon}
              iconBgClass="bg-purple-500/10 dark:bg-purple-500/20"
              iconColorClass="text-purple-600 dark:text-purple-400"
              trend="up"
            />
          )}
        </motion.div>

        {/* Operational Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <motion.div variants={item} className="lg:col-span-2">
            <ActivityFeed />
          </motion.div>
          <motion.div variants={item} className="lg:col-span-1">
            <QuickActions />
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
