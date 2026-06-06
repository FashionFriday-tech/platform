'use client';

import { useEffect, useState } from 'react';

import { useAuthStore } from '@/store/auth-store';
import { useWishlistStore, type WishlistProductItem } from '@/store/wishlist-store';

export function useWishlist() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const user = useAuthStore((state) => state.user);
  const items = useWishlistStore((state) => state.items);
  const loading = useWishlistStore((state) => state.loading);
  const isInitialized = useWishlistStore((state) => state.isInitialized);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  const isAuthenticated = !!user;

  return {
    wishlistItems: isMounted ? items : [],
    hasItems: isMounted ? items.length > 0 : false,
    itemCount: isMounted ? items.length : 0,
    loading,
    isInitialized,
    isMounted,
    toggleWishlist: (product: WishlistProductItem) => toggleItem(product, isAuthenticated),
    removeFromWishlist: (productId: string) => removeItem(productId, isAuthenticated),
    isItemWishlisted: (productId: string) => (isMounted ? isInWishlist(productId) : false),
  };
}
