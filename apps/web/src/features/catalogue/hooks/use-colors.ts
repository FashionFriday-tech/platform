'use client';

import { useEffect, useState } from 'react';

import { type ColorItem, getColors } from '../services/queries';

let cachedColors: ColorItem[] | null = null;
let colorsPromise: Promise<ColorItem[]> | null = null;

/**
 * Shared hook to load all available colors from the database with in-memory caching.
 */
export function useColors(initialColors?: ColorItem[]) {
  const hasInitial = Array.isArray(initialColors) && initialColors.length > 0;
  const hasCached = Array.isArray(cachedColors) && cachedColors.length > 0;

  const [colors, setColors] = useState<ColorItem[]>(() => {
    if (hasInitial) {
      return initialColors;
    }
    if (hasCached) {
      return cachedColors!;
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(!hasInitial && !hasCached);

  useEffect(() => {
    let isMounted = true;

    if (hasInitial) {
      if (typeof window !== 'undefined') {
        cachedColors = initialColors;
      }
      return;
    }

    if (hasCached) {
      setColors(cachedColors!);
      setIsLoading(false);
      return;
    }

    if (!colorsPromise) {
      colorsPromise = getColors();
    }

    colorsPromise
      .then((data) => {
        if (!isMounted) {
          return;
        }
        cachedColors = data;
        setColors(data);
      })
      .catch((err: unknown) => {
        console.error('Error in useColors:', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [hasInitial, hasCached, initialColors]);

  return { colors, isLoading };
}
