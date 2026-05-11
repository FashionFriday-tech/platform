'use client';

import React, { useState } from 'react';

import {
  Area,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AreaChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { MOCK_REVENUE_7D, MOCK_REVENUE_30D } from '../types';

const RANGE_OPTIONS = [
  { label: '7D', data: MOCK_REVENUE_7D },
  { label: '30D', data: MOCK_REVENUE_30D },
];

export function RevenueChart() {
  const [activeRange, setActiveRange] = useState(0);
  // eslint-disable-next-line security/detect-object-injection
  const data = RANGE_OPTIONS[activeRange].data;

  // Calculate summary metrics
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);

  return (
    <div className="flex h-[460px] w-full flex-col rounded-2xl border border-black/[0.06] bg-white shadow-xl shadow-black/[0.04] dark:border-white/[0.08] dark:bg-[#1a1a1a]">
      {/* Header with summary */}
      <div className="flex items-start justify-between border-b border-black/[0.04] p-6 pb-4 dark:border-white/[0.04]">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-black dark:text-white">Revenue & Orders</h2>
          <p className="text-sm font-medium text-black/40 dark:text-white/40">
            Performance over time
          </p>
          <div className="mt-3 flex items-center gap-6">
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-black/30 uppercase dark:text-white/30">
                Revenue
              </p>
              <p className="text-xl font-black text-black dark:text-white">
                ₹{(totalRevenue / 100000).toFixed(1)}L
              </p>
            </div>
            <div className="h-8 w-px bg-black/[0.06] dark:bg-white/[0.06]" />
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-black/30 uppercase dark:text-white/30">
                Orders
              </p>
              <p className="text-xl font-black text-black dark:text-white">
                {totalOrders.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-1 rounded-xl bg-black/[0.04] p-1 dark:bg-white/[0.06]">
            {RANGE_OPTIONS.map((opt, i) => (
              <button
                key={opt.label}
                onClick={() => {
                  setActiveRange(i);
                }}
                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                  activeRange === i
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-black/50 hover:text-black/80 dark:text-white/50 dark:hover:text-white/80'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
              <span className="text-[11px] font-semibold text-black/50 dark:text-white/50">
                Revenue
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-pink-500" />
              <span className="text-[11px] font-semibold text-black/50 dark:text-white/50">
                Orders
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-full min-h-0 w-full flex-1 p-6 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6a4fbb" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#6a4fbb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-black/[0.05] dark:text-white/[0.05]"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 600 }}
              className="text-black/35 dark:text-white/35"
              dy={8}
            />
            <YAxis
              yAxisId="revenue"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', fontSize: 11 }}
              className="text-black/35 dark:text-white/35"
              tickFormatter={(v) => `₹${v / 1000}k`}
            />
            <YAxis yAxisId="orders" orientation="right" axisLine={false} tickLine={false} hide />
            <Tooltip
              cursor={{ stroke: '#6a4fbb', strokeWidth: 1, strokeDasharray: '4 4' }}
              contentStyle={{
                backgroundColor: '#0f0a1e',
                borderRadius: '16px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                color: 'white',
                padding: '12px 18px',
                fontSize: '13px',
                fontWeight: 600,
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              }}
              itemStyle={{ color: 'white', fontWeight: 'bold', padding: '2px 0' }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontSize: 11 }}
              formatter={(value, name) => {
                const v = Number(value);
                if (name === 'revenue') {
                  return [`₹${v.toLocaleString('en-IN')}`, 'Revenue'];
                }
                return [v.toLocaleString('en-IN'), 'Orders'];
              }}
            />
            <Area
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              stroke="#6a4fbb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRev)"
              animationDuration={1200}
              dot={false}
              activeDot={{ r: 6, fill: '#6a4fbb', stroke: 'white', strokeWidth: 3 }}
            />
            <Line
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              stroke="#ec4899"
              strokeWidth={2.5}
              strokeDasharray="6 4"
              dot={false}
              activeDot={{ r: 5, fill: '#ec4899', stroke: 'white', strokeWidth: 3 }}
              animationDuration={1400}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
