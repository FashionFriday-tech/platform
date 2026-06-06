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

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const productId = product.id;
  const isWishlisted = mounted ? isItemWishlisted(productId) : false;

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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Favorite Borderless Button with Larger Black Icon */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-6 right-6 z-10 flex items-center justify-center text-black transition-all duration-300 hover:scale-125 active:scale-90"
          >
            {isWishlisted ? (
              <HeartFilledIcon size={26} className="text-black transition-transform" />
            ) : (
              <HeartIcon size={26} className="text-black transition-colors" />
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
