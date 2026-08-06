'use client';

import React from 'react';

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { type AnalyticsPayload, MOCK_AOV_DATA } from '../types';

interface AovTrendChartProps {
  aovData?: AnalyticsPayload['aovTrend'];
}

export function AovTrendChart({ aovData }: AovTrendChartProps) {
  const chartPoints = aovData?.data ?? MOCK_AOV_DATA;
  const latestCurrent = aovData ? aovData.current : MOCK_AOV_DATA[MOCK_AOV_DATA.length - 1].current;
  const latestPrevious = aovData ? aovData.previous : MOCK_AOV_DATA[MOCK_AOV_DATA.length - 1].previous;
  const delta = aovData
    ? aovData.delta
    : (((latestCurrent - latestPrevious) / latestPrevious) * 100).toFixed(1);
  const isUp = !delta.startsWith('-');

  return (
    <div className="flex h-[400px] w-full flex-col rounded-2xl border border-black/[0.06] bg-white shadow-xl shadow-black/[0.04] dark:border-white/[0.08] dark:bg-[#1a1a1a]">
      <div className="flex items-start justify-between border-b border-black/[0.04] p-6 pb-4 dark:border-white/[0.04]">
        <div>
          <h2 className="text-lg font-bold text-black dark:text-white">Avg. Order Value (AOV)</h2>
          <p className="text-sm font-medium text-black/40 dark:text-white/40">
            Current vs Previous Period
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-black text-black dark:text-white">
            ₹{latestCurrent.toLocaleString('en-IN')}
          </span>
          <span
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
              isUp
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'
            }`}
          >
            <svg
              className={`h-3 w-3 ${isUp ? '' : 'rotate-180'}`}
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M6 2.5V9.5M6 2.5L9 5.5M6 2.5L3 5.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isUp ? `+${delta}%` : `${delta}%`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-5 px-6 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-5 rounded-full bg-[#6a4fbb]" />
          <span className="text-[11px] font-semibold text-black/40 dark:text-white/40">
            Current
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0 w-5 border-t border-dashed border-black/25 dark:border-white/25" />
          <span className="text-[11px] font-semibold text-black/40 dark:text-white/40">
            Previous
          </span>
        </div>
      </div>

      <div className="h-full min-h-0 w-full flex-1 p-6 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartPoints} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="aovGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6a4fbb" stopOpacity={0.25} />
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
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', fontSize: 11 }}
              className="text-black/35 dark:text-white/35"
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f0a1e',
                borderRadius: '16px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                color: 'white',
                padding: '12px 18px',
                fontSize: '13px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              }}
              formatter={(value, name) => [
                `₹${Number(value).toLocaleString('en-IN')}`,
                name === 'current' ? 'Current Period' : 'Previous Period',
              ]}
            />
            <Area
              type="monotone"
              dataKey="current"
              stroke="#6a4fbb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#aovGrad2)"
              dot={false}
              activeDot={{ r: 6, fill: '#6a4fbb', stroke: 'white', strokeWidth: 3 }}
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
