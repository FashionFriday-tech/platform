'use client';

import { useCallback, useEffect, useState } from 'react';

export interface DashboardStats {
  totalSales: number;
  todaySales: number;
  salesGrowthPercentage: number;
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalProducts: number;
  lowStockCount: number;
  totalCustomers: number;
  newCustomersToday: number;
  totalSellers: number;
  totalReviews: number;
  lastUpdated: string;
}

export interface DashboardActivity {
  id: string;
  type: 'order' | 'product' | 'customer';
  title: string;
  description: string;
  timestamp: string;
  timeAgo: string;
  user: {
    name: string;
    avatar: string;
  };
  status?: string;
  amount?: number;
}

const STATS_STORAGE_KEY = 'ff_admin_dash_stats_cache';
const ACTIVITY_STORAGE_KEY = 'ff_admin_dash_activity_cache';

const DEFAULT_STATS: DashboardStats = {
  totalSales: 0,
  todaySales: 0,
  salesGrowthPercentage: 0,
  totalOrders: 0,
  todayOrders: 0,
  pendingOrders: 0,
  shippedOrders: 0,
  deliveredOrders: 0,
  totalProducts: 0,
  lowStockCount: 0,
  totalCustomers: 0,
  newCustomersToday: 0,
  totalSellers: 0,
  totalReviews: 0,
  lastUpdated: new Date().toISOString(),
};

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(STATS_STORAGE_KEY);
        if (cached) {
          return JSON.parse(cached) as DashboardStats;
        }
      } catch {
        // ignore
      }
    }
    return DEFAULT_STATS;
  });

  const [activities, setActivities] = useState<DashboardActivity[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(ACTIVITY_STORAGE_KEY);
        if (cached) {
          return JSON.parse(cached) as DashboardActivity[];
        }
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchDashboardData = useCallback(async (isManual = false) => {
    if (isManual) {
      setIsRefreshing(true);
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

    try {
      const [statsRes, activityRes] = await Promise.all([
        fetch(`${apiUrl}/admin/dashboard/stats`, { cache: 'no-store', credentials: 'include' }),
        fetch(`${apiUrl}/admin/dashboard/activity`, { cache: 'no-store', credentials: 'include' }),
      ]);

      if (statsRes.ok) {
        const statsData = (await statsRes.json()) as DashboardStats;
        setStats(statsData);
        try {
          localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(statsData));
        } catch {
          // ignore
        }
      }

      if (activityRes.ok) {
        const activityData = (await activityRes.json()) as DashboardActivity[];
        setActivities(activityData);
        try {
          localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activityData));
        } catch {
          // ignore
        }
      }

      setLastFetched(new Date());
    } catch (err) {
      console.warn('[Dashboard] Error fetching dynamic dashboard data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboardData();

    // Poll every 30 seconds for live operational stats
    const interval = setInterval(() => {
      void fetchDashboardData();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchDashboardData]);

  return {
    stats,
    activities,
    isLoading,
    isRefreshing,
    lastFetched,
    refresh: () => fetchDashboardData(true),
  };
}
