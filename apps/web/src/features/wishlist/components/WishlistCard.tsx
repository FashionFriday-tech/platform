'use client';

import Image from 'next/image';
import Link from 'next/link';

import { BellIcon, HeartMinusIcon, ShoppingBagIcon } from '@ff/ui';

import { cn } from '@/lib/utils';
import { type Product } from '@/types/wishlist';
interface WishlistCardProps {
  product: Product;
}

export function WishlistCard({ product }: WishlistCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <article className="group border-border relative flex w-full items-center justify-center gap-4 rounded-4xl border-y py-6">
      {/* 1. Left Side: Image Container */}
      <div className="bg-background-muted relative aspect-square w-40 shrink-0 overflow-hidden rounded-2xl sm:w-32 md:w-40">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="100vw"
          />
        </Link>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="bg-background/40 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <div className="bg-background/80 text-foreground rounded-full px-2 py-1 text-[8px] font-bold tracking-tighter uppercase sm:text-[10px]">
              Sold Out
            </div>
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2">
            <span className="bg-background text-foreground rounded-full px-2 py-0.5 text-[8px] font-bold tracking-tighter uppercase sm:text-[10px]">
              -{discount}%
            </span>
          </div>
        )}
      </div>

      {/* 2. Right Side: Product Details */}
      <div className="flex flex-1 flex-col justify-between self-stretch py-1">
        <div className="flex justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-foreground-subtle text-[10px] font-medium tracking-widest uppercase">
              {product.category}
            </p>
            <h3 className="text-foreground group-hover:text-foreground-muted mt-1 text-sm leading-tight font-semibold transition-colors sm:text-base">
              <Link href={`/product/${product.slug}`}>{product.name}</Link>
            </h3>
            <p className="text-foreground-subtle mt-1 text-xs">
              {product.color} • {product.size}
            </p>

            <div className="mt-4 flex items-center justify-start gap-4">
              <span className="text-foreground font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-foreground-subtle line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Price and Actions Row */}
        <div className="mt-auto flex w-full items-center justify-between gap-2 pr-2">
          {/* Remove Button */}
          <button
            className="border-border text-foreground-subtle hover:bg-destructive hover:text-destructive-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full border p-2 transition-all active:scale-90"
            aria-label="Remove from favorites"
          >
            <HeartMinusIcon size={16} />
          </button>
          {/* Move to Bag Button */}
          <button
            disabled={!product.inStock}
            className="bg-foreground text-background flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[10px] font-bold tracking-widest uppercase shadow-sm transition-transform active:scale-95 sm:px-6 sm:py-2.5 sm:text-xs"
          >
            {product.inStock ? (
              <>
                <ShoppingBagIcon size={14} />
                Move to Bag
              </>
            ) : (
              <>
                <BellIcon size={14} />
                Notify Me
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
