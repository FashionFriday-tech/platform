'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { type Brand, type Product } from '@ff/schemas';
import { StarBadgeIcon, StarsIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { useBrands } from '@/features/brand';
import { getBrandLogo } from '@/lib/brand-logo';

interface RelatedProductsProps {
  products?: Product[];
  initialBrands?: Brand[];
}

function RelatedProductBrandLogo({
  brand,
  brands,
}: {
  brand?: string | string[] | null;
  brands: Brand[];
}) {
  const [hasError, setHasError] = useState(false);
  const brandName = Array.isArray(brand)
    ? (brand[0] ?? '')
    : typeof brand === 'string'
      ? brand
      : '';
  const brandLogo = getBrandLogo(brandName, brands);

  if (!brandName) return null;

  if (brandLogo && !hasError) {
    return (
      <Image
        src={brandLogo}
        alt={brandName}
        width={36}
        height={36}
        className="max-h-6 w-auto object-contain invert-0 dark:invert"
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <span className="text-muted-foreground font-bold tracking-wider uppercase">
      {brandName}
    </span>
  );
}

export default function RelatedProducts({ products, initialBrands }: RelatedProductsProps) {
  const { brands } = useBrands(initialBrands);
  return (
    <section className="w-full py-6 lg:py-20">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between px-4 lg:px-8">
        <h2 className="text-3xl font-black tracking-tighter uppercase italic lg:text-4xl">
          Similer Drops
        </h2>
      </div>

      {/* Scroll Container */}
      <div className="relative">
        <div className="no-scrollbar flex gap-4 overflow-x-auto px-4 pb-8 lg:gap-8 lg:px-8">
          {products?.map((product) => (
            <div
              key={product.id}
              className="w-[70vw] shrink-0 snap-start md:w-[300px] lg:w-[360px]"
            >
              {/* Product Card */}
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="group w-full cursor-pointer"
              >
                <Link href={`/product/${product.slug}`} className="block w-full">
                  <div className="bg-foreground/5 relative aspect-4/5 w-full overflow-hidden rounded-[2.5rem]">
                    <Image
                      src={product.media.mainImage || '/images/placeholder.png'}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 70vw, (max-width: 1024px) 300px, 360px"
                    />
                  </div>
                </Link>

                <div className="mt-4 space-y-1 px-1">
                  {/* Brand & Quality */}
                  <div className="mb-0.5 flex items-center justify-between text-[10px]">
                    <RelatedProductBrandLogo brand={product.brand} brands={brands} />

                    <span className="border-border flex items-center gap-1 rounded-full border px-2 py-0.5 font-bold text-blue-500 uppercase">
                      <StarBadgeIcon /> {product.attributes.quality}
                    </span>
                  </div>

                  {/* Name */}
                  <h2 className="text-foreground line-clamp-1 truncate text-[1.2rem] font-bold tracking-tight uppercase">
                    {product.name}
                  </h2>

                  {/* Price & Rating */}
                  <div className="flex items-center gap-2 text-[16px]">
                    <div className="flex w-full items-center justify-between">
                      <span className="flex items-center gap-2">
                        <p className="text-foreground/40 font-medium line-through">
                          ₹{product.price.ogPrice}
                        </p>
                        <p className="font-black text-green-500">₹{product.price.sellingPrice}</p>
                      </span>

                      <span className="flex items-center gap-1 text-[14px] text-yellow-500">
                        <StarsIcon /> 4.5
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
