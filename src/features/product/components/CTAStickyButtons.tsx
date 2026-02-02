"use client";

import React from "react";
import { Heart, HeartPlus, ShoppingBag } from "lucide-react";

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
    <>
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-[100] w-full bg-black border-t border-white/10 px-4 py-3 flex items-center gap-2 lg:hidden">
        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted((prev) => !prev)}
          aria-label="Toggle wishlist"
          className={`h-12 w-12 shrink-0 flex items-center justify-center rounded-full transition-all duration-300 border border-white/50`}
        >
          {isWishlisted ? (
            <Heart size={20} fill="currentColor" />
          ) : (
            <HeartPlus size={20} className="animate-pulse" />
          )}
        </button>

        {/* Main Buy Button - Centered Pill */}
        <button
          onClick={onBuyNow}
          className="flex-1 h-12 flex justify-center items-center text-lg font-black uppercase border border-white/50 rounded-full cursor-pointer hover:bg-white/5 transition-colors overflow-hidden outline-none"
        >
          <span className="bg-[linear-gradient(90deg,#ffffff,#9ca3af,#ffffff,#9ca3af,#ffffff)] bg-[length:400%_100%] bg-clip-text text-transparent animate-glaze whitespace-nowrap">
            Buy Now
          </span>
        </button>

        {/* Cart/Bag Button */}
        <button
          onClick={onCartClick}
          aria-label="View Cart"
          className="h-12 w-12 shrink-0 flex items-center justify-center rounded-full border border-white/50 text-white hover:bg-white/10 transition-all active:scale-90"
        >
          <ShoppingBag size={18} />
        </button>
      </div>
    </>
  );
};

export default CTAStickyButtons;
