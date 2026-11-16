'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { SearchBox } from '@/components/ui/search-box';

interface ProductsSearchHeaderProps {
  initialQuery?: string;
  total?: number;
  didYouMean?: string;
  isFallback?: boolean;
}

export function ProductsSearchHeader({
  initialQuery = '',
  total,
  didYouMean,
  isFallback = false,
}: ProductsSearchHeaderProps) {
  const router = useRouter();

  useEffect(() => {
    if (!initialQuery) {
      return;
    }
    const trimmed = initialQuery.trim();
    if (trimmed.length < 2) {
      return;
    }
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const actualResults = isFallback ? 0 : (total ?? 0);
    fetch(`${API_URL}/search-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        query: trimmed,
        resultsCount: actualResults,
        hasResults: actualResults > 0,
      }),
    }).catch(() => {
      // Ignore background analytics logging errors
    });
  }, [initialQuery, total, isFallback]);

  const handleSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      router.push('/products');
      return;
    }
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="bg-background border-border/30 relative z-20 w-full border-b px-4 py-2.5 sm:px-6 sm:py-3 lg:mt-20 lg:px-12">
      <div className="w-full lg:pl-80">
        <div className="flex flex-col gap-2">
          <div className="max-w-2xl">
            <SearchBox
              interactive
              defaultValue={initialQuery}
              onSubmit={handleSearch}
              autoFocus={false}
              className="py-2.5 sm:py-3"
            />
          </div>

          {/* Fallback recommendation notice */}
          {isFallback && initialQuery && (
            <div className="flex w-fit items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 font-mono text-[11px] tracking-wider text-amber-600 uppercase dark:text-amber-400">
              <span>
                No exact matches for &quot;{initialQuery}&quot;. Showing top recommended drops:
              </span>
            </div>
          )}

          {/* Typo notification */}
          {didYouMean && (
            <div className="border-brand/40 bg-brand/10 flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[11px]">
              <span className="text-foreground/60">Did you mean:</span>
              <button
                onClick={() => {
                  handleSearch(didYouMean);
                }}
                className="text-brand font-black uppercase underline hover:opacity-80"
              >
                {didYouMean}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
