'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { type AnalyticsPayload } from '../types';

const STORAGE_KEY = 'ff_admin_analytics_cache_v1';
const POLL_INTERVAL_MS = 15000; // 15 seconds

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsPayload | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored) as AnalyticsPayload;
        }
      } catch {
        // ignore
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(!data);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | null>(() =>
    data?.lastUpdated ? new Date(data.lastUpdated) : null,
  );
  const [timeAgoText, setTimeAgoText] = useState('Just now');
  const isTabVisibleRef = useRef(true);

  const fetchAnalytics = useCallback(async (forceFresh = false) => {
    if (forceFresh) {
      setIsRefreshing(true);
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    const query = forceFresh ? '?fresh=true' : '';

    try {
      const res = await fetch(`${apiUrl}/admin/analytics${query}`, {
        cache: 'no-store',
        credentials: 'include',
      });

      if (res.ok) {
        const json = (await res.json()) as AnalyticsPayload;
        setData(json);
        const fetchTime = new Date();
        setLastFetched(fetchTime);
        setTimeAgoText('Just now');

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
        } catch {
          // ignore quota error
        }
      }
    } catch (err) {
      console.warn('[Analytics] Dynamic fetch error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Update timeAgo counter every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (!lastFetched) return;
      const sec = Math.floor((Date.now() - lastFetched.getTime()) / 1000);
      if (sec < 5) setTimeAgoText('Just now');
      else if (sec < 60) setTimeAgoText(`${sec}s ago`);
      else {
        const min = Math.floor(sec / 60);
        setTimeAgoText(`${min}m ago`);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [lastFetched]);

  // Tab visibility management: pauses polling when hidden, resumes immediately when visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      isTabVisibleRef.current = isVisible;
      if (isVisible) {
        void fetchAnalytics(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchAnalytics]);

  // Periodic polling interval (low power, scalable)
  useEffect(() => {
    void fetchAnalytics(false);

    const interval = setInterval(() => {
      if (isTabVisibleRef.current) {
        void fetchAnalytics(false);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  return {
    analytics: data,
    isLoading,
    isRefreshing,
    lastFetched,
    timeAgoText,
    refresh: () => fetchAnalytics(true),
  };
}
