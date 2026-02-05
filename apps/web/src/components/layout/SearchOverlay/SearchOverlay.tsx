"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TfiClose } from "react-icons/tfi";
import { useSearchData } from "./SearchOverlay.hooks";

// Sub-components
import { SearchInput } from "./SearchInput";
import { RecentSearches } from "./RecentSearches";
import { QuickDiscovery } from "./QuickDiscovery";

export const SearchOverlay: React.FC<{
  isSearchOpen: boolean;
  setIsSearchOpen: (v: boolean) => void;
}> = ({ isSearchOpen, setIsSearchOpen }) => {
  const [query, setQuery] = useState("");
  const {
    history,
    allSuggestions,
    saveSearch,
    removeHistoryItem,
  } = useSearchData(10);

  // --- 1. BODY SCROLL LOCK LOGIC ---
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  // Memoized Logic
  const filteredHistory = useMemo(() => {
    const list = query.trim()
      ? history.filter((item) =>
          item.toLowerCase().includes(query.toLowerCase())
        )
      : history;
    return list.slice(0, 10);
  }, [query, history]);

  const filteredSuggestions = useMemo(() => {
    if (query.trim().length === 0) return [];
    return allSuggestions
      .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8);
  }, [query, allSuggestions]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-background/80 backdrop-blur-xl flex flex-col pt-8"
        >
          {/* Close Trigger - Stay positioned relative to overlay */}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-4 right-4 z-[10001] p-3 text-foreground hover:bg-white/5 rounded-full transition-colors"
          >
            <TfiClose className="text-2xl" />
          </button>

          <div className="w-full max-w-5xl mx-auto px-6 h-full flex flex-col">
            {/* 1. STICKY AREA: The Search Input */}
            <div className="shrink-0 pb-4">
              <SearchInput
                query={query}
                setQuery={setQuery}
                onSave={saveSearch}
              />
            </div>

            {/* 2. SCROLLABLE AREA: Results & Discovery */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-20 mt-6 transition-all">
              {filteredHistory.length > 0 || filteredSuggestions.length > 0 ? (
                <div className="flex flex-col gap-x-16 gap-y-10">
                  <RecentSearches
                    items={filteredHistory}
                    query={query}
                    setQuery={setQuery}
                    onRemove={removeHistoryItem}
                  />

                  <QuickDiscovery
                    items={filteredSuggestions}
                    query={query}
                    setQuery={setQuery}
                    onSave={saveSearch}
                  />
                </div>
              ) : (
                /* Optional: Zero state message if nothing matches */
                query && (
                  <p className="text-foreground/40 font-mono uppercase text-sm mt-10">
                    No matching results for "{query}"
                  </p>
                )
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
