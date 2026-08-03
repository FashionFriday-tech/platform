'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ProductSuggestion {
  id: string;
  name: string;
  slug: string;
  mainImage: string;
  sellingPrice: number;
  brand: string[];
}

export interface BrandSuggestion {
  name: string;
  slug: string;
}

export interface CategorySuggestion {
  name: string;
  slug: string;
}

export interface SearchSuggestionsData {
  brands: BrandSuggestion[];
  categories: CategorySuggestion[];
  products: ProductSuggestion[];
  popular?: string[];
  didYouMean?: string;
}

const STORAGE_KEY = 'search_history';

export const useSearchHistory = (storageLimit = 10) => {
  const [history, setHistory] = useState<string[]>([]);
  const lastLoggedQueryRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return;
      }
      const parsed = JSON.parse(saved) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setHistory(parsed);
        if (parsed[0]) {
          lastLoggedQueryRef.current = parsed[0];
        }
      }
    } catch {
      // Silent catch
    }
  }, []);

  const saveSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) {
        return;
      }

      // Do not store duplicate search input if searched multiple times
      if (lastLoggedQueryRef.current?.toLowerCase() === trimmed.toLowerCase()) {
        return;
      }
      lastLoggedQueryRef.current = trimmed;

      setHistory((prev) => {
        if (prev.length > 0 && prev[0].toLowerCase() === trimmed.toLowerCase()) {
          return prev;
        }

        const newHistory = [
          trimmed,
          ...prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase()),
        ].slice(0, storageLimit);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        return newHistory;
      });

      // Fire-and-forget: log to backend for analytics
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002';
      const token =
        typeof window !== 'undefined'
          ? (localStorage.getItem('accessToken') ?? undefined)
          : undefined;
      fetch(`${API_URL}/search-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ query: trimmed }),
      }).catch(() => {
        // Silent — logging should never break the UI
      });
    },
    [storageLimit],
  );

  const removeHistoryItem = useCallback((item: string) => {
    setHistory((prev) => {
      const updated = prev.filter((i) => i.toLowerCase() !== item.toLowerCase());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearAllHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    history,
    saveSearch,
    removeHistoryItem,
    clearAllHistory,
  };
};

const suggestionsCache = new Map<string, SearchSuggestionsData>();

export const useLiveSearchSuggestions = (query: string) => {
  const [data, setData] = useState<SearchSuggestionsData>({
    brands: [],
    categories: [],
    products: [],
  });
  const [popularSearches, setPopularSearches] = useState<string[]>([
    'New Arrivals',
    'Nike',
    'Adidas',
    'Sneakers',
    'Watches',
    'Streetwear',
    'Best Sellers',
    'Jordan',
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const activeAbortRef = useRef<AbortController | null>(null);

  // Fetch dynamic popular suggestions from DB once on mount
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';
        const res = await fetch(`${API_URL}/products/search/suggestions`);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.popular) && json.popular.length > 0) {
            setPopularSearches(json.popular);
          }
        }
      } catch {
        // Fallback to initial defaults
      }
    };
    void fetchPopular();
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    // Do not trigger network request for 0 or 1 character
    if (trimmed.length < 2) {
      setData({ brands: [], categories: [], products: [] });
      setIsLoading(false);
      return;
    }

    const cacheKey = trimmed.toLowerCase();
    // Instant response from client cache if already queried
    if (suggestionsCache.has(cacheKey)) {
      setData(suggestionsCache.get(cacheKey)!);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    if (activeAbortRef.current) {
      activeAbortRef.current.abort();
    }

    const controller = new AbortController();
    activeAbortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';
        const res = await fetch(
          `${API_URL}/products/search/suggestions?q=${encodeURIComponent(trimmed)}`,
          {
            signal: controller.signal,
          },
        );

        if (!res.ok) {
          setData({ brands: [], categories: [], products: [] });
          return;
        }

        const json = await res.json();
        const result: SearchSuggestionsData = {
          brands: Array.isArray(json.brands) ? json.brands : [],
          categories: Array.isArray(json.categories) ? json.categories : [],
          products: Array.isArray(json.products) ? json.products : [],
          didYouMean: json.didYouMean,
        };

        suggestionsCache.set(cacheKey, result);
        setData(result);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setData({ brands: [], categories: [], products: [] });
        }
      } finally {
        setIsLoading(false);
      }
    }, 350); // 350ms debounce for optimal typing scale

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return {
    ...data,
    popularSearches,
    isLoading,
  };
};
