'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { CloseIcon, MinusIcon, PlusIcon } from '@ff/ui';
import { toast } from 'sonner';

import { useWishlist } from '@/features/wishlist';

import { useCart } from '../hooks/use-cart';
import { type CartItem } from '../types';

interface BagItemCardProps {
  item: CartItem;
}

export function CartItemsCard({ item }: BagItemCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const { updateQuantity, removeItem } = useCart();
  const { toggleWishlist, isItemWishlisted } = useWishlist();

  const product = item.product;
  const inStock = (product?.totalStock ?? 1) > 0;
  const sellingPrice = product?.sellingPrice ?? 0;
  const ogPrice = product?.ogPrice;
  const mainImage = product?.mainImage || '/images/placeholders/2.png';
  const name = product?.name || 'Product';
  const slug = product?.slug || '';

  const handleIncrement = () => {
    const maxStock = product?.totalStock ?? 10;
    if (item.quantity >= maxStock) {
      toast.warning(`Only ${maxStock} items available in stock`);
      return;
    }
    void updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      void updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    void removeItem(item.id);
    setIsConfirming(false);
    toast.success('Item removed from bag');
  };

  const handleMoveToWishlist = () => {
    if (product) {
      if (!isItemWishlisted(product.id)) {
        void toggleWishlist({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.sellingPrice,
          originalPrice: product.ogPrice,
          image: product.mainImage,
          color: item.color,
          size: item.size,
          inStock,
        });
      }
      void removeItem(item.id);
      setIsConfirming(false);
      toast.success('Moved to wishlist');
    }
  };

  return (
    <div className="border-border group relative flex w-full flex-row gap-6 border-b py-10 transition-all last:border-0 md:gap-10">
      {/* 1. Optimized Image */}
      <div className="bg-background-muted relative aspect-square w-40 shrink-0 overflow-hidden rounded-3xl md:w-60">
        <Link href={slug ? `/products/${slug}` : '#'}>
          <Image
            src={mainImage}
            alt={name}
            fill
            className={`object-cover transition-transform duration-1000 ease-out group-hover:scale-105 ${
              !inStock ? 'opacity-40 grayscale' : ''
            }`}
            sizes="(max-width: 768px) 160px, 240px"
          />
        </Link>

        {/* Deletion / Wishlist Overlay Popup */}
        {isConfirming && (
          <div className="bg-background/80 animate-in fade-in zoom-in absolute inset-0 z-10 flex flex-col items-center justify-center p-3 text-center backdrop-blur-xs duration-200">
            <div className="flex w-full flex-col gap-2">
              <button
                type="button"
                onClick={handleMoveToWishlist}
                className="bg-foreground text-background w-full -skew-x-[12deg] cursor-pointer rounded-xl py-2.5 text-xs font-black uppercase transition-transform active:scale-95"
              >
                <span className="skew-x-[12deg] block">Move to Wishlist</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="hover:bg-destructive hover:text-destructive-foreground w-full -skew-x-[12deg] cursor-pointer rounded-xl bg-red-600 py-2.5 text-xs font-black text-white uppercase transition-all active:scale-95"
              >
                <span className="skew-x-[12deg] block">Remove</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsConfirming(false);
                }}
                className="text-foreground-muted hover:text-foreground text-[10px] font-black uppercase transition-colors"
              >
                Cancel
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
            <Link href={slug ? `/products/${slug}` : '#'}>
              <h3 className="text-foreground hover:text-brand text-lg leading-tight font-medium tracking-tight transition-colors md:text-3xl">
                {name}
              </h3>
            </Link>
            <div className="text-foreground-subtle flex items-center gap-3 text-[11px] font-semibold tracking-widest uppercase md:text-sm">
              <span>{item.color}</span>
              <span className="bg-border h-3 w-px" />
              <span>{item.size}</span>
              {!inStock && <span className="font-bold text-red-500">• Out of Stock</span>}
            </div>
          </div>

          {/* Pricing */}
          <div className="mt-3 flex items-center gap-4 text-sm md:text-2xl">
            {ogPrice && ogPrice > sellingPrice && (
              <span className="text-foreground-subtle tabular-nums line-through opacity-50">
                ₹{(ogPrice * item.quantity).toLocaleString()}
              </span>
            )}
            <span className="text-foreground font-bold tracking-tight tabular-nums">
              ₹{(sellingPrice * item.quantity).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Remove Trigger - Crossed Style */}
            <button
              type="button"
              onClick={() => {
                setIsConfirming((prev) => !prev);
              }}
              className="border-border text-foreground-subtle hover:text-destructive hover:border-destructive group/del flex h-10 w-10 shrink-0 -skew-x-[12deg] cursor-pointer items-center justify-center overflow-hidden rounded-xl border transition-all duration-300 active:scale-90"
              aria-label="Remove item"
            >
              <span className="skew-x-[12deg]">
                <CloseIcon size={16} className="transition-transform group-hover/del:scale-110" />
              </span>
            </button>

            {/* Quantity Toggle - Crossed Style */}
            <div className="border-border bg-background-muted/30 flex h-10 -skew-x-[12deg] items-center overflow-hidden rounded-xl border px-1">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={!inStock || item.quantity <= 1}
                className="text-foreground-muted hover:text-foreground cursor-pointer p-2 transition-all active:scale-90 disabled:opacity-20"
                aria-label="Decrease quantity"
              >
                <span className="skew-x-[12deg] block">
                  <MinusIcon size={12} />
                </span>
              </button>
              <span className="min-w-12 px-2 text-center text-xs font-black tabular-nums">
                <span className="skew-x-[12deg] block">
                  {item.quantity}
                </span>
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={
                  !inStock || Boolean(product?.totalStock && item.quantity >= product.totalStock)
                }
                className="text-foreground-muted hover:text-foreground cursor-pointer p-2 transition-all active:scale-90 disabled:opacity-20"
                aria-label="Increase quantity"
              >
                <span className="skew-x-[12deg] block">
                  <PlusIcon size={12} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
