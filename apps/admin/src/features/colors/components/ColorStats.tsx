'use client';

import React from 'react';

import { motion } from 'motion/react';

import { type Color } from '../types';

interface ColorStatsProps {
  colors: Color[];
}

export function ColorStats({ colors }: ColorStatsProps) {
  const total = colors.length;
  const latestColor = colors[0];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Total Colors */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 shadow-xs dark:border-white/5 dark:bg-[#141417]"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
            Total Colors
          </p>
          <p className="mt-1 text-2xl font-black text-black dark:text-white">{total}</p>
          <p className="mt-0.5 text-[11px] text-black/50 dark:text-white/50">
            Active product color options
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5">
          <svg className="h-6 w-6 text-black/60 dark:text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
      </motion.div>

      {/* Latest Color */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 shadow-xs dark:border-white/5 dark:bg-[#141417]"
      >
        <div className="min-w-0 flex-1 pr-3">
          <p className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
            Latest Added
          </p>
          <p className="mt-1 text-2xl font-black text-black truncate dark:text-white">
            {latestColor ? latestColor.name : '—'}
          </p>
          <p className="mt-0.5 font-mono text-[11px] text-black/50 dark:text-white/50">
            {latestColor ? latestColor.hex : 'No colors yet'}
          </p>
        </div>
        {latestColor && (
          <div
            className="h-12 w-12 rounded-2xl border border-black/10 shadow-xs shrink-0 dark:border-white/10"
            style={{ backgroundColor: latestColor.hex }}
          />
        )}
      </motion.div>

      {/* Quick Palette Swatch Preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col justify-center rounded-2xl border border-black/5 bg-white p-5 shadow-xs dark:border-white/5 dark:bg-[#141417]"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
          Palette Preview
        </p>
        <div className="mt-2.5 flex items-center -space-x-1.5 overflow-hidden">
          {colors.slice(0, 8).map((c) => (
            <span
              key={c.id}
              className="inline-block h-7 w-7 rounded-full border-2 border-white shadow-xs dark:border-[#141417]"
              style={{ backgroundColor: c.hex }}
              title={`${c.name} (${c.hex})`}
            />
          ))}
          {colors.length > 8 && (
            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-black/10 text-[10px] font-bold text-black dark:border-[#141417] dark:bg-white/10 dark:text-white">
              +{colors.length - 8}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
