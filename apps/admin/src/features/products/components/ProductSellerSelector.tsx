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
  onSelectSeller: (sellerId: string | null, seller?: SellerOption | null) => void;
  selectedCategory?: string; // Can be category ID or category name/slug
  categoryId?: string;
  categoryName?: string;
  initialSellerId?: string | null;
  onAddNewSeller?: () => void;
  status?: 'empty' | 'default' | 'valid' | 'error';
}

export function ProductSellerSelector({
  selectedSellerId,
  onSelectSeller,
  selectedCategory,
  categoryId,
  categoryName,
  initialSellerId,
  onAddNewSeller,
  status = 'default',
}: ProductSellerSelectorProps) {
  const activeCategory = categoryId ?? selectedCategory ?? categoryName;
  const [allSellers, setAllSellers] = useState<SellerOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch active sellers
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetch(`${API_BASE_URL}/admin/sellers`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Array<{ id: string; name: string; storeName: string; phone?: string; categories?: { id: string; name: string; slug: string }[] }>) => {
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
      })
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

  // If a category is selected, search within eligible sellers; otherwise show helpful guide
  const displayedSellers = useMemo(() => {
    const list = activeCategory ? eligibleSellers : allSellers;
    if (!search.trim()) {
      return list;
    }
    const q = search.toLowerCase();
    return list.filter(
      (s) =>
        s.storeName.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.phone?.includes(q),
    );
  }, [activeCategory, eligibleSellers, allSellers, search]);

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

  const selectedSeller = allSellers.find((s) => s.id === selectedSellerId);

  return (
    <div ref={dropdownRef} className="relative">
      <div className="flex items-center justify-between">
        <LabelWithTick label="Product Seller / Supplier" status={status} />
        {activeCategory && (
          <span className="text-[11px] font-semibold text-black/50 dark:text-white/50">
            {eligibleSellers.length} eligible
          </span>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          className="flex w-full items-center justify-between rounded-xl border border-transparent bg-black/5 px-4 py-3.5 text-sm font-medium text-black transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
        >
          <div className="flex items-center gap-2.5 truncate">
            <StoreIcon className="h-4 w-4 shrink-0 text-black/40 dark:text-white/40" />
            {selectedSeller ? (
              <span className="font-semibold text-black dark:text-white">
                {selectedSeller.storeName} ({selectedSeller.name})
              </span>
            ) : (
              <span className="text-black/40 dark:text-white/40">
                {selectedCategory
                  ? 'Select an eligible seller...'
                  : 'Select category first to filter sellers...'}
              </span>
            )}
          </div>
          <svg
            className={`h-4 w-4 shrink-0 text-black/40 transition-transform dark:text-white/40 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-2 max-h-72 w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-[#181818]">
            {/* Search within dropdown */}
            <div className="border-b border-black/5 p-2.5 dark:border-white/5">
              <div className="relative flex items-center">
                <SearchIcon className="absolute left-3 h-3.5 w-3.5 text-black/40 dark:text-white/40" />
                <input
                  type="text"
                  placeholder="Filter sellers..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  className="w-full rounded-xl border-none bg-black/5 py-1.5 pr-3 pl-8 text-xs font-medium text-black outline-none dark:bg-white/5 dark:text-white"
                />
              </div>
            </div>

            {/* Helper Notice if no category selected */}
            {!activeCategory && (
              <div className="border-b border-black/5 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
                ⚠️ Select a product category above to automatically filter suppliers approved for
                that category.
              </div>
            )}

            {/* List */}
            <div className="max-h-48 overflow-y-auto p-1">
              {/* Option: In-House / No Seller */}
              <button
                type="button"
                onClick={() => {
                  onSelectSeller(null, null);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors ${
                  !selectedSellerId
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/5'
                }`}
              >
                <span>None (Direct / Fashion Friday In-house)</span>
                {!selectedSellerId && <span>✓</span>}
              </button>

              {isLoading ? (
                <div className="p-4 text-center text-xs text-black/40 dark:text-white/40">
                  Loading suppliers...
                </div>
              ) : displayedSellers.length === 0 ? (
                <div className="p-4 text-center text-xs text-black/40 dark:text-white/40">
                  {activeCategory
                    ? 'No registered sellers for this category.'
                    : 'No sellers found.'}
                </div>
              ) : (
                displayedSellers.map((seller) => {
                  const isSelected = selectedSellerId === seller.id;
                  return (
                    <button
                      type="button"
                      key={seller.id}
                      onClick={() => {
                        onSelectSeller(seller.id, seller);
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                        isSelected
                          ? 'bg-black font-bold text-white dark:bg-white dark:text-black'
                          : 'text-black/80 hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <p className="font-semibold">{seller.storeName}</p>
                        <p className="text-[11px] opacity-70">{seller.name}</p>
                      </div>
                      {isSelected && <span className="shrink-0 font-bold">✓</span>}
                    </button>
                  );
                })
              )}
            </div>

            {/* Add New Seller Action Shortcut */}
            {onAddNewSeller && (
              <div className="border-t border-black/5 p-2 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onAddNewSeller();
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-black/5 py-2 text-xs font-bold text-black transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  <span>Register New Seller</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
