"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CategorySlug,
  MOCK_PRODUCTS,
  CATEGORY_FILTERS,
  filterProducts,
} from "@/data/store-data";
import brandLogos from "@/data/brandLogos";
import { 
  ChevronDown, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Check, 
  Play, 
  Square 
} from "lucide-react";

const SORT_OPTIONS = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Best Sellers", value: "most-sold" },
  { label: "Most Popular", value: "most-liked" },
  { label: "Highest Discount", value: "most-offered" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

const COLOR_MAP: Record<string, string> = {
  Black: "#000000", White: "#ffffff", Blue: "#1d4ed8", 
  Grey: "#71717a", Red: "#dc2626", Green: "#15803d", Gold: "#fbbf24",
};

// --- SUB-COMPONENT: FILTER SECTION ---
function FilterSection({ section, selectedOptions, onChange, isOpen, onToggle, maxPriceLimit }: any) {
  const isBrandSection = section.id === "brand";
  const isPriceSection = section.id === "priceRange";
  const isColorSection = section.id === "color";
  
  const currentRange = isPriceSection ? (selectedOptions[0] || `0-${maxPriceLimit}`).split("-") : [0, maxPriceLimit];
  const maxVal = currentRange[1];

  return (
    <div className="border-b border-border py-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-[11px] font-black uppercase tracking-[0.15em] text-foreground outline-none py-2"
      >
        <span>{section.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-4">
              {isPriceSection && (
                <div className="px-2">
                  <div className="flex justify-between mb-4">
                    <span className="text-[10px] font-black text-foreground-subtle">₹0</span>
                    <span className="text-[10px] font-black text-brand bg-brand/10 px-2 py-1 rounded-full uppercase">
                      Under ₹{Number(maxVal).toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range" min="0" max={maxPriceLimit} step="100" value={maxVal}
                    onChange={(e) => onChange(section.id, `0-${e.target.value}`, true)}
                    className="w-full h-1 bg-background-muted rounded-full appearance-none cursor-pointer accent-brand"
                    style={{ background: `linear-gradient(to right, var(--brand-primary) 0%, var(--brand-primary) ${(Number(maxVal) / maxPriceLimit) * 100}%, var(--surface-muted) ${(Number(maxVal) / maxPriceLimit) * 100}%, var(--surface-muted) 100%)` }}
                  />
                </div>
              )}

              {isColorSection && (
                <div className="flex flex-wrap gap-3">
                  {section.options.map((color: string) => (
                    <button key={color} type="button" onClick={() => onChange(section.id, color, false)}
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${selectedOptions.includes(color) ? "border-brand scale-110 shadow-lg" : "border-border"}`}
                      style={{ backgroundColor: COLOR_MAP[color] || "#ccc" }}>
                      {selectedOptions.includes(color) && <Check size={16} className={color === "White" ? "text-black" : "text-white"} />}
                    </button>
                  ))}
                </div>
              )}

              {!isPriceSection && !isColorSection && (
                <div className="flex flex-wrap gap-2">
                  {section.options.map((option: string) => {
                    const isChecked = selectedOptions.includes(option);
                    const brandObj = isBrandSection ? brandLogos.find(b => b.name.toLowerCase() === option.toLowerCase()) : null;
                    return (
                      <button
                        key={option}
                        onClick={() => onChange(section.id, option, false)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                          isChecked 
                            ? "bg-foreground text-background border-foreground shadow-xl scale-95" 
                            : "bg-background border-border text-foreground hover:border-foreground/40"
                        }`}
                      >
                        {isBrandSection && brandObj && (
                          <img src={brandObj.link} alt="" className={`w-5 object-contain transition-all scale-125 ${isChecked ? "brightness-0 invert-0" : "dark:invert"}`} />
                        )}
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function CategoryClient({ category }: { category: CategorySlug }) {
  // 1. DYNAMIC DATA PREPARATION
  const products = useMemo(() => {
    // Filter by category and Remove duplicates by ID
    const raw = MOCK_PRODUCTS.filter((p) => p.category === category);
    return Array.from(new Map(raw.map(item => [item.id, item])).values());
  }, [category]);

  // Find the absolute highest price in this category to set the slider limit
  const maxPriceLimit = useMemo(() => {
    if (products.length === 0) return 10000;
    return Math.ceil(Math.max(...products.map(p => p.price)) / 1000) * 1000;
  }, [products]);

  const [activeDrawer, setActiveDrawer] = useState<"filter" | "sort" | null>(null);
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({ 
    priceRange: [`0-${maxPriceLimit}`] 
  });
  const [stagedFilters, setStagedFilters] = useState<Record<string, string[]>>({ 
    priceRange: [`0-${maxPriceLimit}`] 
  });
  const [sortBy, setSortBy] = useState("newest");

  // Auto Scroll Engine
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const scrollRef = useRef<number | null>(null);

  const availableFilters = CATEGORY_FILTERS[category] || [];
  const allFilters = useMemo(() => [
    { id: "priceRange", label: "Budget Range", options: [] },
    ...availableFilters.filter(f => f.id !== "gender")
  ], [category, availableFilters]);

  // 2. FILTERING & SORTING EXECUTION
  const filteredAndSortedProducts = useMemo(() => {
    let result = filterProducts(products, activeFilters);
    const sorted = [...result];

    if (sortBy === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === "most-sold") sorted.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    else if (sortBy === "most-liked") sorted.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
    else if (sortBy === "most-offered") sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    
    return sorted;
  }, [products, activeFilters, sortBy]);

  // 3. AUTO SCROLL SYSTEM
  const startAutoScroll = () => {
    if (isAutoScrolling) {
      setIsAutoScrolling(false);
      if (scrollRef.current) cancelAnimationFrame(scrollRef.current);
    } else {
      setIsAutoScrolling(true);
      const scroll = () => {
        window.scrollBy(0, 3);
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
          setIsAutoScrolling(false);
          return;
        }
        scrollRef.current = requestAnimationFrame(scroll);
      };
      scrollRef.current = requestAnimationFrame(scroll);
    }
  };

  useEffect(() => {
    const handleTouch = () => {
      if (isAutoScrolling) {
        setIsAutoScrolling(false);
        if (scrollRef.current) cancelAnimationFrame(scrollRef.current);
      }
    };
    window.addEventListener("touchstart", handleTouch);
    return () => window.removeEventListener("touchstart", handleTouch);
  }, [isAutoScrolling]);

  useEffect(() => {
    document.body.style.overflow = activeDrawer ? "hidden" : "unset";
  }, [activeDrawer]);

  // Update default range if category changes
  useEffect(() => {
    setActiveFilters({ priceRange: [`0-${maxPriceLimit}`] });
    setStagedFilters({ priceRange: [`0-${maxPriceLimit}`] });
  }, [maxPriceLimit]);

  return (
    <div className="bg-background min-h-screen text-foreground transition-colors duration-500 pb-24">
      
      {/* ACTION BAR */}
      <div className="sticky top-16 z-30 bg-background border-y border-border">
        <div className="max-w-7xl mx-auto flex h-12">
          <button onClick={() => setActiveDrawer("filter")} className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border-r border-border hover:bg-background-muted transition-all outline-none">
            <SlidersHorizontal size={13} /> Filter
          </button>
          
          <button onClick={startAutoScroll} className={`flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border-r border-border transition-all outline-none ${isAutoScrolling ? 'text-brand animate-pulse' : ''}`}>
            {isAutoScrolling ? <Square size={12} fill="currentColor"/> : <Play size={12} fill="currentColor"/>}
            {isAutoScrolling ? "Scrolling" : "Auto Scroll"}
          </button>

          <button onClick={() => setActiveDrawer("sort")} className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-background-muted transition-all outline-none">
            <ArrowUpDown size={13} /> Sort
          </button>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-8">
          <AnimatePresence mode="popLayout">
            {filteredAndSortedProducts.map((product) => (
              <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={product.id} className="group cursor-pointer">
                <div className="aspect-4/5 overflow-hidden rounded-4xl bg-background-muted border border-border/50 relative shadow-sm">
                  <img src={product.image || "/images/placeholder.png"} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  {product.isSale && (
                    <span className="absolute top-3 left-3 bg-brand text-brand-foreground text-[8px] font-black px-2 py-1 rounded-full uppercase">Sale</span>
                  )}
                </div>
                <div className="mt-4 px-1 space-y-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="text-[8px] font-black text-foreground-subtle uppercase tracking-widest">{product.brand}</p>
                    <span className="text-[7px] font-bold border border-border px-1.5 py-0.5 rounded-full text-foreground-subtle uppercase">{product.quality}</span>
                  </div>
                  <h2 className="text-[11px] font-bold uppercase truncate tracking-tight text-foreground">{product.name}</h2>
                  <p className="text-[10px] font-black text-foreground">₹{product.price.toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {filteredAndSortedProducts.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">No items match your criteria</p>
          </div>
        )}
      </main>

      {/* DRAWER SYSTEM */}
      <AnimatePresence>
        {activeDrawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveDrawer(null)} className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-sm" />

            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
              drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.8 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 50 || info.velocity.y > 400) setActiveDrawer(null);
              }}
              className="fixed bottom-0 left-0 right-0 z-[70] bg-background-elevated border-t border-border rounded-t-[2.5rem] max-h-[85vh] flex flex-col shadow-2xl touch-none"
            >
              <div className="w-full flex justify-center py-5 shrink-0 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1 bg-border rounded-full opacity-30" />
              </div>

              <div className="px-8 pb-10 overflow-y-auto no-scrollbar touch-auto">
                <h3 className="text-[10px] font-black uppercase italic tracking-[0.2em] mb-6 sticky top-0 bg-background-elevated py-4 z-10 text-foreground-subtle border-b border-border/10">
                   {activeDrawer === "filter" ? "REFINE COLLECTION" : "SORT SELECTION"}
                </h3>

                {activeDrawer === "sort" ? (
                  <div className="space-y-1">
                    {SORT_OPTIONS.map((opt) => (
                      <div key={opt.value} onClick={() => { setSortBy(opt.value); setActiveDrawer(null); }} className="w-full flex items-center justify-between py-5 border-b border-border last:border-none cursor-pointer group">
                        <span className={`text-[11px] uppercase tracking-widest transition-all ${sortBy === opt.value ? 'font-black text-brand' : 'font-bold text-foreground-subtle group-hover:text-foreground'}`}>{opt.label}</span>
                        {sortBy === opt.value && <div className="w-2 h-2 bg-brand rounded-full shadow-lg shadow-brand/20" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      {allFilters.map((section) => (
                        <FilterSection
                          key={section.id}
                          section={section}
                          maxPriceLimit={maxPriceLimit}
                          isOpen={openSectionId === section.id}
                          onToggle={() => setOpenSectionId(openSectionId === section.id ? null : section.id)}
                          selectedOptions={stagedFilters[section.id] || []}
                          onChange={(id: string, opt: string, range: boolean) => setStagedFilters(prev => {
                            const cur = prev[id] || [];
                            if (range) return { ...prev, [id]: [opt] };
                            return cur.includes(opt) ? { ...prev, [id]: cur.filter(i => i !== opt) } : { ...prev, [id]: [...cur, opt] };
                          })}
                        />
                      ))}
                    </div>
                    <div className="mt-10 grid grid-cols-2 gap-4 sticky bottom-0 bg-background-elevated pt-6 border-t border-border/10">
                      <button onClick={() => { setStagedFilters({ priceRange: [`0-${maxPriceLimit}`] }); setOpenSectionId(null); }} className="py-4 text-[10px] font-black uppercase tracking-widest text-foreground-subtle">Reset All</button>
                      <button onClick={() => { setActiveFilters(stagedFilters); setActiveDrawer(null); }} className="py-4 bg-brand text-brand-foreground rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Apply Changes</button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none; height: 16px; width: 16px; border-radius: 50%;
          background: var(--brand-foreground); border: 3px solid var(--brand-primary); cursor: pointer;
        }
      `}</style>
    </div>
  );
}