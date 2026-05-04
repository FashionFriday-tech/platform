'use client';

import React from 'react';
import { motion } from 'motion/react';
import { mockOrders } from '../data/mock-orders';
import { 
  ShoppingBagIcon, 
  ClockIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  AlertCircleIcon 
} from '@ff/ui';

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
      filterValue: 'all',
      icon: ShoppingBagIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10 dark:bg-blue-400/10',
      borderColor: 'border-blue-500/20 dark:border-blue-400/10',
      glow: 'bg-blue-500',
    },
    {
      name: 'Pending',
      value: pendingOrders.toString(),
      filterValue: 'pending',
      icon: ClockIcon,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-500/10 dark:bg-yellow-400/10',
      borderColor: 'border-yellow-500/20 dark:border-yellow-400/10',
      glow: 'bg-yellow-500',
    },
    {
      name: 'In Transit',
      value: transitOrders.toString(),
      filterValue: 'shipped',
      icon: TruckIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10 dark:bg-purple-400/10',
      borderColor: 'border-purple-500/20 dark:border-purple-400/10',
      glow: 'bg-purple-500',
    },
    {
      name: 'Delivered',
      value: deliveredOrders.toString(),
      filterValue: 'delivered',
      icon: CheckCircleIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10 dark:bg-green-400/10',
      borderColor: 'border-green-500/20 dark:border-green-400/10',
      glow: 'bg-green-500',
    },
    {
      name: 'Cancelled',
      value: nonPlacedOrders.toString(),
      filterValue: 'cancelled',
      icon: AlertCircleIcon,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-500/10 dark:bg-red-400/10',
      borderColor: 'border-red-500/20 dark:border-red-400/10',
      glow: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat, i) => (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
          key={stat.name}
          className={`group relative overflow-hidden rounded-2xl border bg-white/70 p-6 backdrop-blur-xl transition-all duration-300 dark:bg-[#111111]/80 ${stat.borderColor}`}
        >
          {/* Subtle background glow effect */}
          <div className={`absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-5 transition-transform duration-500  dark:opacity-[0.03] ${stat.glow}`} />
          
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
