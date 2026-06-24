'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

import { PlusIcon, TrashIcon } from '@ff/ui';
import { toast } from 'sonner';

import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import { useWhatsAppReviews } from '../hooks/useWhatsAppReviews';
import { type UploadItemProgress, WhatsAppReviewsUploadModal } from './WhatsAppReviewsUploadModal';

export function WhatsAppReviewsFeature() {
  const {
    reviews,
    totalCount,
    isLoading,
    isInitialLoad,
    hasMore,
    loadMore,
    uploadSingleReview,
    deleteReview,
    refreshReviews,
  } = useWhatsAppReviews();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewReviewIndex, setPreviewReviewIndex] = useState<number | null>(null);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadItems, setUploadItems] = useState<UploadItemProgress[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  const processFiles = async (files: File[]) => {
    const validImageFiles = files.filter((f) => f.type.startsWith('image/'));
    if (validImageFiles.length === 0) {
      toast.error('Please select valid image files');
      return;
    }

    // Create item progress list with live preview URLs
    const newItems: UploadItemProgress[] = validImageFiles.map((file, idx) => ({
      id: `${Date.now()}-${idx}-${file.name}`,
      file,
      previewUrl: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: file.size,
      status: 'pending',
    }));

    setUploadItems(newItems);
    setIsUploadModalOpen(true);
    setIsUploading(true);

    let successCount = 0;
    let failCount = 0;

    // Process each file sequentially with real-time UI updates
    for (let i = 0; i < newItems.length; i++) {
      const currentItem = newItems[i];

      // Mark current item as 'uploading'
      setUploadItems((prev) =>
        prev.map((it, idx) => (idx === i ? { ...it, status: 'uploading' } : it)),
      );

      try {
        await uploadSingleReview(currentItem.file);
        successCount++;
        // Mark current item as 'success'
        setUploadItems((prev) =>
          prev.map((it, idx) => (idx === i ? { ...it, status: 'success' } : it)),
        );
      } catch (err: unknown) {
        failCount++;
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to upload review image to Cloudflare. Please try again.';
        // Mark current item as 'error'
        setUploadItems((prev) =>
          prev.map((it, idx) => (idx === i ? { ...it, status: 'error', errorMessage } : it)),
        );
      }
    }

    setIsUploading(false);

    // Refresh reviews from the server
    if (successCount > 0) {
      void refreshReviews();
    }

    if (failCount === 0) {
      toast.success(
        successCount === 1
          ? 'WhatsApp review uploaded to Cloudflare successfully'
          : `Successfully added ${successCount} WhatsApp reviews to Cloudflare`,
      );
    } else {
      toast.error(
        `${failCount} review(s) failed to upload to Cloudflare. Failed images were not saved to database or disk.`,
        { duration: 6000 },
      );
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCloseUploadModal = () => {
    // Revoke all preview URLs to prevent memory leaks
    uploadItems.forEach((item) => {
      try {
        URL.revokeObjectURL(item.previewUrl);
      } catch {
        // ignore revoke error
      }
    });
    setIsUploadModalOpen(false);
    setUploadItems([]);
  };

  const handleRetryFailed = async () => {
    const failedIndices = uploadItems
      .map((item, idx) => (item.status === 'error' ? idx : -1))
      .filter((idx) => idx !== -1);

    if (failedIndices.length === 0) {
      return;
    }

    setIsUploading(true);

    for (const idx of failedIndices) {
      const item = uploadItems[idx];
      setUploadItems((prev) =>
        prev.map((it, i) =>
          i === idx ? { ...it, status: 'uploading', errorMessage: undefined } : it,
        ),
      );

      try {
        await uploadSingleReview(item.file);
        setUploadItems((prev) =>
          prev.map((it, i) => (i === idx ? { ...it, status: 'success' } : it)),
        );
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to upload to Cloudflare';
        setUploadItems((prev) =>
          prev.map((it, i) => (i === idx ? { ...it, status: 'error', errorMessage } : it)),
        );
      }
    }

    setIsUploading(false);
    void refreshReviews();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) {
      return;
    }
    await processFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    if (files.length === 0) {
      return;
    }
    await processFiles(files);
  };

  // Scroll listener for pagination
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleScroll = () => {
      // If all items are loaded or currently fetching, do not trigger again
      if (!hasMore || isLoading) {
        return;
      }
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Trigger loadMore when scrolled within 300px of bottom
      if (scrollHeight - scrollTop - clientHeight < 300) {
        loadMore();
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [loadMore, hasMore, isLoading]);

  const navigateNext = useCallback(() => {
    setPreviewReviewIndex((prev) => {
      if (prev === null) {
        return null;
      }

      // 5 images before end of currently loaded batch, trigger loadMore
      if (prev >= reviews.length - 5 && hasMore && !isLoading) {
        loadMore();
      }

      // If at the end of the loaded reviews:
      if (prev >= reviews.length - 1) {
        if (hasMore) {
          if (!isLoading) {
            loadMore();
          }
          return prev;
        }
        // When all reviews have ended, rotate back to 0
        return 0;
      }

      return prev + 1;
    });
  }, [reviews.length, hasMore, isLoading, loadMore]);

  const navigatePrev = useCallback(() => {
    setPreviewReviewIndex((prev) => {
      if (prev === null) {
        return null;
      }
      return prev > 0 ? prev - 1 : reviews.length - 1;
    });
  }, [reviews.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (previewReviewIndex === null) {
        return;
      }
      if (e.key === 'Escape') {
        setPreviewReviewIndex(null);
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
  }, [previewReviewIndex, navigateNext, navigatePrev]);

  // Touch handlers for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) {
      return;
    }
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        navigateNext();
      } else {
        navigatePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex min-h-0 flex-1 flex-col overflow-hidden transition-colors ${
        isDragging ? 'bg-emerald-500/5 ring-2 ring-emerald-500/50' : ''
      }`}
    >
      {/* Dragging Overlay */}
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-500 bg-emerald-500/10 backdrop-blur-xs">
          <div className="flex h-16 w-16 animate-bounce items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-xl">
            <PlusIcon className="h-8 w-8" />
          </div>
          <p className="mt-4 text-base font-bold text-emerald-800 dark:text-emerald-200">
            Drop images here to upload multiple reviews
          </p>
          <p className="text-xs text-emerald-700/70 dark:text-emerald-300/70">
            Supports PNG, JPG, WEBP screenshots
          </p>
        </div>
      )}

      {/* Fixed Top Header (stays pinned at top while scrolling) */}
      <div className="mb-6 flex flex-shrink-0 items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight text-black uppercase dark:text-white">
          Total Reviews {isInitialLoad ? '...' : totalCount}
        </h1>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center space-x-2 rounded-full bg-black px-6 py-3.5 text-xs font-black tracking-wider text-white uppercase transition-all hover:bg-black/90 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <PlusIcon className="h-4 w-4" />
          <span>
            {isUploading
              ? uploadItems.length > 1
                ? `Uploading ${uploadItems.length} Reviews...`
                : 'Uploading...'
              : 'Add Reviews'}
          </span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
      </div>

      {/* Scrollable Container for Review Cards */}
      <div
        ref={containerRef}
        className="scrollbar-hide relative flex min-h-0 flex-1 flex-col overflow-y-auto rounded-3xl"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Initial load skeleton grid */}
        {isInitialLoad && (
          <div className="grid grid-cols-2 gap-6 pb-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`initial-skel-${i}`}
                className="relative aspect-[9/19] w-full animate-pulse overflow-hidden rounded-2xl border border-black/10 bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.04]"
              >
                <div className="flex h-full flex-col justify-between p-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-7 w-7 rounded-full bg-black/10 dark:bg-white/10" />
                    <div className="h-3 w-20 rounded-md bg-black/10 dark:bg-white/10" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 w-3/4 rounded-xl bg-black/10 dark:bg-white/10" />
                    <div className="h-6 w-1/2 rounded-xl bg-black/10 dark:bg-white/10" />
                    <div className="h-6 w-2/3 rounded-xl bg-black/10 dark:bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isInitialLoad && reviews.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-black/40 dark:text-white/40">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-current">
              <PlusIcon className="h-8 w-8" />
            </div>
            <p className="text-sm font-semibold">
              No review cards yet. Click &quot;Add Review&quot; to upload.
            </p>
          </div>
        )}

        {/* Grid of Review Cards — 9:19 ratio preview */}
        {reviews.length > 0 && (
          <div className="grid grid-cols-2 gap-6 pb-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                onClick={() => {
                  setPreviewReviewIndex(index);
                }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-white/10 dark:bg-[#111111]"
              >
                {/* Image — 9:19 ratio preview, object-top */}
                <div className="relative aspect-[9/19] w-full overflow-hidden bg-black/5 dark:bg-white/5">
                  <Image
                    src={review.imageUrl}
                    alt="WhatsApp Review"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    priority={index < 4}
                    className="object-cover object-top"
                  />

                  {/* Hover overlay with view & delete */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewReviewIndex(index);
                      }}
                      className="flex items-center gap-1.5 rounded-xl bg-white/95 px-3.5 py-2 text-xs font-bold text-black shadow-xl transition-all hover:scale-105 hover:bg-white dark:bg-zinc-800 dark:text-white"
                    >
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(review.id);
                      }}
                      className="flex items-center gap-1.5 rounded-xl bg-red-500 px-3.5 py-2 text-xs font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skeleton loading at the bottom for pagination */}
        {isLoading && !isInitialLoad && hasMore && (
          <div className="grid grid-cols-2 gap-6 pb-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`more-skel-${i}`}
                className="relative aspect-[9/19] w-full animate-pulse overflow-hidden rounded-2xl border border-black/10 bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.04]"
              >
                <div className="flex h-full flex-col justify-between p-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-7 w-7 rounded-full bg-black/10 dark:bg-white/10" />
                    <div className="h-3 w-20 rounded-md bg-black/10 dark:bg-white/10" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 w-3/4 rounded-xl bg-black/10 dark:bg-white/10" />
                    <div className="h-6 w-1/2 rounded-xl bg-black/10 dark:bg-white/10" />
                    <div className="h-6 w-2/3 rounded-xl bg-black/10 dark:bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* End of list state: if all items are shown, no more loading */}
        {!hasMore && reviews.length > 0 && !isLoading && (
          <div className="py-6 text-center text-xs font-semibold tracking-wider text-black/40 uppercase dark:text-white/40">
            All {totalCount} reviews loaded
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => {
          setDeleteConfirmId(null);
        }}
        onConfirm={async () => {
          if (deleteConfirmId) {
            await deleteReview(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        title="Delete Review Card"
        message="Are you sure you want to delete this customer review card? This action is permanent."
        confirmText="Delete"
      />

      {/* Real-time Live Upload Progress Popup Modal */}
      <WhatsAppReviewsUploadModal
        isOpen={isUploadModalOpen}
        items={uploadItems}
        isUploading={isUploading}
        onClose={handleCloseUploadModal}
        onRetryFailed={handleRetryFailed}
      />

      {/* Full-screen Detailed Image Preview Modal with Prev / Next Buttons (Portaled to body to appear above all sidebars and menus) */}
      {isClientMounted &&
        previewReviewIndex !== null &&
        reviews[previewReviewIndex] &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close button */}
            <button
              onClick={() => {
                setPreviewReviewIndex(null);
              }}
              className="absolute top-5 right-5 z-[10000] flex items-center justify-center rounded-full bg-white/15 p-3 text-white shadow-2xl backdrop-blur-md transition-all hover:scale-110 hover:bg-white/30 active:scale-95"
              aria-label="Close"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Left / Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigatePrev();
              }}
              className="absolute left-4 z-[10000] flex items-center justify-center rounded-full bg-white/15 p-3.5 text-white shadow-2xl backdrop-blur-md transition-all hover:scale-110 hover:bg-white/30 active:scale-95 sm:left-8 sm:p-4 md:left-12"
              aria-label="Previous Review"
            >
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
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
                setPreviewReviewIndex(null);
              }}
            >
              <img
                src={reviews[previewReviewIndex].imageUrl}
                alt="WhatsApp Review Fullscreen"
                className="pointer-events-none max-h-[90vh] max-w-[95vw] rounded-lg object-contain shadow-2xl md:max-w-[85vw]"
              />
            </div>

            {/* Right / Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateNext();
              }}
              className="absolute right-4 z-[10000] flex items-center justify-center rounded-full bg-white/15 p-3.5 text-white shadow-2xl backdrop-blur-md transition-all hover:scale-110 hover:bg-white/30 active:scale-95 sm:right-8 sm:p-4 md:right-12"
              aria-label="Next Review"
            >
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}
