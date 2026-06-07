'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';

import { BellIcon, HeartMinusIcon, ShoppingBagIcon, CloseIcon } from '@ff/ui';
import { toast } from 'sonner';

import { useCart } from '@/features/cart';
import { type WishlistProductItem } from '@/store/wishlist-store';

import { type Product } from '../types';

interface WishlistCardProps {
  product: Product | WishlistProductItem;
  layoutMode?: 'list' | 'grid';
  onRemove?: (id: string) => void;
}

export function WishlistCard({ product, layoutMode = 'list', onRemove }: WishlistCardProps) {
  const { addItem } = useCart();
  const [isSelectingSize, setIsSelectingSize] = useState(false);

  // Typecast or cast product to check for availableSizes
  const productSizes = (product as WishlistProductItem).availableSizes || ['Standard'];

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCartClick = () => {
    if (!product.inStock) {
      toast.error('This product is currently out of stock');
      return;
    }

    if (productSizes.length > 1) {
      setIsSelectingSize(true);
    } else {
      addToCartWithSize(productSizes[0] || 'Standard');
    }
  };

  const addToCartWithSize = (selectedSize: string) => {
    void addItem({
      productId: product.id,
      size: selectedSize,
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

    toast.success(`Added ${product.name} to Cart!`);
    setIsSelectingSize(false);
  };

  if (layoutMode === 'grid') {
    return (
      <article className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-background-muted transition-all">
        <Link href={`/products/${product.slug}`} className="relative block h-full w-full">
          <Image
            src={product.image || '/images/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 160px, (max-width: 768px) 128px, 160px"
          />
        </Link>

        {/* Hover Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-background/40 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
          <button
            onClick={() => onRemove?.(product.id)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-lg hover:scale-110 transition-transform"
            aria-label="Remove item"
          >
            <HeartMinusIcon size={20} />
          </button>
          
          <button
            disabled={!product.inStock}
            onClick={handleAddToCartClick}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            aria-label="Add to cart"
          >
            {product.inStock ? <ShoppingBagIcon size={20} /> : <BellIcon size={20} />}
          </button>
        </div>

        {/* Size Selection Overlay (Grid Mode) */}
        <AnimatePresence>
          {isSelectingSize && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md p-4"
            >
              <button
                onClick={() => setIsSelectingSize(false)}
                className="absolute top-2 right-2 text-foreground-subtle hover:text-foreground"
              >
                <CloseIcon size={18} />
              </button>
              <span className="text-[10px] uppercase font-black tracking-widest text-foreground-subtle mb-3">Select Size</span>
              <div className="flex flex-wrap justify-center gap-2">
                {productSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => addToCartWithSize(size)}
                    className="h-8 min-w-8 px-2 rounded-md border border-border bg-background hover:bg-foreground hover:text-background text-xs font-bold transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!product.inStock && !isSelectingSize && (
          <div className="absolute top-2 left-2 z-10 rounded-full bg-background/80 px-2 py-0.5 text-[9px] font-black tracking-wider text-foreground uppercase backdrop-blur-sm">
            Sold Out
          </div>
        )}
      </article>
    );
  }

  // --- LIST MODE (Default) ---
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
      <div className="flex flex-1 flex-col justify-between py-1 relative">
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
          <button
            type="button"
            disabled={!product.inStock}
            onClick={handleAddToCartClick}
            className="bg-foreground text-background hover:bg-foreground/90 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full py-2.5 text-[10px] font-black tracking-widest uppercase shadow-sm transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:py-2.5 sm:text-[11px]"
          >
            {product.inStock ? (
              <>
                <ShoppingBagIcon size={13} />
                Add to Cart
              </>
            ) : (
              <>
                <BellIcon size={13} />
                Notify Me
              </>
            )}
          </button>
        </div>

        {/* Size Selection Overlay (List Mode) */}
        <AnimatePresence>
          {isSelectingSize && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md rounded-2xl"
            >
              <button
                onClick={() => setIsSelectingSize(false)}
                className="absolute top-1 right-1 text-foreground-subtle hover:text-foreground p-1"
              >
                <CloseIcon size={16} />
              </button>
              <span className="text-[10px] uppercase font-black tracking-widest text-foreground-subtle mb-2">Select Size</span>
              <div className="flex flex-wrap justify-center gap-1.5 px-4">
                {productSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => addToCartWithSize(size)}
                    className="h-7 min-w-7 px-1.5 rounded border border-border bg-background hover:bg-foreground hover:text-background text-[11px] font-bold transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}
