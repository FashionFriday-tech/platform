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
  createdAt: string;
}

export function useSearchLogs() {
  const [logs, setLogs] = useState<SearchLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002';

  const fetchLogs = useCallback(async () => {
    if (isLoading) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const q = searchQuery.toLowerCase();
    return logs.filter(
      (log) =>
        log.query.toLowerCase().includes(q) ||
        log.user?.name?.toLowerCase().includes(q) ||
        log.user?.email?.toLowerCase().includes(q),
    );
  }, [logs, searchQuery]);

  // Derived stats
  const totalCount = logs.length;
  const loggedInCount = logs.filter((l) => l.userId !== null).length;
  const guestCount = logs.filter((l) => l.userId === null).length;
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
    refreshLogs: fetchLogs,
    stats: { totalCount, loggedInCount, guestCount, todayCount },
  };
}
