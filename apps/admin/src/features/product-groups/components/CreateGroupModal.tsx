'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { CheckIcon, PlusIcon, SearchIcon, TrashIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';

import api from '@/lib/api-client';

import { addProductsToGroup } from '../services/api';

interface SearchProductItem {
  id: string;
  name: string;
  slug: string;
  mainImage?: string;
  colors?: string[];
  sellingPrice?: number;
  totalStock?: number;
  brand?: string[];
  category?: { name: string } | null;
  modelGroup?: string | null;
}

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGroupName?: string;
  existingGroups: string[];
  onSuccess: () => Promise<void>;
}

export function CreateGroupModal({
  isOpen,
  onClose,
  initialGroupName = '',
  existingGroups = [],
  onSuccess,
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState(initialGroupName);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchResults, setSearchResults] = useState<SearchProductItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProductMap, setSelectedProductMap] = useState<Map<string, SearchProductItem>>(
    new Map(),
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setGroupName(initialGroupName);
      setSearchQuery('');
      setDebouncedSearch('');
      setSelectedProductMap(new Map());
    }
  }, [isOpen, initialGroupName]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products from catalog
  const searchCatalog = useCallback(async (query: string) => {
    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) {
        params.set('search', query.trim());
      }
      params.set('take', '100');

      const res = await api.get<{ data?: SearchProductItem[] }>(
        `/admin/products?${params.toString()}`,
      );
      setSearchResults(res?.data || []);
    } catch (err) {
      console.error('Failed to search products:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      void searchCatalog(debouncedSearch);
    }
  }, [isOpen, debouncedSearch, searchCatalog]);

  const toggleSelectProduct = (product: SearchProductItem) => {
    setSelectedProductMap((prev) => {
      const next = new Map(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.set(product.id, product);
        // If no group name has been specified yet, auto-suggest from the first selected product
        if (!groupName.trim()) {
          const auto = product.name
            .split(/\s*[-–—/|(]\s*/)[0]
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9_-]+/g, '-')
            .replace(/(^-|-$)+/g, '');
          setGroupName(auto);
        }
      }
      return next;
    });
  };

  const handleSave = async () => {
    const cleanGroup = groupName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-');

    if (!cleanGroup) {
      toast.error('Please enter a valid group name');
      return;
    }

    const selectedIds = Array.from(selectedProductMap.keys());
    if (selectedIds.length === 0) {
      toast.error('Please select at least one product to assign to this group');
      return;
    }

    setIsSaving(true);
    try {
      const res = await addProductsToGroup(cleanGroup, selectedIds);
      toast.success(
        `Added ${res.updatedCount} product${res.updatedCount === 1 ? '' : 's'} to group "${cleanGroup}"!`,
      );
      await onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to save group:', err);
      toast.error(err?.message || 'Failed to assign products to group');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const selectedCount = selectedProductMap.size;
  const isExistingGroup = existingGroups.includes(groupName.trim().toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-[#141417]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-4.5 dark:border-white/5">
          <div>
            <h3 className="text-base font-black text-black dark:text-white sm:text-lg">
              {initialGroupName ? `Add Products to "${initialGroupName}"` : 'Create Product Group'}
            </h3>
            <p className="mt-0.5 text-xs text-black/50 dark:text-white/50">
              Link products that share the same model so customers can toggle colors on the Product Detail Page.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-black/40 hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto p-6">
          {/* Group Identifier Input */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                Group Name / Model Slug
              </label>
              {groupName.trim() && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isExistingGroup
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                  }`}
                >
                  {isExistingGroup ? 'Existing Group' : 'New Group'}
                </span>
              )}
            </div>
            <input
              type="text"
              value={groupName}
              onChange={(e) =>
                setGroupName(
                  e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9_-]+/g, ''),
                )
              }
              placeholder="e.g. nike-dunk-low or classic-clog-crocs"
              className="mt-1.5 w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 font-mono text-xs font-semibold text-black lowercase transition-all outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/30"
            />
          </div>

          {/* Search Catalog Input */}
          <div>
            <label className="text-[11px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
              Search Products to Add
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <SearchIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
              </div>
              <input
                type="text"
                placeholder="Search by product name, brand, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white py-2.5 pr-4 pl-10 text-xs font-medium text-black transition-all outline-none placeholder:text-black/40 focus:border-black/30 sm:text-sm dark:border-white/10 dark:bg-[#181818] dark:text-white dark:placeholder:text-white/40 dark:focus:border-white/30"
              />
            </div>
          </div>

          {/* Selected Products Tray (if any) */}
          {selectedCount > 0 && (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/30 p-3 dark:border-emerald-500/20 dark:bg-emerald-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                  {selectedCount} Product{selectedCount === 1 ? '' : 's'} Selected
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedProductMap(new Map())}
                  className="text-[11px] font-bold text-rose-500 hover:text-rose-600"
                >
                  Clear Selection
                </button>
              </div>

              <div className="scrollbar-hide mt-2 flex gap-2 overflow-x-auto pb-1">
                {Array.from(selectedProductMap.values()).map((p) => (
                  <div
                    key={p.id}
                    className="relative flex w-20 shrink-0 flex-col items-center rounded-lg border border-black/5 bg-white p-1 text-center shadow-xs dark:border-white/5 dark:bg-[#1a1a1f]"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSelectProduct(p)}
                      title="Remove from selection"
                      className="absolute -top-1 -right-1 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs"
                    >
                      ✕
                    </button>
                    <div className="relative aspect-square w-full overflow-hidden rounded bg-black/5 dark:bg-white/5">
                      {p.mainImage ? (
                        <Image src={p.mainImage} alt={p.name} fill sizes="80px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[8px] font-bold text-black/30">
                          IMG
                        </div>
                      )}
                    </div>
                    <span className="mt-1 line-clamp-1 w-full text-[9px] font-semibold text-black dark:text-white">
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Results List */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
              Catalog Items {searchResults.length > 0 ? `(${searchResults.length})` : ''}
            </span>

            {isSearching ? (
              <div className="flex min-h-[160px] items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-black dark:border-white/10 dark:border-t-white" />
              </div>
            ) : searchResults.length === 0 ? (
              <div className="rounded-xl border border-dashed border-black/10 p-6 text-center text-xs text-black/40 dark:border-white/10 dark:text-white/40">
                No products found matching your search.
              </div>
            ) : (
              <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
                {searchResults.map((item) => {
                  const isSelected = selectedProductMap.has(item.id);
                  const isCurrentGroup =
                    item.modelGroup && item.modelGroup === groupName.trim().toLowerCase();

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleSelectProduct(item)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-2.5 transition-all ${
                        isSelected
                          ? 'border-black bg-black/5 ring-1 ring-black dark:border-white dark:bg-white/10 dark:ring-white'
                          : 'border-black/5 bg-white hover:border-black/20 hover:bg-black/[0.02] dark:border-white/5 dark:bg-[#161619] dark:hover:border-white/20'
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
                          {item.mainImage ? (
                            <Image src={item.mainImage} alt={item.name} fill sizes="44px" className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-black/30">
                              IMG
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 pr-2">
                          <p className="truncate text-xs font-bold text-black dark:text-white">{item.name}</p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[10px] text-black/50 dark:text-white/50">
                            {item.brand && item.brand.length > 0 && <span>{item.brand.join(', ')}</span>}
                            {item.category?.name && <span>• {item.category.name}</span>}
                            <span>• ₹{item.sellingPrice?.toLocaleString('en-IN') || 0}</span>
                            {item.modelGroup && (
                              <span
                                className={`rounded px-1.5 py-0.2 text-[9px] font-bold font-mono ${
                                  isCurrentGroup
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60'
                                }`}
                              >
                                {isCurrentGroup ? 'Currently in this group' : `In: ${item.modelGroup}`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all ${
                          isSelected
                            ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                            : 'border-black/20 bg-white text-transparent dark:border-white/20 dark:bg-transparent'
                        }`}
                      >
                        <CheckIcon className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-black/5 bg-gray-50/50 px-6 py-4 dark:border-white/5 dark:bg-[#111111]">
          <span className="text-xs font-semibold text-black/50 dark:text-white/50">
            {selectedCount > 0
              ? `${selectedCount} item${selectedCount === 1 ? '' : 's'} will be linked`
              : 'Select products above to add'}
          </span>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-full border border-black/10 px-4 py-2 text-xs font-bold text-black/70 hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={isSaving || !groupName.trim() || selectedCount === 0}
              className="rounded-full bg-black px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:opacity-90 disabled:opacity-40 dark:bg-white dark:text-black"
            >
              {isSaving
                ? 'Linking...'
                : selectedCount > 0
                  ? `Link ${selectedCount} Product${selectedCount === 1 ? '' : 's'} to Group`
                  : 'Select Products'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
