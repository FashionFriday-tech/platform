'use client';

import { useEffect, useState } from 'react';

import { type Brand } from '@ff/schemas';

import { getBrands } from '../services/queries';

// Module-level in-memory cache & deduplication promise
let cachedBrands: Brand[] | null = null;
let brandsPromise: Promise<Brand[]> | null = null;

/**
 * Single-fetch shared hook for brand data.
 * Fetches data ONCE and reuses it across BrandScroll, ShopByBrands, and BrandsPage with 0ms re-fetch delay.
 */
export function useBrands(initialBrands?: Brand[]) {
  const hasInitial = Array.isArray(initialBrands) && initialBrands.length > 0;
  const hasCached = Array.isArray(cachedBrands) && cachedBrands.length > 0;

  const [brands, setBrands] = useState<Brand[]>(() => {
    if (hasInitial) return initialBrands as Brand[];
    if (hasCached) return cachedBrands as Brand[];
    return [];
  });
  const [isLoading, setIsLoading] = useState(!hasInitial && !hasCached);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (hasInitial) {
      if (typeof window !== 'undefined') {
        cachedBrands = initialBrands;
      }
      return;
    }

    if (hasCached) {
      setBrands(cachedBrands as Brand[]);
      setIsLoading(false);
      return;
    }

    if (!brandsPromise) {
      brandsPromise = getBrands();
    }

    brandsPromise
      .then((data) => {
        const finalData = Array.isArray(data) ? data : [];
        cachedBrands = finalData;
        if (isMounted) {
          setBrands(finalData);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        // Reset promise on error so retry is possible if needed
        brandsPromise = null;
        if (isMounted) {
          setBrands([]);
          setError(err instanceof Error ? err : new Error('Failed to load brands'));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [hasInitial, hasCached]);

  return { brands, isLoading, error };
}
