import React from 'react';
import type { Metadata } from 'next';

import { getNewArrivalsProducts } from '@/data/filter-engine';
import { CatalogueClient } from '@/features/catalogue';

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'New Arrivals | Fashion Friday',
  description:
    'Explore the freshest drops at Fashion Friday. Shop newly arrived sneakers, streetwear, watches, and luxury apparel.',
  alternates: {
    canonical: 'https://fashionfriday.in/new-arrivals',
  },
  openGraph: {
    title: 'New Arrivals | Fashion Friday',
    description:
      'Explore the freshest drops at Fashion Friday. Shop newly arrived sneakers, streetwear, watches, and luxury apparel.',
    url: 'https://fashionfriday.in/new-arrivals',
    siteName: 'Fashion Friday',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Arrivals | Fashion Friday',
    description:
      'Explore the freshest drops at Fashion Friday. Shop newly arrived sneakers, streetwear, watches, and luxury apparel.',
  },
};

export default async function NewArrivalsPage() {
  // Fetch latest products from database sorted newest added to oldest (top to bottom)
  const products = await getNewArrivalsProducts(100);

  // Determine initial filter category context from first available product or fallback
  const contextCategory = products.length > 0 ? (products[0].categoryId || 'all') : 'all';

  return (
    <div className="flex w-full flex-col">
      {/* Hero Section aligned with the product grid to avoid sidebar overlap */}
      <div className="w-full max-w-none px-4 pt-24 md:px-8 md:pt-32 xl:px-10 2xl:px-14">
        <div className="w-full lg:pl-80">
          <section className="relative flex h-[35vh] w-full items-center justify-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-neutral-900 via-neutral-950 to-black md:h-[45vh]">
            <div className="from-background/50 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

            <div className="relative z-10 px-4 text-center">
              <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.25)]">
                ✨ Just Dropped
              </span>
              <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic drop-shadow-lg md:text-7xl">
                New Arrivals
              </h1>
              <p className="mx-auto mt-3 max-w-md text-xs font-medium text-neutral-400 md:text-sm">
                The freshest luxury apparel, hype sneakers, and exclusive designer drops.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Catalogue Grid reusing central CatalogueClient (DRY) */}
      <CatalogueClient categorySlug={contextCategory} initialProducts={products} />
    </div>
  );
}
