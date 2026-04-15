import React from 'react';

import { type ReferralMetric } from '../types';

interface ReferralMetricsProps {
  metrics: ReferralMetric[];
}

export function ReferralMetrics({ metrics }: ReferralMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="bg-background border-border flex items-center justify-between rounded-2xl border p-5 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="bg-foreground/5 rounded-xl p-2.5">{m.icon}</div>
            <div>
              <p className="mb-0.5 text-[7px] font-black tracking-[0.2em] uppercase opacity-40">
                {m.label}
              </p>
              <h3 className={`text-lg font-black tracking-tighter italic ${m.color}`}>{m.value}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
