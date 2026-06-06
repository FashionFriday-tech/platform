'use client';

import { useEffect, useMemo, useState } from 'react';

import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';

import { type AddToCartInput, type CartTotals } from '../types';

export function useCart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const loading = useCartStore((state) => state.loading);
  const isInitialized = useCartStore((state) => state.isInitialized);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const isAuthenticated = !!user;

  const totals: CartTotals = useMemo(() => {
    let subtotal = 0;
    let originalSubtotal = 0;
    let totalQuantity = 0;

    for (const item of items) {
      const price = item.product?.sellingPrice ?? 0;
      const ogPrice = item.product?.ogPrice ?? price;
      const qty = item.quantity || 1;

      subtotal += price * qty;
      originalSubtotal += ogPrice * qty;
      totalQuantity += qty;
    }

    const discount = Math.max(0, originalSubtotal - subtotal);
    const shipping = 0; // Free standard shipping
    const total = subtotal + shipping;

    return {
      subtotal,
      originalSubtotal,
      discount,
      shipping,
      total,
      itemCount: items.length,
      totalQuantity,
    };
  }, [items]);

  return {
    cartItems: isMounted ? items : [],
    hasItems: isMounted ? items.length > 0 : false,
    itemCount: isMounted ? items.length : 0,
    totalQuantity: isMounted ? totals.totalQuantity : 0,
    totals: isMounted
      ? totals
      : {
          subtotal: 0,
          originalSubtotal: 0,
          discount: 0,
          shipping: 0,
          total: 0,
          itemCount: 0,
          totalQuantity: 0,
        },
    loading,
    isInitialized,
    isMounted,
    addItem: (input: AddToCartInput) => addItem(input, isAuthenticated),
    updateQuantity: (itemId: string, quantity: number) =>
      updateQuantity(itemId, quantity, isAuthenticated),
    removeItem: (itemId: string) => removeItem(itemId, isAuthenticated),
    clearCart: () => clearCart(isAuthenticated),
  };
}
