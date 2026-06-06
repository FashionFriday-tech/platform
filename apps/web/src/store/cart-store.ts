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
        const { items } = get();
        const size = input.size || 'Standard';
        const color = input.color || 'Standard';
        const addQty = input.quantity || 1;

        // Check for existing variant in local store
        const existingIndex = items.findIndex(
          (item) =>
            item.productId === input.productId && item.size === size && item.color === color,
        );

        let optimisticItems: CartItem[];

        if (existingIndex >= 0) {
          optimisticItems = items.map((item, idx) => {
            if (idx === existingIndex) {
              const maxStock = item.product?.totalStock ?? 10;
              const newQuantity = Math.min(item.quantity + addQty, maxStock, 10);
              return { ...item, quantity: newQuantity };
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
          optimisticItems = [newItem, ...items];
        }

        // Optimistic UI update
        set({ items: optimisticItems });

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
              set({ items: serverItems });
            }
          } catch (error) {
            console.error('Failed to add item to server cart:', error);
          }
        }
      },

      updateQuantity: async (itemId: string, quantity: number, isAuthenticated = false) => {
        const { items } = get();

        if (quantity <= 0) {
          set({ items: items.filter((item) => item.id !== itemId) });
        } else {
          set({
            items: items.map((item) => {
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
              set({ items: serverItems });
            }
          } catch (error) {
            console.error('Failed to update cart quantity on server:', error);
          }
        }
      },

      removeItem: async (itemId: string, isAuthenticated = false) => {
        const { items } = get();
        set({ items: items.filter((item) => item.id !== itemId) });

        if (isAuthenticated) {
          try {
            const serverItems = await removeCartItemAction(itemId);
            if (serverItems) {
              set({ items: serverItems });
            }
          } catch (error) {
            console.error('Failed to remove cart item on server:', error);
          }
        }
      },

      clearCart: async (isAuthenticated = false) => {
        set({ items: [] });

        if (isAuthenticated) {
          try {
            await clearCartAction();
          } catch (error) {
            console.error('Failed to clear cart on server:', error);
          }
        }
      },

      syncWithServer: async (isAuthenticated = false) => {
        if (!isAuthenticated) {
          set({ isInitialized: true });
          return;
        }

        if (get().loading) {
          return;
        }

        set({ loading: true });
        try {
          const localItems = get().items;

          // If guest added items locally, send them to sync endpoint
          if (localItems.length > 0) {
            const syncPayload = localItems.map((item) => ({
              productId: item.productId,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
            }));

            const merged = await syncCartAction(syncPayload);
            if (merged && merged.length > 0) {
              set({ items: merged, isInitialized: true });
              return;
            }
          }

          // Otherwise fetch existing user cart from database
          const remote = await fetchUserCartAction();
          set({ items: remote, isInitialized: true });
        } catch (error) {
          console.error('Failed to sync cart with server:', error);
        } finally {
          set({ loading: false, isInitialized: true });
        }
      },
    }),
    {
      name: 'ff_cart_storage',
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
