'use client';

import React from 'react';
import { motion } from 'motion/react';
import { mockCustomers } from '../data/mock-customers';
import { 
  UsersIcon, 
  ShoppingBagIcon, 
  AlertCircleIcon, 
  ActivityIcon
} from '@ff/ui';

export function CustomerStats() {
  const totalCustomers = mockCustomers.length;
  const activeCustomers = mockCustomers.filter((c) => c.status === 'active').length;
  const blockedCustomers = mockCustomers.filter((c) => c.status === 'blocked').length;
  const purchasedCustomers = mockCustomers.filter((c) => c.ordersCount > 0).length;

  const stats = [
    {
      name: 'Total Customers',
      value: totalCustomers.toString(),
      icon: UsersIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10 dark:bg-blue-400/10',
      borderColor: 'border-blue-500/20 dark:border-blue-400/10',
      glow: 'bg-blue-500',
    },
    {
      name: 'Active Users',
      value: activeCustomers.toString(),
      icon: ActivityIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10 dark:bg-green-400/10',
      borderColor: 'border-green-500/20 dark:border-green-400/10',
      glow: 'bg-green-500',
    },
    {
      name: 'Purchased',
      value: purchasedCustomers.toString(),
      icon: ShoppingBagIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10 dark:bg-purple-400/10',
      borderColor: 'border-purple-500/20 dark:border-purple-400/10',
      glow: 'bg-purple-500',
    },
    {
      name: 'Blocked Users',
      value: blockedCustomers.toString(),
      icon: AlertCircleIcon,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-500/10 dark:bg-red-400/10',
      borderColor: 'border-red-500/20 dark:border-red-400/10',
      glow: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
          key={stat.name}
          className={`group relative overflow-hidden rounded-2xl border bg-white/70 p-6 backdrop-blur-xl transition-all duration-300 dark:bg-[#111111]/80 ${stat.borderColor}`}
        >
          {/* Subtle background glow effect */}
          <div className={`absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-5 transition-transform duration-500 dark:opacity-[0.03] ${stat.glow}`} />
          
          <div className="flex items-center justify-between relative z-10">
            <dt className="text-xs font-bold tracking-widest text-black/50 uppercase dark:text-white/50">
              {stat.name}
            </dt>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300 ${stat.bgColor} ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
          
          <dd className="mt-4 flex items-baseline relative z-10">
            <span className={`text-4xl font-[900] tracking-tight ${stat.color}`}>
              {stat.value}
            </span>
          </dd>
        </motion.div>
      ))}
    </div>
  );
}
