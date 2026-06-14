'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export interface ProductRequest {
  id: string;
  productName: string;
  imageUrl: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone: string;
  } | null;
}

export function useProductRequests() {
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002';

  const fetchRequests = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/product-requests/admin`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data as ProductRequest[]);
      }
    } catch (error) {
      console.error('Failed to fetch product requests:', error);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, isLoading]);

  useEffect(() => {
    void fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return requests;
    const q = searchQuery.toLowerCase();
    return requests.filter(
      (r) =>
        r.productName.toLowerCase().includes(q) ||
        r.user?.name?.toLowerCase().includes(q) ||
        r.user?.email?.toLowerCase().includes(q),
    );
  }, [requests, searchQuery]);

  // Derived stats
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setDate(now.getDate() - 30);

  const thisWeekCount = requests.filter((r) => new Date(r.createdAt) >= oneWeekAgo).length;
  const thisMonthCount = requests.filter((r) => new Date(r.createdAt) >= oneMonthAgo).length;
  const uniqueUsers = new Set(requests.map((r) => r.user?.email).filter(Boolean)).size;

  return {
    requests,
    filteredRequests,
    isLoading,
    searchQuery,
    setSearchQuery,
    refreshRequests: fetchRequests,
    stats: {
      total: requests.length,
      thisWeek: thisWeekCount,
      thisMonth: thisMonthCount,
      uniqueUsers,
    },
  };
}
