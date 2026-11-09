'use client';

import React from 'react';

import { PackageIcon } from '@ff/ui';

import { type QualityItem } from '../types';

interface QualityCardProps {
  quality: QualityItem;
  onEdit: (quality: QualityItem) => void;
  onDelete: (quality: QualityItem) => void;
  onToggleCategory?: (quality: QualityItem, category: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
}

export function QualityCard({ quality, onEdit, onDelete, dragHandleProps }: QualityCardProps) {
  return (
    <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs transition-all hover:border-black/15 hover:shadow-md sm:p-4 md:p-5 dark:border-white/5 dark:bg-[#121212] dark:hover:border-white/15">
      <div className="flex flex-col">
        {/* Top Header: Grade Badge & Actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black text-white shadow-xs sm:h-11 sm:w-11 dark:bg-white dark:text-black">
              <span className="font-mono text-xs font-black tracking-tight sm:text-sm">
                {quality.name}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="truncate text-sm font-bold text-black sm:text-base md:text-lg dark:text-white">
                  {quality.name}
                </h3>
                {quality.name === '6A' && (
                  <span className="shrink-0 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    New
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-black/50 dark:text-white/50">
                <PackageIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{quality.productCount ?? 0} Products</span>
              </div>
            </div>
          </div>

          {/* Action buttons (Drag + Edit + Delete) */}
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            {dragHandleProps && (
              <button
                {...dragHandleProps}
                type="button"
                className="flex h-7 w-7 cursor-grab items-center justify-center rounded-lg text-black/30 transition-all hover:bg-black/5 hover:text-black active:cursor-grabbing sm:h-8 sm:w-8 sm:rounded-xl dark:text-white/30 dark:hover:bg-white/5 dark:hover:text-white"
                title="Drag to reorder quality tier"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onEdit(quality);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-black/50 transition-colors hover:bg-black/5 hover:text-black sm:h-8 sm:w-8 sm:rounded-xl dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white"
              title="Edit Quality"
            >
              <svg
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete(quality);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-black/50 transition-colors hover:bg-red-500/10 hover:text-red-600 sm:h-8 sm:w-8 sm:rounded-xl dark:text-white/50 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              title="Delete Quality"
            >
              <svg
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="mt-2.5 line-clamp-2 text-xs text-black/60 sm:mt-3 sm:text-sm dark:text-white/60">
          {quality.description || 'Standard quality grade with custom specifications.'}
        </p>
      </div>

      {/* Categories Under This Quality (pinned to bottom) */}
      <div className="mt-3.5 border-t border-black/5 pt-3 sm:mt-4 dark:border-white/5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-wider text-black/50 uppercase sm:text-[11px] dark:text-white/50">
            Categories ({quality.categories.length})
          </span>
          <button
            type="button"
            onClick={() => {
              onEdit(quality);
            }}
            className="text-[10px] font-medium text-black/60 hover:text-black sm:text-[11px] dark:text-white/60 dark:hover:text-white"
          >
            + Add
          </button>
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {quality.categories.length === 0 ? (
            <span className="text-xs text-black/40 italic dark:text-white/40">
              No categories assigned
            </span>
          ) : (
            quality.categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center rounded-lg bg-black/5 px-2 py-0.5 text-[10px] font-medium text-black/80 sm:px-2.5 sm:py-1 sm:text-[11px] dark:bg-white/5 dark:text-white/80"
              >
                {cat}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
