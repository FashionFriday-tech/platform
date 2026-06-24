'use client';

import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api-client';

export interface OrderStatsSummary {
  unplacedCount: number;
  totalOrders: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useOrderStats(): OrderStatsSummary {
  const [unplacedCount, setUnplacedCount] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchStats = useCallback(async () => {
    try {
      // 1. Try dedicated stats endpoint
      try {
        const stats = (await api.get('/orders/stats', { cache: 'no-store' })) as any;
        if (stats && typeof stats.unplacedCount === 'number') {
          setUnplacedCount(stats.unplacedCount);
          setTotalOrders(stats.totalOrders ?? 0);
          setIsLoading(false);
          return;
        }
      } catch {
        // Fallback below if endpoint not active yet
      }

      // 2. Fallback to /orders/admin
      const orders = await api.get('/orders/admin', { cache: 'no-store' });
      if (Array.isArray(orders)) {
        const unplaced = orders.filter((o: any) => {
          const status = (o.status || '').toLowerCase();
          return status === 'pending' || status === 'confirmed';
        }).length;

        setUnplacedCount(unplaced);
        setTotalOrders(orders.length);
      }
    } catch (err) {
      console.error('Failed to fetch order stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStats();

    // Poll every 30 seconds for live order count updates
    const interval = setInterval(() => {
      void fetchStats();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchStats]);

  return {
    unplacedCount,
    totalOrders,
    isLoading,
    refresh: fetchStats,
  };
}
