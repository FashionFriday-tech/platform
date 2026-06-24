'use client';

import { useEffect, useMemo, useState } from 'react';

import { api } from '@/lib/api-client';

import { fetchUserOrdersAction } from '../services/orders.actions';

// Map DB OrderStatus to frontend generic types if needed, or just use strings.
export type FrontendOrderStatus = 'shipping' | 'delivered' | 'canceled' | 'arrived';

export function useOrders() {
  const [activeTab, setActiveTab] = useState<FrontendOrderStatus>('shipping');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      console.log('[useOrders] Fetching user orders list...');
      try {
        // Try server action first
        let data = await fetchUserOrdersAction();
        if (!data || data.length === 0) {
          // Fallback to client fetch
          try {
            data = await api.get<any[]>('/orders/me', { cache: 'no-store' });
          } catch {
            // keep data as is
          }
        }
        console.log(`[useOrders] Loaded ${Array.isArray(data) ? data.length : 0} orders:`, data);
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('[useOrders] Failed to fetch customer orders:', err);
      } finally {
        setLoading(false);
      }
    }
    void fetchOrders();
  }, []);

  const flattenedOrders = useMemo(() => {
    return orders
      .filter((o) => {
        const s = o.status?.toUpperCase();
        if (activeTab === 'shipping') {
          return ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(s);
        }
        if (activeTab === 'delivered' || activeTab === 'arrived') {
          return ['DELIVERED'].includes(s);
        }
        if (activeTab === 'canceled') {
          return ['CANCELLED', 'CANCELED', 'RETURNED', 'REFUNDED'].includes(s);
        }
        return false;
      })
      .flatMap((order) =>
        (order.items || []).map((item: any) => ({
          ...order,
          uniqueShipmentId: `${order.id}-${item.id}`,
          displayItem: item,
        })),
      );
  }, [activeTab, orders]);

  const getCount = (tab: FrontendOrderStatus) => {
    return orders
      .filter((o) => {
        const s = o.status?.toUpperCase();
        if (tab === 'shipping') {
          return ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(s);
        }
        if (tab === 'delivered' || tab === 'arrived') {
          return ['DELIVERED'].includes(s);
        }
        if (tab === 'canceled') {
          return ['CANCELLED', 'CANCELED', 'RETURNED', 'REFUNDED'].includes(s);
        }
        return false;
      })
      .reduce((acc: number, curr: any) => acc + Number(curr.items?.length ?? 0), 0);
  };

  return {
    activeTab,
    setActiveTab,
    flattenedOrders,
    getCount,
    loading,
  };
}
