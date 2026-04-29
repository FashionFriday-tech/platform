'use client';

import React from 'react';

import { HeartIcon, HeartPlusIcon, ShoppingBagIcon } from '@ff/ui';

interface CTAStickyButtonsProps {
  isWishlisted: boolean;
  setIsWishlisted: React.Dispatch<React.SetStateAction<boolean>>;
  onBuyNow?: () => void;
  onCartClick?: () => void;
}

const CTAStickyButtons: React.FC<CTAStickyButtonsProps> = ({
  isWishlisted,
  setIsWishlisted,
  onBuyNow,
  onCartClick,
}) => {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-[100] flex w-full items-center gap-2 border-t border-white/10 bg-black px-4 py-3 md:hidden lg:hidden">
      {/* Wishlist Button */}
      <button
        onClick={() => {
          setIsWishlisted((prev) => !prev);
        }}
        aria-label="Toggle wishlist"
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/50 transition-all duration-300`}
      >
        {isWishlisted ? (
          <HeartIcon size={20} fill="currentColor" />
        ) : (
          <HeartPlusIcon size={20} className="animate-pulse" />
        )}
      </button>

      {/* Main Buy Button - Centered Pill */}
      <button
        onClick={onBuyNow}
        className="flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/50 text-lg font-black uppercase transition-colors outline-none hover:bg-white/5"
      >
        <span className="animate-glaze bg-[linear-gradient(90deg,#ffffff,#9ca3af,#ffffff,#9ca3af,#ffffff)] bg-[length:400%_100%] bg-clip-text whitespace-nowrap text-transparent">
          Buy Now
        </span>
      </button>

      {/* Cart/Bag Button */}
      <button
        onClick={onCartClick}
        aria-label="View Cart"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/50 text-white transition-all hover:bg-white/10 active:scale-90"
      >
        <ShoppingBagIcon size={18} />
      </button>
    </div>
  );
};

export default CTAStickyButtons;
