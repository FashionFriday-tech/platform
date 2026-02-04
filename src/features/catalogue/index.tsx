"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  ArrowUpDown,
  Play,
  Square,
  ChevronDown,
} from "lucide-react";

// Data & Hook Imports
import { CategorySlug, Product } from "@/data/store-data";
import { useCatalogue } from "./hooks/use-catalogue";

// Sub-component Imports
import { CatalogueSidebar } from "./components/catalogue-sidebar";
import { CatalogueGrid } from "./components/catalogue-grid";

// Sort Options for both Desktop Select and Mobile Drawer
const SORT_OPTIONS = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Most Popular", value: "popularity" },
  { label: "Best Sellers", value: "most-sold" },
];

interface CatalogueClientProps {
  type: "category" | "brand" | "search";
  title: string;
  initialProducts: Product[];
  categorySlug: CategorySlug;
}

export default function CatalogueClient({
  type,
  title,
  initialProducts,
  categorySlug,
}: CatalogueClientProps) {
  // 1. EXTRACT LOGIC FROM HOOK
  // All filtering, sorting, and auto-scroll logic is centralized here
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

  // 2. UI STATE
  const [activeDrawer, setActiveDrawer] = useState<"filter" | "sort" | null>(
    null
  );

  // Calculate max price for the budget slider
  const maxPrice = Math.max(
    ...initialProducts.map((p) => p.defaultPrice),
    10000
  );

  return (
    <div className="bg-background min-h-screen text-foreground transition-colors duration-500">
      {/* --- HEADER SECTION --- */}
      {/* <header className="pt-24 pb-12 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
          {title}<span className="text-brand">.</span>
        </h1>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
          Showing {totalResults} items optimized for your lifestyle
        </p>
      </header> */}

      {/* --- MOBILE TOOLBAR (Refine, Scroll, Sort) --- */}
      <div className="sticky md:hidden top-16 z-30 bg-background border-y border-border">
        <div className="mx-auto flex h-12">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setActiveDrawer("filter")}
            className="flex-1 flex lg:hidden items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border-r border-border hover:bg-background-muted transition-all outline-none"
          >
            <SlidersHorizontal size={13} /> Filter
          </button>

          {/* Auto Scroll Toggle (Uses Hook Logic) */}
          <button
            onClick={toggleAutoScroll}
            className={`flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border-r border-border transition-all outline-none ${
              isAutoScrolling ? "text-brand bg-brand/5" : ""
            }`}
          >
            {isAutoScrolling ? (
              <Square size={12} className="fill-current" />
            ) : (
              <Play size={12} className="fill-current" />
            )}
            {isAutoScrolling ? "Scrolling" : "Auto Scroll"}
          </button>

          {/* Sort Logic */}
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={() => setActiveDrawer("sort")}
              className="lg:hidden flex items-center gap-2 text-[10px] font-black uppercase tracking-widest outline-none"
            >
              <ArrowUpDown size={13} /> Sort
            </button>

            {/* Desktop-only Sort Select */}
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-[10px] font-black uppercase opacity-40">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
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
      <main className="container mx-auto flex flex-col lg:flex-row  pb-20 px-4">
        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:block w-76 shrink-0">
          <CatalogueSidebar
            category={categorySlug}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            maxPrice={maxPrice}
          />
        </div>

        {/* DYNAMIC PRODUCT GRID */}
        <CatalogueGrid products={products} />
      </main>

      {/* --- MOBILE DRAWERS (Framer Motion) --- */}
      <AnimatePresence>
        {activeDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDrawer(null)}
              className="fixed inset-0 z-60 bg-background/60 backdrop-blur-sm"
            />

            {/* Drawer Content */}
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
                        <span
                          className={`text-[11px] uppercase tracking-widest ${
                            sortBy === opt.value
                              ? "font-black text-brand"
                              : "font-bold opacity-60"
                          }`}
                        >
                          {opt.label}
                        </span>
                        {sortBy === opt.value && (
                          <div className="w-2 h-2 bg-brand rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  /* Mobile Filter Context */
                  <div className="space-y-6">
                    <p className="text-[10px] font-bold opacity-40 italic">
                      Mobile filtering is currently simplified. Use desktop for
                      full budget range and color refinements.
                    </p>
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
