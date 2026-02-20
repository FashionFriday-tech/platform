'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { type Product } from '@ff/schemas';
import { StarBadgeIcon, StarsIcon } from '@ff/ui';
import { motion } from 'framer-motion';

import brandLogos from '@/data/brandLogos';

interface StoreProductCardProps {
  // Use the concrete Product type instead of 'any' to catch errors early
  product: Product;
}

export function CatalogueProductCard({ product }: StoreProductCardProps) {
  // Safety check to prevent crashes if a null product enters the grid
  if (!product) {
    return null;
  }

  const getBrandLogoByName = (name: string) => {
    return brandLogos.find((brand) => brand.name.toLowerCase() === name.toLowerCase())?.logo;
  };

  // Helper to handle original price calculation safely
  const originalPrice = product.price.ogPrice || product.price.sellingPrice * 3;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group cursor-pointer"
    >
      <Link href={`/product/${product.slug}`} className="block cursor-pointer">
        <div className="bg-background-muted relative aspect-4/5 overflow-hidden rounded-4xl lg:rounded-[2.5rem]">
          <Image
            src={product.media.mainImage || '/images/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="100vw"
          />
        </div>

        <div className="mt-1 px-1">
          <div className="flex items-center justify-between text-[8px] md:text-[10px]">
            <Image
              src={getBrandLogoByName(product.brand[0]) || '/images/placeholder.png'}
              alt={product.brand[0]}
              width={32}
              height={32}
              className="invert-0 dark:invert"
            />
            <span className="border-border flex items-center justify-center gap-1 rounded-full border px-2 py-0.5 font-bold text-blue-500 uppercase">
              <StarBadgeIcon /> {product.attributes.quality}
            </span>
          </div>

          <h2 className="text-foreground line-clamp-1 truncate text-[14px] font-bold tracking-tight uppercase">
            {product.name}
          </h2>

          <div className="mt-1 flex items-center gap-2 text-[11px]">
            <div className="flex w-full items-center justify-between">
              <span className="flex items-center gap-2">
                <p className="text-foreground/50 font-medium line-through">₹{originalPrice}</p>
                <p className="font-black text-green-500">₹{product.price.sellingPrice}</p>
              </span>
              <span className="text-foreground-muted flex items-center gap-1 text-[10px]">
                <StarsIcon className="text-yellow-500" /> 4.5
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
