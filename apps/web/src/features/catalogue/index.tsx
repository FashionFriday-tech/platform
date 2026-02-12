"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersIcon,
  ArrowUpDownIcon,
  PlayIcon,
  StopIcon,
} from "@ff/ui";

// Data & Hook Imports
import { Product } from "@ff/schemas";
import { useCatalogue } from "./hooks/use-catalogue";

// Sub-component Imports
import { CatalogueSidebar } from "./components/catalogue-sidebar";
import { CatalogueGrid } from "./components/catalogue-grid";

// Sort Options
const SORT_OPTIONS = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Most Popular", value: "popularity" },
  { label: "Best Sellers", value: "most-sold" },
];

// --- UPDATED INTERFACE ---
interface CatalogueClientProps {
  gender: string;          // Added: required gender string (men/women/snkrs)
  initialProducts: Product[];
  categorySlug: string;
}

// --- UPDATED FUNCTION PARAMS ---
export default function CatalogueClient({
  gender,                  // Destructured gender
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

  const [activeDrawer, setActiveDrawer] = useState<"filter" | "sort" | null>(null);

  const maxPrice = Math.max(
    ...initialProducts.map((p) => p.price.sellingPrice),
    10000
  );

  return (
    <div className="bg-background min-h-screen text-foreground transition-colors duration-500">


      {/* --- MOBILE TOOLBAR --- */}
      <div className="sticky md:hidden top-16 z-30 bg-background border-y border-border">
        <div className="mx-auto flex h-12">
          <button
            onClick={() => setActiveDrawer("filter")}
            className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border-r border-border hover:bg-background-muted transition-all outline-none"
          >
            <SlidersIcon size={13} /> Filter
          </button>

          <button
            onClick={toggleAutoScroll}
            className={`flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border-r border-border transition-all outline-none ${
              isAutoScrolling ? "text-brand bg-brand/5" : ""
            }`}
          >
            {isAutoScrolling ? (
              <StopIcon size={12} className="fill-current" />
            ) : (
              <PlayIcon size={12} className="fill-current" />
            )}
            {isAutoScrolling ? "Scrolling" : "Auto Scroll"}
          </button>

          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={() => setActiveDrawer("sort")}
              className="lg:hidden flex items-center gap-2 text-[10px] font-black uppercase tracking-widest outline-none"
            >
              <ArrowUpDownIcon size={13} /> Sort
            </button>

            <div className="hidden lg:flex items-center gap-3">
              <span className="text-[10px] font-black uppercase opacity-40">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN GRID AREA --- */}
      <main className="container mx-auto flex flex-col lg:flex-row pb-20 px-4">
        <div className="hidden lg:block w-76 shrink-0">
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
              className="fixed inset-0 z-60 bg-background/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-70 bg-background border-t border-border rounded-t-4xl max-h-[85vh] flex flex-col"
            >
              <div className="w-full flex justify-center py-5 shrink-0">
                <div className="w-12 h-1 bg-border rounded-full opacity-30" />
              </div>

              <div className="px-8 pb-10 overflow-y-auto no-scrollbar">
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 text-foreground-subtle border-b border-border/10 pb-4">
                  {activeDrawer === "filter" ? "REFINE SEARCH" : "SORT RESULTS"}
                </h3>

                {activeDrawer === "sort" ? (
                  <div className="space-y-1">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setActiveDrawer(null);
                        }}
                        className="w-full flex items-center justify-between py-5 border-b border-border last:border-none"
                      >
                        <span className={`text-[11px] uppercase tracking-widest ${
                            sortBy === opt.value ? "font-black text-brand" : "font-bold opacity-60"
                        }`}>
                          {opt.label}
                        </span>
                        {sortBy === opt.value && <div className="w-2 h-2 bg-brand rounded-full" />}
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
                      className="w-full py-4 bg-foreground text-background rounded-full font-black uppercase text-[11px] tracking-widest"
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