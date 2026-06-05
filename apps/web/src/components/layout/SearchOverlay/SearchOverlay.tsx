'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { CloseIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { QuickDiscovery } from './QuickDiscovery';
import { RecentSearches } from './RecentSearches';
// Sub-components
import { SearchInput } from './SearchInput';
import { useSearchData } from './SearchOverlay.hooks';

export const SearchOverlay: React.FC<{
  isSearchOpen: boolean;
  setIsSearchOpen: (v: boolean) => void;
}> = ({ isSearchOpen, setIsSearchOpen }) => {
  const [query, setQuery] = useState('');
  const { history, allSuggestions, saveSearch, removeHistoryItem } = useSearchData(10);

  // --- 1. BODY SCROLL LOCK LOGIC ---
  useEffect(() => {
    document.body.style.overflow = isSearchOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  // Memoized Logic
  const filteredHistory = useMemo(() => {
    const list = query.trim()
      ? history.filter((item) => item.toLowerCase().includes(query.toLowerCase()))
      : history;
    return list.slice(0, 10);
  }, [query, history]);

  const filteredSuggestions = useMemo(() => {
    if (query.trim().length === 0) {
      return [];
    }
    return allSuggestions
      .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8);
  }, [query, allSuggestions]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="bg-background/95 text-foreground fixed inset-0 z-[10000] flex flex-col pt-8 backdrop-blur-2xl"
        >
          {/* Close Trigger - Stay positioned relative to overlay */}
          <button
            onClick={() => {
              setIsSearchOpen(false);
            }}
            className="text-foreground absolute top-4 right-4 z-[10001] rounded-full p-3 transition-colors hover:bg-white/5"
          >
            <CloseIcon className="text-2xl" />
          </button>

          <div className="mx-auto flex h-full w-full max-w-5xl flex-col px-6">
            {/* 1. STICKY AREA: The Search Input */}
            <div className="shrink-0 pb-4">
              <SearchInput query={query} setQuery={setQuery} onSave={saveSearch} />
            </div>

            {/* 2. SCROLLABLE AREA: Results & Discovery */}
            <div className="no-scrollbar mt-6 flex-1 overflow-y-auto pb-20 transition-all">
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
                  <p className="text-foreground/40 mt-10 font-mono text-sm uppercase">
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
