'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { type Product } from '@ff/schemas';

import { filterProducts } from '@/data/filter-engine';
import { useSettingsStore } from '@/store/settings-store';

interface UseCatalogueProps {
  initialProducts: Product[];
  initialFilters?: Record<string, string[]>;
}

export const useCatalogue = ({ initialProducts, initialFilters = {} }: UseCatalogueProps) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(initialFilters);
  const [sortBy, setSortBy] = useState<string>('newest');

  // --- AUTO-SCROLL ENGINE ---
  const settings = useSettingsStore((state) => state.settings);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const scrollRef = useRef<number | null>(null);

  // Use a ref for the speed so the animation loop always has the latest value
  const speedRef = useRef(settings.autoScrollLevel);

  useEffect(() => {
    speedRef.current = settings.autoScrollLevel;
  }, [settings.autoScrollLevel]);

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
      if (scrollRef.current === null) {
        return;
      }

      window.scrollBy({ top: speedRef.current, behavior: 'auto' });

      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;

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
    window.addEventListener('wheel', handleInteraction, { passive: true, capture: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true, capture: true });
    window.addEventListener('mousedown', handleInteraction, { passive: true, capture: true });
    window.addEventListener('keydown', handleInteraction, { passive: true, capture: true });

    return () => {
      window.removeEventListener('wheel', handleInteraction, true);
      window.removeEventListener('touchstart', handleInteraction, true);
      window.removeEventListener('mousedown', handleInteraction, true);
      window.removeEventListener('keydown', handleInteraction, true);
      if (scrollRef.current) {
        cancelAnimationFrame(scrollRef.current);
      }
    };
  }, [stopAutoScroll]);

  // --- FILTER & SORT LOGIC ---
  const filteredAndSortedProducts = useMemo(() => {
    const result = filterProducts(initialProducts, activeFilters);
    const sorted = [...result];

    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => (a.price?.sellingPrice ?? 0) - (b.price?.sellingPrice ?? 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.price?.sellingPrice ?? 0) - (a.price?.sellingPrice ?? 0));
        break;
      case 'newest':
        sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating?.averageRating ?? 0) - (a.rating?.averageRating ?? 0));
        break;
      case 'discount':
        sorted.sort((a, b) => {
          const discA =
            a.price?.ogPrice && a.price.ogPrice > a.price.sellingPrice
              ? (a.price.ogPrice - a.price.sellingPrice) / a.price.ogPrice
              : 0;
          const discB =
            b.price?.ogPrice && b.price.ogPrice > b.price.sellingPrice
              ? (b.price.ogPrice - b.price.sellingPrice) / b.price.ogPrice
              : 0;
          return discB - discA;
        });
        break;
      case 'popularity':
        sorted.sort((a, b) => (b.liveMatrix?.liveSold ?? 0) - (a.liveMatrix?.liveSold ?? 0));
        break;
      case 'featured':
        sorted.sort(
          (a, b) => (b.marketing?.isFeatured ? 1 : 0) - (a.marketing?.isFeatured ? 1 : 0),
        );
        break;
      default:
        // Keep initial curated order
        break;
    }
    return sorted;
  }, [initialProducts, activeFilters, sortBy]);

  const handleFilterChange = useCallback((key: string, value: string, isSingleSelect = false) => {
    setActiveFilters((prev) => {
      const currentValues = Object.prototype.hasOwnProperty.call(prev, key) ? prev[key] : [];
      if (isSingleSelect) {
        // Toggle if same value is clicked again
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
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  const removeFilterValue = useCallback((key: string, value: string) => {
    setActiveFilters((prev) => {
      const currentValues = prev[key] || [];
      const newValues = currentValues.filter((v) => v !== value);
      if (newValues.length === 0) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: newValues };
    });
  }, []);

  return {
    products: filteredAndSortedProducts,
    activeFilters,
    setActiveFilters,
    handleFilterChange,
    clearFilters,
    removeFilterValue,
    sortBy,
    setSortBy,
    totalResults: filteredAndSortedProducts.length,
    isAutoScrolling,
    toggleAutoScroll,
  };
};
