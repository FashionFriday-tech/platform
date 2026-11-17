'use client';

import { useCallback, useEffect, useState } from 'react';

import { type SellerOrder, type SellerProduct } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002';

export function useSellerDetails(sellerId?: string | null) {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!sellerId) {
      setOrders([]);
      return;
    }
    try {
      setIsLoadingOrders(true);
      const res = await fetch(`${API_BASE_URL}/admin/sellers/${sellerId}/orders`);
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch seller orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [sellerId]);

  const fetchProducts = useCallback(async () => {
    if (!sellerId) {
      setProducts([]);
      return;
    }
    try {
      setIsLoadingProducts(true);
      const res = await fetch(`${API_BASE_URL}/admin/sellers/${sellerId}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch seller products:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [sellerId]);

  useEffect(() => {
    if (sellerId) {
      void fetchOrders();
      void fetchProducts();
    } else {
      setOrders([]);
      setProducts([]);
    }
  }, [sellerId, fetchOrders, fetchProducts]);

  return {
    orders,
    products,
    isLoadingOrders,
    isLoadingProducts,
    refetchOrders: fetchOrders,
    refetchProducts: fetchProducts,
  };
}
