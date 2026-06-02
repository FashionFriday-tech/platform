'use client';

import { useEffect, useState } from 'react';

export interface WhatsAppReview {
  id: string;
  imageUrl: string;
  sortOrder: number;
  createdAt: string;
}

export function useWhatsAppReviews() {
  const [reviews, setReviews] = useState<WhatsAppReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';

  const fetchReviews = async (newOffset: number, clearPrevious = false) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/admin/whatsapp-reviews?limit=${limit}&offset=${newOffset}`,
      );
      if (res.ok) {
        const data = await res.json();
        if (data.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
        setReviews((prev) => (clearPrevious ? data : [...prev, ...data]));
        setOffset(newOffset);
      }
    } catch (error) {
      console.error('Failed to fetch WhatsApp reviews:', error);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchReviews(0, true);
  }, []);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchReviews(offset + limit);
    }
  };

  const uploadReview = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/admin/whatsapp-reviews`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Upload failed');
    }
    // Clear and refetch from start on fresh upload
    setHasMore(true);
    await fetchReviews(0, true);
  };

  const deleteReview = async (id: string) => {
    const res = await fetch(`${API_URL}/admin/whatsapp-reviews/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Delete failed');
    }
    // Clear and refetch from start on deletion
    setHasMore(true);
    await fetchReviews(0, true);
  };

  return {
    reviews,
    isLoading,
    isInitialLoad,
    hasMore,
    loadMore,
    uploadReview,
    deleteReview,
    refreshReviews: () => fetchReviews(0, true),
  };
}
