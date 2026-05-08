'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { MOCK_CATEGORY_DATA } from '../types';

const total = MOCK_CATEGORY_DATA.reduce((sum, d) => sum + d.value, 0);
const EMOJIS: Record<string, string> = { Men: '👔', Women: '👗', Accessories: '👜', Kids: '🧸' };

export function CategoryDistribution() {
  return (
    <div className="flex h-full min-h-[400px] w-full flex-col rounded-2xl border border-black/[0.06] bg-white shadow-xl shadow-black/[0.04] dark:border-white/[0.08] dark:bg-[#1a1a1a]">
      <div className="border-b border-black/[0.04] p-6 pb-4 dark:border-white/[0.04]">
        <h2 className="text-lg font-bold text-black dark:text-white">Category Mix</h2>
        <p className="text-sm font-medium text-black/40 dark:text-white/40">Last 30 Days</p>
      </div>

      <div className="relative flex flex-1 items-center justify-center p-6">
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Pie
              data={MOCK_CATEGORY_DATA}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              animationDuration={1200}
              stroke="none"
              cornerRadius={6}
            >
              {MOCK_CATEGORY_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute flex flex-col items-center">
          <span className="text-3xl font-black text-black dark:text-white">{total}%</span>
          <span className="text-[11px] font-semibold text-black/35 dark:text-white/35">
            Distribution
          </span>
        </div>
      </div>

      <div className="border-t border-black/[0.04] p-6 pt-4 dark:border-white/[0.04]">
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
          {MOCK_CATEGORY_DATA.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center gap-2.5 rounded-xl p-2 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
            >
              <span className="text-base">{EMOJIS[cat.name] ?? '📦'}</span>
              <div className="flex-1">
                <span className="text-xs font-bold text-black dark:text-white">{cat.name}</span>
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-black/[0.04] dark:bg-white/[0.04]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
              <span className="text-xs font-black text-black dark:text-white">{cat.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
