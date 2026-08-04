'use client';

import { useCallback, useEffect, useState } from 'react';

import { type Activity } from '../types';

export function useActivityLog() {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const res = await fetch(`${apiUrl}/admin/dashboard/activity?limit=50`, {
        cache: 'no-store',
        credentials: 'include',
      });
      if (res.ok) {
        const raw = await res.json();
        const mapped: Activity[] = raw.map(
          (item: {
            id: string;
            type: string;
            title: string;
            description: string;
            timeAgo: string;
            timestamp: string;
            user?: { name: string; avatar: string };
          }) => ({
            id: item.id,
            type: (item.type === 'customer' ? 'team' : item.type) as Activity['type'],
            title: item.title,
            description: item.description,
            time: item.timeAgo,
            timestamp: item.timestamp,
            user: item.user || {
              name: item.type === 'order' ? 'Customer' : 'System',
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                item.title.slice(0, 4),
              )}&background=random`,
            },
          }),
        );
        setActivities(mapped);
      }
    } catch (err) {
      console.warn('Failed to fetch activity log', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchActivities();
  }, [fetchActivities]);

  const filteredActivities = activities.filter((activity) => {
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return {
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    filteredActivities,
    isLoading,
    refresh: fetchActivities,
  };
}
