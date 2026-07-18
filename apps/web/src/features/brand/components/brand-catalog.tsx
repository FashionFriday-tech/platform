import type { JSX } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { getProductsByBrand } from '@/data/filter-engine';
import { CatalogueClient } from '@/features/catalogue';

import { getBrandBySlug } from '../services/queries';
import { BrandHeroBg } from './brand-hero-bg';

interface BrandCatalogProps {
  brandName: string;
}

export async function BrandCatalog({ brandName }: BrandCatalogProps): Promise<JSX.Element> {
  if (!brandName) {
    return notFound();
  }

  // 1. Fetch exact brand metadata (e.g. slug 'nike' -> name 'Nike')
  const brand = await getBrandBySlug(brandName);
  if (!brand) {
    return notFound();
  }

  // 2. Fetch products specifically for this brand from API
  const brandProducts = await getProductsByBrand(brand.name);
  console.log('BRAND PRODUCTS COUNT for brand', brand.name, ':', brandProducts.length);

  // 3. Determine initial sidebar context
  const contextCategory = brandProducts.length > 0 ? brandProducts[0].categoryId : 'sneakers';

  return (
    <div className="flex w-full flex-col">
      {/* Hero Section aligned with the product grid to avoid sidebar overlap */}
      <div className="w-full max-w-none px-4 pt-2 sm:pt-4 md:px-8 md:pt-24 xl:px-10 2xl:px-14">
        <div className="w-full lg:pl-80">
          <section className="relative flex h-[40vh] w-full items-center justify-center overflow-hidden rounded-[2.5rem] bg-black md:h-[50vh]">
            <BrandHeroBg poster={brand.poster} name={brand.name} />

            {/* Corner Markers */}
            <div className="absolute top-4 left-4 h-1.5 w-1.5 bg-white/80 md:top-6 md:left-6" />
            <div className="absolute top-4 right-4 h-1.5 w-1.5 bg-white/80 md:top-6 md:right-6" />
            <div className="absolute bottom-4 left-4 h-1.5 w-1.5 bg-white/80 md:bottom-6 md:left-6" />
            <div className="absolute right-4 bottom-4 h-1.5 w-1.5 bg-white/80 md:right-6 md:bottom-6" />

            {/* Centered Brand Lockup */}
            <div className="relative z-10 flex w-full max-w-xl flex-row items-center justify-center gap-4 px-4 pb-8 sm:gap-8 md:gap-12">
              <div className="relative flex h-10 w-24 items-center justify-center sm:h-14 sm:w-32 md:h-18 md:w-36">
                <div className="relative h-full w-full">
                  <Image
                    src="/images/logos/ff-logo.png"
                    alt="Fashion Friday"
                    fill
                    sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 144px"
                    className="object-contain invert"
                  />
                </div>
              </div>

              {/* Symmetrical centered X */}
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center sm:h-10 sm:w-10 md:h-12 md:w-12">
                <div className="absolute h-10 w-[2px] rotate-45 bg-white sm:h-14 md:h-18 md:w-[3px]" />
                <div className="absolute h-10 w-[2px] -rotate-45 bg-white sm:h-14 md:h-18 md:w-[3px]" />
              </div>

              {brand.logo ? (
                <div className="relative flex h-10 w-24 items-center justify-center sm:h-14 sm:w-32 md:h-18 md:w-36">
                  <div className="relative h-full w-full">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 144px"
                      className="object-contain invert"
                    />
                  </div>
                </div>
              ) : (
                <h1 className="text-center text-xl font-black tracking-tighter text-white uppercase italic sm:text-2xl md:text-4xl">
                  {brand.name}
                </h1>
              )}
            </div>

            {/* Bottom Text (Streetwear Style) */}
            <div className="absolute right-0 bottom-6 left-0 flex items-center justify-center px-12">
              <div className="flex w-full max-w-2xl items-center gap-4">
                <div className="h-[2px] flex-1 bg-white/80" />
                <div className="px-2 text-center">
                  <p className="text-[10px] font-black tracking-[0.2em] text-white uppercase md:text-xs">
                    FASHION FRIDAY X {brand.name}
                  </p>
                  <p className="mt-1 text-[9px] font-bold tracking-widest text-white/70 uppercase md:text-[10px]">
                    EXCLUSIVE COLLECTION — {new Date().getFullYear()}
                  </p>
                </div>
                <div className="h-[2px] flex-1 bg-white/80" />
              </div>
            </div>
          </section>
        </div>
      </div>

      <CatalogueClient categorySlug={contextCategory} initialProducts={brandProducts} />
    </div>
  );
}
