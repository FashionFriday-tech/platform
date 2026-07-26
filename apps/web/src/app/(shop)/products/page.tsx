import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { getNewArrivalsProducts, getSearchResults } from '@/data/filter-engine';
import { CatalogueClient } from '@/features/catalogue';

import { ProductsSearchHeader } from './products-search-header';

export const revalidate = 30;

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (q || '').trim();

  if (!query) {
    return {
      title: 'Products Catalogue | Fashion Friday',
      description:
        'Explore authentic hype sneakers, streetwear, watches, and luxury apparel at Fashion Friday.',
    };
  }

  return {
    title: `Products: "${query}" | Fashion Friday`,
    description: `Shop products matching "${query}" at Fashion Friday. Authentic sneakers, streetwear, and luxury designer drops.`,
    alternates: {
      canonical: `https://fashionfriday.in/products?q=${encodeURIComponent(query)}`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { q } = await searchParams;
  const rawQuery = (q || '').trim();

  let products = [];
  let total = 0;
  let didYouMean: string | undefined;

  if (rawQuery) {
    const searchData = await getSearchResults(rawQuery, 100);
    products = searchData.products;
    total = searchData.total;
    didYouMean = searchData.didYouMean;
  } else {
    products = await getNewArrivalsProducts(100);
    total = products.length;
  }

  const contextCategory = products.length > 0 ? products[0].categoryId || 'all' : 'all';

  return (
    <div className="flex w-full flex-col">
      {/* Top sticky search input bar next to header */}
      <ProductsSearchHeader initialQuery={rawQuery} total={total} didYouMean={didYouMean} />

      {/* Catalogue Grid or Zero State */}
      {products.length > 0 ? (
        <CatalogueClient categorySlug={contextCategory} initialProducts={products} />
      ) : (
        <div className="w-full max-w-none px-4 py-16 sm:py-24 md:px-8 xl:px-10 2xl:px-14">
          <div className="flex w-full flex-col items-center justify-center text-center lg:pl-80">
            <div className="bg-foreground/5 text-foreground/40 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>

            <h2 className="text-foreground text-2xl font-black tracking-tight uppercase md:text-3xl">
              No matching products
            </h2>
            <p className="text-foreground/60 mt-2 max-w-md text-sm">
              We couldn't find anything matching "{rawQuery}". Try checking for spelling mistakes or
              explore our latest drops.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/products"
                className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6 py-3 text-xs font-black tracking-widest uppercase transition-all"
              >
                View All Products
              </Link>
              <Link
                href="/new-arrivals"
                className="border-border hover:bg-foreground/5 rounded-full border px-6 py-3 text-xs font-black tracking-widest uppercase transition-all"
              >
                Browse New Arrivals
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
