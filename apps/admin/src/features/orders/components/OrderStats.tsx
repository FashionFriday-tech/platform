'use client';

import React from 'react';
import { motion } from 'motion/react';
import { mockOrders } from '../data/mock-orders';

export function OrderStats() {
  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter(
    (o) => o.status === 'pending' || o.status === 'processing',
  ).length;
  const transitOrders = mockOrders.filter((o) => o.status === 'shipped').length;
  const deliveredOrders = mockOrders.filter((o) => o.status === 'delivered').length;
  const nonPlacedOrders = mockOrders.filter((o) => o.status === 'cancelled').length;

  const stats = [
    {
      name: 'Total Orders',
      value: totalOrders.toString(),
      color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400',
    },
    {
      name: 'Pending Orders',
      value: pendingOrders.toString(),
      color: 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-400/10 dark:text-yellow-400',
    },
    {
      name: 'Transit Orders',
      value: transitOrders.toString(),
      color: 'bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400',
    },
    {
      name: 'Delivered',
      value: deliveredOrders.toString(),
      color: 'bg-green-500/10 text-green-600 dark:bg-green-400/10 dark:text-green-400',
    },
    {
      name: 'Non-placed',
      value: nonPlacedOrders.toString(),
      color: 'bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat, i) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          key={stat.name}
          className="relative overflow-hidden rounded-2xl border border-black/5 bg-white/50 p-5 backdrop-blur-xl transition-all hover:shadow-lg dark:border-white/5 dark:bg-black/50"
        >
          <dt className="text-sm font-medium text-black/60 dark:text-white/60">{stat.name}</dt>
          <dd className="mt-3 flex items-baseline">
            <span
              className={`rounded-xl px-3 py-1 text-3xl font-bold tracking-tight ${stat.color}`}
            >
              {stat.value}
            </span>
          </dd>
        </motion.div>
      ))}
    </div>
  );
}
