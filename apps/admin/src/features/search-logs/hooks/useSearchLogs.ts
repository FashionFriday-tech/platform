'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export interface SearchLogUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface SearchLog {
  id: string;
  query: string;
  userId: string | null;
  user: SearchLogUser | null;
  hasResults?: boolean;
  resultsCount?: number;
  createdAt: string;
}

export type SearchLogFilterType = 'all' | 'results' | 'no_results' | 'members' | 'guests';

export function useSearchLogs() {
  const [logs, setLogs] = useState<SearchLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchLogFilterType>('all');

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002';

  const fetchLogs = useCallback(async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/search-logs/admin`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data as SearchLog[]);
      }
    } catch (error) {
      console.error('Failed to fetch search logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, isLoading]);

  useEffect(() => {
    void fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    let result = logs;

    // Filter by category/status
    if (activeFilter === 'results') {
      result = result.filter((log) => log.hasResults !== false && (log.resultsCount ?? 1) > 0);
    } else if (activeFilter === 'no_results') {
      result = result.filter((log) => log.hasResults === false || log.resultsCount === 0);
    } else if (activeFilter === 'members') {
      result = result.filter((log) => log.userId !== null);
    } else if (activeFilter === 'guests') {
      result = result.filter((log) => log.userId === null);
    }

    if (!searchQuery.trim()) {
      return result;
    }

    const q = searchQuery.toLowerCase();
    return result.filter(
      (log) =>
        log.query.toLowerCase().includes(q) ||
        log.user?.name?.toLowerCase().includes(q) ||
        log.user?.email?.toLowerCase().includes(q),
    );
  }, [logs, activeFilter, searchQuery]);

  // Derived stats
  const totalCount = logs.length;
  const loggedInCount = logs.filter((l) => l.userId !== null).length;
  const guestCount = logs.filter((l) => l.userId === null).length;
  const hasResultsCount = logs.filter(
    (l) => l.hasResults !== false && (l.resultsCount ?? 1) > 0,
  ).length;
  const noResultsCount = logs.filter((l) => l.hasResults === false || l.resultsCount === 0).length;
  const todayCount = logs.filter((l) => {
    const d = new Date(l.createdAt);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }).length;

  return {
    logs,
    filteredLogs,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    refreshLogs: fetchLogs,
    stats: {
      totalCount,
      loggedInCount,
      guestCount,
      hasResultsCount,
      noResultsCount,
      todayCount,
    },
  };
}
