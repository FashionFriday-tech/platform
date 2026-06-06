'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { BellIcon, HeartMinusIcon, ShoppingBagIcon } from '@ff/ui';
import { toast } from 'sonner';

import { useCart } from '@/features/cart';
import { type WishlistProductItem } from '@/store/wishlist-store';

import { type Product } from '../types';

interface WishlistCardProps {
  product: Product | WishlistProductItem;
  onRemove?: (id: string) => void;
}

export function WishlistCard({ product, onRemove }: WishlistCardProps) {
  const { addItem } = useCart();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleMoveToBag = () => {
    if (!product.inStock) {
      toast.error('This product is currently out of stock');
      return;
    }

    void addItem({
      productId: product.id,
      size: product.size || 'Standard',
      color: product.color || 'Standard',
      quantity: 1,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        brand: product.category ? [product.category] : ['Fashion Friday'],
        ogPrice: product.originalPrice || product.price,
        sellingPrice: product.price,
        mainImage: product.image,
        totalStock: product.inStock ? 10 : 0,
      },
    });

    onRemove?.(product.id);
    toast.success(`Moved ${product.name} to Bag!`);
  };

  return (
    <article className="border-border bg-background-muted/40 hover:border-foreground/30 group relative flex w-full items-center justify-center gap-4 rounded-3xl border p-4 transition-all">
      {/* 1. Left Side: Image Container */}
      <div className="bg-background-muted relative aspect-square w-36 shrink-0 overflow-hidden rounded-2xl sm:w-32 md:w-36">
        <Link href={`/products/${product.slug}`} className="relative block h-full w-full">
          <Image
            src={product.image || '/images/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 160px, (max-width: 768px) 128px, 160px"
          />
        </Link>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="bg-background/60 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <div className="bg-background text-foreground rounded-full px-2.5 py-1 text-[9px] font-black tracking-wider uppercase">
              Sold Out
            </div>
          </div>
        )}
      </div>

      {/* 2. Right Side: Product Details */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          {/* Brand/Category & Delete Action */}
          <div className="mb-1 flex items-start justify-between gap-2">
            <span className="text-foreground-subtle text-[10px] font-black tracking-widest uppercase">
              {product.category || 'Apparel'}
            </span>
            <button
              onClick={() => onRemove?.(product.id)}
              className="text-foreground-subtle hover:text-foreground -mt-1 -mr-1 p-1 transition-colors"
              aria-label="Remove item"
            >
              <HeartMinusIcon size={16} />
            </button>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-foreground hover:text-brand line-clamp-1 text-sm font-bold tracking-tight uppercase transition-colors sm:text-base">
              {product.name}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-foreground text-sm font-black tracking-tight sm:text-base">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-foreground-subtle text-[11px] line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-[10px] font-black text-emerald-500">{discount}% OFF</span>
              </>
            )}
          </div>
        </div>

        {/* Actions CTA Container */}
        <div className="mt-4">
          {/* Move to Bag Button */}
          <button
            type="button"
            disabled={!product.inStock}
            onClick={handleMoveToBag}
            className="bg-foreground text-background hover:bg-foreground/90 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full py-2.5 text-[10px] font-black tracking-widest uppercase shadow-sm transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:py-2.5 sm:text-[11px]"
          >
            {product.inStock ? (
              <>
                <ShoppingBagIcon size={13} />
                Move to Bag
              </>
            ) : (
              <>
                <BellIcon size={13} />
                Notify Me
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
