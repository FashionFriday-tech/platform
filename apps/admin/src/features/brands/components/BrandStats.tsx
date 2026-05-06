import React from 'react';
import { motion } from 'motion/react';
import { Brand } from '@ff/schemas';
import { 
  StarBadgeIcon,
  ShoeCategoryIcon,
  HangerCategoryIcon,
  WatchIcon,
  ShoppingBagIcon,
  EyeIcon
} from '@ff/ui';

interface BrandStatsProps {
  brands: Brand[];
}

export function BrandStats({ brands }: BrandStatsProps) {
  const getCategoryCount = (category: string) => 
    brands.filter(b => b.categories.includes(category as any)).length;

  const stats = [
    { name: 'Total Brands', value: brands.length, icon: StarBadgeIcon, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { name: 'Clothing', value: getCategoryCount('clothing'), icon: HangerCategoryIcon, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-500/10' },
    { name: 'Footwear', value: getCategoryCount('footwear'), icon: ShoeCategoryIcon, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/10' },
    { name: 'Watches', value: getCategoryCount('watch'), icon: WatchIcon, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-500/10' },
    { name: 'Accessories', value: getCategoryCount('accessories'), icon: ShoppingBagIcon, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
    { name: 'Eyewear', value: getCategoryCount('eyewear'), icon: EyeIcon, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  ];

  return (
    <div className="flex w-full gap-4 overflow-x-auto scrollbar-hide pb-2">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="flex min-w-[200px] shrink-0 items-center gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-[#111111]"
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
            <stat.icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-black/60 dark:text-white/60 whitespace-nowrap">{stat.name}</p>
            <p className="text-2xl font-bold tracking-tight text-black dark:text-white">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
