'use client';

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { HeartFilledIcon, HeartIcon, ShoppingBagIcon } from '@ff/ui';

interface CTAStickyButtonsProps {
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  onBuyNow?: () => void;
  onCartClick?: () => void;
  isVisible?: boolean;
}

const CTAStickyButtons: React.FC<CTAStickyButtonsProps> = ({
  isWishlisted,
  onWishlistToggle,
  onBuyNow,
  onCartClick,
  isVisible = true,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="sticky-cta-bar"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="border-border/40 bg-background/95 fixed inset-x-0 bottom-0 z-50 w-full border-t px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom,0.625rem))] shadow-[0_-4px_20px_rgba(0,0,0,0.2)] backdrop-blur-md md:hidden lg:hidden"
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

            {/* Main Buy Button - Crossed Style */}
            <button
              type="button"
              onClick={onBuyNow}
              className="flex h-12 flex-1 -skew-x-[12deg] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-black text-white shadow-lg transition-transform outline-none active:scale-95 dark:border-zinc-300 dark:bg-white dark:text-black"
            >
              <span className="skew-x-[12deg] text-sm font-black tracking-widest whitespace-nowrap uppercase">
                Buy Now
              </span>
            </button>

            {/* Cart/Bag Button */}
            <button
              type="button"
              onClick={onCartClick}
              aria-label="View Cart"
              className="border-border hover:bg-foreground/5 text-foreground flex h-12 w-12 shrink-0 -skew-x-[12deg] items-center justify-center overflow-hidden rounded-xl border transition-all active:scale-90"
            >
              <span className="skew-x-[12deg]">
                <ShoppingBagIcon size={18} />
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CTAStickyButtons;
