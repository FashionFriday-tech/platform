'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { type Product } from '@ff/schemas';

import { filterProducts } from '@/data/filter-engine';
import { useSettingsStore } from '@/store/settings-store';

import {
  clearReturningFlag,
  getCatalogueKey,
  getCatalogueState,
  isReturningToCatalogue,
  markNavigatingToProduct,
  restoreScrollPosition,
  saveCatalogueState,
} from '../services/catalogue-cache';

interface UseCatalogueProps {
  initialProducts: Product[];
  initialFilters?: Record<string, string[]>;
  categorySlug?: string;
  brandName?: string;
  collectionSlug?: string;
  isNewArrivals?: boolean;
}

export const useCatalogue = ({
  initialProducts,
  initialFilters = {},
  categorySlug,
  brandName,
  collectionSlug,
  isNewArrivals,
}: UseCatalogueProps) => {
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(initialFilters);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(
    collectionSlug ? initialProducts.length >= 100 : initialProducts.length >= 24,
  );

  const isRestoredRef = useRef(false);
  const prevCategoryKeyRef = useRef(
    `${categorySlug || ''}-${brandName || ''}-${collectionSlug || ''}-${isNewArrivals ? '1' : '0'}`,
  );

  // Restore previous catalogue state & scroll location if returning from a product detail page
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const key = getCatalogueKey();
    if (isReturningToCatalogue(key)) {
      const cached = getCatalogueState(key);
      if (cached?.products && cached.products.length > 0) {
        isRestoredRef.current = true;
        setAllProducts(cached.products);
        if (cached.activeFilters && Object.keys(cached.activeFilters).length > 0) {
          setActiveFilters(cached.activeFilters);
        }
        if (cached.sortBy) {
          setSortBy(cached.sortBy);
        }
        setHasMore(cached.hasMore);

        const cleanup = restoreScrollPosition(cached.scrollY, cached.lastClickedProductId, () => {
          clearReturningFlag();
        });

        return cleanup;
      }
    }
  }, []);

  // Sync when initialProducts or category/brand/collection props change
  useEffect(() => {
    const currentKey = `${categorySlug || ''}-${brandName || ''}-${collectionSlug || ''}-${isNewArrivals ? '1' : '0'}`;
    const categoryChanged = prevCategoryKeyRef.current !== currentKey;
    prevCategoryKeyRef.current = currentKey;

    if (categoryChanged) {
      isRestoredRef.current = false;
      setAllProducts(initialProducts);
      setHasMore(collectionSlug ? initialProducts.length >= 100 : initialProducts.length >= 24);
      return;
    }

    if (!isRestoredRef.current) {
      setAllProducts(initialProducts);
      setHasMore(collectionSlug ? initialProducts.length >= 100 : initialProducts.length >= 24);
    }
  }, [initialProducts, collectionSlug, categorySlug, brandName, isNewArrivals]);

  // Keep saved catalogue state synced as products or filters change
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const key = getCatalogueKey();
    saveCatalogueState({
      key,
      products: allProducts,
      activeFilters,
      sortBy,
      hasMore,
    });
  }, [allProducts, activeFilters, sortBy, hasMore]);

  // Passive throttled scroll listener to keep scrollY up to date
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const key = getCatalogueKey();

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          timeoutId = null;
          saveCatalogueState({
            key,
            products: allProducts,
            activeFilters,
            sortBy,
            hasMore,
            scrollY: window.scrollY,
          });
        }, 150);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [allProducts, activeFilters, sortBy, hasMore]);

  const handleProductClick = useCallback(
    (productId: string) => {
      if (typeof window === 'undefined') {
        return;
      }
      const key = getCatalogueKey();
      saveCatalogueState({
        key,
        products: allProducts,
        activeFilters,
        sortBy,
        hasMore,
        scrollY: window.scrollY,
        lastClickedProductId: productId,
      });
      markNavigatingToProduct(key, productId, window.scrollY);
    },
    [allProducts, activeFilters, sortBy, hasMore],
  );

  // Load more products dynamically
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) {
      return;
    }
    setIsLoadingMore(true);

    try {
      const skip = allProducts.length;
      const take = 24;
      const params = new URLSearchParams({
        skip: String(skip),
        take: String(take),
      });

      if (brandName) {
        params.set('brand', brandName);
      }
      if (collectionSlug) {
        params.set('collection', collectionSlug);
      }
      if (!isNewArrivals && !collectionSlug && categorySlug && categorySlug !== 'all') {
        params.set('category', categorySlug);
      }

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) {
        setHasMore(false);
        return;
      }

      const json = await res.json();
      let newItems: Product[] = json.data || [];

      // Defense-in-depth: if collectionSlug is present, strictly filter to ensure products belong to this collection
      if (collectionSlug) {
        const clean = (s?: string | null) => (s ? s.toLowerCase().replace(/[^a-z0-9]/g, '') : '');
        const target = clean(collectionSlug);
        newItems = newItems.filter((p: Product) => {
          const colList = p.marketing?.collections || [];
          return colList.some((c) => {
            if (!c) {
              return false;
            }
            return clean(c) === target || c.toLowerCase() === collectionSlug.toLowerCase();
          });
        });
      }

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setAllProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const uniqueNew = newItems.filter((p) => !existingIds.has(p.id));
          if (uniqueNew.length === 0) {
            setHasMore(false);
            return prev;
          }
          return [...prev, ...uniqueNew];
        });

        if (json.meta && typeof json.meta.hasMore === 'boolean') {
          setHasMore(json.meta.hasMore);
        } else if (newItems.length < take) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error('Failed to load more products:', err);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    isLoadingMore,
    hasMore,
    allProducts.length,
    brandName,
    collectionSlug,
    categorySlug,
    isNewArrivals,
  ]);

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
    const result = filterProducts(allProducts, activeFilters);
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
  }, [allProducts, activeFilters, sortBy]);

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
    hasMore,
    isLoadingMore,
    loadMore,
    handleProductClick,
  };
};
