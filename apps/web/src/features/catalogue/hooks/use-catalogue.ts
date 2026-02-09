import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Product} from "@ff/types";
import { filterProducts } from "@/data/filter-engine";
import { useSettings } from "@/context/SettingsContext";

interface UseCatalogueProps {
  initialProducts: Product[];
  initialFilters?: Record<string, string[]>;
}

export const useCatalogue = ({ initialProducts, initialFilters = {} }: UseCatalogueProps) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(initialFilters);
  const [sortBy, setSortBy] = useState<string>("newest");

  // --- AUTO-SCROLL ENGINE ---
  const { settings } = useSettings();
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const scrollRef = useRef<number | null>(null);
  
  // Use a ref for the speed so the animation loop always has the latest value
  const speedRef = useRef(settings?.autoScrollLevel ?? 3);
  
  useEffect(() => {
    speedRef.current = settings?.autoScrollLevel ?? 3;
  }, [settings?.autoScrollLevel]);

  // STOPS THE SCROLL: Immediately cancels the frame and resets state
  const stopAutoScroll = useCallback(() => {
    if (scrollRef.current !== null) {
      cancelAnimationFrame(scrollRef.current);
      scrollRef.current = null;
    }
    setIsAutoScrolling(false);
  }, []);

  // START/TOGGLE LOGIC
  const toggleAutoScroll = useCallback(() => {
    if (isAutoScrolling) {
      stopAutoScroll();
      return;
    }

    setIsAutoScrolling(true);

    const scrollStep = () => {
      // If the state was set to false, do not schedule next frame
      if (scrollRef.current === null) return;

      window.scrollBy({ top: speedRef.current, behavior: "auto" });

      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10;

      if (isAtBottom) {
        stopAutoScroll();
      } else {
        scrollRef.current = requestAnimationFrame(scrollStep);
      }
    };

    // Initialize the first frame
    scrollRef.current = requestAnimationFrame(scrollStep);
  }, [isAutoScrolling, stopAutoScroll]);

  // FIX: Detect any user interaction to kill the scroll immediately
  useEffect(() => {
    const handleInteraction = () => {
      // Check if a frame is currently scheduled
      if (scrollRef.current !== null) {
        stopAutoScroll();
      }
    };

    // Capture phase listeners (true) ensure we catch the event before other logic
    window.addEventListener("wheel", handleInteraction, { passive: true, capture: true });
    window.addEventListener("touchstart", handleInteraction, { passive: true, capture: true });
    window.addEventListener("mousedown", handleInteraction, { passive: true, capture: true });
    window.addEventListener("keydown", handleInteraction, { passive: true, capture: true });

    return () => {
      window.removeEventListener("wheel", handleInteraction, true);
      window.removeEventListener("touchstart", handleInteraction, true);
      window.removeEventListener("mousedown", handleInteraction, true);
      window.removeEventListener("keydown", handleInteraction, true);
      if (scrollRef.current) cancelAnimationFrame(scrollRef.current);
    };
  }, [stopAutoScroll]);

  // --- FILTER & SORT LOGIC ---
  const filteredAndSortedProducts = useMemo(() => {
    let result = filterProducts(initialProducts, activeFilters);
    const sorted = [...result];
    switch (sortBy) {
      case "price-asc": sorted.sort((a, b) => a.price.sellingPrice - b.price.sellingPrice); break;
      case "price-desc": sorted.sort((a, b) => b.price.sellingPrice - a.price.sellingPrice); break;
      // case "most-sold": sorted.sort((a, b) => b.salesCount - a.salesCount); break;
      // case "popularity": sorted.sort((a, b) => b.popularityScore - a.popularityScore); break;
      // default: sorted.sort((a, b) => b.staticNumber - a.staticNumber);
    }
    return sorted;
  }, [initialProducts, activeFilters, sortBy]);

  const handleFilterChange = (key: string, value: string, isSingleSelect: boolean = false) => {
    setActiveFilters((prev) => {
      const currentValues = prev[key] || [];
      if (isSingleSelect) return { ...prev, [key]: [value] };
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [key]: newValues };
    });
  };

  return {
    products: filteredAndSortedProducts,
    activeFilters,
    handleFilterChange,
    sortBy,
    setSortBy,
    totalResults: filteredAndSortedProducts.length,
    isAutoScrolling,
    toggleAutoScroll,
  };
};