'use client';

import React from 'react';

import { motion } from 'motion/react';

import { type AnalyticsPayload, MOCK_TOP_PRODUCTS } from '../types';

const GRADIENT_PAIRS = [
  ['#6a4fbb', '#8b5cf6'],
  ['#7c3aed', '#a855f7'],
  ['#8b5cf6', '#c084fc'],
  ['#a855f7', '#d8b4fe'],
  ['#c084fc', '#e9d5ff'],
];
const MEDALS = ['🥇', '🥈', '🥉'];

interface TopProductsChartProps {
  topProducts?: AnalyticsPayload['topProducts'];
}

export function TopProductsChart({ topProducts }: TopProductsChartProps) {
  const activeProducts = topProducts && topProducts.length > 0 ? topProducts : MOCK_TOP_PRODUCTS;
  const maxRevenue = Math.max(...activeProducts.map((p) => p.revenue), 1);

  return (
    <div className="flex h-full min-h-[440px] w-full flex-col rounded-2xl border border-black/[0.06] bg-white shadow-xl shadow-black/[0.04] dark:border-white/[0.08] dark:bg-[#1a1a1a]">
      <div className="border-b border-black/[0.04] p-6 pb-4 dark:border-white/[0.04]">
        <h2 className="text-lg font-bold text-black dark:text-white">Top Products</h2>
        <p className="text-sm font-medium text-black/40 dark:text-white/40">
          Revenue performance ranking
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        {activeProducts.map((product, i) => {
          const pct = (product.revenue / maxRevenue) * 100;
          const pair = GRADIENT_PAIRS[i % GRADIENT_PAIRS.length];
          return (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="group rounded-xl p-3 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
                    style={i >= 3 ? { background: `${pair[0]}15` } : {}}
                  >
                    {MEDALS[i] ?? (
                      <span className="text-xs font-black" style={{ color: pair[0] }}>
                        #{i + 1}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-black dark:text-white">
                      {product.name}
                    </span>
                    <p className="text-[11px] font-medium text-black/35 dark:text-white/35">
                      {product.sales} units sold
                    </p>
                  </div>
                </div>
                <span className="font-mono text-sm font-black text-black dark:text-white">
                  ₹{product.revenue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-black/[0.04] dark:bg-white/[0.04]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${pair[0]}, ${pair[1]})`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
