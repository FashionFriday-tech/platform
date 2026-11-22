import React from 'react';
import type { Metadata } from 'next';

import { getProductsByCategory } from '@/data/filter-engine';
import { CatalogueClient } from '@/features/catalogue';

// Production standard: 1h ISR cache, updated instantly via on-demand tag revalidation
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'SNKRS Vault | Fashion Friday',
  description:
    'Step into the SNKRS Vault. Discover hyped releases, classic silhouettes, and authenticated sneakers at Fashion Friday.',
  alternates: {
    canonical: 'https://fashionfriday.in/snkrs',
  },
};

export default async function SnkrsPage() {
  const products = await getProductsByCategory('sneakers');

  return (
    <div className="flex w-full flex-col">
      <div className="w-full max-w-none px-4 pt-2 sm:pt-4 md:px-8 md:pt-24 xl:px-10 2xl:px-14">
        <div className="w-full lg:pl-80">
          <section className="relative flex h-[35vh] w-full items-center justify-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-zinc-900 via-neutral-950 to-black md:h-[45vh]">
            <div className="from-background/50 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
            <div className="relative z-10 px-4 text-center">
              <span className="mb-2.5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-black tracking-widest text-white uppercase">
                The Vault
              </span>
              <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic drop-shadow-lg md:text-7xl">
                SNKRS Collection
              </h1>
              <p className="text-foreground-muted mx-auto mt-2.5 max-w-lg text-xs font-bold tracking-widest uppercase md:text-sm">
                Authentic, limited-edition, and iconic sneaker drops
              </p>
            </div>
          </section>
        </div>
      </div>

      <div className="w-full pt-6">
        <CatalogueClient initialProducts={products} categorySlug="sneakers" />
      </div>
    </div>
  );
}
