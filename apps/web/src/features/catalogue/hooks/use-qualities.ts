'use client';

import { useEffect, useState } from 'react';

import { getQualities, type QualityItem } from '../services/queries';

let cachedQualities: QualityItem[] | null = null;
let qualitiesPromise: Promise<QualityItem[]> | null = null;

/**
 * Shared hook to load all quality grades from the database with in-memory caching.
 */
export function useQualities(initialQualities?: QualityItem[]) {
  const hasInitial = Array.isArray(initialQualities) && initialQualities.length > 0;
  const hasCached = Array.isArray(cachedQualities) && cachedQualities.length > 0;

  const [qualities, setQualities] = useState<QualityItem[]>(() => {
    if (hasInitial) {
      return initialQualities;
    }
    if (hasCached) {
      return cachedQualities!;
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(!hasInitial && !hasCached);

  useEffect(() => {
    let isMounted = true;

    if (hasInitial) {
      if (typeof window !== 'undefined') {
        cachedQualities = initialQualities;
      }
      return;
    }

    if (hasCached) {
      setQualities(cachedQualities!);
      setIsLoading(false);
      return;
    }

    if (!qualitiesPromise) {
      qualitiesPromise = getQualities();
    }

    qualitiesPromise
      .then((data) => {
        if (!isMounted) {
          return;
        }
        cachedQualities = data;
        setQualities(data);
      })
      .catch((err: unknown) => {
        console.error('Error in useQualities:', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [hasInitial, hasCached, initialQualities]);

  return { qualities, isLoading };
}
