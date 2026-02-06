"use client";

import Link from "next/link";
import { ShoppingBagIcon, AlertCircleIcon, HeartMinusIcon, BellIcon } from "@ff/ui";
import { Product } from "@/types/wishlist";
import { cn } from "@/lib/utils";
interface WishlistCardProps {
  product: Product;
}

export default function WishlistCard({ product }: WishlistCardProps) {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <article className="group relative flex justify-center w-full items-center gap-4 border-y rounded-4xl py-6 border-border ">
      {/* 1. Left Side: Image Container */}
      <div className="relative aspect-square w-40 shrink-0 overflow-hidden rounded-2xl bg-background-muted sm:w-32 md:w-40">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/40 backdrop-blur-[1px]">
            <div className="rounded-full bg-background/80 px-2 py-1 text-[8px] font-bold uppercase tracking-tighter text-foreground sm:text-[10px]">
              Sold Out
            </div>
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute left-2 top-2">
            <span className="rounded-full bg-background px-2 py-0.5 text-[8px] font-bold text-foreground uppercase tracking-tighter sm:text-[10px]">
              -{discount}%
            </span>
          </div>
        )}
      </div>

      {/* 2. Right Side: Product Details */}
      <div className="flex flex-1 flex-col justify-between self-stretch py-1">
        <div className="flex justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase tracking-widest text-foreground-subtle">
              {product.category}
            </p>
            <h3 className="mt-1 text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-foreground-muted sm:text-base">
              <Link href={`/product/${product.slug}`}>{product.name}</Link>
            </h3>
            <p className="mt-1 text-xs text-foreground-subtle">
              {product.color} • {product.size}
            </p>

            <div className="flex gap-4 justify-start items-center mt-4">
              <span className="font-bold text-foreground ">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-foreground-subtle line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Price and Actions Row */}
        <div className="mt-auto flex items-center justify-between gap-2 w-full pr-2">
          {/* Remove Button */}
          <button
            className="flex justify-center items-center shrink-0 rounded-full border border-border h-10 w-10 p-2 text-foreground-subtle transition-all hover:bg-destructive hover:text-destructive-foreground active:scale-90"
            aria-label="Remove from favorites"
          >
            <HeartMinusIcon size={16} />
          </button>
          {/* Move to Bag Button */}
          <button
            disabled={!product.inStock}
            className="w-full flex justify-center items-center gap-2 rounded-full py-2.5 text-[10px] font-bold uppercase tracking-widest transition-transform active:scale-95 sm:px-6 sm:py-2.5 sm:text-xs shadow-sm bg-foreground text-background"
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
