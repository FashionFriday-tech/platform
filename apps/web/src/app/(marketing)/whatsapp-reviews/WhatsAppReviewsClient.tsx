'use client';

import React, { useEffect, useRef, useState } from 'react';

import { fetcher } from '@/lib/api-client';

export interface WhatsAppReview {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

interface Props {
  initialReviews: WhatsAppReview[];
}

export function WhatsAppReviewsClient({ initialReviews }: Props) {
  const [reviews, setReviews] = useState<WhatsAppReview[]>(initialReviews);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(initialReviews.length >= 20);
  const limit = 20;

  const [activeReviewIndex, setActiveReviewIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const fetchReviews = async (newOffset: number) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const data = await fetcher<WhatsAppReview[]>(
        `/whatsapp-reviews?limit=${limit}&offset=${newOffset}`,
      );
      if (Array.isArray(data)) {
        if (data.length < limit) {
          setHasMore(false);
        }
        setReviews((prev) => [...prev, ...data]);
        setOffset(newOffset);
      }
    } catch (err) {
      console.error('Failed to load whatsapp reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Infinite Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || isLoading) {
        return;
      }
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollHeight - scrollTop - clientHeight < 150) {
        void fetchReviews(offset + limit);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [offset, hasMore, isLoading]);

  const navigateNext = useCallback(() => {
    setActiveReviewIndex((prev) => {
      if (prev === null) {
        return null;
      }
      return prev < reviews.length - 1 ? prev + 1 : 0;
    });
  }, [reviews.length]);

  const navigatePrev = useCallback(() => {
    setActiveReviewIndex((prev) => {
      if (prev === null) {
        return null;
      }
      return prev > 0 ? prev - 1 : reviews.length - 1;
    });
  }, [reviews.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeReviewIndex === null) {
        return;
      }
      if (e.key === 'Escape') {
        setActiveReviewIndex(null);
      } else if (e.key === 'ArrowRight') {
        navigateNext();
      } else if (e.key === 'ArrowLeft') {
        navigatePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeReviewIndex, navigateNext, navigatePrev]);

  // Touch handlers for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) {
      return;
    }
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50; // swipe minimum distance in px

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        navigateNext(); // Swiped left
      } else {
        navigatePrev(); // Swiped right
      }
    }
    touchStartX.current = null;
  };

  return (
    <div>
      {/* Grid layout for tall screenshot cards */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              onClick={() => {
                setActiveReviewIndex(index);
              }}
              className="cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-transform hover:scale-[1.02] dark:border-white/10 dark:bg-[#111111]"
            >
              <img
                src={review.imageUrl}
                alt="WhatsApp Chat Customer Review"
                className="block h-auto w-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-foreground-muted py-20 text-center">
          <p className="text-lg">No reviews found.</p>
        </div>
      )}

      {/* Infinite scroll pagination loader */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
        </div>
      )}

      {/* Full-screen Lightbox Modal */}
      {activeReviewIndex !== null && reviews[activeReviewIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={() => {
              setActiveReviewIndex(null);
            }}
            className="absolute top-6 right-6 z-50 p-2 text-white/60 transition-colors hover:text-white"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Desktop Left Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigatePrev();
            }}
            className="absolute left-8 z-50 hidden rounded-full p-4 text-white/60 transition-all hover:bg-white/10 hover:text-white md:flex"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Review Image Wrapper */}
          <div
            className="relative flex max-h-screen max-w-full items-center justify-center p-4"
            onClick={() => {
              setActiveReviewIndex(null);
            }}
          >
            <img
              src={reviews[activeReviewIndex].imageUrl}
              alt="WhatsApp Review Fullscreen"
              className="pointer-events-none max-h-[90vh] max-w-[95vw] rounded-lg object-contain shadow-2xl md:max-w-[85vw]"
            />
          </div>

          {/* Desktop Right Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateNext();
            }}
            className="absolute right-8 z-50 hidden rounded-full p-4 text-white/60 transition-all hover:bg-white/10 hover:text-white md:flex"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
