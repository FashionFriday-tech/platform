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
export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>(cachedBrands || []);
  const [isLoading, setIsLoading] = useState(!cachedBrands);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (cachedBrands) {
      setBrands(cachedBrands);
      setIsLoading(false);
      return;
    }

    if (!brandsPromise) {
      brandsPromise = getBrands();
    }

    brandsPromise
      .then((data) => {
        const finalData = data || [];
        cachedBrands = finalData;
        if (isMounted) {
          setBrands(finalData);
          setIsLoading(false);
        }
      })

      .catch((err) => {
        // Reset promise on error so retry is possible if needed
        brandsPromise = null;
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load brands'));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { brands, isLoading, error };
}

