'use client';

import React, { useState } from 'react';

import { motion } from 'motion/react';

import { type AnalyticsPayload, MOCK_RETENTION_DATA } from '../types';

const MONTH_LABELS = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5'];

function getCellStyle(value: number) {
  if (value === 0) {
    return { bg: 'transparent', text: 'transparent', glow: '' };
  }
  if (value >= 70) {
    return { bg: 'rgba(34, 197, 94, 0.18)', text: '#16a34a', glow: '#22c55e' };
  }
  if (value >= 50) {
    return { bg: 'rgba(132, 204, 22, 0.18)', text: '#65a30d', glow: '#84cc16' };
  }
  if (value >= 35) {
    return { bg: 'rgba(245, 158, 11, 0.18)', text: '#d97706', glow: '#f59e0b' };
  }
  if (value >= 20) {
    return { bg: 'rgba(249, 115, 22, 0.18)', text: '#ea580c', glow: '#f97316' };
  }
  return { bg: 'rgba(239, 68, 68, 0.15)', text: '#dc2626', glow: '#ef4444' };
}

interface CustomerRetentionHeatmapProps {
  retentionData?: AnalyticsPayload['customerRetention'];
}

export function CustomerRetentionHeatmap({ retentionData }: CustomerRetentionHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const cohorts = retentionData
    ? retentionData.map((r) => ({
        cohort: r.cohort,
        months: [r.m0, r.m1, r.m2, r.m3, r.m4, r.m5],
      }))
    : MOCK_RETENTION_DATA;

  return (
    <div className="flex h-full min-h-[440px] w-full flex-col rounded-2xl border border-black/[0.06] bg-white shadow-xl shadow-black/[0.04] dark:border-white/[0.08] dark:bg-[#1a1a1a]">
      <div className="border-b border-black/[0.04] p-6 pb-4 dark:border-white/[0.04]">
        <h2 className="text-lg font-bold text-black dark:text-white">Customer Retention</h2>
        <p className="text-sm font-medium text-black/40 dark:text-white/40">
          Cohort analysis — monthly retention %
        </p>
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        <table className="w-full">
          <thead>
            <tr>
              <th className="pb-3 text-left text-[11px] font-bold tracking-wider text-black/30 uppercase dark:text-white/30">
                Cohort
              </th>
              {MONTH_LABELS.map((label) => (
                <th
                  key={label}
                  className="pb-3 text-center text-[11px] font-bold tracking-wider text-black/30 uppercase dark:text-white/30"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((cohort, rowIdx) => (
              <tr key={cohort.cohort}>
                <td className="py-1.5 pr-4 text-xs font-semibold whitespace-nowrap text-black/60 dark:text-white/60">
                  {cohort.cohort}
                </td>
                {cohort.months.map((value, colIdx) => {
                  const isHovered = hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx;
                  const isEmpty = value === 0 && colIdx > 0;
                  const style = getCellStyle(value);

                  return (
                    <td key={colIdx} className="p-1">
                      <motion.div
                        onMouseEnter={() => {
                          setHoveredCell({ row: rowIdx, col: colIdx });
                        }}
                        onMouseLeave={() => {
                          setHoveredCell(null);
                        }}
                        animate={{
                          scale: isHovered ? 1.08 : 1,
                          boxShadow: isHovered ? `0 0 16px ${style.glow}` : 'none',
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="relative flex h-8 min-w-[42px] cursor-pointer items-center justify-center rounded-lg text-xs font-bold transition-colors"
                        style={{
                          backgroundColor: style.bg,
                          color: style.text,
                        }}
                      >
                        {isEmpty ? '—' : `${value}%`}
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
