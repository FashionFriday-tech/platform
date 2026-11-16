import React from 'react';
import type { Metadata } from 'next';

import { getNewArrivalsProducts } from '@/data/filter-engine';
import { CatalogueClient } from '@/features/catalogue';

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Sale & Special Offers | Fashion Friday',
  description:
    'Discover exclusive deals and discounted drops across sneakers, streetwear, and luxury essentials at Fashion Friday.',
  alternates: {
    canonical: 'https://fashionfriday.in/sale',
  },
};

export default async function SalePage() {
  const products = await getNewArrivalsProducts(24, 0);

  return (
    <div className="flex w-full flex-col">
      <div className="w-full max-w-none px-4 pt-2 sm:pt-4 md:px-8 md:pt-24 xl:px-10 2xl:px-14">
        <div className="w-full lg:pl-80">
          <section className="relative flex h-[35vh] w-full items-center justify-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-red-950 via-neutral-950 to-black md:h-[45vh]">
            <div className="from-background/50 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
            <div className="relative z-10 px-4 text-center">
              <span className="mb-2.5 inline-flex items-center rounded-full border border-red-500/30 bg-red-500/20 px-3.5 py-1 text-[11px] font-black tracking-widest text-red-400 uppercase">
                Limited Time Deals
              </span>
              <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic drop-shadow-lg md:text-7xl">
                Exclusive Sale
              </h1>
              <p className="text-foreground-muted mx-auto mt-2.5 max-w-lg text-xs font-bold tracking-widest uppercase md:text-sm">
                Up to 50% off select sneakers, luxury apparel, and daily drops
              </p>
            </div>
          </section>
        </div>
      </div>

      <div className="w-full pt-6">
        <CatalogueClient categorySlug="all" initialProducts={products} isNewArrivals />
      </div>
    </div>
  );
}
