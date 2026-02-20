'use client';

import { useState } from 'react';
import Image from 'next/image';

import { CloseIcon, MinusIcon, PlusIcon } from '@ff/ui';

import { type BagItem } from '@/data/bag-items';

interface BagItemCardProps {
  item: BagItem;
}

export function CartItemsCard({ item }: BagItemCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div className="border-border group relative flex w-full flex-row gap-6 border-b py-10 transition-all last:border-0 md:gap-10">
      {/* 1. Optimized Image - Fixed Aspect & Premium Radii */}
      <div className="bg-background-muted relative aspect-square w-40 shrink-0 overflow-hidden rounded-3xl md:w-60">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className={`object-cover transition-transform duration-1000 ease-out group-hover:scale-105 ${
            !item.inStock ? 'opacity-40 grayscale' : ''
          }`}
          sizes="100vw"
        />

        {/* Deletion / Wishlist Overlay Popup */}
        {isConfirming && (
          <div className="bg-background/50 animate-in fade-in zoom-in absolute inset-0 z-10 flex flex-col items-center justify-center p-2 text-center duration-300">
            <div className="flex w-full flex-col gap-2">
              <button
                onClick={() => setIsConfirming(false)} // Replace with actual Wishlist logic
                className="bg-foreground text-background w-full rounded-full py-4 text-xs font-bold uppercase transition-transform active:scale-95"
              >
                Move to Wishlist
              </button>
              <button
                onClick={() => setIsConfirming(false)} // Replace with actual Delete logic
                className="hover:bg-destructive hover:text-destructive-foreground w-full rounded-full bg-red-600 py-3 text-xs font-bold uppercase text-white transition-all"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
      {/* 2. Content Area */}
      <div className="flex flex-col justify-between py-1">
        <div className="flex flex-col items-start justify-between gap-2">
          {/* Info */}
          <div className="space-y-1">
            <h3 className="text-foreground text-lg font-medium leading-tight tracking-tight md:text-3xl">
              {item.name}
            </h3>
            <div className="text-foreground-subtle flex items-center gap-3 text-[11px] text-sm font-semibold uppercase tracking-widest md:text-lg">
              <span className="text-sm md:text-lg">{item.color}</span>
              <span className="bg-border h-3" />
              <span>{item.size}</span>
            </div>
          </div>

          {/* Pricing - Now aligned better */}
          <div className="mt-3 flex items-center gap-4 text-sm md:text-2xl">
            {item.originalPrice && (
              <span className="text-foreground-subtle tabular-nums line-through opacity-50">
                ₹{item.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-foreground font-bold tabular-nums tracking-tight">
              ₹{(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Optimized Delete Trigger */}
            <button
              onClick={() => setIsConfirming((prev) => !prev)}
              className="border-border text-foreground-subtle hover:text-destructive hover:border-destructive group/del flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition-all duration-300"
              aria-label="Remove item"
            >
              <CloseIcon size={18} className="transition-transform group-hover/del:scale-110" />
            </button>

            {/* Quantity Toggle */}
            <div className="border-border bg-background-muted/30 flex h-11 items-center rounded-full border px-2">
              <button
                disabled={!item.inStock || item.quantity <= 1}
                className="text-foreground-muted hover:text-foreground cursor-pointer p-2 transition-all disabled:opacity-20"
              >
                <MinusIcon size={14} />
              </button>
              <span className="min-w-16 px-4 text-center text-sm font-bold tabular-nums">
                {item.quantity}
              </span>
              <button
                disabled={!item.inStock}
                className="text-foreground-muted hover:text-foreground cursor-pointer p-2 transition-all disabled:opacity-20"
              >
                <PlusIcon size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
