// eslint-disable-next-line unicorn/filename-case
// eslint-disable-next-line unicorn/filename-case
'use client';

import { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ActivityType, MOCK_ACTIVITY_LOG } from '../types';

export function useActivityLog() {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = MOCK_ACTIVITY_LOG.filter((activity) => {
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
  };
}
