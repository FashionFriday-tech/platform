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
                className="bg-foreground text-background w-full cursor-pointer rounded-full py-3 text-xs font-bold uppercase transition-transform active:scale-95"
              >
                Move to Wishlist
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="hover:bg-destructive hover:text-destructive-foreground w-full cursor-pointer rounded-full bg-red-600 py-3 text-xs font-bold text-white uppercase transition-all"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsConfirming(false);
                }}
                className="text-foreground-muted hover:text-foreground text-[10px] font-bold uppercase transition-colors"
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
            {/* Remove Trigger */}
            <button
              type="button"
              onClick={() => {
                setIsConfirming((prev) => !prev);
              }}
              className="border-border text-foreground-subtle hover:text-destructive hover:border-destructive group/del flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition-all duration-300"
              aria-label="Remove item"
            >
              <CloseIcon size={18} className="transition-transform group-hover/del:scale-110" />
            </button>

            {/* Quantity Toggle */}
            <div className="border-border bg-background-muted/30 flex h-11 items-center rounded-full border px-2">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={!inStock || item.quantity <= 1}
                className="text-foreground-muted hover:text-foreground cursor-pointer p-2 transition-all disabled:opacity-20"
                aria-label="Decrease quantity"
              >
                <MinusIcon size={14} />
              </button>
              <span className="min-w-16 px-4 text-center text-sm font-bold tabular-nums">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={
                  !inStock || Boolean(product?.totalStock && item.quantity >= product.totalStock)
                }
                className="text-foreground-muted hover:text-foreground cursor-pointer p-2 transition-all disabled:opacity-20"
                aria-label="Increase quantity"
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
