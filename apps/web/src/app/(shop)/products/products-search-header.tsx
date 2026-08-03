'use client';

import React from 'react';
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
  didYouMean,
  isFallback = false,
}: ProductsSearchHeaderProps) {
  const router = useRouter();

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
            <div className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 flex w-fit items-center gap-1.5 rounded-full border px-3.5 py-1 text-[11px] font-mono tracking-wider uppercase">
              <span>No exact matches for &quot;{initialQuery}&quot;. Showing top recommended drops:</span>
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
