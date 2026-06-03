import React from 'react';
import Image from 'next/image';

import { type Brand } from '@ff/schemas';
import { AnimatePresence, motion } from 'motion/react';

interface BrandDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand | null;
  onEdit: () => void;
  onDelete: () => void;
}

export function BrandDetailsModal({
  isOpen,
  onClose,
  brand,
  onEdit,
  onDelete,
}: BrandDetailsModalProps) {
  if (!isOpen || !brand) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl dark:border-white/5 dark:bg-[#111]"
        >
          {/* Header Image Area */}
          <div
            className="relative flex h-48 w-full items-center justify-center p-6 transition-colors"
            style={{ backgroundColor: brand.color ?? '#000000' }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <Image
              width={500}
              height={500}
              src={brand.logo}
              alt={brand.name}
              className="max-h-full max-w-full object-contain drop-shadow-md invert"
            />
          </div>

          {/* Body */}
          <div className="space-y-4 p-6">
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white">{brand.name}</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {brand.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex rounded bg-black/5 px-2 py-0.5 text-xs font-semibold text-black/70 capitalize dark:bg-white/5 dark:text-white/70"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-black/5 pt-2 dark:border-white/5">
              <p className="mb-1 text-sm text-black/60 dark:text-white/60">Brand Color</p>
              <div className="flex items-center gap-2">
                <div
                  className="h-6 w-6 rounded-full border border-black/10 dark:border-white/10"
                  style={{ backgroundColor: brand.color }}
                />
                <span className="text-sm font-medium text-black uppercase dark:text-white">
                  {brand.color}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-3 border-t border-black/5 bg-[#f8f9fa] p-6 dark:border-white/5 dark:bg-[#1a1a1a]">
            <button
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              Delete
            </button>
            <button
              onClick={() => {
                onEdit();
                onClose();
              }}
              className="flex-1 rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95 dark:bg-white dark:text-black"
            >
              Edit Brand
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
