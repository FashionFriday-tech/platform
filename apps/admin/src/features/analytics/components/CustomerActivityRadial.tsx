'use client';

import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const DATA = [
  { name: 'Women', sales: 4568, fill: '#ec4899', trend: '-1.08%', emoji: '👗' },
  { name: 'Men', sales: 5568, fill: '#6a4fbb', trend: '+5.08%', emoji: '👔' },
];

const totalSales = DATA.reduce((sum, d) => sum + d.sales, 0);

export function CustomerActivityRadial() {
  return (
    <div className="flex h-full min-h-[400px] w-full flex-col rounded-2xl border border-black/[0.06] bg-white shadow-xl shadow-black/[0.04] dark:border-white/[0.08] dark:bg-[#1a1a1a]">
      <div className="border-b border-black/[0.04] p-6 pb-4 dark:border-white/[0.04]">
        <h2 className="text-lg font-bold text-black dark:text-white">Customer Activity</h2>
        <p className="text-sm font-medium text-black/40 dark:text-white/40">
          Category buying trends
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 2xl:flex-row">
        <div className="relative h-44 w-44 shrink-0 lg:h-48 lg:w-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="100%"
              barSize={16}
              data={DATA}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                background={{ fill: 'rgba(0,0,0,0.03)' }}
                dataKey="sales"
                cornerRadius={12}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-black dark:text-white">
              {(totalSales / 1000).toFixed(1)}K
            </span>
            <span className="text-[11px] font-semibold text-black/35 dark:text-white/35">
              Total Sales
            </span>
          </div>
        </div>

        <div className="flex w-full max-w-[220px] flex-col gap-2">
          {DATA.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-xl p-2.5 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{item.emoji}</span>
                <div>
                  <span className="text-sm font-bold text-black dark:text-white">{item.name}</span>
                  <p className="text-[11px] font-semibold text-black/40 dark:text-white/40">
                    {item.sales.toLocaleString('en-IN')} units
                  </p>
                </div>
              </div>
              <span
                className={`rounded-lg px-2 py-1 text-[11px] font-bold ${
                  item.trend.startsWith('+')
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'
                }`}
              >
                {item.trend}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
