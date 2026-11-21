'use client';

import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api-client';

import { type SellerOrder, type SellerProduct } from '../types';

export function useSellerDetails(sellerId?: string | null) {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const fetchOrders = useCallback(
    async (silent = false) => {
      if (!sellerId) {
        setOrders([]);
        return;
      }
      try {
        if (!silent) {
          setIsLoadingOrders(true);
        }
        const data = await api.get<SellerOrder[]>(`/admin/sellers/${sellerId}/orders`, {
          cache: 'no-store',
          params: { _t: Date.now() },
        });
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch seller orders:', err);
      } finally {
        if (!silent) {
          setIsLoadingOrders(false);
        }
      }
    },
    [sellerId],
  );

  const fetchProducts = useCallback(
    async (silent = false) => {
      if (!sellerId) {
        setProducts([]);
        return;
      }
      try {
        if (!silent) {
          setIsLoadingProducts(true);
        }
        const data = await api.get<SellerProduct[]>(`/admin/sellers/${sellerId}/products`, {
          cache: 'no-store',
          params: { _t: Date.now() },
        });
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch seller products:', err);
      } finally {
        if (!silent) {
          setIsLoadingProducts(false);
        }
      }
    },
    [sellerId],
  );

  // Initial fetch on mount or seller change
  useEffect(() => {
    if (sellerId) {
      void fetchOrders();
      void fetchProducts();
    } else {
      setOrders([]);
      setProducts([]);
    }
  }, [sellerId, fetchOrders, fetchProducts]);

  // Reactive updates when orders are updated, window focused, or cross-tab mutation happens
  useEffect(() => {
    if (!sellerId) {
      return;
    }

    const handleSync = () => {
      void fetchOrders(true);
    };

    window.addEventListener('ff-orders-updated', handleSync);
    window.addEventListener('focus', handleSync);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleSync();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'ff_order_mutation_ts') {
        handleSync();
      }
    };
    window.addEventListener('storage', handleStorage);

    // Light periodic polling every 10 seconds while tab is active to guarantee realtime sync
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        void fetchOrders(true);
      }
    }, 10000);

    return () => {
      window.removeEventListener('ff-orders-updated', handleSync);
      window.removeEventListener('focus', handleSync);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [sellerId, fetchOrders]);

  return {
    orders,
    products,
    isLoadingOrders,
    isLoadingProducts,
    refetchOrders: fetchOrders,
    refetchProducts: fetchProducts,
  };
}
