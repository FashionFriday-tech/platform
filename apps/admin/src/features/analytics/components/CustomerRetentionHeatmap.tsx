'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MOCK_RETENTION_DATA } from '../types';

const MONTH_LABELS = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5'];

function getCellStyle(value: number) {
  if (value === 0) return { bg: 'transparent', text: 'transparent', glow: '' };
  if (value >= 70) return { bg: 'rgba(34, 197, 94, 0.18)', text: '#16a34a', glow: '#22c55e' };
  if (value >= 50) return { bg: 'rgba(132, 204, 22, 0.18)', text: '#65a30d', glow: '#84cc16' };
  if (value >= 35) return { bg: 'rgba(245, 158, 11, 0.18)', text: '#d97706', glow: '#f59e0b' };
  if (value >= 20) return { bg: 'rgba(249, 115, 22, 0.18)', text: '#ea580c', glow: '#f97316' };
  return { bg: 'rgba(239, 68, 68, 0.15)', text: '#dc2626', glow: '#ef4444' };
}

export function CustomerRetentionHeatmap() {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

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
              <th className="pb-3 text-left text-[11px] font-bold uppercase tracking-wider text-black/30 dark:text-white/30">
                Cohort
              </th>
              {MONTH_LABELS.map((label) => (
                <th
                  key={label}
                  className="pb-3 text-center text-[11px] font-bold uppercase tracking-wider text-black/30 dark:text-white/30"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_RETENTION_DATA.map((cohort, rowIdx) => (
              <tr key={cohort.cohort}>
                <td className="py-1.5 pr-4 text-xs font-semibold text-black/60 dark:text-white/60 whitespace-nowrap">
                  {cohort.cohort}
                </td>
                {cohort.months.map((value, colIdx) => {
                  const isHovered = hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx;
                  const isEmpty = value === 0 && colIdx > 0;
                  const style = getCellStyle(value);

                  return (
                    <td key={colIdx} className="p-1">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{
                          opacity: 1,
                          scale: isHovered ? 1.12 : 1,
                        }}
                        transition={{
                          delay: 0.025 * (rowIdx * MONTH_LABELS.length + colIdx),
                          duration: 0.2,
                        }}
                        onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className="flex h-10 items-center justify-center rounded-lg text-[12px] font-bold transition-shadow"
                        style={{
                          backgroundColor: isEmpty ? 'rgba(0,0,0,0.02)' : style.bg,
                          color: isEmpty ? 'transparent' : style.text,
                          boxShadow: isHovered && !isEmpty ? `0 0 16px ${style.glow}30` : 'none',
                          cursor: isEmpty ? 'default' : 'pointer',
                        }}
                      >
                        {isEmpty ? '' : `${value}%`}
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 border-t border-black/[0.04] px-6 py-4 dark:border-white/[0.04]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-black/30 dark:text-white/30">
          Retention:
        </span>
        {[
          { label: '70%+', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.18)' },
          { label: '50-70%', color: '#84cc16', bg: 'rgba(132, 204, 22, 0.18)' },
          { label: '35-50%', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.18)' },
          { label: '20-35%', color: '#f97316', bg: 'rgba(249, 115, 22, 0.18)' },
          { label: '<20%', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="h-3 w-3 rounded"
              style={{ backgroundColor: item.bg, border: `1px solid ${item.color}30` }}
            />
            <span className="text-[10px] font-semibold text-black/40 dark:text-white/40">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
