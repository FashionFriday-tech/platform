'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

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
  const [hasMore, setHasMore] = useState(initialReviews.length >= 20);
  const limit = 20;

  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(initialReviews.length >= 20);
  const offsetRef = useRef(0);
  const pendingAdvanceRef = useRef(false);

  const [activeReviewIndex, setActiveReviewIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const fetchReviews = useCallback(async (newOffset: number) => {
    if (isLoadingRef.current || !hasMoreRef.current) {
      return;
    }
    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const data = await fetcher<WhatsAppReview[]>(
        `/whatsapp-reviews?limit=${limit}&offset=${newOffset}`,
      );
      if (Array.isArray(data)) {
        const moreAvailable = data.length >= limit;
        hasMoreRef.current = moreAvailable;
        setHasMore(moreAvailable);

        if (data.length > 0) {
          setReviews((prev) => {
            const existingIds = new Set(prev.map((r) => r.id));
            const newUnique = data.filter((r) => !existingIds.has(r.id));
            const updated = [...prev, ...newUnique];

            // If user clicked next at the end of the batch and was waiting for the new batch
            if (pendingAdvanceRef.current) {
              pendingAdvanceRef.current = false;
              if (newUnique.length > 0) {
                setActiveReviewIndex(prev.length);
              }
            }

            return updated;
          });
          offsetRef.current = newOffset;
        } else {
          hasMoreRef.current = false;
          setHasMore(false);
          // If waiting to advance and no more exist, rotate to 0
          if (pendingAdvanceRef.current) {
            pendingAdvanceRef.current = false;
            setActiveReviewIndex(0);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load whatsapp reviews:', err);
      pendingAdvanceRef.current = false;
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [limit]);

  // Pre-fetch next batch 5 images before reaching the end of the loaded reviews in detail view
  useEffect(() => {
    if (activeReviewIndex === null) {
      return;
    }

    // 5 images before the end of the loaded list, call next batch immediately
    if (activeReviewIndex >= reviews.length - 5 && hasMoreRef.current && !isLoadingRef.current) {
      void fetchReviews(offsetRef.current + limit);
    }
  }, [activeReviewIndex, reviews.length, fetchReviews, limit]);

  // Infinite Scroll event handler for the grid view
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMoreRef.current || isLoadingRef.current) {
        return;
      }
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollHeight - scrollTop - clientHeight < 300) {
        void fetchReviews(offsetRef.current + limit);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fetchReviews, limit]);

  const navigateNext = useCallback(() => {
    setActiveReviewIndex((prev) => {
      if (prev === null) {
        return null;
      }

      // 5 images before end, pre-fetch next batch
      if (prev >= reviews.length - 5 && hasMoreRef.current && !isLoadingRef.current) {
        void fetchReviews(offsetRef.current + limit);
      }

      // If at the end of the currently loaded reviews:
      if (prev >= reviews.length - 1) {
        if (hasMoreRef.current) {
          if (!isLoadingRef.current) {
            void fetchReviews(offsetRef.current + limit);
          }
          pendingAdvanceRef.current = true;
          return prev;
        }
        // When all reviews in the entire store have ended, rotate back to 0
        return 0;
      }

      return prev + 1;
    });
  }, [reviews.length, fetchReviews, limit]);

  const navigatePrev = useCallback(() => {
    setActiveReviewIndex((prev) => {
      if (prev === null) {
        return null;
      }
      // If at the start (0), rotate to the end
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
        navigateNext(); // Swiped left -> next
      } else {
        navigatePrev(); // Swiped right -> prev
      }
    }
    touchStartX.current = null;
  };

  return (
    <div>
      {/* Grid layout for 9:19 ratio screenshot cards */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              onClick={() => {
                setActiveReviewIndex(index);
              }}
              className="group relative aspect-[9/19] w-full cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-all hover:shadow-lg dark:border-white/10 dark:bg-[#111111]"
            >
              <img
                src={review.imageUrl}
                alt="WhatsApp Chat Customer Review"
                className="h-full w-full object-cover object-top"
                loading="lazy"
              />

              {/* Hover overlay with action indicator */}
              <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-3">
                <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-black shadow-md backdrop-blur-xs uppercase tracking-wider dark:bg-black/95 dark:text-white">
                  View Chat
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-foreground-muted py-20 text-center">
          <p className="text-lg">No reviews found.</p>
        </div>
      )}

      {/* Infinite scroll pagination skeleton loader */}
      {isLoading && hasMore && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`skel-${i}`}
              className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl border border-black/10 bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.04] animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Bottom spacing when all items are loaded (no count displayed on client) */}
      {!hasMore && reviews.length > 0 && !isLoading && (
        <div className="py-12" />
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
            aria-label="Previous Review"
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
            {isLoading && pendingAdvanceRef.current && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs rounded-lg">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}
          </div>

          {/* Desktop Right Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateNext();
            }}
            className="absolute right-8 z-50 hidden rounded-full p-4 text-white/60 transition-all hover:bg-white/10 hover:text-white md:flex"
            aria-label="Next Review"
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
