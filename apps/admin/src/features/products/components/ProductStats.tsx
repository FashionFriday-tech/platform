import React from 'react';
import { motion } from 'motion/react';
import { mockProducts } from '../services/api';
import { ShoppingBagIcon, ActivityIcon, AlertCircleIcon, ClockIcon } from '@ff/ui';

export function ProductStats() {
  const totalProducts = mockProducts.length;
  const activeProducts = mockProducts.filter((p) => p.status === 'Active').length;
  const inactiveProducts = mockProducts.filter((p) => p.status === 'Inactive').length;
  const draftProducts = mockProducts.filter((p) => p.status === 'Draft').length;

  const stats = [
    { 
      name: 'Total Products', 
      value: totalProducts, 
      bg: 'bg-gradient-to-br from-purple-400 to-purple-600', 
      subLabel: 'ALL INVENTORY',
      icon: ShoppingBagIcon,
    },
    { 
      name: 'Active Products', 
      value: activeProducts, 
      bg: 'bg-gradient-to-br from-green-400 to-green-600', 
      subLabel: 'CURRENTLY LISTED',
      icon: ActivityIcon,
    },
    { 
      name: 'Inactive', 
      value: inactiveProducts, 
      bg: 'bg-gradient-to-br from-red-400 to-red-600', 
      icon: AlertCircleIcon,
    },
    { 
      name: 'Draft', 
      value: draftProducts, 
      bg: 'bg-gradient-to-br from-orange-400 to-orange-600', 
      icon: ClockIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
          className={`group relative overflow-hidden rounded-[20px] p-6 text-white shadow-lg aspect-[1.586] ${stat.bg}`}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <stat.icon className="absolute -bottom-4 -right-4 h-24 w-24 sm:h-28 sm:w-28 text-white opacity-[0.1]" />
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
