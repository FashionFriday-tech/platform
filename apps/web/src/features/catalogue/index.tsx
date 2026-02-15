'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersIcon, ArrowUpDownIcon, PlayIcon, StopIcon } from '@ff/ui';

// Data & Hook Imports
import { Product } from '@ff/schemas';
import { useCatalogue } from './hooks/use-catalogue';

// Sub-component Imports
import { CatalogueSidebar } from './components/catalogue-sidebar';
import { CatalogueGrid } from './components/catalogue-grid';

// Sort Options
const SORT_OPTIONS = [
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Most Popular', value: 'popularity' },
  { label: 'Best Sellers', value: 'most-sold' },
];

// --- UPDATED INTERFACE ---
interface CatalogueClientProps {
  gender: string; // Added: required gender string (men/women/snkrs)
  initialProducts: Product[];
  categorySlug: string;
}

// --- UPDATED FUNCTION PARAMS ---
export default function CatalogueClient({
  gender, // Destructured gender
  initialProducts,
  categorySlug,
}: CatalogueClientProps) {
  const {
    products,
    activeFilters,
    handleFilterChange,
    sortBy,
    setSortBy,
    totalResults,
    isAutoScrolling,
    toggleAutoScroll,
  } = useCatalogue({ initialProducts });

  const [activeDrawer, setActiveDrawer] = useState<'filter' | 'sort' | null>(null);

  const maxPrice = Math.max(...initialProducts.map((p) => p.price.sellingPrice), 10000);

  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-500">
      {/* --- MOBILE TOOLBAR --- */}
      <div className="bg-background border-border sticky top-16 z-30 border-y md:hidden">
        <div className="mx-auto flex h-12">
          <button
            onClick={() => setActiveDrawer('filter')}
            className="border-border hover:bg-background-muted flex flex-1 items-center justify-center gap-2 border-r text-[10px] font-black tracking-widest uppercase transition-all outline-none"
          >
            <SlidersIcon size={13} /> Filter
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
              onClick={() => setActiveDrawer('sort')}
              className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase outline-none lg:hidden"
            >
              <ArrowUpDownIcon size={13} /> Sort
            </button>

            <div className="hidden items-center gap-3 lg:flex">
              <span className="text-[10px] font-black uppercase opacity-40">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cursor-pointer bg-transparent text-[10px] font-black tracking-widest uppercase outline-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN GRID AREA --- */}
      <main className="container mx-auto flex flex-col px-4 pb-20 lg:flex-row">
        <div className="hidden w-76 shrink-0 lg:block">
          <CatalogueSidebar
            category={categorySlug}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            maxPrice={maxPrice}
          />
        </div>

        <CatalogueGrid products={products} />
      </main>

      {/* --- MOBILE DRAWERS --- */}
      <AnimatePresence>
        {activeDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDrawer(null)}
              className="bg-background/60 fixed inset-0 z-60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-background border-border fixed right-0 bottom-0 left-0 z-70 flex max-h-[85vh] flex-col rounded-t-4xl border-t"
            >
              <div className="flex w-full shrink-0 justify-center py-5">
                <div className="bg-border h-1 w-12 rounded-full opacity-30" />
              </div>

              <div className="no-scrollbar overflow-y-auto px-8 pb-10">
                <h3 className="text-foreground-subtle border-border/10 mb-6 border-b pb-4 text-[10px] font-black tracking-widest uppercase">
                  {activeDrawer === 'filter' ? 'REFINE SEARCH' : 'SORT RESULTS'}
                </h3>

                {activeDrawer === 'sort' ? (
                  <div className="space-y-1">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setActiveDrawer(null);
                        }}
                        className="border-border flex w-full items-center justify-between border-b py-5 last:border-none"
                      >
                        <span
                          className={`text-[11px] tracking-widest uppercase ${
                            sortBy === opt.value ? 'text-brand font-black' : 'font-bold opacity-60'
                          }`}
                        >
                          {opt.label}
                        </span>
                        {sortBy === opt.value && <div className="bg-brand h-2 w-2 rounded-full" />}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Re-use Sidebar content or add simplified mobile filters here */}
                    <CatalogueSidebar
                      category={categorySlug}
                      activeFilters={activeFilters}
                      onFilterChange={handleFilterChange}
                      maxPrice={maxPrice}
                    />
                    <button
                      onClick={() => setActiveDrawer(null)}
                      className="bg-foreground text-background w-full rounded-full py-4 text-[11px] font-black tracking-widest uppercase"
                    >
                      Close and View Results
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
