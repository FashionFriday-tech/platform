import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  fetchUserWishlistAction,
  removeWishlistItemAction,
  syncWishlistAction,
  toggleWishlistAction,
} from '@/features/wishlist/services/wishlist.actions';

export interface WishlistProductItem {
  id: string;
  name: string;
  slug: string;
  category?: string;
  price: number;
  originalPrice?: number;
  image: string;
  color?: string;
  size?: string;
  inStock?: boolean;
}

interface WishlistState {
  items: WishlistProductItem[];
  loading: boolean;
  isInitialized: boolean;

  // Actions
  toggleItem: (product: WishlistProductItem, isAuthenticated?: boolean) => Promise<void>;
  removeItem: (productId: string, isAuthenticated?: boolean) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  syncWithServer: (isAuthenticated?: boolean) => Promise<void>;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      isInitialized: false,

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.id === productId);
      },

      toggleItem: async (product: WishlistProductItem, isAuthenticated = false) => {
        const { items } = get();
        const exists = items.some((item) => item.id === product.id);

        // Optimistic UI Update (Instant response)
        if (exists) {
          set({ items: items.filter((item) => item.id !== product.id) });
        } else {
          set({ items: [product, ...items] });
        }

        // If authenticated, sync with database
        if (isAuthenticated) {
          try {
            await toggleWishlistAction(product.id);
          } catch (error) {
            console.error('Failed to toggle wishlist on server:', error);
            // Rollback optimistic update on server error
            set({ items });
          }
        }
      },

      removeItem: async (productId: string, isAuthenticated = false) => {
        const { items } = get();
        const previousItems = [...items];

        // Optimistic UI update
        set({ items: items.filter((item) => item.id !== productId) });

        if (isAuthenticated) {
          try {
            await removeWishlistItemAction(productId);
          } catch (error) {
            console.error('Failed to remove item on server:', error);
            set({ items: previousItems });
          }
        }
      },

      syncWithServer: async (isAuthenticated = false) => {
        if (!isAuthenticated) {
          set({ isInitialized: true });
          return;
        }

        // Prevent duplicate concurrent sync calls
        if (get().loading) {
          return;
        }

        set({ loading: true });
        try {
          const localIds = get().items.map((item) => item.id);

          // If there are local items from guest session, merge them
          if (localIds.length > 0) {
            const merged = await syncWishlistAction(localIds);
            if (merged && merged.length > 0) {
              const mappedItems: WishlistProductItem[] = merged
                .filter((m) => m.product)
                .map((m) => ({
                  id: m.product!.id,
                  name: m.product!.name,
                  slug: m.product!.slug,
                  category: m.product?.brand?.[0] || 'Apparel',
                  price: Number(m.product!.sellingPrice),
                  originalPrice: Number(m.product!.ogPrice),
                  image: m.product!.mainImage,
                  color: m.product?.colors?.[0] || 'Standard',
                  size: m.product?.sizes?.[0] || 'M',
                  inStock: (m.product?.totalStock ?? 1) > 0,
                }));
              set({ items: mappedItems, isInitialized: true });
              return;
            }
          }

          // Otherwise fetch existing user wishlist from database
          const remote = await fetchUserWishlistAction();
          const mappedItems: WishlistProductItem[] = (remote || [])
            .filter((m) => m?.product)
            .map((m) => ({
              id: m.product!.id,
              name: m.product!.name,
              slug: m.product!.slug,
              category: m.product?.brand?.[0] || 'Apparel',
              price: Number(m.product!.sellingPrice),
              originalPrice: Number(m.product!.ogPrice),
              image: m.product!.mainImage,
              color: m.product?.colors?.[0] || 'Standard',
              size: m.product?.sizes?.[0] || 'M',
              inStock: (m.product?.totalStock ?? 1) > 0,
            }));

          set({ items: mappedItems, isInitialized: true });
        } catch (error) {
          console.error('Failed to sync wishlist with server:', error);
        } finally {
          set({ loading: false, isInitialized: true });
        }
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'ff_wishlist_storage',
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
