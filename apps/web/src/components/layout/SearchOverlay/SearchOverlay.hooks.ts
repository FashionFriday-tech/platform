import { useState, useEffect, useCallback } from 'react';

export interface SuggestionItem {
  label: string;
  type: 'brand' | 'category' | 'collection' | 'trend' | 'keyword';
}

const DATABASE_SUGGESTIONS: SuggestionItem[] = [
  // --- BRANDS ---
  { label: 'Nike', type: 'brand' },
  { label: 'Adidas', type: 'brand' },
  { label: 'Crocs', type: 'brand' },
  { label: 'Chrome Hearts', type: 'brand' },
  { label: 'Versace', type: 'brand' },
  { label: 'Birkenstock', type: 'brand' },
  { label: 'Stussy', type: 'brand' },
  { label: 'Puma', type: 'brand' },
  { label: 'G-Shock', type: 'brand' },

  // --- CATEGORIES ---
  { label: "Men's Sneakers", type: 'category' },
  { label: "Woment's Sneakers", type: 'category' },
  { label: "Ment's Watches", type: 'category' },
  { label: "Woment's Watches", type: 'category' },
  { label: "Ment's Cloths", type: 'category' },
  { label: "Woment's Cloths", type: 'category' },
  { label: "Ment's Shoes", type: 'category' },
  { label: "Woment's Shoes", type: 'category' },
  { label: 'Sports Wear', type: 'category' },

  // --- COLLECTIONS ---
  { label: 'Sports Wear', type: 'collection' },
  { label: 'Streat Wear', type: 'collection' },
  { label: 'Party Wear', type: 'collection' },

  // --- TRENDS ---
  { label: 'Luxury', type: 'trend' },
  { label: 'Aesthetic', type: 'trend' },
  { label: 'Premeume', type: 'trend' },
  { label: 'Old Money Style', type: 'trend' },
  { label: 'Streetwear', type: 'trend' },
  { label: 'Minimalist', type: 'trend' },

  // --- KEYWORDS / DISCOVERY ---
  { label: 'New Arrivals', type: 'keyword' },
  { label: 'Best Sellers', type: 'keyword' },
  { label: 'Gift Guide', type: 'keyword' },
  { label: 'Under ₹2999', type: 'keyword' },
  { label: 'Clearance', type: 'keyword' },
  { label: 'Budget Frendly', type: 'keyword' },
];

export const useSearchData = (storageLimit: number = 10) => {
  const [history, setHistory] = useState<string[]>([]);
  const [allSuggestions] = useState<SuggestionItem[]>(DATABASE_SUGGESTIONS);

  useEffect(() => {
    const saved = localStorage.getItem('search_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
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
        localStorage.setItem('search_history', JSON.stringify(newHistory));
        return newHistory;
      });
    },
    [storageLimit],
  );

  const removeHistoryItem = (item: string) => {
    setHistory((prev) => {
      const updated = prev.filter((i) => i !== item);
      localStorage.setItem('search_history', JSON.stringify(updated));
      return updated;
    });
  };

  return { history, allSuggestions, saveSearch, removeHistoryItem };
};
