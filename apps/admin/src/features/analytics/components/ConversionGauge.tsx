'use client';

import React from 'react';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { type AnalyticsPayload } from '../types';

interface ConversionGaugeProps {
  conversion?: AnalyticsPayload['conversion'];
}

export function ConversionGauge({ conversion }: ConversionGaugeProps) {
  const conversionRate = conversion ? conversion.rate : 58.19;

  const data = [
    { name: 'Converted', value: conversionRate },
    { name: 'Remaining', value: Math.max(100 - conversionRate, 0) },
  ];

  const funnelSteps = conversion?.funnel ?? [
    { label: 'Visits', value: '14,987', pct: '100%', color: '#6a4fbb' },
    { label: 'Add to Cart', value: '5,620', pct: '37.5%', color: '#8b5cf6' },
    { label: 'Checkout', value: '3,210', pct: '21.4%', color: '#a855f7' },
    { label: 'Purchased', value: '1,870', pct: '12.5%', color: '#22c55e' },
  ];

  const rateDelta = conversion?.rateDelta ?? '+3.5%';
  const rateDeltaUp = conversion ? conversion.rateDeltaUp : true;

  return (
    <div className="flex h-[460px] w-full flex-col rounded-2xl border border-black/[0.06] bg-white shadow-xl shadow-black/[0.04] dark:border-white/[0.08] dark:bg-[#1a1a1a]">
      <div className="flex items-start justify-between border-b border-black/[0.04] p-6 pb-4 dark:border-white/[0.04]">
        <div>
          <h2 className="text-lg font-bold text-black dark:text-white">Conversion Funnel</h2>
          <p className="text-sm font-medium text-black/40 dark:text-white/40">
            Visit → Purchase rate
          </p>
        </div>
        <div
          className={`mt-1 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
            rateDeltaUp
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
              : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'
          }`}
        >
          <svg
            className={`h-3 w-3 ${rateDeltaUp ? '' : 'rotate-180'}`}
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
          {rateDelta}
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-6 pt-2 pb-0">
        <ResponsiveContainer width="100%" height={120}>
          <PieChart>
            <defs>
              <linearGradient id="gaugeGrad2" x1="0" y1="0" x2="1" y2="0.5">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="40%" stopColor="#6a4fbb" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={95}
              paddingAngle={0}
              dataKey="value"
              animationDuration={1200}
              stroke="none"
              cornerRadius={6}
            >
              <Cell fill="url(#gaugeGrad2)" />
              <Cell fill="rgba(0,0,0,0.04)" className="dark:fill-white/[0.04]" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute bottom-4 flex flex-col items-center">
          <span className="text-3xl font-black text-black dark:text-white">
            {conversionRate.toFixed(1)}%
          </span>
          <span className="text-[11px] font-semibold text-black/35 dark:text-white/35">
            Conversion Rate
          </span>
        </div>
      </div>

      <div className="border-t border-black/[0.04] p-6 pt-4 dark:border-white/[0.04]">
        <div className="space-y-2.5">
          {funnelSteps.map((step, idx) => (
            <div key={step.label} className="group flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold text-white shadow-xs"
                  style={{ backgroundColor: step.color }}
                >
                  {idx + 1}
                </div>
                <span className="font-semibold text-black/70 dark:text-white/70">{step.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-black dark:text-white">
                  {step.value}
                </span>
                <span className="w-10 text-right font-mono text-[11px] font-bold text-black/30 dark:text-white/30">
                  {step.pct}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
