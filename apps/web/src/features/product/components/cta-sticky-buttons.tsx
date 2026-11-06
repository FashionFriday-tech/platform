'use client';

import React from 'react';

import { AddToCartIcon, BellIcon, HeartFilledIcon, HeartIcon } from '@ff/ui';
import { motion } from 'motion/react';

interface CTAStickyButtonsProps {
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  onBuyNow?: () => void;
  onAddToCart?: () => void;
  onCartClick?: () => void;
  isVisible?: boolean;
  isSoldOut?: boolean;
  onNotifyMe?: () => void;
  isNotified?: boolean;
}

const CTAStickyButtons: React.FC<CTAStickyButtonsProps> = ({
  isWishlisted,
  onWishlistToggle,
  onBuyNow,
  onAddToCart,
  onCartClick,
  isVisible = true,
  isSoldOut = false,
  onNotifyMe,
  isNotified = false,
}) => {
  return (
    <motion.div
      initial={false}
      animate={{
        y: isVisible ? '0%' : '115%',
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`border-border/40 bg-background/95 fixed inset-x-0 bottom-0 z-50 w-full border-t px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom,0.625rem))] shadow-[0_-4px_20px_rgba(0,0,0,0.2)] backdrop-blur-md will-change-transform md:hidden lg:hidden ${
        isVisible ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div className="mx-auto flex w-full max-w-lg items-center gap-3">
        {/* Wishlist Button */}
        <button
          type="button"
          onClick={onWishlistToggle}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`flex h-12 w-12 shrink-0 -skew-x-[12deg] items-center justify-center overflow-hidden rounded-xl border transition-all duration-200 active:scale-90 ${
            isWishlisted
              ? 'border-black bg-black text-white shadow-md dark:border-white'
              : 'border-border text-foreground hover:border-foreground/60'
          }`}
        >
          <span className="skew-x-[12deg]">
            {isWishlisted ? (
              <HeartFilledIcon size={20} className="scale-110 fill-white text-white" />
            ) : (
              <HeartIcon size={20} />
            )}
          </span>
        </button>

        {/* Main Action Button: Notify Me (if Sold Out) or Buy Now */}
        {isSoldOut ? (
          <button
            type="button"
            onClick={onNotifyMe}
            className={`flex h-12 flex-1 -skew-x-[12deg] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border shadow-lg transition-transform outline-none active:scale-95 ${
              isNotified
                ? 'border-emerald-600 bg-emerald-600 text-white shadow-emerald-500/20'
                : 'border-zinc-800 bg-black text-white hover:border-zinc-700 dark:border-zinc-300 dark:bg-white dark:text-black'
            }`}
          >
            <span className="flex skew-x-[12deg] items-center gap-2 text-sm font-black tracking-widest uppercase">
              <BellIcon size={18} />
              {isNotified ? 'Subscribed' : 'Notify Me'}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onBuyNow}
            className="flex h-12 flex-1 -skew-x-[12deg] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-black text-white shadow-lg transition-transform outline-none active:scale-95 dark:border-zinc-300 dark:bg-white dark:text-black"
          >
            <span className="skew-x-[12deg] text-sm font-black tracking-widest whitespace-nowrap uppercase">
              Buy Now
            </span>
          </button>
        )}

        {/* Add to Cart Button (only if not sold out) */}
        {!isSoldOut && (
          <button
            type="button"
            onClick={onAddToCart || onCartClick}
            aria-label="Add to Cart"
            className="border-border hover:bg-foreground/5 text-foreground flex h-12 w-12 shrink-0 -skew-x-[12deg] cursor-pointer items-center justify-center overflow-hidden rounded-xl border transition-all active:scale-90"
          >
            <span className="skew-x-[12deg]">
              <AddToCartIcon size={20} />
            </span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default CTAStickyButtons;
