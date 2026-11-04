import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  addToCartAction,
  clearCartAction,
  fetchUserCartAction,
  removeCartItemAction,
  syncCartAction,
  updateCartQuantityAction,
} from '@/features/cart/services/cart.actions';
import { type AddToCartInput, type CartItem } from '@/features/cart/types';

/**
 * Consolidate duplicate cart items that have the same product and size.
 * Combines their quantities into a single card up to maximum allowed stock.
 */
export function consolidateCartItems(items: CartItem[]): CartItem[] {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return [];
  }

  const map = new Map<string, CartItem>();

  for (const item of items) {
    if (!item) {
      continue;
    }
    const normSize = (item.size || 'Standard').trim().toLowerCase();
    const productId = item.productId || item.product?.id || item.id;
    const key = `${productId}_${normSize}`;
    const existing = map.get(key);

    if (existing) {
      const maxStock = existing.product?.totalStock ?? item.product?.totalStock ?? 10;
      const combinedQty = Math.min(existing.quantity + (item.quantity || 1), maxStock, 10);
      const preferredColor =
        item.color && item.color.toLowerCase() !== 'standard' ? item.color : existing.color;
      const preferredProduct = existing.product || item.product;
      map.set(key, {
        ...existing,
        color: preferredColor,
        quantity: combinedQty,
        product: preferredProduct,
      });
    } else {
      map.set(key, { ...item });
    }
  }

  return Array.from(map.values());
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  isInitialized: boolean;

  // Actions
  addItem: (input: AddToCartInput, isAuthenticated?: boolean) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number, isAuthenticated?: boolean) => Promise<void>;
  removeItem: (itemId: string, isAuthenticated?: boolean) => Promise<void>;
  clearCart: (isAuthenticated?: boolean) => Promise<void>;
  syncWithServer: (isAuthenticated?: boolean) => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      isInitialized: false,

      addItem: async (input: AddToCartInput, isAuthenticated = false) => {
        const currentItems = consolidateCartItems(get().items);
        const size = input.size || 'Standard';
        const normSize = size.trim().toLowerCase();
        const color = input.color || 'Standard';
        const addQty = input.quantity || 1;

        // Check for existing variant in local store by same product and same size
        const existingIndex = currentItems.findIndex(
          (item) =>
            item.productId === input.productId &&
            (item.size || 'Standard').trim().toLowerCase() === normSize,
        );

        let optimisticItems: CartItem[];

        if (existingIndex >= 0) {
          optimisticItems = currentItems.map((item, idx) => {
            if (idx === existingIndex) {
              const maxStock = item.product?.totalStock ?? 10;
              const newQuantity = Math.min(item.quantity + addQty, maxStock, 10);
              const preferredColor =
                color && color.toLowerCase() !== 'standard' ? color : item.color;
              return { ...item, quantity: newQuantity, color: preferredColor };
            }
            return item;
          });
        } else {
          if (!input.product) {
            console.error('Cannot add item without product details');
            return;
          }
          const newItem: CartItem = {
            id: `temp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            productId: input.productId,
            size,
            color,
            quantity: Math.min(addQty, input.product.totalStock || 10, 10),
            product: input.product,
          };
          optimisticItems = [newItem, ...currentItems];
        }

        // Optimistic UI update with consolidated items
        set({ items: consolidateCartItems(optimisticItems) });

        // If authenticated, sync mutation with database
        if (isAuthenticated) {
          try {
            const serverItems = await addToCartAction({
              productId: input.productId,
              size,
              color,
              quantity: addQty,
            });
            if (serverItems && serverItems.length > 0) {
              set({ items: consolidateCartItems(serverItems) });
            }
          } catch (error) {
            console.error('Failed to add item to server cart:', error);
          }
        }
      },

      updateQuantity: async (itemId: string, quantity: number, isAuthenticated = false) => {
        const currentItems = consolidateCartItems(get().items);

        if (quantity <= 0) {
          set({ items: currentItems.filter((item) => item.id !== itemId) });
        } else {
          set({
            items: currentItems.map((item) => {
              if (item.id === itemId) {
                const maxStock = item.product?.totalStock ?? 10;
                return { ...item, quantity: Math.min(quantity, maxStock, 10) };
              }
              return item;
            }),
          });
        }

        if (isAuthenticated) {
          try {
            const serverItems = await updateCartQuantityAction(itemId, quantity);
            if (serverItems) {
              set({ items: consolidateCartItems(serverItems) });
            }
          } catch (error) {
            console.error('Failed to update cart quantity on server:', error);
          }
        }
      },

      removeItem: async (itemId: string, isAuthenticated = false) => {
        const currentItems = consolidateCartItems(get().items);
        set({ items: currentItems.filter((item) => item.id !== itemId) });

        if (isAuthenticated) {
          try {
            const serverItems = await removeCartItemAction(itemId);
            if (serverItems) {
              set({ items: consolidateCartItems(serverItems) });
            }
          } catch (error) {
            console.error('Failed to remove cart item on server:', error);
          }
        }
      },

      clearCart: async (isAuthenticated = false) => {
        console.log('[CartStore] Clearing cart, isAuthenticated:', isAuthenticated);
        set({ items: [] });

        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('ff_cart_storage');
          } catch {
            // Ignore localStorage errors
          }
        }

        if (isAuthenticated) {
          try {
            await clearCartAction();
            console.log('[CartStore] Successfully cleared server cart');
          } catch (error) {
            console.error('[CartStore] Failed to clear cart on server:', error);
          }
        }
      },

      syncWithServer: async (isAuthenticated = false) => {
        console.log('[CartStore] syncWithServer called, isAuthenticated:', isAuthenticated);
        if (!isAuthenticated) {
          set({ isInitialized: true });
          return;
        }

        if (get().loading) {
          console.log('[CartStore] syncWithServer already loading, skipping');
          return;
        }

        set({ loading: true });
        try {
          const localItems = consolidateCartItems(get().items);
          // Identify un-synced guest items (temporary IDs generated in guest session)
          const guestItems = localItems.filter((item) => item.id.startsWith('temp_'));

          if (guestItems.length > 0) {
            console.log(`[CartStore] Found ${guestItems.length} guest items to sync with server`);
            const syncPayload = guestItems.map((item) => ({
              productId: item.productId,
              size: item.size || 'Standard',
              color: item.color || 'Standard',
              quantity: item.quantity || 1,
            }));

            const merged = await syncCartAction(syncPayload);
            if (merged !== null && Array.isArray(merged)) {
              console.log('[CartStore] Guest items merged successfully:', merged.length, 'items');
              set({ items: consolidateCartItems(merged), isInitialized: true });
              return;
            }
          }

          // Otherwise fetch current user cart from database
          console.log('[CartStore] Fetching current user cart from database...');
          const remote = await fetchUserCartAction();
          console.log(
            `[CartStore] Fetched ${Array.isArray(remote) ? remote.length : 0} items from server`,
          );
          set({
            items: consolidateCartItems(Array.isArray(remote) ? remote : []),
            isInitialized: true,
          });
        } catch (error) {
          console.error('[CartStore] Failed to sync cart with server:', error);
        } finally {
          set({ loading: false, isInitialized: true });
        }
      },
    }),
    {
      name: 'ff_cart_storage',
      partialize: (state) => ({ items: consolidateCartItems(state.items) }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.items)) {
          state.items = consolidateCartItems(state.items);
        }
      },
    },
  ),
);
