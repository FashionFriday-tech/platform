'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { PlusIcon, TrashIcon } from '@ff/ui';

import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import { useWhatsAppReviews } from '../hooks/useWhatsAppReviews';

export function WhatsAppReviewsFeature() {
  const { reviews, isLoading, isInitialLoad, loadMore, uploadReview, deleteReview } =
    useWhatsAppReviews();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
    try {
      await uploadReview(file);
    } catch (err) {
      alert('Failed to upload review image. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Scroll event listener for infinite scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Trigger loadMore when scrolled within 100px of bottom
      if (scrollHeight - scrollTop - clientHeight < 100) {
        loadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [loadMore]);

  return (
    <div
      ref={containerRef}
      className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-black uppercase dark:text-white">
            Total Reviews {reviews.length}
          </h1>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center space-x-2 rounded-full bg-black px-4 px-8 py-2 py-4 text-xs font-black tracking-wider text-white uppercase transition-all hover:bg-black/90 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <PlusIcon className="h-4 w-4" />
          <span>{isUploading ? 'Uploading...' : 'Add Review'}</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Initial load loading state */}
      {isInitialLoad && (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
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

      {/* Grid of Review Cards — image only, no title */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-2 gap-6 pb-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-white/10 dark:bg-[#111111]"
            >
              {/* Image — full natural size, no crop */}
              <div className="relative w-full bg-black/5 dark:bg-white/5">
                <Image
                  src={review.imageUrl}
                  alt="WhatsApp Review"
                  width={800}
                  height={1400}
                  className="block h-auto w-full"
                />

                {/* Hover overlay with delete */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                  <button
                    onClick={() => {
                      setDeleteConfirmId(review.id);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-red-600"
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

      {/* Loading animation at the bottom for scroll pagination */}
      {isLoading && !isInitialLoad && (
        <div className="flex items-center justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
        </div>
      )}

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
    </div>
  );
}
