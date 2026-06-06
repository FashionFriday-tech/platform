'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { type Product } from '@ff/schemas';
import { HeartFilledIcon, HeartIcon, StarBadgeIcon, StarsIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { useBrands } from '@/features/brand';
import { useWishlist } from '@/features/wishlist';

interface StoreProductCardProps {
  product: Product;
}

export function CatalogueProductCard({ product }: StoreProductCardProps) {
  const { brands } = useBrands();
  const { isItemWishlisted, toggleWishlist } = useWishlist();

  const productId = product.id;
  const isWishlisted = isItemWishlisted(productId);

  const brandName = product.brand?.[0] || '';
  const brandLogo = brands.find((b) => b.name.toLowerCase() === brandName.toLowerCase())?.logo;

  // Helper to handle original price calculation safely
  const originalPrice = product.price.ogPrice || product.price.sellingPrice * 3;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void toggleWishlist({
      id: productId,
      name: product.name,
      slug: product.slug,
      price: product.price.sellingPrice,
      originalPrice: product.price.ogPrice,
      image: product.media.mainImage || '/images/placeholder.png',
      category: brandName,
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group relative cursor-pointer"
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

          {/* Favorite Transparent Button with Black Border & Icon */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-5 right-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-black bg-transparent text-black transition-all duration-300 hover:scale-110 hover:bg-black/5 active:scale-90 dark:border-white dark:text-white dark:hover:bg-white/10"
          >
            {isWishlisted ? (
              <HeartFilledIcon
                size={16}
                className="scale-110 text-black transition-transform dark:text-white"
              />
            ) : (
              <HeartIcon size={16} className="text-black transition-colors dark:text-white" />
            )}
          </button>
        </div>

        <div className="mt-1 px-1">
          <div className="flex items-center justify-between text-[8px] md:text-[10px]">
            {brandLogo ? (
              <Image
                src={brandLogo}
                alt={brandName}
                width={32}
                height={32}
                className="object-contain invert-0 dark:invert"
              />
            ) : (
              <span className="text-muted-foreground font-bold tracking-wider uppercase">
                {brandName}
              </span>
            )}
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
