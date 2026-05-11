'use client';

import React from 'react';

import { ActivityIcon, AlertCircleIcon, ShoppingBagIcon, UsersIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { mockCustomers } from '../services/mock-customers';

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
      bg: 'bg-gradient-to-br from-blue-400 to-blue-600', // Blue
      subLabel: 'ALL TIME',
    },
    {
      name: 'Active Users',
      value: activeCustomers.toString(),
      icon: ActivityIcon,
      bg: 'bg-gradient-to-br from-green-400 to-green-600', // Green
      subLabel: 'CURRENT',
    },
    {
      name: 'Purchased',
      value: purchasedCustomers.toString(),
      icon: ShoppingBagIcon,
      bg: 'bg-gradient-to-br from-purple-400 to-purple-600', // Purple
      subLabel: 'WITH ORDERS',
    },
    {
      name: 'Blocked Users',
      value: blockedCustomers.toString(),
      icon: AlertCircleIcon,
      bg: 'bg-gradient-to-br from-red-400 to-red-600', // Red
      subLabel: 'RESTRICTED',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
          key={stat.name}
          className={`group relative aspect-[1.586] overflow-hidden rounded-[20px] p-6 text-white shadow-lg ${stat.bg}`}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <stat.icon className="absolute -right-4 -bottom-4 h-24 w-24 text-white opacity-[0.1] sm:h-28 sm:w-28" />
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white opacity-[0.08] blur-2xl" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between">
            {/* Top row: Title */}
            <div className="flex items-start justify-between">
              <dt className="pr-2 text-base font-extrabold tracking-wider text-white drop-shadow-sm">
                {stat.name}
              </dt>
            </div>

            {/* Middle: Big Number */}
            <dd className="text-3xl font-bold tracking-tight md:text-4xl">{stat.value}</dd>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
