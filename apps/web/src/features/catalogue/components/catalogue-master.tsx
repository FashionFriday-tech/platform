'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { type Product } from '@ff/schemas';
import { ArrowUpDownIcon, PlayIcon, SlidersIcon, StopIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { useCatalogue } from '../hooks/use-catalogue';
import { CatalogueGrid } from './catalogue-grid';
import { CatalogueSidebar } from './catalogue-sidebar';

// Sort Options
const SORT_OPTIONS = [
  { label: 'Newest Arrivals (New to Old)', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Customer Rating', value: 'rating' },
  { label: 'Biggest Discount (% Off)', value: 'discount' },
  { label: 'Best Sellers / Popular', value: 'popularity' },
  { label: 'Featured Drops', value: 'featured' },
];

interface CatalogueClientProps {
  initialProducts: Product[];
  categorySlug: string;
}

export function CatalogueClient({ initialProducts, categorySlug }: CatalogueClientProps) {
  const {
    products,
    activeFilters,
    setActiveFilters,
    handleFilterChange,
    clearFilters,
    removeFilterValue,
    sortBy,
    setSortBy,
    isAutoScrolling,
    toggleAutoScroll,
  } = useCatalogue({ initialProducts });

  const [activeDrawer, setActiveDrawer] = useState<'filter' | 'sort' | null>(null);
  const [drawerDraftFilters, setDrawerDraftFilters] =
    useState<Record<string, string[]>>(activeFilters);

  useEffect(() => {
    if (activeDrawer === 'filter') {
      setDrawerDraftFilters(activeFilters);
    }
  }, [activeDrawer, activeFilters]);

  useEffect(() => {
    if (activeDrawer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeDrawer]);

  const maxPrice = useMemo(() => {
    const prices = initialProducts.map((p: Product) => p.price?.sellingPrice ?? 0);
    return Math.max(...prices, 15000);
  }, [initialProducts]);

  const drawerDraftFilterCount = useMemo(() => {
    return Object.values(drawerDraftFilters).reduce((acc, curr) => acc + (curr?.length || 0), 0);
  }, [drawerDraftFilters]);

  const isMobileResetActive = useMemo(() => {
    return (
      drawerDraftFilterCount > 0 ||
      JSON.stringify(drawerDraftFilters) !== JSON.stringify(activeFilters)
    );
  }, [drawerDraftFilterCount, drawerDraftFilters, activeFilters]);

  const touchStartY = useRef<number | null>(null);

  const handleTopTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTopTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current !== null) {
      const diffY = e.touches[0].clientY - touchStartY.current;
      // Require intentional downward drag (touch, hold and swipe down >= 60px)
      if (diffY > 60) {
        setActiveDrawer(null);
        touchStartY.current = null;
      }
    }
  };

  const handleTopTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current !== null) {
      const touch = e.changedTouches?.[0];
      if (touch) {
        const diffY = touch.clientY - touchStartY.current;
        if (diffY > 50) {
          setActiveDrawer(null);
        }
      }
    }
    touchStartY.current = null;
  };

  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-500">
      {/* --- MOBILE TOOLBAR --- */}
      <div className="bg-background sticky top-[51px] z-30 md:hidden">
        <div className="mx-auto flex h-12">
          <button
            onClick={() => {
              setActiveDrawer('filter');
            }}
            className="border-border hover:bg-background-muted flex flex-1 items-center justify-center gap-2 border-r text-[10px] font-black tracking-widest uppercase transition-all outline-none"
          >
            <SlidersIcon size={13} />
            Filter
          </button>

          <button
            onClick={toggleAutoScroll}
            className={`border-border flex flex-1 items-center justify-center gap-2 border-r text-[10px] font-black tracking-widest uppercase transition-all outline-none ${
              isAutoScrolling ? 'text-brand bg-brand/5' : ''
            }`}
          >
            {isAutoScrolling ? (
              <StopIcon size={12} className="fill-current" />
            ) : (
              <PlayIcon size={12} className="fill-current" />
            )}
            {isAutoScrolling ? 'Scrolling' : 'Auto Scroll'}
          </button>

          <div className="flex flex-1 items-center justify-center">
            <button
              onClick={() => {
                setActiveDrawer('sort');
              }}
              className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase outline-none"
            >
              <ArrowUpDownIcon size={13} /> Sort
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN GRID AREA --- */}
      <main className="w-full max-w-none px-4 pt-2 pb-16 sm:pt-4 sm:pb-20 md:px-8 xl:px-10 2xl:px-14">
        {/* Desktop Fixed Sidebar */}
        <div className="fixed top-20 z-20 hidden h-[calc(100vh-6rem)] w-72 shrink-0 lg:flex lg:flex-col">
          <CatalogueSidebar
            category={categorySlug}
            products={initialProducts}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onApplyFilters={setActiveFilters}
            onClearFilters={clearFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={SORT_OPTIONS}
            maxPrice={maxPrice}
          />
        </div>

        {/* Product Grid & Top Bar */}
        <div className="w-full lg:pl-80">
          <CatalogueGrid
            products={products}
            activeFilters={activeFilters}
            onRemoveFilter={removeFilterValue}
            onClearFilters={clearFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={SORT_OPTIONS}
          />
        </div>
      </main>

      {/* --- MOBILE DRAWERS --- */}
      <AnimatePresence>
        {activeDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setActiveDrawer(null);
              }}
              className="bg-background/80 fixed inset-0 z-60 backdrop-blur-md"
            />

            {/* Bottom Slide-Up Sheet - Docked cleanly on top of the bottom navigation bar */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="bg-background border-border fixed right-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] left-0 z-70 flex max-h-[82vh] flex-col rounded-t-[2rem] border-t shadow-2xl lg:bottom-0"
            >
              {/* Drag Handle - Only swipe down to close; do not close on click/tap */}
              <div
                onTouchStart={handleTopTouchStart}
                onTouchMove={handleTopTouchMove}
                onTouchEnd={handleTopTouchEnd}
                className="flex w-full shrink-0 justify-center py-3.5 transition-opacity select-none"
                aria-label="Filter drawer handle"
              >
                <div className="bg-border h-1.5 w-12 -skew-x-[12deg] rounded-xs opacity-60" />
              </div>

              {/* Drawer Header */}
              <div
                onTouchStart={handleTopTouchStart}
                onTouchMove={handleTopTouchMove}
                onTouchEnd={handleTopTouchEnd}
                className="border-border flex items-center justify-between border-b px-4 pb-3 select-none"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black tracking-widest uppercase">
                    {activeDrawer === 'filter' ? 'Refine Results' : 'Sort Products'}
                  </h3>
                  {activeDrawer === 'filter' && drawerDraftFilterCount > 0 && (
                    <span className="flex h-5 min-w-[20px] -skew-x-[12deg] items-center justify-center rounded-xs bg-white px-1.5 text-[10px] font-black text-black shadow-xs">
                      <span className="skew-x-[12deg]">{drawerDraftFilterCount}</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setActiveDrawer(null);
                  }}
                  className="border-border hover:bg-background-muted flex h-8 w-8 -skew-x-[12deg] items-center justify-center rounded-sm border text-xs font-bold transition-all active:scale-95"
                >
                  <span className="skew-x-[12deg]">✕</span>
                </button>
              </div>

              {/* Drawer Scrollable Body with Lenis scroll prevention */}
              <div
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                data-lenis-prevent-touch="true"
                className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-3 py-3"
              >
                {activeDrawer === 'sort' ? (
                  <div className="space-y-2 pb-6">
                    {SORT_OPTIONS.map((opt) => {
                      const isSelected = sortBy === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSortBy(opt.value);
                            setActiveDrawer(null);
                          }}
                          className={`flex w-full -skew-x-[12deg] items-center justify-between rounded-sm border px-3.5 py-3 text-left transition-all active:scale-98 ${
                            isSelected
                              ? 'bg-foreground text-background border-foreground font-black shadow-md'
                              : 'border-border bg-background hover:border-foreground/40 text-foreground-subtle font-bold'
                          }`}
                        >
                          <div className="flex w-full skew-x-[12deg] items-center justify-between">
                            <span
                              className={`text-[11px] tracking-wider uppercase ${
                                isSelected
                                  ? 'text-background font-black'
                                  : 'text-foreground-subtle font-semibold'
                              }`}
                            >
                              {opt.label}
                            </span>
                            {isSelected && (
                              <div className="bg-background h-2 w-2 -skew-x-[12deg] rounded-xs" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <CatalogueSidebar
                      category={categorySlug}
                      products={initialProducts}
                      activeFilters={activeFilters}
                      onFilterChange={handleFilterChange}
                      onApplyFilters={(newFilters) => {
                        setActiveFilters(newFilters);
                        setActiveDrawer(null);
                      }}
                      onDraftFiltersChange={setDrawerDraftFilters}
                      onClearFilters={clearFilters}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                      sortOptions={SORT_OPTIONS}
                      maxPrice={maxPrice}
                      isMobileDrawer={true}
                    />
                  </div>
                )}
              </div>

              {/* --- STICKY BOTTOM CONFIRMATION BAR (Mobile) - Fixed right on top of bottom menu box --- */}
              {activeDrawer === 'filter' && (
                <div className="bg-background/95 border-border shrink-0 border-t px-3 py-3 backdrop-blur-md">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => {
                        if (!isMobileResetActive) return;
                        clearFilters();
                        setDrawerDraftFilters({});
                      }}
                      disabled={!isMobileResetActive}
                      className={`flex-1 -skew-x-[12deg] rounded-sm border py-3 text-center text-[10px] font-black tracking-widest uppercase transition-all duration-200 ${
                        isMobileResetActive
                          ? 'cursor-pointer border-white bg-white/10 text-white shadow-md hover:bg-white/20 active:scale-95'
                          : 'cursor-not-allowed border-zinc-800 bg-transparent text-zinc-500 opacity-60 dark:border-zinc-800 dark:text-zinc-500'
                      }`}
                    >
                      <span className="block skew-x-[12deg]">Reset All</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveFilters(drawerDraftFilters);
                        setActiveDrawer(null);
                      }}
                      className="bg-foreground text-background hover:bg-foreground/90 flex-[2] -skew-x-[12deg] rounded-sm py-3 text-center text-[10px] font-black tracking-widest uppercase shadow-lg transition-all active:scale-95"
                    >
                      <span className="block skew-x-[12deg]">Apply Filters</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
