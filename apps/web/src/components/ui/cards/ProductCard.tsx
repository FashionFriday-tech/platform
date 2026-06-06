'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { HeartFilledIcon, HeartIcon, StarBadgeIcon, StarsIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { useWishlist } from '@/features/wishlist';

interface Product {
  id: string | number;
  slug: string;
  name: string;
  brand: string;
  price: number;
  promoImage: string;
  quality: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { isItemWishlisted, toggleWishlist } = useWishlist();
  const productId = String(product.id);
  const isWishlisted = isItemWishlisted(productId);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void toggleWishlist({
      id: productId,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.promoImage || '/images/placeholder.png',
      category: product.brand,
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group relative w-full cursor-pointer"
    >
      <Link href={`/product/${product.slug}`} className="block w-full">
        <div className="bg-foreground/5 relative aspect-4/5 w-full overflow-hidden rounded-[2.5rem]">
          <Image
            src={product.promoImage || '/images/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Favorite Transparent Button with Black Border & Icon */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-6 right-6 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-black bg-transparent text-black transition-all duration-300 hover:scale-110 hover:bg-black/5 active:scale-90 dark:border-white dark:text-white dark:hover:bg-white/10"
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
      </Link>

      <div className="mt-4 space-y-1 px-1">
        {/* Brand & Quality Badge */}
        <div className="mb-0.5 flex items-center justify-between text-[10px]">
          <Image
            src="/images/brand-logos/nike.png"
            alt="Nike brand logo"
            width={40}
            height={40}
            className="invert"
          />

          <span className="border-border flex items-center justify-center gap-1 rounded-full border px-1.5 py-0.5 font-bold text-green-500 uppercase">
            <StarBadgeIcon /> {product.quality}
          </span>
        </div>

        {/* Product Name */}
        <h2 className="text-foreground line-clamp-1 truncate text-[1.2rem] font-bold tracking-tight uppercase">
          {product.name}
        </h2>

        {/* Pricing & Rating */}
        <div className="flex items-center gap-2 text-[16px]">
          <div className="flex w-full items-center justify-between">
            <span className="flex items-center gap-2">
              <p className="text-foreground/40 font-medium line-through">₹14,999</p>
              <p className="text-foreground font-black">₹{product.price.toLocaleString()}</p>
            </span>
            <span className="flex items-center gap-1 text-[14px] text-blue-500">
              <StarsIcon /> 4.5
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
