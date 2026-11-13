'use client';

import { useEffect, useRef, useState } from 'react';

import { fetchProductsPaginated } from '../services/api';
import { type Product } from '../types';

export function useDuplicateProductCheck(productName: string, currentProductId?: string) {
  const [matches, setMatches] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // In-memory cache across typing sessions (0ms, 0 DB queries for cached terms)
  const cacheRef = useRef<Map<string, Product[]>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = productName.trim();
    if (trimmed.length < 3) {
      setMatches([]);
      setIsSearching(false);
      setIsOpen(false);
      setHasSearched(false);
      return;
    }

    const normalizedKey = trimmed.toLowerCase();

    // Check memory cache first
    if (cacheRef.current.has(normalizedKey)) {
      const cached = cacheRef.current.get(normalizedKey)!;
      const filtered = currentProductId ? cached.filter((p) => p.id !== currentProductId) : cached;
      setMatches(filtered);
      setIsSearching(false);
      setIsOpen(true);
      setHasSearched(true);
      return;
    }

    setIsSearching(true);
    setIsOpen(true);

    // Debounce: 350ms pause before firing query
    const timeoutId = setTimeout(async () => {
      // Abort any prior pending request to prevent race conditions
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const res = await fetchProductsPaginated(
          {
            search: trimmed,
          },
          { signal: controller.signal },
        );

        const data = res.data || [];
        cacheRef.current.set(normalizedKey, data);

        const filtered = currentProductId ? data.filter((p) => p.id !== currentProductId) : data;
        setMatches(filtered);
        setHasSearched(true);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.error('Duplicate product check error:', err);
        }
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [productName, currentProductId]);

  const closeBox = () => setIsOpen(false);
  const openBox = () => {
    if (productName.trim().length >= 3) {
      setIsOpen(true);
    }
  };

  return {
    matches,
    isSearching,
    isOpen,
    hasSearched,
    closeBox,
    openBox,
  };
}
