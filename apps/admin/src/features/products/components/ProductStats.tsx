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
          {/* Abstract Waves Background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <svg className="absolute h-full w-full" viewBox="0 0 400 250" preserveAspectRatio="none" fill="none">
              <path d="M-50 250 C 100 100, 250 200, 450 0" stroke="white" strokeWidth="2" strokeOpacity="0.15" />
              <path d="M-50 280 C 120 120, 230 180, 450 20" stroke="white" strokeWidth="1" strokeOpacity="0.15" />
              <path d="M-50 310 C 140 140, 210 160, 450 40" stroke="white" strokeWidth="0.5" strokeOpacity="0.15" />
            </svg>
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white opacity-[0.08] blur-2xl"></div>
          </div>
          
          <div className="relative z-10 flex h-full flex-col justify-between">
            {/* Top row: Title and Icon */}
            <div className="flex items-start justify-between">
              <dt className="text-base font-extrabold tracking-wider text-white drop-shadow-sm pr-2">
                {stat.name}
              </dt>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <stat.icon className="h-5 w-5 text-white" />
              </div>
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
