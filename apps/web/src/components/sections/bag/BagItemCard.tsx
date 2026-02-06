"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon, CloseIcon, HeartIcon, TrashIcon } from "@ff/ui";
import { BagItem } from "@/data/bagItems";

interface BagItemCardProps {
  item: BagItem;
}

export default function BagItemCard({ item }: BagItemCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div className="w-full group relative flex flex-row gap-6 md:gap-10 py-10 border-b border-border last:border-0 transition-all">
      {/* 1. Optimized Image - Fixed Aspect & Premium Radii */}
      <div className="relative shrink-0 overflow-hidden rounded-3xl bg-background-muted w-40 md:w-60  aspect-square">
        <img
          src={item.image}
          alt={item.name}
          className={`h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 ${
            !item.inStock ? "opacity-40 grayscale" : ""
          }`}
        />

        {/* Deletion / Wishlist Overlay Popup */}
        {isConfirming && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50 animate-in fade-in zoom-in duration-300 p-2 text-center">
            <div className="flex flex-col w-full gap-2">
              <button
                onClick={() => setIsConfirming(false)} // Replace with actual Wishlist logic
                className="w-full py-4 bg-foreground text-background text-xs uppercase font-bold rounded-full transition-transform active:scale-95"
              >
                Move to Wishlist
              </button>
              <button
                onClick={() => setIsConfirming(false)} // Replace with actual Delete logic
                className="w-full py-3 bg-red-600 text-white text-xs uppercase font-bold rounded-full hover:bg-destructive hover:text-destructive-foreground transition-all"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
      {/* 2. Content Area */}
      <div className="flex flex-col justify-between py-1">
        <div className="flex flex-col justify-between items-start gap-2">
          {/* Info */}
          <div className="space-y-1">
            <h3 className="text-lg md:text-3xl font-medium text-foreground leading-tight tracking-tight">
              {item.name}
            </h3>
            <div className="flex items-center gap-3 text-[11px] text-foreground-subtle uppercase tracking-widest font-semibold text-sm md:text-lg">
              <span className="text-sm md:text-lg">{item.color}</span>
              <span className="h-3 bg-border" />
              <span>{item.size}</span>
            </div>
          </div>

          {/* Pricing - Now aligned better */}
          <div className="flex items-center gap-4 text-sm md:text-2xl mt-3">
            {item.originalPrice && (
              <span className="text-foreground-subtle line-through opacity-50 tabular-nums">
                ₹{item.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="font-bold tracking-tight text-foreground tabular-nums">
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
              className="flex items-center justify-center h-11 w-11 rounded-full border border-border text-foreground-subtle hover:text-destructive hover:border-destructive transition-all duration-300 cursor-pointer group/del"
              aria-label="Remove item"
            >
              <CloseIcon
                size={18}
                className="group-hover/del:scale-110 transition-transform"
              />
            </button>

            {/* Quantity Toggle */}
            <div className="flex items-center h-11 border border-border rounded-full px-2 bg-background-muted/30">
              <button
                disabled={!item.inStock || item.quantity <= 1}
                className="p-2 text-foreground-muted hover:text-foreground disabled:opacity-20 transition-all cursor-pointer"
              >
                <MinusIcon size={14} />
              </button>
              <span className="px-4 text-sm font-bold tabular-nums text-center min-w-16">
                {item.quantity}
              </span>
              <button
                disabled={!item.inStock}
                className="p-2 text-foreground-muted hover:text-foreground disabled:opacity-20 transition-all cursor-pointer"
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
