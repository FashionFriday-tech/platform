'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { SearchBox } from '@/components/ui/search-box';

interface ProductsSearchHeaderProps {
  initialQuery?: string;
  total?: number;
  didYouMean?: string;
}

export function ProductsSearchHeader({ initialQuery = '', didYouMean }: ProductsSearchHeaderProps) {
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

          {/* Typo notification only (no product count) */}
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
