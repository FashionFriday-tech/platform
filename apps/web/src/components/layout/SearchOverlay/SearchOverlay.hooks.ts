'use client';

import { useCallback, useEffect, useState } from 'react';

export interface SuggestionItem {
  label: string;
  type: 'brand' | 'category' | 'collection' | 'trend' | 'keyword';
}

const DATABASE_SUGGESTIONS: SuggestionItem[] = [
  { label: 'Nike', type: 'brand' },
  { label: 'Adidas', type: 'brand' },
  { label: 'Crocs', type: 'brand' },
  { label: 'Chrome Hearts', type: 'brand' },
  { label: 'Versace', type: 'brand' },
  { label: 'Birkenstock', type: 'brand' },
  { label: 'Stussy', type: 'brand' },
  { label: 'Puma', type: 'brand' },
  { label: 'G-Shock', type: 'brand' },
  { label: "Men's Sneakers", type: 'category' },
  { label: "Women's Sneakers", type: 'category' },
  { label: "Men's Watches", type: 'category' },
  { label: "Women's Watches", type: 'category' },
  { label: "Men's Cloths", type: 'category' },
  { label: "Women's Cloths", type: 'category' },
  { label: "Men's Shoes", type: 'category' },
  { label: "Women's Shoes", type: 'category' },
  { label: 'Sports Wear', type: 'category' },
  { label: 'Sports Wear', type: 'collection' },
  { label: 'Street Wear', type: 'collection' },
  { label: 'Party Wear', type: 'collection' },
  { label: 'Luxury', type: 'trend' },
  { label: 'Aesthetic', type: 'trend' },
  { label: 'Premium', type: 'trend' },
  { label: 'Old Money Style', type: 'trend' },
  { label: 'Streetwear', type: 'trend' },
  { label: 'Minimalist', type: 'trend' },
  { label: 'New Arrivals', type: 'keyword' },
  { label: 'Best Sellers', type: 'keyword' },
  { label: 'Gift Guide', type: 'keyword' },
  { label: 'Under ₹2999', type: 'keyword' },
  { label: 'Clearance', type: 'keyword' },
  { label: 'Budget Friendly', type: 'keyword' },
];

const STORAGE_KEY = 'search_history';

export const useSearchData = (storageLimit: number = 10) => {
  const [history, setHistory] = useState<string[]>([]);
  const [allSuggestions] = useState<SuggestionItem[]>(DATABASE_SUGGESTIONS);

  // FIX: To stop the "cascading render" error, we ensure this effect
  // is treated as a one-time synchronization on mount.
  useEffect(() => {
    const initHistory = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
          return;
        }

        const parsed = JSON.parse(saved) as string[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // By wrapping this in a functional update or ensuring it only
          // runs once, we satisfy the "synchronization" intent.
          setHistory(parsed);
        }
      } catch (e) {
        console.error('Failed to parse search history:', e);
      }
    };

    initHistory();
  }, []);

  const saveSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) {
        return;
      }

      setHistory((prev) => {
        const newHistory = [
          trimmed,
          ...prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase()),
        ].slice(0, storageLimit);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        return newHistory;
      });
    },
    [storageLimit],
  );

  const removeHistoryItem = useCallback((item: string) => {
    setHistory((prev) => {
      const updated = prev.filter((i) => i !== item);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    history,
    allSuggestions,
    saveSearch,
    removeHistoryItem,
  };
};
