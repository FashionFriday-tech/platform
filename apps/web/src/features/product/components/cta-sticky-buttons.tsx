'use client';

import React from 'react';

import { HeartFilledIcon, HeartIcon, ShoppingBagIcon } from '@ff/ui';

interface CTAStickyButtonsProps {
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  onBuyNow?: () => void;
  onCartClick?: () => void;
}

const CTAStickyButtons: React.FC<CTAStickyButtonsProps> = ({
  isWishlisted,
  onWishlistToggle,
  onBuyNow,
  onCartClick,
}) => {
  return (
    <div className="border-foreground/10 bg-background/90 fixed right-0 bottom-0 left-0 z-50 flex w-full items-center gap-2 border-t px-4 py-3 backdrop-blur-md md:hidden lg:hidden">
      {/* Wishlist Button */}
      <button
        type="button"
        onClick={onWishlistToggle}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        className={`border-border hover:border-foreground flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-300 active:scale-90 ${
          isWishlisted ? 'border-red-500 bg-red-500/10 text-red-500' : 'text-foreground'
        }`}
      >
        {isWishlisted ? (
          <HeartFilledIcon size={20} className="scale-110 text-red-500" />
        ) : (
          <HeartIcon size={20} />
        )}
      </button>

      {/* Main Buy Button - Centered Pill */}
      <button
        type="button"
        onClick={onBuyNow}
        className="bg-foreground text-background flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-full text-lg font-black uppercase shadow-lg transition-transform outline-none active:scale-95"
      >
        <span className="whitespace-nowrap">Buy Now</span>
      </button>

      {/* Cart/Bag Button */}
      <button
        type="button"
        onClick={onCartClick}
        aria-label="View Cart"
        className="border-border hover:bg-background-muted text-foreground flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all active:scale-90"
      >
        <ShoppingBagIcon size={18} />
      </button>
    </div>
  );
};

export default CTAStickyButtons;
