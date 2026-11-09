'use client';

import React from 'react';

import { PackageIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { type QualityItem } from '../types';

interface QualityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  quality: QualityItem | null;
  onEdit: () => void;
  onDelete: () => void;
}

export function QualityDetailsModal({
  isOpen,
  onClose,
  quality,
  onEdit,
  onDelete,
}: QualityDetailsModalProps) {
  if (!isOpen || !quality) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl dark:border-white/10 dark:bg-[#121212]"
        >
          {/* Header */}
          <div className="border-b border-black/5 p-5 sm:p-6 dark:border-white/5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black tracking-tight text-black sm:text-2xl dark:text-white">
                    {quality.name}
                  </h2>
                  {quality.name === '6A' && (
                    <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                      New
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-black/50 sm:text-sm dark:text-white/50">
                  Quality Tier Specification & Category Assignments
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-black/50 transition-colors hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="scrollbar-hide max-h-[60vh] space-y-4 overflow-y-auto p-5 sm:p-6">
            {/* Catalog Stats / Overview Card */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-black/5 bg-[#f8f9fa] p-3.5 sm:p-4 dark:border-white/5 dark:bg-[#1a1a1a]">
                <span className="text-[11px] font-semibold tracking-wider text-black/50 uppercase dark:text-white/50">
                  Catalog Products
                </span>
                <div className="mt-1.5 flex items-center gap-2">
                  <PackageIcon className="h-4 w-4 text-black/60 dark:text-white/60" />
                  <span className="text-lg font-black text-black sm:text-xl dark:text-white">
                    {quality.productCount ?? 0}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-black/5 bg-[#f8f9fa] p-3.5 sm:p-4 dark:border-white/5 dark:bg-[#1a1a1a]">
                <span className="text-[11px] font-semibold tracking-wider text-black/50 uppercase dark:text-white/50">
                  Assigned Categories
                </span>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-lg font-black text-black sm:text-xl dark:text-white">
                    {quality.categories.length}
                  </span>
                  <span className="text-xs text-black/40 dark:text-white/40">categories</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-black/5 bg-[#f8f9fa] p-4 dark:border-white/5 dark:bg-[#1a1a1a]">
              <h4 className="text-xs font-bold tracking-wider text-black uppercase dark:text-white">
                Description
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-black/70 sm:text-sm dark:text-white/70">
                {quality.description || 'No detailed description provided for this quality grade.'}
              </p>
            </div>

            {/* Assigned Categories */}
            <div className="rounded-2xl border border-black/5 bg-[#f8f9fa] p-4 dark:border-white/5 dark:bg-[#1a1a1a]">
              <div className="mb-2.5 flex items-center justify-between">
                <h4 className="text-xs font-bold tracking-wider text-black uppercase dark:text-white">
                  Applicable Categories ({quality.categories.length})
                </h4>
              </div>

              {quality.categories.length === 0 ? (
                <p className="text-xs text-black/40 italic dark:text-white/40">
                  No categories currently assigned to this quality tier.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {quality.categories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center rounded-xl border border-black/5 bg-white px-3 py-1.5 text-xs font-medium text-black shadow-2xs dark:border-white/5 dark:bg-[#222] dark:text-white"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 border-t border-black/5 bg-[#f8f9fa] p-4 sm:p-5 dark:border-white/5 dark:bg-[#161616]">
            <button
              type="button"
              onClick={onDelete}
              className="rounded-xl px-3.5 py-2.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
            >
              Delete Quality
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-black/10 px-4 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
              >
                Close
              </button>
              <button
                type="button"
                onClick={onEdit}
                className="flex items-center gap-1.5 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-black/90 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <span>Edit Quality</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
