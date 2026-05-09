'use client';

import React from 'react';
import { motion } from 'motion/react';
import { mockOrders } from '../services/mock-orders';
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
      icon: ShoppingBagIcon,
      bg: 'bg-gradient-to-br from-blue-400 to-blue-600', // Blue
      subLabel: 'ALL TIME',
    },
    {
      name: 'Pending',
      value: pendingOrders.toString(),
      icon: ClockIcon,
      bg: 'bg-gradient-to-br from-orange-400 to-orange-600', // Yellow/Orange
      subLabel: 'AWAITING',
    },
    {
      name: 'In Transit',
      value: transitOrders.toString(),
      icon: TruckIcon,
      bg: 'bg-gradient-to-br from-purple-400 to-purple-600', // Purple
      subLabel: 'ON THE WAY',
    },
    {
      name: 'Delivered',
      value: deliveredOrders.toString(),
      icon: CheckCircleIcon,
      bg: 'bg-gradient-to-br from-green-400 to-green-600', // Green
      subLabel: 'COMPLETED',
    },
    {
      name: 'Cancelled',
      value: nonPlacedOrders.toString(),
      icon: AlertCircleIcon,
      bg: 'bg-gradient-to-br from-red-400 to-red-600', // Red
      subLabel: 'FAILED/CANCELLED',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat, i) => (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
          key={stat.name}
          className={`group relative overflow-hidden rounded-[20px] p-6 text-white shadow-lg aspect-[1.586] ${stat.bg}`}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <stat.icon className="absolute -bottom-4 -right-4 h-28 w-28 text-white opacity-[0.1]" />
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
