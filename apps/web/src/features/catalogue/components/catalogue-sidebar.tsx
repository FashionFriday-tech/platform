'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import { type Product } from '@ff/schemas';
import { ArrowUpDownIcon, ChevronDownIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { COLOR_SWATCH_MAP, extractFacets, filterProducts } from '@/data/filter-engine';
import { useBrands } from '@/features/brand';

interface SidebarProps {
  category: string;
  products?: Product[];
  activeFilters: Record<string, string[]>;
  onFilterChange?: (key: string, value: string, isSingle?: boolean) => void;
  onApplyFilters: (newFilters: Record<string, string[]>) => void;
  onClearFilters?: () => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  sortOptions?: { label: string; value: string }[];
  maxPrice: number;
  isMobileDrawer?: boolean;
}

export const CatalogueSidebar = ({
  category: _category,
  products = [],
  activeFilters,
  onApplyFilters,
  onClearFilters,
  sortBy = 'newest',
  onSortChange,
  sortOptions = [],
  maxPrice,
  isMobileDrawer = false,
}: SidebarProps) => {
  // Staged Draft State for user selection
  const [draftFilters, setDraftFilters] = useState<Record<string, string[]>>(activeFilters);
  const [draftSort, setDraftSort] = useState<string>(sortBy);

  // Synchronize when activeFilters / sortBy change from outside (e.g. top chips)
  useEffect(() => {
    setDraftFilters(activeFilters);
  }, [activeFilters]);

  useEffect(() => {
    setDraftSort(sortBy);
  }, [sortBy]);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    sort: true,
    priceRange: true,
    brand: true,
    quality: true,
    colors: true,
    sizes: true,
  });

  const { brands } = useBrands();

  const getBrandLogo = (brandName: string) => {
    const normalized = brandName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const brandFromDb = brands.find(
      (b) => b.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized,
    );
    if (brandFromDb?.logo) {
      return brandFromDb.logo;
    }
    return `/images/brand-logos/${normalized}.png`;
  };

  const [brandSearch, setBrandSearch] = useState('');

  // Extract dynamic facets & counts from available products
  const facets = useMemo(() => {
    return extractFacets(products);
  }, [products]);

  // Real-time preview count of matching products for the draft filters
  const previewMatchingProducts = useMemo(() => {
    return filterProducts(products, draftFilters);
  }, [products, draftFilters]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Draft filter toggle handler
  const handleDraftToggle = (key: string, value: string, isSingle = false) => {
    setDraftFilters((prev) => {
      const currentValues = prev[key] || [];
      if (isSingle) {
        if (currentValues[0] === value) {
          const { [key]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [key]: [value] };
      }
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      if (newValues.length === 0) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: newValues };
    });
  };

  const handleApply = () => {
    onApplyFilters(draftFilters);
    if (onSortChange && draftSort !== sortBy) {
      onSortChange(draftSort);
    }
  };

  const handleReset = () => {
    setDraftFilters({});
    onClearFilters?.();
  };

  // Helper to safely get the current max price from range string
  const getCurrentPriceValue = () => {
    const range = draftFilters?.priceRange?.[0] || `0-${maxPrice}`;
    return Number(range.split('-')[1] || maxPrice);
  };

  const totalDraftFilterCount = useMemo(() => {
    return Object.values(draftFilters).reduce((acc, curr) => acc + (curr?.length || 0), 0);
  }, [draftFilters]);

  // Only activate Apply button if editing anything after last applied fetch/state
  const hasChanges = useMemo(() => {
    if (draftSort !== sortBy) {
      return true;
    }

    const draftEntries = Object.entries(draftFilters).filter(
      ([_, v]) => Array.isArray(v) && v.length > 0,
    );
    const activeEntries = Object.entries(activeFilters).filter(
      ([_, v]) => Array.isArray(v) && v.length > 0,
    );

    if (draftEntries.length !== activeEntries.length) {
      return true;
    }

    for (const [key, draftVals] of draftEntries) {
      const activeVals = activeFilters[key] || [];
      if (draftVals.length !== activeVals.length) {
        return true;
      }
      const sortedDraft = [...draftVals].sort();
      const sortedActive = [...activeVals].sort();
      for (let i = 0; i < sortedDraft.length; i++) {
        if (sortedDraft[i] !== sortedActive[i]) {
          return true;
        }
      }
    }

    return false;
  }, [draftFilters, activeFilters, draftSort, sortBy]);

  // Filtered brands if user types in search
  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) {
      return facets.brands;
    }
    return facets.brands.filter((b) =>
      b.label.toLowerCase().includes(brandSearch.toLowerCase().trim()),
    );
  }, [facets.brands, brandSearch]);

  const pricePresets = [
    { label: 'All', range: `0-${maxPrice}` },
    { label: 'Under ₹4,000', range: '0-4000' },
    { label: '₹4K - ₹8K', range: '4000-8000' },
    { label: '₹8K+', range: `8000-${maxPrice}` },
  ];

  return (
    <aside
      className={
        isMobileDrawer
          ? 'flex h-full w-full flex-col space-y-4'
          : 'flex h-full w-full flex-col justify-between overflow-hidden'
      }
    >
      {/* 1. Fixed Header (Pinned to top of sidebar) */}
      <div className="border-border mb-3 flex shrink-0 items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-black tracking-tighter uppercase italic">Refine</h2>
          {totalDraftFilterCount > 0 && (
            <span className="bg-foreground text-background flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black">
              {totalDraftFilterCount}
            </span>
          )}
        </div>
        {totalDraftFilterCount > 0 && (
          <button
            onClick={handleReset}
            className="text-foreground-subtle text-[10px] font-black tracking-widest uppercase transition-colors hover:text-red-500"
          >
            Reset All
          </button>
        )}
      </div>

      {/* 2. Middle Scrollable Content (Isolated scroll with min-h-0 and Lenis prevention) */}
      <div
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
        className={
          isMobileDrawer
            ? 'min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1'
            : 'min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2 [scrollbar-width:thin]'
        }
      >
        {/* --- SORT BY SECTION --- */}
        {sortOptions.length > 0 && (
          <div className="border-border border-b py-3">
            <button
              onClick={() => {
                toggleSection('sort');
              }}
              className="flex w-full items-center justify-between py-1 text-[11px] font-black tracking-widest uppercase"
            >
              <span className="flex items-center gap-1.5">
                <ArrowUpDownIcon size={12} />
                Sort By
              </span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-300 ${openSections.sort ? 'rotate-180' : ''
                  }`}
              />
            </button>

            <AnimatePresence>
              {openSections.sort && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1 overflow-hidden pt-2.5 pb-2"
                >
                  {sortOptions.map((opt) => {
                    const isSelected = draftSort === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setDraftSort(opt.value);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[11px] uppercase transition-all ${isSelected
                          ? 'bg-foreground text-background font-black shadow-xs'
                          : 'text-foreground-subtle hover:bg-background-muted font-bold'
                          }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <div className="bg-background h-1.5 w-1.5 rounded-full" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* --- BUDGET RANGE SECTION --- */}
        <div className="border-border border-b py-3">
          <button
            onClick={() => {
              toggleSection('priceRange');
            }}
            className="flex w-full items-center justify-between py-1 text-[11px] font-black tracking-widest uppercase"
          >
            <span>
              Budget Range
              {draftFilters?.priceRange && (
                <span className="text-foreground ml-1.5 text-[10px] font-normal opacity-70">
                  (Up to ₹{getCurrentPriceValue().toLocaleString()})
                </span>
              )}
            </span>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-300 ${openSections.priceRange ? 'rotate-180' : ''
                }`}
            />
          </button>

          <AnimatePresence>
            {openSections.priceRange && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pt-3 pb-2"
              >
                {/* Range Slider */}
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="500"
                  value={getCurrentPriceValue()}
                  onChange={(e) => {
                    handleDraftToggle('priceRange', `0-${e.target.value}`, true);
                  }}
                  className="bg-border accent-foreground h-1.5 w-full cursor-pointer appearance-none rounded-full"
                />
                <div className="mt-2 flex justify-between text-[10px] font-black opacity-50">
                  <span>₹0</span>
                  <span>₹{getCurrentPriceValue().toLocaleString()}</span>
                </div>

                {/* Price Preset Chips */}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {pricePresets.map((preset) => {
                    const isActive = draftFilters?.priceRange?.[0] === preset.range;
                    return (
                      <button
                        key={preset.label}
                        onClick={() => {
                          handleDraftToggle('priceRange', preset.range, true);
                        }}
                        className={`rounded-full border px-2.5 py-1 text-[9px] font-black tracking-wider uppercase transition-all ${isActive
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border bg-background hover:border-foreground/40'
                          }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- BRANDS SECTION --- */}
        {facets.brands.length > 0 && (
          <div className="border-border border-b py-3">
            <button
              onClick={() => {
                toggleSection('brand');
              }}
              className="flex w-full items-center justify-between py-1 text-[11px] font-black tracking-widest uppercase"
            >
              <span>
                Brand
                {draftFilters?.brand?.length ? (
                  <span className="text-foreground ml-1 text-[10px] font-bold">
                    ({draftFilters.brand.length})
                  </span>
                ) : null}
              </span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-300 ${openSections.brand ? 'rotate-180' : ''
                  }`}
              />
            </button>

            <AnimatePresence>
              {openSections.brand && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pt-2.5 pb-2"
                >
                  {facets.brands.length > 5 && (
                    <input
                      type="text"
                      placeholder="Search brands..."
                      value={brandSearch}
                      onChange={(e) => {
                        setBrandSearch(e.target.value);
                      }}
                      className="border-border bg-background-muted placeholder:text-foreground-subtle/50 focus:border-foreground mb-2.5 w-full rounded-xl border px-3 py-1.5 text-xs outline-none"
                    />
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {filteredBrands.map((b) => {
                      const isActive =
                        draftFilters?.brand?.some(
                          (val) => val.toLowerCase() === b.value.toLowerCase(),
                        ) ?? false;
                      const logoUrl = getBrandLogo(b.label);

                      return (
                        <button
                          key={b.value}
                          onClick={() => {
                            handleDraftToggle('brand', b.value);
                          }}
                          className={`group/brand flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black tracking-wider uppercase transition-all duration-200 active:scale-95 ${isActive
                            ? 'bg-foreground text-background border-foreground shadow-md'
                            : 'bg-background border-border hover:border-foreground/40'
                            }`}
                        >
                          {logoUrl && (
                            <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                              <Image
                                src={logoUrl}
                                alt={b.label}
                                width={14}
                                height={14}
                                className={`h-full w-full object-contain ${isActive
                                  ? 'brightness-0 invert dark:brightness-100 dark:invert-0'
                                  : 'invert-0 dark:invert'
                                  }`}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </span>
                          )}
                          <span>{b.label}</span>
                          <span className="text-[9px] font-semibold opacity-60">({b.count})</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* --- QUALITY SECTION --- */}
        {facets.qualities.length > 0 && (
          <div className="border-border border-b py-3">
            <button
              onClick={() => {
                toggleSection('quality');
              }}
              className="flex w-full items-center justify-between py-1 text-[11px] font-black tracking-widest uppercase"
            >
              <span>
                Quality / Grade
                {draftFilters?.quality?.length ? (
                  <span className="text-foreground ml-1 text-[10px] font-bold">
                    ({draftFilters.quality.length})
                  </span>
                ) : null}
              </span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-300 ${openSections.quality ? 'rotate-180' : ''
                  }`}
              />
            </button>

            <AnimatePresence>
              {openSections.quality && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-wrap gap-1.5 overflow-hidden pt-2.5 pb-2"
                >
                  {facets.qualities.map((q) => {
                    const isActive =
                      draftFilters?.quality?.some(
                        (val) => val.toLowerCase() === q.value.toLowerCase(),
                      ) ?? false;
                    return (
                      <button
                        key={q.value}
                        onClick={() => {
                          handleDraftToggle('quality', q.value);
                        }}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black tracking-widest uppercase transition-all duration-200 active:scale-95 ${isActive
                          ? 'bg-foreground text-background border-foreground shadow-md'
                          : 'bg-background border-border hover:border-foreground/40'
                          }`}
                      >
                        {q.label}
                        <span className="text-[9px] opacity-60">({q.count})</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* --- COLORS SECTION --- */}
        {facets.colors.length > 0 && (
          <div className="border-border border-b py-3">
            <button
              onClick={() => {
                toggleSection('colors');
              }}
              className="flex w-full items-center justify-between py-1 text-[11px] font-black tracking-widest uppercase"
            >
              <span>
                Colors
                {draftFilters?.colors?.length ? (
                  <span className="text-foreground ml-1 text-[10px] font-bold">
                    ({draftFilters.colors.length})
                  </span>
                ) : null}
              </span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-300 ${openSections.colors ? 'rotate-180' : ''
                  }`}
              />
            </button>

            <AnimatePresence>
              {openSections.colors && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-wrap gap-1.5 overflow-hidden pt-2.5 pb-2"
                >
                  {facets.colors.map((c) => {
                    const colorKey = c.value.toLowerCase().trim();
                    const swatch = COLOR_SWATCH_MAP[colorKey];
                    const isActive =
                      draftFilters?.colors?.some((val) => val.toLowerCase() === colorKey) ?? false;

                    return (
                      <button
                        key={c.value}
                        onClick={() => {
                          handleDraftToggle('colors', c.value);
                        }}
                        className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black tracking-widest uppercase transition-all duration-200 active:scale-95 ${isActive
                          ? 'bg-foreground text-background border-foreground shadow-md'
                          : 'bg-background border-border hover:border-foreground/40'
                          }`}
                      >
                        {swatch ? (
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/20"
                            style={{
                              background: swatch.bg,
                              borderColor: swatch.border || 'rgba(0,0,0,0.15)',
                            }}
                          />
                        ) : (
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-zinc-400" />
                        )}
                        <span>{c.label}</span>
                        <span className="text-[9px] opacity-60">({c.count})</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* --- SIZES SECTION --- */}
        {facets.sizes.length > 0 && (
          <div className="border-border border-b py-3">
            <button
              onClick={() => {
                toggleSection('sizes');
              }}
              className="flex w-full items-center justify-between py-1 text-[11px] font-black tracking-widest uppercase"
            >
              <span>
                Sizes
                {draftFilters?.sizes?.length ? (
                  <span className="text-foreground ml-1 text-[10px] font-bold">
                    ({draftFilters.sizes.length})
                  </span>
                ) : null}
              </span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-300 ${openSections.sizes ? 'rotate-180' : ''
                  }`}
              />
            </button>

            <AnimatePresence>
              {openSections.sizes && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="grid grid-cols-4 gap-1.5 overflow-hidden pt-2.5 pb-2 sm:grid-cols-5"
                >
                  {facets.sizes.map((s) => {
                    const isActive =
                      draftFilters?.sizes?.some(
                        (val) => val.toLowerCase() === s.value.toLowerCase(),
                      ) ?? false;
                    return (
                      <button
                        key={s.value}
                        onClick={() => {
                          handleDraftToggle('sizes', s.value);
                        }}
                        className={`flex flex-col items-center justify-center rounded-2xl border py-1.5 text-[10px] font-black uppercase transition-all duration-200 active:scale-95 ${isActive
                          ? 'bg-foreground text-background border-foreground shadow-md'
                          : 'bg-background border-border hover:border-foreground/40'
                          }`}
                      >
                        <span>{s.label}</span>
                        <span className="text-[8px] opacity-60">({s.count})</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 3. Fixed Bottom Apply Button (outside the scrolling container) */}
      {!isMobileDrawer && (
        <div className="border-border bg-background shrink-0 border-t pt-3">
          <button
            onClick={handleApply}
            disabled={!hasChanges}
            className={`w-full rounded-2xl py-3.5 text-center text-xs font-black tracking-widest uppercase transition-all duration-300 ${hasChanges
              ? 'bg-foreground text-background hover:bg-foreground/90 cursor-pointer shadow-xl active:scale-95'
              : 'bg-foreground/10 text-foreground/30 border-border/40 cursor-not-allowed border shadow-none'
              }`}
          >
            {hasChanges
              ? `Apply Filters • (${previewMatchingProducts.length} Items)`
              : 'Filters Applied'}
          </button>
        </div>
      )}
    </aside>
  );
};
