'use client';

import React from 'react';

import { motion } from 'motion/react';

import { MOCK_TRAFFIC_SOURCES } from '../types';

const totalVisitors = MOCK_TRAFFIC_SOURCES.reduce((sum, s) => sum + s.visitors, 0);

const EMOJIS = ['🎯', '🔍', '📱', '🔗', '📧'];

export function TrafficSourcesFunnel() {
  return (
    <div className="flex h-full min-h-[400px] w-full flex-col rounded-2xl border border-black/[0.06] bg-white shadow-xl shadow-black/[0.04] dark:border-white/[0.08] dark:bg-[#1a1a1a]">
      <div className="border-b border-black/[0.04] p-6 pb-4 dark:border-white/[0.04]">
        <h2 className="text-lg font-bold text-black dark:text-white">Traffic Sources</h2>
        <p className="text-sm font-medium text-black/40 dark:text-white/40">
          Where users come from
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6">
        {MOCK_TRAFFIC_SOURCES.map((source, i) => {
          const widthPct =
            40 + ((MOCK_TRAFFIC_SOURCES.length - i) / MOCK_TRAFFIC_SOURCES.length) * 55;
          const sharePct = ((source.visitors / totalVisitors) * 100).toFixed(1);

          return (
            <motion.div
              key={source.source}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
              className="group relative flex items-center justify-center overflow-hidden rounded-xl px-4 py-3.5 text-center transition-all hover:scale-[1.02]"
              style={{
                width: `${widthPct}%`,
                background: `linear-gradient(135deg, ${source.color}12, ${source.color}06)`,
                borderLeft: `3px solid ${source.color}`,
              }}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2.5">
                  // eslint-disable-next-line security/detect-object-injection
                  <span className="text-sm">{EMOJIS[i]}</span>
                  <span className="text-xs font-bold text-black dark:text-white">
                    {source.source}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-black dark:text-white">
                    {source.visitors.toLocaleString('en-IN')}
                  </span>
                  <span className="rounded-md bg-black/[0.04] px-1.5 py-0.5 text-[10px] font-bold text-black/40 dark:bg-white/[0.06] dark:text-white/40">
                    {sharePct}%
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="border-t border-black/[0.04] p-6 pt-4 dark:border-white/[0.04]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-black/40 dark:text-white/40">
            Total Visitors
          </span>
          <span className="text-lg font-black text-black dark:text-white">
            {totalVisitors.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}
