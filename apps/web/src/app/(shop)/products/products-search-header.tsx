'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { SearchBox } from '@/components/ui/search-box';

interface ProductsSearchHeaderProps {
  initialQuery?: string;
  total: number;
  didYouMean?: string;
}

export function ProductsSearchHeader({
  initialQuery = '',
  total,
  didYouMean,
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
    <div className="bg-background/95 border-border/40 sticky top-14 z-30 w-full border-b px-4 py-3 backdrop-blur-xl sm:px-6 lg:top-20 lg:px-12">
      <div className="w-full lg:pl-80">
        <div className="flex flex-col gap-2.5">
          <div className="max-w-2xl">
            <SearchBox
              interactive
              defaultValue={initialQuery}
              onSubmit={handleSearch}
              autoFocus={false}
              className="py-2.5 sm:py-3"
            />
          </div>

          {/* Info & typo notification */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-foreground/50 font-mono text-[11px] font-bold uppercase">
                {total} {total === 1 ? 'Product' : 'Products'} found
              </span>
              {initialQuery && (
                <span className="text-foreground/40 text-[11px]">
                  for <span className="text-foreground font-semibold italic">"{initialQuery}"</span>
                </span>
              )}
            </div>

            {didYouMean && (
              <div className="border-brand/40 bg-brand/10 flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px]">
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
    </div>
  );
}
