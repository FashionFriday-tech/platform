'use client';

import { useEffect } from 'react';

import { useAuthStore } from '@/store/auth-store';
import { useWishlistStore, type WishlistProductItem } from '@/store/wishlist-store';

export function useWishlist() {
  const user = useAuthStore((state) => state.user);
  const items = useWishlistStore((state) => state.items);
  const loading = useWishlistStore((state) => state.loading);
  const isInitialized = useWishlistStore((state) => state.isInitialized);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const syncWithServer = useWishlistStore((state) => state.syncWithServer);

  const isAuthenticated = !!user;

  // Auto-sync with server on mount or when user authentication state changes
  useEffect(() => {
    void syncWithServer(isAuthenticated);
  }, [isAuthenticated, syncWithServer]);

  return {
    wishlistItems: items,
    hasItems: items.length > 0,
    itemCount: items.length,
    loading,
    isInitialized,
    toggleWishlist: (product: WishlistProductItem) => toggleItem(product, isAuthenticated),
    removeFromWishlist: (productId: string) => removeItem(productId, isAuthenticated),
    isItemWishlisted: (productId: string) => isInWishlist(productId),
  };
}
