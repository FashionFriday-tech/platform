'use client';

import React from 'react';

import { ChevronRightIcon, PackageIcon } from '@ff/ui';

import { type QualityItem } from '../types';

interface QualityCardProps {
  quality: QualityItem;
  onSelect: (quality: QualityItem) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
}

export function QualityCard({ quality, onSelect, dragHandleProps }: QualityCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        onSelect(quality);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(quality);
        }
      }}
      className="group relative flex h-full cursor-pointer flex-col justify-between rounded-2xl border border-black/5 bg-white p-4 shadow-xs transition-all hover:border-black/20 hover:shadow-md active:scale-[0.99] sm:p-5 dark:border-white/5 dark:bg-[#121212] dark:hover:border-white/20"
    >
      <div className="flex flex-col">
        {/* Top Header: Quality Name + New Badge + Drag Handle / Arrow */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h3 className="text-base font-bold text-black sm:text-lg dark:text-white">
                {quality.name}
              </h3>
              {quality.name === '6A' && (
                <span className="shrink-0 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  New
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-black/50 dark:text-white/50">
              <PackageIcon className="h-3.5 w-3.5 shrink-0" />
              <span>{quality.productCount ?? 0} Products</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {dragHandleProps && (
              <button
                {...dragHandleProps}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                }}
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
            <div className="flex h-7 w-7 items-center justify-center rounded-lg text-black/30 transition-all group-hover:translate-x-0.5 group-hover:text-black sm:h-8 sm:w-8 sm:rounded-xl dark:text-white/30 dark:group-hover:text-white">
              <ChevronRightIcon className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mt-3 line-clamp-2 text-xs text-black/60 sm:text-sm dark:text-white/60">
          {quality.description || 'Standard quality grade with custom specifications.'}
        </p>
      </div>

      {/* Categories Under This Quality */}
      <div className="mt-4 border-t border-black/5 pt-3 dark:border-white/5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-wider text-black/50 uppercase sm:text-[11px] dark:text-white/50">
            Categories ({quality.categories.length})
          </span>
          <span className="text-[10px] font-medium text-black/40 transition-colors group-hover:text-black sm:text-[11px] dark:text-white/40 dark:group-hover:text-white">
            Details →
          </span>
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {quality.categories.length === 0 ? (
            <span className="text-xs text-black/40 italic dark:text-white/40">
              No categories assigned
            </span>
          ) : (
            quality.categories.slice(0, 4).map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center rounded-lg bg-black/5 px-2 py-0.5 text-[10px] font-medium text-black/80 sm:px-2.5 sm:py-1 sm:text-[11px] dark:bg-white/5 dark:text-white/80"
              >
                {cat}
              </span>
            ))
          )}
          {quality.categories.length > 4 && (
            <span className="inline-flex items-center rounded-lg bg-black/5 px-2 py-0.5 text-[10px] font-medium text-black/60 sm:px-2.5 sm:py-1 sm:text-[11px] dark:bg-white/5 dark:text-white/60">
              +{quality.categories.length - 4} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
