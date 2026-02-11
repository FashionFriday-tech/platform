import ShopByBrand from "@/components/ui/sections/BrandGrid";
import brandLogos from "@/data/brandLogos";
const brands = brandLogos;
import { BrandCard } from "@/features/brand/components/BrandCard";
import { ArrowUpRightIcon } from "@ff/ui";
import Link from "next/link";

const FEATURED_BRAND_NAMES = [
  "nike",
  "adidas",
  "zara",
  "crocs",
  "new balance",
  "asics",
];

export default function ShopByBrands() {
  return (
    <>
      {/* <ShopByBrand brands={brands} /> */}

      <section className="w-screen overflow-hidden py-16 lg:py-24 transition-colors duration-300">
        {/* HEADER */}
        <div className="container mx-auto px-4 mb-8 flex justify-between items-end">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-center">
            Shop by brands
          </h2>

          <Link
            href="/brands"
            className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b-2 border-black dark:border-white pb-1"
          >
            View All Brands <ArrowUpRightIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:flex gap-x-3 gap-y-6 px-6 w-full overflow-x-auto">
          {brands
            .filter((brand) =>
              FEATURED_BRAND_NAMES.includes(brand.name.toLowerCase())
            )
            .map((brand) => (
              <BrandCard key={brand.slug} brand={brand} />
            ))}
        </div>

             {/* MOBILE CTA */}
        <div className="mt-8 flex justify-center md:hidden border rounded-full py-2.5 w-90 justify-self-center">
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
