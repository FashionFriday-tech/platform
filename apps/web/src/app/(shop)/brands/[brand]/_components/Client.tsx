"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MOCK_PRODUCTS,
  filterProductsByBrand,
  Product,
} from "@/data/store-data";
import brandLogos from "@/data/brandLogos";
import { StoreProductCard } from "@/components/ui/cards/StoreProductCard";
import {
  ChevronDownIcon,
  SlidersIcon,
  ArrowUpDownIcon,
  CheckIcon,
  PlayIcon,
  StopIcon,
} from "@ff/ui";
import { useSettings } from "@/context/SettingsContext";

const SORT_OPTIONS = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Best Sellers", value: "most-sold" },
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
  Silver: "#C0C0C0",
  Brown: "#78350f",
};

// --- REUSED COMPONENT: FILTER CONTENT ---
function FilterContent({
  section,
  selectedOptions,
  onChange,
  maxPriceLimit,
}: any) {
  const isPrice = section.id === "priceRange";
  const isColor = section.id === "color";
  const maxVal = isPrice
    ? (selectedOptions[0] || `0-${maxPriceLimit}`).split("-")[1]
    : maxPriceLimit;

  return (
    <div className="pt-2 pb-4">
      {isPrice ? (
        <div className="px-2">
          <div className="flex justify-between mb-4">
            <span className="text-[10px] font-black uppercase">₹0</span>
            <span className="text-[10px] font-black text-brand bg-brand/5 px-2 py-1 rounded-full">
              Under ₹{Number(maxVal).toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={maxPriceLimit}
            step="500"
            value={maxVal}
            onChange={(e) => onChange(section.id, `0-${e.target.value}`, true)}
            className="w-full h-1 bg-border rounded-full appearance-none cursor-pointer accent-brand"
          />
        </div>
      ) : isColor ? (
        <div className="flex flex-wrap gap-3">
          {section.options.map((color: string) => (
            <button
              key={color}
              onClick={() => onChange(section.id, color, false)}
              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedOptions.includes(color)
                  ? "border-brand scale-110 shadow-lg"
                  : "border-border"
              }`}
              style={{ backgroundColor: COLOR_MAP[color] || "#ccc" }}
            >
              {selectedOptions.includes(color) && (
                <CheckIcon
                  size={16}
                  className={color === "White" ? "text-black" : "text-white"}
                />
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {section.options.map((opt: string) => (
            <button
              key={opt}
              onClick={() => onChange(section.id, opt, false)}
              className={`px-4 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedOptions.includes(opt)
                  ? "bg-foreground text-background border-foreground shadow-lg scale-95"
                  : "bg-background border-border"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BrandClient({ brand }: { brand: string }) {
  const { settings } = useSettings();
  const [activeDrawer, setActiveDrawer] = useState<"filter" | "sort" | null>(
    null
  );
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    priceRange: true,
  });
  const [sortBy, setSortBy] = useState("newest");
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const scrollRef = useRef<number | null>(null);

  // 1. DATA PREP
  const brandInfo = useMemo(
    () => brandLogos.find((b) => b.name.toLowerCase() === brand.toLowerCase()),
    [brand]
  );
  const baseProducts = useMemo(
    () =>
      MOCK_PRODUCTS.filter(
        (p) => p.brand.toLowerCase() === brand.toLowerCase()
      ),
    [brand]
  );

  const maxPriceLimit = useMemo(() => {
    if (baseProducts.length === 0) return 30000;
    return (
      Math.ceil(Math.max(...baseProducts.map((p) => p.price)) / 1000) * 1000
    );
  }, [baseProducts]);

  // 2. FILTER STATE
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  );
  const [stagedFilters, setStagedFilters] = useState<Record<string, string[]>>(
    {}
  );

  // Sync initial price range once data is ready
  useEffect(() => {
    const initial = { priceRange: [`0-${maxPriceLimit}`] };
    setActiveFilters(initial);
    setStagedFilters(initial);
  }, [maxPriceLimit]);

  const allFilters = useMemo(
    () => [
      { id: "priceRange", label: "Budget", options: [] },
      {
        id: "category",
        label: "Categories",
        options: Array.from(new Set(baseProducts.map((p) => p.category))),
      },
      {
        id: "color",
        label: "Colors",
        options: Array.from(
          new Set(baseProducts.map((p) => p.color).filter(Boolean))
        ),
      },
      {
        id: "quality",
        label: "Quality Grade",
        options: Array.from(new Set(baseProducts.map((p) => p.quality))),
      },
    ],
    [baseProducts]
  );

  // 3. AUTO SCROLL
  const currentSpeed = settings?.autoScrollLevel ?? 3;
  const stopScroll = useCallback(() => {
    setIsAutoScrolling(false);
    if (scrollRef.current) cancelAnimationFrame(scrollRef.current);
  }, []);

  const toggleAutoScroll = useCallback(() => {
    if (isAutoScrolling) return stopScroll();
    setIsAutoScrolling(true);
    const step = () => {
      window.scrollBy({ top: currentSpeed, behavior: "auto" });
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10
      )
        return stopScroll();
      scrollRef.current = requestAnimationFrame(step);
    };
    scrollRef.current = requestAnimationFrame(step);
  }, [isAutoScrolling, currentSpeed, stopScroll]);

  // 4. HANDLERS
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

  const finalProducts = useMemo(() => {
    // Ensure we are using the filtered brand subset first
    let result = filterProductsByBrand(MOCK_PRODUCTS, brand, activeFilters);

    // Sorting Logic
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "most-sold")
      result.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    if (sortBy === "newest")
      result.sort((a, b) => b.staticNumber - a.staticNumber);

    return result;
  }, [brand, activeFilters, sortBy]);

  return (
    <div className="bg-background min-h-screen text-foreground">
      {/* BRAND HEADER */}
      <header className="pt-32 pb-16 px-4 border-b border-border text-center">
        {brandInfo?.logo && (
          <motion.img
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            src={brandInfo.logo}
            alt=""
            className="h-12 mx-auto mb-8 dark:invert opacity-80"
          />
        )}
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
          {brand}
          <span className="text-brand">.</span>
        </h1>
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 max-w-lg mx-auto leading-relaxed">
          Authorized Dealer. Technical footwear & apparel engineered by {brand}{" "}
          for the modern explorer.
        </p>
      </header>

      {/* STICKY TOOLBAR (Mobile) */}
      <div className="sticky lg:hidden top-16 z-30 bg-background border-b border-border flex h-12">
        <button
          onClick={() => {
            setStagedFilters(activeFilters);
            setActiveDrawer("filter");
          }}
          className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase border-r border-border"
        >
          <SlidersIcon size={13} /> Filter
        </button>
        <button
          onClick={toggleAutoScroll}
          className={`flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase border-r border-border ${
            isAutoScrolling ? "text-brand" : ""
          }`}
        >
          {isAutoScrolling ? (
            <StopIcon size={12} fill="currentColor" />
          ) : (
            <PlayIcon size={12} fill="currentColor" />
          )}{" "}
          Scroll
        </button>
        <button
          onClick={() => setActiveDrawer("sort")}
          className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase"
        >
          <ArrowUpDownIcon size={13} /> Sort
        </button>
      </div>

      <main className="container mx-auto flex flex-col lg:flex-row gap-12 py-12 px-4">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-28 h-fit">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black uppercase italic tracking-tighter">
              Refine
            </h2>
            <button
              onClick={() =>
                setActiveFilters({ priceRange: [`0-${maxPriceLimit}`] })
              }
              className="text-[10px] font-bold opacity-30 hover:opacity-100 uppercase tracking-widest"
            >
              Reset
            </button>
          </div>

          <button
            onClick={toggleAutoScroll}
            className={`w-full py-4 rounded-full border mb-8 flex items-center justify-center gap-3 transition-all ${
              isAutoScrolling
                ? "bg-brand border-brand text-white"
                : "border-border"
            }`}
          >
            {isAutoScrolling ? (
              <StopIcon size={12} fill="currentColor" />
            ) : (
              <PlayIcon size={12} fill="currentColor" />
            )}
            <span className="text-[11px] font-black uppercase tracking-widest">
              Auto Scroll
            </span>
          </button>

          {allFilters.map((section) => (
            <div key={section.id} className="border-b border-border py-4">
              <button
                onClick={() =>
                  setOpenSections((p) => ({
                    ...p,
                    [section.id]: !p[section.id],
                  }))
                }
                className="flex w-full items-center justify-between text-[11px] font-black uppercase tracking-widest py-2"
              >
                {section.label}{" "}
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${
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
        </aside>

        {/* PRODUCT GRID */}
        <div className="flex-1">
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-12">
            <AnimatePresence mode="popLayout">
              {finalProducts.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <StoreProductCard product={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {finalProducts.length === 0 && (
            <div className="py-32 text-center">
              <p className="opacity-30 text-[10px] font-black uppercase tracking-widest">
                No Items Match Your Filter
              </p>
              <button
                onClick={() =>
                  setActiveFilters({ priceRange: [`0-${maxPriceLimit}`] })
                }
                className="mt-4 text-brand text-[10px] font-black uppercase underline decoration-2 underline-offset-4"
              >
                Clear All Filters
              </button>
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
              className="fixed bottom-0 left-0 right-0 z-[70] bg-background border-t border-border rounded-t-[2.5rem] max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="w-full flex justify-center py-5 shrink-0">
                <div className="w-12 h-1 bg-border rounded-full opacity-30" />
              </div>
              <div className="px-8 overflow-y-auto no-scrollbar pb-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 sticky top-0 bg-background py-4 z-10 border-b border-border/10">
                  {activeDrawer === "filter" ? "REFINE GEAR" : "SORT BY"}
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {allFilters.map((section) => (
                      <div
                        key={section.id}
                        className="border-b border-border py-4"
                      >
                        <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-40">
                          {section.label}
                        </h4>
                        <FilterContent
                          section={section}
                          selectedOptions={stagedFilters[section.id] || []}
                          onChange={handleFilterChange}
                          maxPriceLimit={maxPriceLimit}
                        />
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <button
                        onClick={() =>
                          setStagedFilters({
                            priceRange: [`0-${maxPriceLimit}`],
                          })
                        }
                        className="py-4 text-[10px] font-black uppercase tracking-widest opacity-40"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => {
                          setActiveFilters(stagedFilters);
                          setActiveDrawer(null);
                        }}
                        className="py-4 bg-brand text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl"
                      >
                        Apply Filters
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
          border: 4px solid #f6373f; /* Using a fallback brand color */
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}
