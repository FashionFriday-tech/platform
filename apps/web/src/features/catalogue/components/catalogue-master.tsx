'use client';

import { useMemo, useState } from 'react';

import { type Product } from '@ff/schemas';
import { ArrowUpDownIcon, PlayIcon, SlidersIcon, StopIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { useCatalogue } from '../hooks/use-catalogue';
import { CatalogueGrid } from './catalogue-grid';
import { CatalogueSidebar } from './catalogue-sidebar';

// Sort Options
export const SORT_OPTIONS = [
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

  const maxPrice = useMemo(() => {
    const prices = initialProducts.map((p: Product) => p.price?.sellingPrice ?? 0);
    return Math.max(...prices, 15000);
  }, [initialProducts]);

  const activeFilterCount = useMemo(() => {
    return Object.values(activeFilters).reduce((acc, curr) => acc + (curr?.length || 0), 0);
  }, [activeFilters]);

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
            {activeFilterCount > 0 && (
              <span className="bg-foreground text-background flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black">
                {activeFilterCount}
              </span>
            )}
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
      <main className="w-full max-w-none px-4 pt-4 pb-20 md:px-8 xl:px-10 2xl:px-14">
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

            {/* Bottom Slide-Up Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="bg-background border-border fixed right-0 bottom-0 left-0 z-70 flex max-h-[90vh] flex-col rounded-t-[2.5rem] border-t shadow-2xl"
            >
              {/* Drag Handle */}
              <div className="flex w-full shrink-0 justify-center py-4">
                <div className="bg-border h-1.5 w-12 rounded-full opacity-50" />
              </div>

              {/* Drawer Header */}
              <div className="border-border flex items-center justify-between border-b px-6 pb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black tracking-widest uppercase">
                    {activeDrawer === 'filter' ? 'Refine Results' : 'Sort Products'}
                  </h3>
                  {activeDrawer === 'filter' && activeFilterCount > 0 && (
                    <span className="bg-foreground text-background flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black">
                      {activeFilterCount}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setActiveDrawer(null);
                  }}
                  className="border-border hover:bg-background-muted flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Scrollable Body with Lenis scroll prevention */}
              <div
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                data-lenis-prevent-touch="true"
                className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-6 py-4"
              >
                {activeDrawer === 'sort' ? (
                  <div className="space-y-1 pb-10">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setActiveDrawer(null);
                        }}
                        className="border-border flex w-full items-center justify-between border-b py-4.5 last:border-none"
                      >
                        <span
                          className={`text-xs tracking-wider uppercase ${
                            sortBy === opt.value
                              ? 'text-foreground font-black'
                              : 'text-foreground-subtle font-medium'
                          }`}
                        >
                          {opt.label}
                        </span>
                        {sortBy === opt.value && (
                          <div className="bg-foreground h-2.5 w-2.5 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <CatalogueSidebar
                      category={categorySlug}
                      products={initialProducts}
                      activeFilters={activeFilters}
                      onFilterChange={handleFilterChange}
                      onApplyFilters={(newFilters) => {
                        setActiveFilters(newFilters);
                        setActiveDrawer(null);
                      }}
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

              {/* --- STICKY BOTTOM CONFIRMATION BAR (Mobile) --- */}
              {activeDrawer === 'filter' && (
                <div className="bg-background/95 border-border shrink-0 border-t p-4 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    {activeFilterCount > 0 && (
                      <button
                        onClick={() => {
                          clearFilters();
                        }}
                        className="border-border text-foreground-subtle hover:text-foreground flex-1 rounded-full border py-3.5 text-center text-[10px] font-black tracking-widest uppercase transition-colors"
                      >
                        Reset All
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setActiveDrawer(null);
                      }}
                      className="bg-foreground text-background flex-[2] rounded-full py-3.5 text-center text-[10px] font-black tracking-widest uppercase shadow-lg transition-transform active:scale-95"
                    >
                      Apply Filters • View {products.length}{' '}
                      {products.length === 1 ? 'Item' : 'Items'}
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
