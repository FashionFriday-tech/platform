import React from 'react';
import { motion } from 'motion/react';
import { mockProducts } from '../services/api';

export function ProductStats() {
  const totalProducts = mockProducts.length;
  const activeProducts = mockProducts.filter((p) => p.status === 'Active').length;
  const inactiveProducts = mockProducts.filter((p) => p.status === 'Inactive' || p.status === 'Draft').length;

  const stats = [
    { label: 'Total Products', value: totalProducts, color: 'bg-[#e6f5f9]' },
    { label: 'Active Products', value: activeProducts, color: 'bg-[#eef2ff]' },
    { label: 'Inactive / Draft', value: inactiveProducts, color: 'bg-[#fff1f2]' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className={`flex items-center justify-between rounded-2xl p-6 shadow-sm dark:text-black ${stat.color}`}
        >
          <div className="flex flex-col">
            <span className="mb-2 text-sm font-medium text-black/70">{stat.label}</span>
            <span className="text-3xl font-bold text-black">{stat.value}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
