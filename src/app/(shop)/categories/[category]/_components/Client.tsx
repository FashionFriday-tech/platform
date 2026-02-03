"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CategorySlug,
  MOCK_PRODUCTS,
  CATEGORY_FILTERS,
  filterProducts,
} from "@/data/store-data";
import brandLogos from "@/data/brandLogos";
import { RiShieldStarFill } from "react-icons/ri";
import { StoreProductCard } from "@/components/ui/cards/StoreProductCard";
import {
  ChevronDown,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  Play,
  Square,
  Zap,
} from "lucide-react";
import { MdStars } from "react-icons/md";
import { useSettings } from "@/context/SettingsContext";
import Link from "next/link";

const SORT_OPTIONS = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Best Sellers", value: "most-sold" },
  { label: "Most Popular", value: "most-liked" },
  { label: "Highest Discount", value: "most-offered" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

const COLOR_MAP: Record<string, string> = {
  Black: "#000000",
  White: "#ffffff",
  Blue: "#1d4ed8",
  Grey: "#71717a",
  Red: "#dc2626",
  Green: "#15803d",
  Gold: "#fbbf24",
};

// --- SHARED COMPONENT: FILTER CONTENT ---
function FilterContent({
  section,
  selectedOptions,
  onChange,
  maxPriceLimit,
}: any) {
  const isBrandSection = section.id === "brand";
  const isPriceSection = section.id === "priceRange";
  const isColorSection = section.id === "color";

  const currentRange = isPriceSection
    ? (selectedOptions[0] || `0-${maxPriceLimit}`).split("-")
    : [0, maxPriceLimit];
  const maxVal = currentRange[1];

  return (
    <div className="pt-2 pb-4">
      {isPriceSection && (
        <div className="px-2">
          <div className="flex justify-between mb-4">
            <span className="text-[10px] font-black text-foreground">₹0</span>
            <span className="text-[10px] font-black text-brand bg-background px-2 py-1 rounded-full uppercase">
              Under ₹{Number(maxVal).toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={maxPriceLimit}
            step="100"
            value={maxVal}
            onChange={(e) => onChange(section.id, `0-${e.target.value}`, true)}
            className="w-full h-1 bg-background-muted rounded-full appearance-none cursor-pointer accent-brand"
            style={{
              background: `linear-gradient(to right, var(--brand-primary) 0%, var(--brand-primary) ${
                (Number(maxVal) / maxPriceLimit) * 100
              }%, var(--surface-muted) ${
                (Number(maxVal) / maxPriceLimit) * 100
              }%, var(--surface-muted) 100%)`,
            }}
          />
        </div>
      )}

      {isColorSection && (
        <div className="flex flex-wrap gap-3">
          {section.options.map((color: string) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(section.id, color, false)}
              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedOptions.includes(color)
                  ? "border-brand scale-110 shadow-lg"
                  : "border-border"
              }`}
              style={{ backgroundColor: COLOR_MAP[color] || "#ccc" }}
            >
              {selectedOptions.includes(color) && (
                <Check
                  size={16}
                  className={color === "White" ? "text-black" : "text-white"}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {!isPriceSection && !isColorSection && (
        <div className="flex flex-wrap gap-2">
          {section.options.map((option: string) => {
            const isChecked = selectedOptions.includes(option);
            const brandObj = isBrandSection
              ? brandLogos.find(
                  (b) => b.name.toLowerCase() === option.toLowerCase()
                )
              : null;
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
                  <img
                    src={brandObj.logo}
                    alt=""
                    className={`w-5 object-contain transition-all scale-125 ${
                      isChecked ? "brightness-0 invert-0" : "dark:invert"
                    }`}
                  />
                )}
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function CategoryClient({
  category,
}: {
  category: CategorySlug;
}) {
  // 1. DATA PREPARATION
  const products = useMemo(() => {
    const raw = MOCK_PRODUCTS.filter((p) => p.category === category);
    return Array.from(new Map(raw.map((item) => [item.id, item])).values());
  }, [category]);

  const maxPriceLimit = useMemo(() => {
    if (products.length === 0) return 10000;
    return Math.ceil(Math.max(...products.map((p) => p.price)) / 1000) * 1000;
  }, [products]);

  // 2. STATE
  const [activeDrawer, setActiveDrawer] = useState<"filter" | "sort" | null>(
    null
  );
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    priceRange: true,
  });
  const [openSectionId, setOpenSectionId] = useState<string | null>(
    "priceRange"
  );
  const [sortBy, setSortBy] = useState("newest");
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const scrollRef = useRef<number | null>(null);

  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    priceRange: [`0-${maxPriceLimit}`],
  });
  const [stagedFilters, setStagedFilters] = useState<Record<string, string[]>>({
    priceRange: [`0-${maxPriceLimit}`],
  });

  const availableFilters = CATEGORY_FILTERS[category] || [];
  const allFilters = useMemo(
    () => [
      { id: "priceRange", label: "Budget Range", options: [] },
      ...availableFilters.filter((f) => f.id !== "gender"),
    ],
    [category, availableFilters]
  );

  // 3. AUTO SCROLL ENGINE
  const { settings } = useSettings();

  // Extract speed safely using the correct property name: 'autoScrollLevel'
  const currentScrollSpeed = useMemo(() => {
    // We use settings?.autoScrollLevel and provide a fallback (3) to avoid indexing errors
    const scrollSpeed = settings?.autoScrollLevel ?? 3;
    return scrollSpeed;
  }, [settings?.autoScrollLevel]);

  const stopAutoScroll = useCallback(() => {
    setIsAutoScrolling(false);
    if (scrollRef.current) {
      cancelAnimationFrame(scrollRef.current);
      scrollRef.current = null;
    }
  }, []);

  const toggleAutoScroll = useCallback(() => {
    if (isAutoScrolling) {
      stopAutoScroll();
      return;
    }

    setIsAutoScrolling(true);

    const scrollStep = () => {
      // Smoothly scroll by the mapped factor
      window.scrollBy({ top: currentScrollSpeed, behavior: "auto" });

      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10;

      if (isAtBottom) {
        stopAutoScroll();
        return;
      }

      scrollRef.current = requestAnimationFrame(scrollStep);
    };

    scrollRef.current = requestAnimationFrame(scrollStep);
  }, [isAutoScrolling, currentScrollSpeed, stopAutoScroll]);

  // Emergency stop on manual interaction
  useEffect(() => {
    const stopScrolling = () => {
      if (isAutoScrolling) {
        setIsAutoScrolling(false);
        if (scrollRef.current) cancelAnimationFrame(scrollRef.current);
        scrollRef.current = null;
      }
    };

    window.addEventListener("wheel", stopScrolling, { passive: true });
    window.addEventListener("touchstart", stopScrolling, { passive: true });
    window.addEventListener("mousedown", stopScrolling, { passive: true });

    return () => {
      window.removeEventListener("wheel", stopScrolling);
      window.removeEventListener("touchstart", stopScrolling);
      window.removeEventListener("mousedown", stopScrolling);
    };
  }, [isAutoScrolling]);

  // 4. FILTER/SORT LOGIC
  const handleFilterChange = (id: string, opt: string, isRange: boolean) => {
    const setter =
      activeDrawer === "filter" ? setStagedFilters : setActiveFilters;
    setter((prev) => {
      const cur = prev[id] || [];
      if (isRange) return { ...prev, [id]: [opt] };
      return cur.includes(opt)
        ? { ...prev, [id]: cur.filter((i) => i !== opt) }
        : { ...prev, [id]: [...cur, opt] };
    });
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = filterProducts(products, activeFilters);
    const sorted = [...result];
    if (sortBy === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === "most-sold")
      sorted.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    else if (sortBy === "most-liked")
      sorted.sort(
        (a, b) => (b.popularityScore || 0) - (a.popularityScore || 0)
      );
    else if (sortBy === "most-offered")
      sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    return sorted;
  }, [products, activeFilters, sortBy]);

  useEffect(() => {
    document.body.style.overflow = activeDrawer ? "hidden" : "unset";
  }, [activeDrawer]);

  return (
    <div className="bg-background min-h-screen text-foreground transition-colors duration-500">
      {/* Mobile BAR */}
      <div className="sticky lg:hidden top-16 z-30 bg-background border-y border-border">
        <div className="mx-auto flex h-12">
          <button
            onClick={() => {
              setStagedFilters(activeFilters);
              setActiveDrawer("filter");
            }}
            className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border-r border-border hover:bg-background-muted transition-all outline-none"
          >
            <SlidersHorizontal size={13} /> Filter
          </button>

          <button
            onClick={toggleAutoScroll}
            className={`flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border-r border-border transition-all outline-none ${
              isAutoScrolling ? "text-brand" : ""
            }`}
          >
            {isAutoScrolling ? (
              <Square size={12} className="fill-current" />
            ) : (
              <Play size={12} className="fill-current" />
            )}
            {isAutoScrolling ? "Scrolling" : "Auto Scroll"}
          </button>

          <button
            onClick={() => setActiveDrawer("sort")}
            className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-background-muted transition-all outline-none"
          >
            <ArrowUpDown size={13} /> Sort
          </button>
        </div>
      </div>

      <main className="container mx-auto flex gap-12">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-76 shrink-0 sticky top-26 h-[calc(100vh-100px)] overflow-y-auto no-scrollbar border-r border-border pr-6">
          <div className="sticky top-0 z-100 flex justify-between items-center mb-8 bg-background pb-2">
            <h2 className="text-xl font-black uppercase italic tracking-tighter">
              Refine
            </h2>
            <button
              onClick={() =>
                setActiveFilters({ priceRange: [`0-${maxPriceLimit}`] })
              }
              className="text-[10px] font-bold opacity-40 hover:opacity-100 uppercase tracking-widest transition-opacity"
            >
              Reset
            </button>
          </div>

          <div className="space-y-2">
            <button
              onClick={toggleAutoScroll}
              className={`w-full py-3.5 rounded-4xl flex items-center justify-center gap-3 transition-all duration-500 border ${
                isAutoScrolling
                  ? "bg-brand text-brand-foreground border-brand"
                  : "bg-background border-border"
              }`}
            >
              {isAutoScrolling ? (
                <Square size={14} fill="currentColor" />
              ) : (
                <Play size={14} fill="currentColor" />
              )}
              <span className="text-[11px] font-black uppercase tracking-widest">
                {isAutoScrolling ? "Stop" : "Start Auto-Scroll"}
              </span>
            </button>

            {allFilters.map((section) => (
              <div key={section.id} className="border-b border-border py-4">
                <button
                  onClick={() =>
                    setOpenSections((prev) => ({
                      ...prev,
                      [section.id]: !prev[section.id],
                    }))
                  }
                  className="flex w-full items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] py-2"
                >
                  <span>{section.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-500 ${
                      openSections[section.id] ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openSections[section.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <FilterContent
                        section={section}
                        selectedOptions={activeFilters[section.id] || []}
                        onChange={handleFilterChange}
                        maxPriceLimit={maxPriceLimit}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </aside>

        {/* PRODUCTS */}
        <div className="flex-1 px-4 pt-8 pb-20">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-8 lg:pt-20">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedProducts.map((product) => (
                <StoreProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </div>

          {filteredAndSortedProducts.length === 0 && (
            <div className="py-24 text-center w-full opacity-40 text-[10px] font-black uppercase tracking-widest">
              No matching items found
            </div>
          )}
        </div>
      </main>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {activeDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDrawer(null)}
              className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "tween",
                duration: 0.4,
                ease: [0.32, 0.72, 0, 1],
              }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.8 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 50 || info.velocity.y > 400)
                  setActiveDrawer(null);
              }}
              className="fixed bottom-0 left-0 right-0 z-[70] bg-background-elevated border-t border-border rounded-t-[2.5rem] max-h-[85vh] flex flex-col shadow-2xl"
            >
              <div className="w-full flex justify-center py-5 shrink-0">
                <div className="w-12 h-1 bg-border rounded-full opacity-30" />
              </div>
              <div className="px-8 overflow-y-auto no-scrollbar">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 sticky top-0 bg-background-elevated py-4 z-10 text-foreground-subtle border-b border-border/10">
                  {activeDrawer === "filter" ? "REFINE" : "SORT"}
                </h3>

                {activeDrawer === "sort" ? (
                  <div className="space-y-1">
                    {SORT_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setActiveDrawer(null);
                        }}
                        className="w-full flex items-center justify-between py-5 border-b border-border last:border-none cursor-pointer"
                      >
                        <span
                          className={`text-[11px] uppercase tracking-widest ${
                            sortBy === opt.value
                              ? "font-black text-brand"
                              : "font-bold text-foreground-subtle"
                          }`}
                        >
                          {opt.label}
                        </span>
                        {sortBy === opt.value && (
                          <div className="w-2 h-2 bg-brand rounded-full" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      {allFilters.map((section) => (
                        <div
                          key={section.id}
                          className="border-b border-border py-4"
                        >
                          <button
                            onClick={() =>
                              setOpenSectionId(
                                openSectionId === section.id ? null : section.id
                              )
                            }
                            className="flex w-full items-center justify-between text-[11px] font-black uppercase tracking-[0.15em] py-2"
                          >
                            <span>{section.label}</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${
                                openSectionId === section.id ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {openSectionId === section.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <FilterContent
                                  section={section}
                                  selectedOptions={
                                    stagedFilters[section.id] || []
                                  }
                                  onChange={handleFilterChange}
                                  maxPriceLimit={maxPriceLimit}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 sticky bottom-0 pb-4 bg-background-elevated pt-6 border-t border-border/10">
                      <button
                        onClick={() =>
                          setStagedFilters({
                            priceRange: [`0-${maxPriceLimit}`],
                          })
                        }
                        className="py-4 text-[10px] font-black uppercase tracking-widest text-foreground-subtle"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => {
                          setActiveFilters(stagedFilters);
                          setActiveDrawer(null);
                        }}
                        className="py-4 bg-brand text-brand-foreground rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl"
                      >
                        Apply
                      </button>
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
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: white;
          border: 4px solid var(--brand-primary);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}
