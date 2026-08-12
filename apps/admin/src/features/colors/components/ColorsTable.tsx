'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

import { EditIcon, TrashIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { type Color } from '../types';

interface ColorsTableProps {
  colors: Color[];
  isLoading: boolean;
  onEditColor: (color: Color) => void;
  onDeleteColor: (color: Color) => void;
}

export function ColorsTable({
  colors,
  isLoading,
  onEditColor,
  onDeleteColor,
}: ColorsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyHex = (e: React.MouseEvent, hex: string, id: string) => {
    e.stopPropagation();
    void navigator.clipboard.writeText(hex);
    setCopiedId(id);
    toast.success(`Copied ${hex} to clipboard`);
    setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr));
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-black/10 bg-white shadow-xs dark:border-white/10 dark:bg-[#141417]">
        <div className="flex items-center gap-3 text-sm font-medium text-black/50 dark:text-white/50">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
          <span>Loading colors...</span>
        </div>
      </div>
    );
  }

  if (colors.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white p-8 text-center shadow-xs dark:border-white/10 dark:bg-[#141417]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5">
          <span className="h-6 w-6 rounded-full border border-dashed border-black/40 dark:border-white/40" />
        </div>
        <p className="text-base font-semibold text-black dark:text-white">No colors found</p>
        <p className="max-w-sm text-sm text-black/50 dark:text-white/50">
          No colors match your search query. Try changing your search or add a new color.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-slate-50/50 p-2.5 shadow-xs dark:border-white/10 dark:bg-black/20">
      <div className="scrollbar-hide flex-1 overflow-x-auto overflow-y-auto">
        <div className="flex min-w-[700px] flex-col gap-2.5 pb-2">
          {/* Header Tab - Fixed / Sticky on Top (Black in Light Mode) */}
          <div className="sticky top-0 z-20 pb-0.5">
            <div className="grid grid-cols-[minmax(180px,2fr)_minmax(140px,1.5fr)_minmax(140px,1.5fr)_minmax(120px,1.2fr)_minmax(100px,1fr)] items-center rounded-xl border border-black/10 bg-black px-6 py-3.5 text-white shadow-md backdrop-blur-md dark:border-white/10 dark:bg-white dark:text-black dark:shadow-sm">
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Color & Swatch
              </div>
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                HEX Code
              </div>
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Preview
              </div>
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Date Added
              </div>
              <div className="text-right text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Actions
              </div>
            </div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col gap-2">
            {colors.map((color, index) => (
              <motion.div
                key={color.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.2) }}
                className="group grid grid-cols-[minmax(180px,2fr)_minmax(140px,1.5fr)_minmax(140px,1.5fr)_minmax(120px,1.2fr)_minmax(100px,1fr)] items-center rounded-xl border border-black/5 bg-white px-6 py-3.5 shadow-xs transition-all hover:border-black/15 hover:shadow-sm dark:border-white/5 dark:bg-[#141417] dark:hover:border-white/15"
              >
                {/* Color & Swatch */}
                <div className="flex items-center gap-3">
                  <span
                    className="h-7 w-7 rounded-full border border-black/15 shadow-xs shrink-0 dark:border-white/15"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-black truncate dark:text-white">
                      {color.name}
                    </p>
                    <p className="text-[11px] text-black/40 font-mono dark:text-white/40">
                      ID: {color.id.slice(0, 8)}
                    </p>
                  </div>
                </div>

                {/* HEX Code */}
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-black/5 px-2.5 py-1 font-mono text-xs font-bold text-black uppercase dark:bg-white/5 dark:text-white">
                    {color.hex}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCopyHex(e, color.hex, color.id)}
                    className="cursor-pointer text-xs text-black/40 transition-colors hover:text-black dark:text-white/40 dark:hover:text-white"
                    title="Copy hex code"
                  >
                    {copiedId === color.id ? (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        Copied!
                      </span>
                    ) : (
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Preview Badge */}
                <div>
                  <div
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 shadow-xs dark:border-white/10"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span
                      className="text-[11px] font-bold"
                      style={{
                        color:
                          color.hex.toLowerCase() === '#ffffff' ||
                          color.hex.toLowerCase() === '#f5f5dc' ||
                          color.hex.toLowerCase() === '#ffff00' ||
                          color.hex.toLowerCase() === '#ffc0cb'
                            ? '#000000'
                            : '#FFFFFF',
                      }}
                    >
                      {color.name}
                    </span>
                  </div>
                </div>

                {/* Date Added */}
                <div className="text-xs text-black/60 dark:text-white/60">
                  {color.createdAt ? new Date(color.createdAt).toLocaleDateString() : '—'}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEditColor(color)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/5 bg-black/[0.02] text-black/70 transition-all hover:border-black/20 hover:bg-black/10 hover:text-black dark:border-white/5 dark:bg-white/[0.02] dark:text-white/70 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white"
                    title="Edit Color"
                  >
                    <EditIcon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteColor(color)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/10 bg-red-500/[0.03] text-red-500 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-600 dark:border-red-500/20 dark:bg-red-500/[0.05] dark:hover:bg-red-500/20"
                    title="Delete Color"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
