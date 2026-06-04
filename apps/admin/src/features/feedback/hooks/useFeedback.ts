'use client';

import { useEffect, useMemo, useState } from 'react';

import { type Feedback } from '@ff/schemas';

import { fetcher } from '@/lib/api-client';

export function useFeedback() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const fetchFeedbackList = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const data = await fetcher<Feedback[]>('/feedback/admin');
      setFeedbackList(data);
    } catch (error) {
      console.error('Failed to fetch feedback list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchFeedbackList();
  }, []);

  const filteredFeedbackList = useMemo(() => {
    return feedbackList.filter((item) => {
      const matchesSearch =
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'all' || item.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [feedbackList, searchQuery, selectedType]);

  return {
    feedbackList,
    filteredFeedbackList,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    refreshFeedback: fetchFeedbackList,
  };
}
