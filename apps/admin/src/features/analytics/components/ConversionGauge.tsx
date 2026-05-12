'use client';

import React from 'react';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

export function ConversionGauge() {
  const conversionRate = 58.19;

  const data = [
    { name: 'Converted', value: conversionRate },
    { name: 'Remaining', value: 100 - conversionRate },
  ];

  const funnelSteps = [
    { label: 'Visits', value: '14,987', pct: '100%', color: '#6a4fbb' },
    { label: 'Add to Cart', value: '5,620', pct: '37.5%', color: '#8b5cf6' },
    { label: 'Checkout', value: '3,210', pct: '21.4%', color: '#a855f7' },
    { label: 'Purchased', value: '1,870', pct: '12.5%', color: '#22c55e' },
  ];

  return (
    <div className="flex h-[460px] w-full flex-col rounded-2xl border border-black/[0.06] bg-white shadow-xl shadow-black/[0.04] dark:border-white/[0.08] dark:bg-[#1a1a1a]">
      <div className="flex items-start justify-between border-b border-black/[0.04] p-6 pb-4 dark:border-white/[0.04]">
        <div>
          <h2 className="text-lg font-bold text-black dark:text-white">Conversion Funnel</h2>
          <p className="text-sm font-medium text-black/40 dark:text-white/40">
            Visit → Purchase rate
          </p>
        </div>
        <div className="mt-1 flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 2.5V9.5M6 2.5L9 5.5M6 2.5L3 5.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          +3.5%
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
              outerRadius={105}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              cornerRadius={14}
              animationDuration={1500}
              animationBegin={200}
            >
              <Cell fill="url(#gaugeGrad2)" />
              <Cell fill="rgba(0,0,0,0.03)" className="dark:fill-white/[0.04]" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute bottom-1 flex flex-col items-center">
          <span className="text-2xl font-black tracking-tight text-black dark:text-white">
            {conversionRate}%
          </span>
          <span className="mt-0.5 text-[10px] font-bold tracking-widest text-black/30 uppercase dark:text-white/30">
            Rate
          </span>
        </div>
      </div>

      {/* Funnel breakdown */}
      <div className="flex flex-col justify-center gap-1.5 border-t border-black/[0.04] px-5 py-3 pb-4 dark:border-white/[0.04]">
        {funnelSteps.map((step, i) => {
          const barWidth = i === 0 ? 100 : parseFloat(step.pct);
          return (
            <div
              key={step.label}
              className="group flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
            >
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-black text-white shadow-sm"
                style={{ backgroundColor: step.color, boxShadow: `0 3px 8px ${step.color}30` }}
              >
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-black/70 dark:text-white/70">
                    {step.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-black dark:text-white">
                      {step.value}
                    </span>
                    <span className="rounded-md bg-black/[0.04] px-1.5 py-0.5 text-[10px] font-bold text-black/40 dark:bg-white/[0.06] dark:text-white/40">
                      {step.pct}
                    </span>
                  </div>
                </div>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-black/[0.04] dark:bg-white/[0.04]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${barWidth}%`, backgroundColor: step.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
