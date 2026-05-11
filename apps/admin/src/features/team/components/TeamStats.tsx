import React from 'react';

import { PackageIcon, ShieldCheckIcon, ShoppingBagIcon, UsersIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { type TeamMember } from '../types';

interface TeamStatsProps {
  team: TeamMember[];
}

export function TeamStats({ team }: TeamStatsProps) {
  const stats = [
    {
      title: 'Total Members',
      value: team.length,
      icon: UsersIcon,
      color: 'bg-black dark:bg-white',
      iconColor: 'text-white dark:text-black',
    },
    {
      title: 'Super Admins',
      value: team.filter((m) => m.role === 'SUPER_ADMIN').length,
      icon: ShieldCheckIcon,
      color: 'bg-orange-500/10 dark:bg-orange-500/20',
      iconColor: 'text-orange-500 dark:text-orange-400',
    },
    {
      title: 'Product Managers',
      value: team.filter((m) => m.role === 'PRODUCT_MANAGER').length,
      icon: PackageIcon,
      color: 'bg-blue-500/10 dark:bg-blue-500/20',
      iconColor: 'text-blue-500 dark:text-blue-400',
    },
    {
      title: 'Sales Managers',
      value: team.filter((m) => m.role === 'SALES_MANAGER').length,
      icon: ShoppingBagIcon,
      color: 'bg-green-500/10 dark:bg-green-500/20',
      iconColor: 'text-green-500 dark:text-green-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-[#111111]"
        >
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${stat.color}`}
          >
            <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
          </div>
          <div>
            <div className="text-sm font-medium text-black/60 dark:text-white/60">{stat.title}</div>
            <div className="mt-1 text-3xl font-black text-black dark:text-white">{stat.value}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
