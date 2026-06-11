'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import { ChevronDownIcon, ChevronUpIcon, FilledStarIcon, SparklesIcon, VerifiedIcon } from '@ff/ui';
import { twMerge } from 'tailwind-merge';

import { type Review } from '../types';

interface ReviewsTableProps {
  reviews: Review[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  onDelete: (reviewId: string) => void;
  onToggleVerified: (reviewId: string) => void;
  onToggleFeatured: (reviewId: string) => void;
  onEditReview: (reviewId: string) => void;
}

function SortIcon({
  field,
  sortField,
  sortDirection,
}: {
  field: string;
  sortField: string;
  sortDirection: 'asc' | 'desc';
}) {
  if (sortField !== field) {
    return null;
  }
  return sortDirection === 'asc' ? (
    <ChevronUpIcon className="ml-1 inline h-4 w-4" />
  ) : (
    <ChevronDownIcon className="ml-1 inline h-4 w-4" />
  );
}

export function ReviewsTable({
  reviews,
  sortField,
  sortDirection,
  onSort,
  onDelete,
  onToggleVerified,
  onToggleFeatured,
  onEditReview,
}: ReviewsTableProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-yellow-500">
        {Array.from({ length: 5 }, (_, i) => (
          <FilledStarIcon
            key={i}
            className={`h-4 w-4 ${i < rating ? 'opacity-100' : 'opacity-20'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-slate-50/50 p-2.5 shadow-xs dark:border-white/10 dark:bg-black/20">
      <div className="scrollbar-hide flex-1 overflow-x-auto overflow-y-auto">
        <div className="flex min-w-[980px] flex-col gap-2.5 pb-2">
          {/* Header Tab - Fixed / Sticky on Top (Black in Light Mode) */}
          <div className="sticky top-0 z-20 pb-0.5">
            <div className="grid grid-cols-[minmax(130px,1fr)_minmax(220px,1.8fr)_minmax(140px,1.2fr)_minmax(120px,1fr)_minmax(250px,2fr)_minmax(80px,0.7fr)] items-center rounded-xl border border-black/10 bg-black px-6 py-3.5 text-white shadow-md backdrop-blur-md dark:border-white/10 dark:bg-white dark:text-black dark:shadow-sm">
              <div
                className="group flex cursor-pointer items-center gap-1.5 font-semibold tracking-wider transition-colors select-none"
                onClick={() => {
                  onSort('date');
                }}
              >
                <span className="text-xs text-white/60 uppercase group-hover:text-white dark:text-black/60 dark:group-hover:text-black">
                  Date
                </span>
                <SortIcon field="date" sortField={sortField} sortDirection={sortDirection} />
              </div>
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Product
              </div>
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Customer
              </div>
              <div
                className="group flex cursor-pointer items-center gap-1.5 font-semibold tracking-wider transition-colors select-none"
                onClick={() => {
                  onSort('rating');
                }}
              >
                <span className="text-xs text-white/60 uppercase group-hover:text-white dark:text-black/60 dark:group-hover:text-black">
                  Rating
                </span>
                <SortIcon field="rating" sortField={sortField} sortDirection={sortDirection} />
              </div>
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Comment
              </div>
              <div className="text-right text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Actions
              </div>
            </div>
          </div>

          {/* Row Tabs (White in Light Mode) */}
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="group relative grid grid-cols-[minmax(130px,1fr)_minmax(220px,1.8fr)_minmax(140px,1.2fr)_minmax(120px,1fr)_minmax(250px,2fr)_minmax(80px,0.7fr)] items-center rounded-xl border border-black/5 bg-white px-6 py-3.5 text-black shadow-xs transition-all duration-200 hover:border-black/15 hover:shadow-md active:scale-[0.995] dark:border-white/10 dark:bg-[#141417] dark:text-white dark:shadow-sm dark:hover:border-white/20"
            >
              {/* Date & Verified */}
              <div className="flex items-center gap-2 pr-4 text-xs font-medium text-black/70 dark:text-white/70">
                {review.isVerified ? (
                  <div
                    title="Verified Purchase"
                    className="flex h-5 w-5 shrink-0 items-center justify-center text-blue-700 dark:text-blue-400"
                  >
                    <VerifiedIcon className="h-4 w-4" />
                  </div>
                ) : (
                  <div
                    title="Not Verified"
                    className="flex h-5 w-5 shrink-0 items-center justify-center text-red-500 dark:text-red-400"
                  >
                    <VerifiedIcon className="h-4 w-4" />
                  </div>
                )}
                <span>
                  {new Date(review.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {/* Product */}
              <div className="flex min-w-0 items-center gap-3 pr-4 font-medium">
                <Image
                  width={40}
                  height={40}
                  src={review.productImage}
                  alt={review.productName}
                  className="h-10 w-10 shrink-0 rounded-xl border border-black/5 bg-black/5 object-cover dark:border-white/10 dark:bg-white/10"
                />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-semibold text-black dark:text-white">
                    {review.productName}
                  </span>
                  {review.isFeatured && (
                    <span className="inline-flex w-fit items-center gap-1 rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-bold text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400">
                      <SparklesIcon className="h-2.5 w-2.5" /> Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Customer */}
              <div className="truncate pr-4 text-xs font-medium text-black/60 dark:text-white/60">
                {review.customerId}
              </div>

              {/* Rating */}
              <div className="pr-4">{renderStars(review.rating)}</div>

              {/* Comment */}
              <div className="pr-4 text-xs text-black/70 dark:text-white/70">
                <p className="line-clamp-2 max-w-md">{review.comment}</p>
              </div>

              {/* Actions */}
              <div className="relative text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(openDropdown === review.id ? null : review.id);
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-black/40 transition-colors hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </button>

                {openDropdown === review.id && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => {
                        setOpenDropdown(null);
                      }}
                    />
                    <div
                      className={twMerge(
                        'absolute right-0 z-50 flex w-48 flex-col gap-1 rounded-xl border border-black/10 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-[#1a1a1a]',
                        index >= reviews.length - 2 ? 'bottom-9' : 'top-9',
                      )}
                    >
                      <button
                        onClick={() => {
                          onEditReview(review.id);
                          setOpenDropdown(null);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-black transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                      >
                        Edit Review
                      </button>
                      <button
                        onClick={() => {
                          onToggleFeatured(review.id);
                          setOpenDropdown(null);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-black transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                      >
                        {review.isFeatured ? 'Unfeature' : 'Feature'} Review
                      </button>
                      <button
                        onClick={() => {
                          onToggleVerified(review.id);
                          setOpenDropdown(null);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-black transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                      >
                        Mark as {review.isVerified ? 'Unverified' : 'Verified'}
                      </button>
                      <button
                        onClick={() => {
                          onDelete(review.id);
                          setOpenDropdown(null);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                      >
                        Delete Review
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
