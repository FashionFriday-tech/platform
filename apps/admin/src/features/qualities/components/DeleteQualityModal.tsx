'use client';

import React from 'react';

import { AnimatePresence, motion } from 'motion/react';

interface DeleteQualityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  qualityName?: string;
  isDeleting?: boolean;
}

export function DeleteQualityModal({
  isOpen,
  onClose,
  onConfirm,
  qualityName,
  isDeleting,
}: DeleteQualityModalProps) {
  if (!isOpen) {
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
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-black/10 bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-3xl sm:p-6 dark:border-white/10 dark:bg-[#121212]"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>

          <h3 className="text-base font-bold text-black sm:text-lg dark:text-white">
            Delete Quality Tier?
          </h3>
          <p className="mt-1.5 text-xs text-black/60 sm:text-sm dark:text-white/60">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-black dark:text-white">
              &quot;{qualityName}&quot;
            </span>
            ? This will remove this quality tier from the catalog options.
          </p>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-black/60 transition-colors hover:bg-black/5 hover:text-black sm:text-sm dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50 sm:text-sm"
            >
              {isDeleting ? 'Deleting...' : 'Delete Quality'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
