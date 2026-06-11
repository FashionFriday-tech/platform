'use client';

import React, { useEffect, useState } from 'react';

import { CloseIcon, StoreIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { type Seller, type SellerCategory, type SellerStatus } from '../types';

interface AddSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: {
      name: string;
      storeName: string;
      email?: string | null;
      phone: string;
      address?: string | null;
      status: SellerStatus;
      categoryIds: string[];
    },
    isEdit: boolean,
    id?: string,
  ) => Promise<void>;
  sellerToEdit?: Seller | null;
  categories: SellerCategory[];
}

export function AddSellerModal({
  isOpen,
  onClose,
  onSave,
  sellerToEdit,
  categories,
}: AddSellerModalProps) {
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<SellerStatus>('ACTIVE');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (sellerToEdit) {
      setName(sellerToEdit.name);
      setStoreName(sellerToEdit.storeName);
      setPhone(sellerToEdit.phone);
      setEmail(sellerToEdit.email ?? '');
      setAddress(sellerToEdit.address ?? '');
      setStatus(sellerToEdit.status);
      setSelectedCategoryIds(sellerToEdit.categories?.map((c) => c.id) ?? []);
    } else {
      setName('');
      setStoreName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setStatus('ACTIVE');
      setSelectedCategoryIds([]);
    }
    setError(null);
  }, [sellerToEdit, isOpen]);

  if (!isOpen) {
    return null;
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    );
  };

  const handleSelectAllCategories = () => {
    if (selectedCategoryIds.length === categories.length) {
      setSelectedCategoryIds([]);
    } else {
      setSelectedCategoryIds(categories.map((c) => c.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Contact person name is required');
      return;
    }
    if (!storeName.trim()) {
      setError('Store name is required');
      return;
    }
    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }
    if (selectedCategoryIds.length === 0) {
      setError('Please assign at least one category to this seller');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(
        {
          name: name.trim(),
          storeName: storeName.trim(),
          phone: phone.trim(),
          email: email.trim() ? email.trim() : null,
          address: address.trim() ? address.trim() : null,
          status,
          categoryIds: selectedCategoryIds,
        },
        !!sellerToEdit,
        sellerToEdit?.id,
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving seller');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-[#121212]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/5 px-6 py-5 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 text-black dark:bg-white/10 dark:text-white">
                <StoreIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-black dark:text-white">
                  {sellerToEdit ? 'Edit Seller' : 'Add New Seller'}
                </h3>
                <p className="text-xs text-black/50 dark:text-white/50">
                  {sellerToEdit
                    ? 'Update seller details and category associations'
                    : 'Register a supplier or brand partner'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-black/40 transition-colors hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="max-h-[75vh] space-y-5 overflow-y-auto p-6">
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-black/70 uppercase dark:text-white/70">
                  Store / Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Silks & Trends"
                  value={storeName}
                  onChange={(e) => {
                    setStoreName(e.target.value);
                  }}
                  className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-sm font-medium text-black transition-all outline-none focus:border-black focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white dark:focus:bg-[#1a1a1a]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-black/70 uppercase dark:text-white/70">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-sm font-medium text-black transition-all outline-none focus:border-black focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white dark:focus:bg-[#1a1a1a]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-black/70 uppercase dark:text-white/70">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                  className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-sm font-medium text-black transition-all outline-none focus:border-black focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white dark:focus:bg-[#1a1a1a]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-black/70 uppercase dark:text-white/70">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. contact@royalsilks.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-sm font-medium text-black transition-all outline-none focus:border-black focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white dark:focus:bg-[#1a1a1a]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-black/70 uppercase dark:text-white/70">
                Pickup / Store Address (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Unit 4, Fashion Market, Surat, Gujarat"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                className="w-full resize-none rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-sm font-medium text-black transition-all outline-none focus:border-black focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white dark:focus:bg-[#1a1a1a]"
              />
            </div>

            {/* Category Multi-select */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-bold tracking-wider text-black/70 uppercase dark:text-white/70">
                  Assigned Categories * ({selectedCategoryIds.length} selected)
                </label>
                <button
                  type="button"
                  onClick={handleSelectAllCategories}
                  className="text-xs font-semibold text-black hover:underline dark:text-white"
                >
                  {selectedCategoryIds.length === categories.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-2xl border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.02]">
                {categories.map((cat) => {
                  const isSelected = selectedCategoryIds.includes(cat.id);
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => {
                        toggleCategory(cat.id);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                        isSelected
                          ? 'border-black bg-black text-white shadow-sm dark:border-white dark:bg-white dark:text-black'
                          : 'border-black/10 bg-white text-black/70 hover:border-black/20 dark:border-white/10 dark:bg-[#181818] dark:text-white/70 dark:hover:border-white/20'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {cat.gender && (
                        <span
                          className={`rounded px-1 text-[10px] uppercase ${
                            isSelected
                              ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                              : 'bg-black/5 text-black/50 dark:bg-white/10 dark:text-white/50'
                          }`}
                        >
                          {cat.gender}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Select */}
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-black/70 uppercase dark:text-white/70">
                Seller Status
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['ACTIVE', 'INACTIVE', 'SUSPENDED'] as SellerStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setStatus(st);
                    }}
                    className={`rounded-xl border py-2.5 text-xs font-bold tracking-wider uppercase transition-all ${
                      status === st
                        ? st === 'ACTIVE'
                          ? 'border-emerald-500 bg-emerald-500 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-black'
                          : st === 'INACTIVE'
                            ? 'border-zinc-700 bg-zinc-700 text-white dark:border-zinc-300 dark:bg-zinc-300 dark:text-black'
                            : 'border-rose-500 bg-rose-500 text-white dark:border-rose-400 dark:bg-rose-400 dark:text-black'
                        : 'border-black/10 bg-transparent text-black/60 hover:bg-black/5 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/5'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-black/5 pt-4 dark:border-white/5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-black/60 transition-colors hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-black/90 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                {isSubmitting && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white dark:border-black/20 dark:border-t-black" />
                )}
                <span>{sellerToEdit ? 'Save Changes' : 'Create Seller'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
