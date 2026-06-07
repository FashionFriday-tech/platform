import type { JSX } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { getProductsByBrand } from '@/data/filter-engine';
import { CatalogueClient } from '@/features/catalogue';

import { BrandHeroBg } from './brand-hero-bg';
import { getBrandBySlug } from '../services/queries';

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
    <div className="flex flex-col w-full">
      {/* Hero Section aligned with the product grid to avoid sidebar overlap */}
      <div className="w-full max-w-none px-4 pt-4 md:px-8 md:pt-32 xl:px-10 2xl:px-14">
        <div className="w-full lg:pl-80">
          <section
            className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden rounded-[2.5rem]"
            style={{ backgroundColor: brand.color || '#000' }}
          >
            <BrandHeroBg poster={brand.poster} name={brand.name} />

            {/* Corner Markers */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 w-1.5 h-1.5 bg-white/80" />
            <div className="absolute top-4 right-4 md:top-6 md:right-6 w-1.5 h-1.5 bg-white/80" />
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 w-1.5 h-1.5 bg-white/80" />
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-1.5 h-1.5 bg-white/80" />

            <div className="relative z-10 flex flex-row items-center justify-center gap-10 md:gap-20 px-4 pb-8 pl-20">
              <div className="relative h-12 w-16 md:h-20 md:w-28 flex items-center justify-end">
                <div className="relative h-full w-full">
                  <Image
                    src="/images/logos/ff-logo.png"
                    alt="Fashion Friday"
                    fill
                    className="object-contain invert"
                  />
                </div>
              </div>

              {/* Perfectly centered absolute X */}
              <div className="relative flex items-center justify-center w-8 h-8 md:w-16 md:h-16">
                <div className="absolute w-[2px] md:w-[4px] h-24 md:h-46 bg-white rotate-45" />
                <div className="absolute w-[2px] md:w-[4px] h-12 md:h-30 bg-white -rotate-45" />
              </div>

              {brand.logo ? (
                <div className="relative h-32 w-26 md:h-42 md:w-48 flex items-center justify-start">
                  <div className="relative h-full w-full">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className={`object-contain ${brand.color === '#000000' || brand.color === '#000' ? 'invert' : 'invert'}`}
                    />
                  </div>
                </div>
              ) : (
                <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
                  {brand.name}
                </h1>
              )}
            </div>

            {/* Bottom Text (Streetwear Style) */}
            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center px-12">
              <div className="flex w-full max-w-2xl items-center gap-4">
                <div className="h-[2px] flex-1 bg-white/80" />
                <div className="text-center px-2">
                  <p className="text-[10px] md:text-xs font-black tracking-[0.2em] uppercase text-white">
                    FASHION FRIDAY X {brand.name}
                  </p>
                  <p className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-white/70 mt-1">
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
