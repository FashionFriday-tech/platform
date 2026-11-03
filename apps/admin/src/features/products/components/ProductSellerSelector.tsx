'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { PlusIcon, SearchIcon, StoreIcon } from '@ff/ui';

import { LabelWithTick } from './LabelWithTick';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002';

export interface SellerOption {
  id: string;
  name: string;
  storeName: string;
  phone?: string;
  categories?: { id: string; name: string; slug: string }[];
}

interface ProductSellerSelectorProps {
  selectedSellerId?: string | null;
  selectedSellerIds?: string[];
  onSelectSeller?: (sellerId: string | null, seller?: SellerOption | null) => void;
  onSelectSellers?: (sellerIds: string[], sellers: SellerOption[]) => void;
  selectedCategory?: string;
  categoryId?: string;
  categoryName?: string;
  initialSellerId?: string | null;
  onAddNewSeller?: () => void;
  status?: 'empty' | 'default' | 'valid' | 'error';
}

export function ProductSellerSelector({
  selectedSellerId,
  selectedSellerIds,
  onSelectSeller,
  onSelectSellers,
  selectedCategory,
  categoryId,
  categoryName,
  initialSellerId: _initialSellerId,
  onAddNewSeller,
  status = 'default',
}: ProductSellerSelectorProps) {
  const activeCategory = categoryId ?? selectedCategory ?? categoryName;
  const [allSellers, setAllSellers] = useState<SellerOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'category' | 'all'>('category');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Compute effective selected IDs array
  const effectiveSelectedIds = useMemo(() => {
    if (selectedSellerIds !== undefined) {
      return selectedSellerIds;
    }
    return selectedSellerId ? [selectedSellerId] : [];
  }, [selectedSellerIds, selectedSellerId]);

  // Fetch active sellers
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetch(`${API_BASE_URL}/admin/sellers`)
      .then((res) => (res.ok ? res.json() : []))
      .then(
        (
          data: {
            id: string;
            name: string;
            storeName: string;
            phone?: string;
            categories?: { id: string; name: string; slug: string }[];
          }[],
        ) => {
          if (isMounted) {
            setAllSellers(
              Array.isArray(data)
                ? data.map((s) => ({
                    id: s.id,
                    name: s.name,
                    storeName: s.storeName,
                    phone: s.phone,
                    categories: s.categories ?? [],
                  }))
                : [],
            );
            setIsLoading(false);
          }
        },
      )
      .catch((err: unknown) => {
        console.error('Failed to load sellers:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter sellers eligible for currently selected category
  const eligibleSellers = useMemo(() => {
    if (!activeCategory) {
      return [];
    }

    const catNormalized = activeCategory.trim().toLowerCase();

    return allSellers.filter((seller) => {
      if (!seller.categories || seller.categories.length === 0) {
        return false;
      }
      return seller.categories.some(
        (c) =>
          c.id === activeCategory ||
          c.slug.toLowerCase() === catNormalized ||
          c.name.toLowerCase() === catNormalized ||
          catNormalized.includes(c.name.toLowerCase()) ||
          c.name.toLowerCase().includes(catNormalized),
      );
    });
  }, [allSellers, activeCategory]);

  // Auto-switch to 'all' if active category has no specific sellers registered
  useEffect(() => {
    if (activeCategory && eligibleSellers.length === 0 && allSellers.length > 0) {
      setActiveTab('all');
    }
  }, [activeCategory, eligibleSellers.length, allSellers.length]);

  // Sellers to display based on active tab and search query
  const displayedSellers = useMemo(() => {
    const baseList =
      activeCategory && activeTab === 'category' && eligibleSellers.length > 0
        ? eligibleSellers
        : allSellers;

    if (!search.trim()) {
      return baseList;
    }
    const q = search.toLowerCase();
    return baseList.filter(
      (s) =>
        s.storeName.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.phone?.includes(q),
    );
  }, [activeCategory, activeTab, eligibleSellers, allSellers, search]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Resolved selected seller objects
  const selectedSellers = useMemo(() => {
    return effectiveSelectedIds.map((id) => {
      const found = allSellers.find((s) => s.id === id);
      return (
        found ?? {
          id,
          name: 'Supplier',
          storeName: `Supplier (${id.slice(0, 8)})`,
        }
      );
    });
  }, [allSellers, effectiveSelectedIds]);

  const handleToggleSeller = (seller: SellerOption) => {
    const isCurrentlySelected = effectiveSelectedIds.includes(seller.id);
    let nextIds: string[];
    if (isCurrentlySelected) {
      nextIds = effectiveSelectedIds.filter((id) => id !== seller.id);
    } else {
      nextIds = [...effectiveSelectedIds, seller.id];
    }

    const nextSellers = allSellers.filter((s) => nextIds.includes(s.id));
    if (onSelectSellers) {
      onSelectSellers(nextIds, nextSellers);
    } else if (onSelectSeller) {
      onSelectSeller(nextIds[0] ?? null, nextSellers[0] ?? null);
    }
  };

  const handleRemoveSeller = (sellerIdToRemove: string) => {
    const nextIds = effectiveSelectedIds.filter((id) => id !== sellerIdToRemove);
    const nextSellers = allSellers.filter((s) => nextIds.includes(s.id));
    if (onSelectSellers) {
      onSelectSellers(nextIds, nextSellers);
    } else if (onSelectSeller) {
      onSelectSeller(nextIds[0] ?? null, nextSellers[0] ?? null);
    }
  };

  const handleClearAll = () => {
    if (onSelectSellers) {
      onSelectSellers([], []);
    } else if (onSelectSeller) {
      onSelectSeller(null, null);
    }
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div className="flex items-center justify-between pb-1">
        <LabelWithTick
          label="Product Seller / Supplier"
          status={
            status !== 'default'
              ? status
              : selectedSellers.length > 0
                ? 'valid'
                : 'default'
          }
        />
        <div className="flex items-center gap-2">
          {selectedSellers.length > 0 && (
            <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-bold text-black/80 dark:bg-white/10 dark:text-white/80">
              {selectedSellers.length} selected
            </span>
          )}
          {activeCategory && eligibleSellers.length > 0 && (
            <span className="text-[11px] font-semibold text-black/50 dark:text-white/50">
              {eligibleSellers.length} category-approved
            </span>
          )}
        </div>
      </div>

      <div className="relative w-full">
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          className="flex min-h-[48px] w-full items-center justify-between rounded-xl border border-transparent bg-black/5 px-4 py-3 text-sm font-medium text-black transition-all outline-none hover:bg-black/8 focus:border-black/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/8 dark:focus:border-white/20"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2.5 truncate">
            <StoreIcon className="h-4 w-4 shrink-0 text-black/40 dark:text-white/40" />
            {selectedSellers.length === 0 ? (
              <span className="truncate text-black/40 dark:text-white/40">
                {activeCategory
                  ? 'Select suppliers (multiple allowed)...'
                  : 'Select category first to filter suppliers...'}
              </span>
            ) : selectedSellers.length === 1 ? (
              <span className="truncate font-semibold text-black dark:text-white">
                {selectedSellers[0].storeName}{' '}
                <span className="font-normal opacity-70">({selectedSellers[0].name})</span>
              </span>
            ) : (
              <span className="truncate font-semibold text-black dark:text-white">
                {selectedSellers.length} suppliers selected{' '}
                <span className="font-normal opacity-70">
                  ({selectedSellers.map((s) => s.storeName).join(', ')})
                </span>
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2 pl-2">
            {selectedSellers.length > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1.5 text-[11px] font-bold text-white dark:bg-white dark:text-black">
                {selectedSellers.length}
              </span>
            )}
            <svg
              className={`h-4 w-4 shrink-0 text-black/40 transition-transform duration-200 dark:text-white/40 ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Selected Supplier Chips */}
        {selectedSellers.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {selectedSellers.map((seller) => (
              <span
                key={seller.id}
                className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-black/5 py-1 pr-1.5 pl-2.5 text-xs font-semibold text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white"
              >
                <StoreIcon className="h-3.5 w-3.5 shrink-0 opacity-60" />
                <span className="max-w-[160px] truncate">{seller.storeName}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSeller(seller.id);
                  }}
                  className="flex h-4 w-4 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/10 hover:text-black dark:text-white/40 dark:hover:bg-white/20 dark:hover:text-white"
                  title={`Remove ${seller.storeName}`}
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}
            {selectedSellers.length > 1 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-1 text-[11px] font-bold text-red-500 transition-colors hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              >
                Clear all ({selectedSellers.length})
              </button>
            )}
          </div>
        )}

        {/* Dropdown Popup */}
        {isOpen && (
          <div className="absolute top-full z-50 mt-2 flex max-h-[32rem] w-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-[#181818]">
            {/* Search Bar */}
            <div className="shrink-0 border-b border-black/5 p-2.5 dark:border-white/5">
              <div className="relative flex items-center">
                <SearchIcon className="absolute left-3 h-3.5 w-3.5 text-black/40 dark:text-white/40" />
                <input
                  type="text"
                  placeholder="Filter suppliers by store, name or phone..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  autoFocus
                  className="w-full rounded-xl border-none bg-black/5 py-2 pr-3 pl-8 text-xs font-medium text-black outline-none placeholder:text-black/40 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40"
                />
              </div>
            </div>

            {/* Filter Tabs: Category vs All */}
            {activeCategory && (
              <div className="shrink-0 flex items-center gap-1 border-b border-black/5 bg-black/[0.02] p-1.5 dark:border-white/5 dark:bg-white/[0.02]">
                <button
                  type="button"
                  onClick={() => setActiveTab('category')}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                    activeTab === 'category'
                      ? 'bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white'
                      : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
                  }`}
                >
                  Category Approved ({eligibleSellers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                    activeTab === 'all'
                      ? 'bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white'
                      : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
                  }`}
                >
                  All Suppliers ({allSellers.length})
                </button>
              </div>
            )}

            {/* Action Bar: Direct In-house & Clear */}
            <div className="shrink-0 flex items-center justify-between border-b border-black/5 bg-zinc-50/50 px-3 py-2 dark:border-white/5 dark:bg-zinc-900/50">
              <button
                type="button"
                onClick={handleClearAll}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  selectedSellers.length === 0
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/5'
                }`}
              >
                None (In-house)
              </button>
              {selectedSellers.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-red-500 hover:underline dark:text-red-400"
                >
                  Clear all ({selectedSellers.length})
                </button>
              )}
            </div>

            {/* Scrollable List */}
            <div className="scrollbar-thin flex-1 min-h-0 overflow-y-auto p-2 space-y-1">
              {isLoading ? (
                <div className="py-8 text-center text-xs text-black/40 dark:text-white/40">
                  Loading suppliers...
                </div>
              ) : displayedSellers.length === 0 ? (
                <div className="py-8 text-center text-xs text-black/40 dark:text-white/40">
                  {activeCategory && activeTab === 'category'
                    ? 'No registered suppliers for this category. Switch to "All Suppliers" above to choose any registered supplier.'
                    : 'No suppliers match your search.'}
                </div>
              ) : (
                displayedSellers.map((seller) => {
                  const isSelected = effectiveSelectedIds.includes(seller.id);
                  return (
                    <button
                      type="button"
                      key={seller.id}
                      onClick={() => {
                        handleToggleSeller(seller);
                      }}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl p-2.5 text-left text-xs transition-colors ${
                        isSelected
                          ? 'bg-black/5 font-semibold text-black dark:bg-white/10 dark:text-white'
                          : 'text-black/80 hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2.5">
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md border transition-all ${
                            isSelected
                              ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                              : 'border-black/30 bg-transparent dark:border-white/30'
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="h-3 w-3 stroke-[3]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 truncate">
                          <p className="truncate font-bold text-zinc-900 dark:text-zinc-100">
                            {seller.storeName}
                          </p>
                          <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                            {seller.name}
                            {seller.phone ? ` • ${seller.phone}` : ''}
                          </p>
                        </div>
                      </div>
                      {isSelected ? (
                        <span className="shrink-0 rounded-md bg-black px-1.5 py-0.5 text-[10px] font-bold text-white dark:bg-white dark:text-black">
                          Selected
                        </span>
                      ) : (
                        <span className="shrink-0 text-[10px] text-black/30 opacity-0 group-hover:opacity-100 dark:text-white/30">
                          + Add
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Bar: Fixed at the bottom so it is NEVER cut off */}
            <div className="shrink-0 flex items-center justify-between border-t border-black/5 bg-zinc-50 p-2.5 dark:border-white/5 dark:bg-zinc-900">
              {onAddNewSeller ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onAddNewSeller();
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-black/5 px-3 py-2 text-xs font-bold text-black transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  <span>Register New</span>
                </button>
              ) : (
                <span className="px-2 text-[11px] font-medium text-black/50 dark:text-white/50">
                  Multiple suppliers allowed
                </span>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1.5 rounded-xl bg-black px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-black"
              >
                <span>Done</span>
                {selectedSellers.length > 0 && (
                  <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] dark:bg-black/20">
                    {selectedSellers.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
