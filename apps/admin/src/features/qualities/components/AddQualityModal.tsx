'use client';

import React, { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { type QualityItem } from '../types';

interface AddQualityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    name: string,
    description: string,
    categories: string[],
    isEdit: boolean,
    id?: string,
  ) => Promise<void>;
  initialData?: QualityItem | null;
  availableCategories: string[];
}

const COMMON_CATEGORIES = [
  'Footwear',
  'Sneakers',
  'Slippers',
  'Boots',
  'Watches',
  'Clothing',
  'Accessories',
  'Bags',
];

export function AddQualityModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  availableCategories,
}: AddQualityModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData && isOpen) {
      setName(initialData.name);
      setDescription(initialData.description ?? '');
      setCategories(initialData.categories ?? []);
      setCustomCategory('');
      setError('');
    } else if (isOpen) {
      setName('');
      setDescription('');
      setCategories(['Footwear']);
      setCustomCategory('');
      setError('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) {
    return null;
  }

  const allCategoryOptions = Array.from(
    new Set([...COMMON_CATEGORIES, ...availableCategories, ...categories]),
  );

  const toggleCategory = (cat: string) => {
    setCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  const handleAddCustomCategory = () => {
    const trimmed = customCategory.trim();
    if (!trimmed) {
      return;
    }
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    if (!categories.includes(formatted)) {
      setCategories((prev) => [...prev, formatted]);
    }
    setCustomCategory('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Quality name is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSave(
        name.trim(),
        description.trim(),
        categories,
        Boolean(initialData),
        initialData?.id,
      );
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save quality');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl sm:rounded-3xl dark:border-white/10 dark:bg-[#121212]"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-black/5 p-4 sm:p-5 dark:border-white/5">
            <div>
              <h2 className="text-base font-bold text-black sm:text-lg dark:text-white">
                {initialData ? 'Edit Quality' : 'Add New Quality'}
              </h2>
              <p className="mt-0.5 text-xs text-black/50 dark:text-white/50">
                Configure quality tier and assign applicable categories
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-black/40 hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
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

          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex-1 space-y-3.5 overflow-y-auto p-4 sm:space-y-4 sm:p-5">
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Quality Name */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-black/80 sm:text-sm dark:text-white/80">
                  Quality Name / Grade <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 6A, UA, 7AA, 10A"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  className="w-full rounded-xl border border-black/10 bg-[#f8f9fa] px-3.5 py-2 text-xs text-black transition-colors outline-none focus:border-black/30 focus:bg-white sm:py-2.5 sm:text-sm dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:focus:border-white/30 dark:focus:bg-[#222222]"
                  required
                />
              </div>

              {/* Description / Tier Notes */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-black/80 sm:text-sm dark:text-white/80">
                  Description / Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Short explanation of this quality tier, accuracy, materials..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  className="w-full rounded-xl border border-black/10 bg-[#f8f9fa] px-3.5 py-2 text-xs text-black transition-colors outline-none focus:border-black/30 focus:bg-white sm:py-2.5 sm:text-sm dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:focus:border-white/30 dark:focus:bg-[#222222]"
                />
              </div>

              {/* Applicable Categories Under this Quality */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-xs font-semibold text-black/80 sm:text-sm dark:text-white/80">
                    Categories Under this Quality
                  </label>
                  <span className="text-[11px] text-black/50 dark:text-white/50">
                    {categories.length} selected
                  </span>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {allCategoryOptions.map((cat) => {
                    const isSelected = categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          toggleCategory(cat);
                        }}
                        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all sm:px-3 sm:py-1.5 ${
                          isSelected
                            ? 'bg-black text-white shadow-xs dark:bg-white dark:text-black'
                            : 'bg-black/5 text-black/70 hover:bg-black/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10'
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="h-3 w-3 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Category Input */}
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add custom category..."
                    value={customCategory}
                    onChange={(e) => {
                      setCustomCategory(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomCategory();
                      }
                    }}
                    className="min-w-0 flex-1 rounded-xl border border-black/10 bg-[#f8f9fa] px-3 py-2 text-xs text-black outline-none focus:border-black/30 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:focus:border-white/30"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCategory}
                    className="shrink-0 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-white/5"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Actions (Pinned Bottom Footer) */}
            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-black/5 bg-slate-50/50 p-3.5 backdrop-blur-xs sm:p-4 dark:border-white/5 dark:bg-[#161616]/50">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-black/60 transition-colors hover:bg-black/5 hover:text-black sm:text-sm dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-black/90 active:scale-95 disabled:opacity-50 sm:text-sm dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white dark:border-black/20 dark:border-t-black" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{initialData ? 'Update Quality' : 'Create Quality'}</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
