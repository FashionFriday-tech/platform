'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { motion } from 'motion/react';

import { SearchBox } from '@/components/ui/search-box';
import {
  type DiscoveryItem,
  LiveProductSuggestions,
  QuickDiscovery,
  RecentSearches,
  useLiveSearchSuggestions,
  useSearchHistory,
} from '@/features/search';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  // 1. History from localStorage
  const { history, saveSearch, removeHistoryItem, clearAllHistory } = useSearchHistory(10);

  // 2. Scalable live server suggestions (350ms debounce + min 2 chars + client memory cache) + dynamic popular searches
  const { brands, categories, products, popularSearches, didYouMean, isLoading } =
    useLiveSearchSuggestions(query);

  // Execute full search navigation to products page
  const handleExecuteSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      return;
    }
    saveSearch(trimmed);
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  };

  // Direct product navigation
  const handleSelectProduct = (slug: string, name: string) => {
    saveSearch(name);
    router.push(`/product/${slug}`);
  };

  // Format discovery items from matching brands and categories
  const discoveryItems: DiscoveryItem[] = useMemo(() => {
    const list: DiscoveryItem[] = [];
    brands.forEach((b) => {
      list.push({ label: b.name, type: 'brand' });
    });
    categories.forEach((c) => {
      list.push({ label: c.name, type: 'category' });
    });
    return list;
  }, [brands, categories]);

  const hasResults = products.length > 0 || discoveryItems.length > 0;

  return (
    <div className="bg-background text-foreground min-h-[calc(100vh-80px)] w-full">
      {/* 1. SINGLE FIXED TOP SEARCH BAR (Identical style to Home Hero section) */}
      <div className="bg-background/95 border-border/40 sticky top-14 z-30 w-full border-b px-4 py-3 backdrop-blur-xl sm:px-6 lg:top-20 lg:px-12">
        <div className="mx-auto w-full max-w-4xl">
          <SearchBox
            interactive
            value={query}
            onChange={setQuery}
            onSubmit={handleExecuteSearch}
            autoFocus
            className="py-3 sm:py-3.5"
          />
        </div>
      </div>

      {/* 2. MAIN DISCOVERY CONTENT */}
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-12">
        {/* Popular Searches: Forward Cross-Cut Badges */}
        <div className="border-border/30 border-b pb-5">
          <h4 className="text-foreground/40 mb-3 text-[10px] font-bold tracking-[0.25em] uppercase">
            Popular Searches
          </h4>
          <div className="no-scrollbar flex items-center gap-3 overflow-x-auto py-1 whitespace-nowrap sm:gap-4">
            {popularSearches.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  handleExecuteSearch(tag);
                }}
                className="group relative -skew-x-[12deg] rounded-md border border-zinc-300/80 bg-white px-4 py-1.5 transition-all duration-200 hover:border-black hover:bg-zinc-50 active:scale-95 sm:-skew-x-[14deg] sm:px-5 sm:py-2 dark:border-zinc-800 dark:bg-black dark:hover:border-zinc-400 dark:hover:bg-zinc-900"
              >
                <span className="inline-block skew-x-[12deg] font-mono text-xs font-bold tracking-wider text-zinc-700 uppercase transition-colors group-hover:text-black sm:skew-x-[14deg] sm:text-xs dark:text-zinc-300 dark:group-hover:text-white">
                  {tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* When query is empty: show recent searches history */}
        {!query.trim() ? (
          <div className="mt-8 flex flex-col gap-10">
            {history.length > 0 && (
              <RecentSearches
                items={history}
                query={query}
                onSelect={handleExecuteSearch}
                onRemove={removeHistoryItem}
                onClearAll={clearAllHistory}
              />
            )}
          </div>
        ) : (
          /* When query has text: show live server suggestions & previews */
          <div className="mt-6 flex flex-col gap-8 pb-16">
            {/* Typo Correction Banner if applicable */}
            {didYouMean && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-brand/40 bg-brand/10 flex items-center gap-2 rounded-xl border p-3.5 text-xs"
              >
                <span className="opacity-70">Did you mean:</span>
                <button
                  onClick={() => {
                    handleExecuteSearch(didYouMean);
                  }}
                  className="text-brand font-black uppercase underline underline-offset-2 hover:opacity-80"
                >
                  {didYouMean}
                </button>
              </motion.div>
            )}

            {/* Top Matching Products Preview */}
            {products.length > 0 && (
              <LiveProductSuggestions products={products} onSelectProduct={handleSelectProduct} />
            )}

            {/* Matching Brands & Categories */}
            {discoveryItems.length > 0 && (
              <QuickDiscovery items={discoveryItems} query={query} onSelect={handleExecuteSearch} />
            )}

            {/* Zero state if no instant matches */}
            {!hasResults && !isLoading && query.trim().length >= 2 && (
              <div className="py-12 text-center">
                <p className="font-mono text-sm uppercase opacity-50">
                  No instant matches for "{query}"
                </p>
                <p className="text-foreground/40 mt-1 text-xs">
                  Press Enter to search the full catalogue.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
