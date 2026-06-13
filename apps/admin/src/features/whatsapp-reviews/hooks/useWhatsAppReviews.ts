'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface WhatsAppReview {
  id: string;
  imageUrl: string;
  sortOrder: number;
  createdAt: string;
}

export function useWhatsAppReviews() {
  const [reviews, setReviews] = useState<WhatsAppReview[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const offsetRef = useRef(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002';

  const fetchReviews = useCallback(
    async (newOffset: number, clearPrevious = false) => {
      if (isLoadingRef.current || (!clearPrevious && !hasMoreRef.current)) {
        return;
      }
      isLoadingRef.current = true;
      setIsLoading(true);

      try {
        const res = await fetch(
          `${API_URL}/admin/whatsapp-reviews?limit=${limit}&offset=${newOffset}`,
        );
        if (res.ok) {
          const data = await res.json();
          const items: WhatsAppReview[] = Array.isArray(data) ? data : (data.items ?? []);
          const total: number =
            typeof data.total === 'number'
              ? data.total
              : Array.isArray(data)
                ? data.length
                : items.length;

          setTotalCount(total);
          const moreAvailable = newOffset + items.length < total;
          hasMoreRef.current = moreAvailable;
          setHasMore(moreAvailable);

          setReviews((prev) => (clearPrevious ? items : [...prev, ...items]));
          offsetRef.current = newOffset;
          setOffset(newOffset);
        }
      } catch (error) {
        console.error('Failed to fetch WhatsApp reviews:', error);
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    },
    [API_URL, limit],
  );

  useEffect(() => {
    void fetchReviews(0, true);
  }, [fetchReviews]);

  const loadMore = useCallback(() => {
    if (!isLoadingRef.current && hasMoreRef.current) {
      void fetchReviews(offsetRef.current + limit);
    }
  }, [fetchReviews, limit]);

  const uploadSingleReview = async (file: File) => {
    const formData = new FormData();
    formData.append('files', file);

    const res = await fetch(`${API_URL}/admin/whatsapp-reviews`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const errorMsg = Array.isArray(err.message)
        ? err.message.join(', ')
        : (err.message || 'Failed to upload review image to Cloudflare');
      throw new Error(errorMsg);
    }

    return (await res.json()) as WhatsAppReview[];
  };

  const uploadReviews = async (files: File[]) => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const res = await fetch(`${API_URL}/admin/whatsapp-reviews`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const errorMsg = Array.isArray(err.message)
        ? err.message.join(', ')
        : (err.message || 'Failed to upload review images to Cloudflare');
      throw new Error(errorMsg);
    }

    // Clear and refetch from start on fresh upload
    setHasMore(true);
    await fetchReviews(0, true);
  };

  const uploadReview = async (file: File) => {
    const result = await uploadSingleReview(file);
    setHasMore(true);
    await fetchReviews(0, true);
    return result;
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
    totalCount,
    isLoading,
    isInitialLoad,
    hasMore,
    loadMore,
    uploadReview,
    uploadReviews,
    uploadSingleReview,
    deleteReview,
    refreshReviews: () => fetchReviews(0, true),
  };
}
