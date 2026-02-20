import brandLogos from '@/data/brandLogos';
const brands = brandLogos;
import Link from 'next/link';

import { ArrowUpRightIcon } from '@ff/ui';

import { BrandCard } from '@/features/brand/components/BrandCard';

const FEATURED_BRAND_NAMES = ['nike', 'adidas', 'zara', 'crocs', 'new balance', 'asics'];

export default function ShopByBrands() {
  return (
    <>
      {/* <ShopByBrand brands={brands} /> */}

      <section className="w-screen overflow-hidden py-16 transition-colors duration-300 lg:py-24">
        {/* HEADER */}
        <div className="container mx-auto mb-8 flex items-end justify-between px-4">
          <h2 className="text-center text-3xl font-black uppercase tracking-tighter md:text-5xl">
            Shop by brands
          </h2>

          <Link
            href="/brands"
            className="hidden items-center gap-2 border-b-2 border-black pb-1 text-sm font-bold uppercase tracking-widest md:flex dark:border-white"
          >
            View All Brands <ArrowUpRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid w-full grid-cols-2 gap-x-3 gap-y-6 overflow-x-auto px-6 sm:flex">
          {brands
            .filter((brand) => FEATURED_BRAND_NAMES.includes(brand.name.toLowerCase()))
            .map((brand) => (
              <BrandCard key={brand.slug} brand={brand} />
            ))}
        </div>

        {/* MOBILE CTA */}
        <div className="w-90 mt-8 flex justify-center justify-self-center rounded-full border py-2.5 md:hidden">
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
          >
            View All Brands <ArrowUpRightIcon />
          </Link>
        </div>
      </section>
    </>
  );
}
