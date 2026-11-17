'use client';

import React, { useState } from 'react';

import { TrendingUpIcon } from '@ff/ui';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { type DailyTrendPoint } from '../types';

interface PaymentTrendChartProps {
  trendData?: DailyTrendPoint[];
  isLoading: boolean;
}

function formatInr(val: number) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
  return `₹${val}`;
}

export function PaymentTrendChart({ trendData = [], isLoading }: PaymentTrendChartProps) {
  const [metric, setMetric] = useState<'volume' | 'count'>('volume');
  const [isExpanded, setIsExpanded] = useState(true);

  if (isLoading && trendData.length === 0) {
    return (
      <div className="h-64 animate-pulse rounded-3xl border border-black/5 bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/[0.02]" />
    );
  }

  // Format dates for display
  const chartData = trendData.map((d) => {
    const dateObj = new Date(d.date);
    const dayLabel = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    return {
      ...d,
      displayDate: dayLabel,
    };
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white/80 p-5 shadow-xs backdrop-blur-xl transition-all dark:border-white/10 dark:bg-[#121212]/80">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-black/5 text-black dark:bg-white/10 dark:text-white">
            <TrendingUpIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-black dark:text-white">
              7-Day Payment Trajectory & Volume
            </h3>
            <p className="text-xs text-black/40 dark:text-white/40">
              Live settlement flow across online & advance gateway receipts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Metric Selector Pill */}
          <div className="flex items-center rounded-2xl border border-black/5 bg-black/5 p-1 dark:border-white/10 dark:bg-white/5">
            <button
              type="button"
              onClick={() => setMetric('volume')}
              className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                metric === 'volume'
                  ? 'bg-black text-white shadow-xs dark:bg-white dark:text-black'
                  : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
              }`}
            >
              Volume (₹)
            </button>
            <button
              type="button"
              onClick={() => setMetric('count')}
              className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                metric === 'count'
                  ? 'bg-black text-white shadow-xs dark:bg-white dark:text-black'
                  : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
              }`}
            >
              Count (#)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-2xl border border-black/5 bg-white px-2.5 py-1 text-xs font-bold text-black/60 transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white/60 dark:hover:bg-white/10"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 h-52 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="paymentVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="paymentCountGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 11, fill: '#888888' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#888888' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => (metric === 'volume' ? formatInr(val) : String(val))}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload as DailyTrendPoint & { displayDate: string };
                    return (
                      <div className="rounded-2xl border border-black/10 bg-white/95 p-3 shadow-xl backdrop-blur-xl dark:border-white/15 dark:bg-[#181818]/95">
                        <p className="text-xs font-bold text-black/50 dark:text-white/50">
                          {d.displayDate}
                        </p>
                        <div className="mt-1 space-y-1">
                          <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                            Volume:{' '}
                            {new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                            }).format(d.volume)}
                          </p>
                          <p className="text-xs font-semibold text-black/70 dark:text-white/70">
                            Transactions: {d.count} orders
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {metric === 'volume' ? (
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#paymentVolumeGrad)"
                />
              ) : (
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#paymentCountGrad)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
