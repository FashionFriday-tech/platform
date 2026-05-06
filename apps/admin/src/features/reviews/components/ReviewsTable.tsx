'use client';

import React, { useState } from 'react';
import { Review } from '../../customers/data/mock-reviews';
import { ChevronDownIcon, ChevronUpIcon, FilledStarIcon, VerifiedIcon, SparklesIcon } from '@ff/ui';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="ml-1 inline h-4 w-4" />
    ) : (
      <ChevronDownIcon className="ml-1 inline h-4 w-4" />
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <FilledStarIcon key={i} className={`h-4 w-4 ${i < rating ? 'opacity-100' : 'opacity-20'}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white dark:border-white/5 dark:bg-[#111111]">
      <div className="flex-1 overflow-auto scrollbar-hide">
        <table className="w-full text-left text-sm text-black dark:text-white relative">
          <thead className="sticky top-0 z-30 border-b border-black/5 bg-[#f8f9fa] text-xs font-medium text-black/60 uppercase dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/60">
            <tr>
              <th className="cursor-pointer px-6 py-4 whitespace-nowrap transition-colors hover:bg-black/5 dark:hover:bg-white/5" onClick={() => onSort('date')}>
                Date <SortIcon field="date" />
              </th>
              <th className="px-6 py-4 whitespace-nowrap">Product</th>
              <th className="px-6 py-4 whitespace-nowrap">Customer</th>
              <th className="cursor-pointer px-6 py-4 whitespace-nowrap transition-colors hover:bg-black/5 dark:hover:bg-white/5" onClick={() => onSort('rating')}>
                Rating <SortIcon field="rating" />
              </th>
              <th className="px-6 py-4 whitespace-nowrap min-w-[200px]">Comment</th>
              <th className="sticky right-0 z-20 bg-[#f8f9fa] px-6 py-4 text-right dark:bg-[#1a1a1a] whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {reviews.map((review, index) => (
              <tr key={review.id} className="group relative transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                <td className="px-6 py-4 whitespace-nowrap text-black/60 dark:text-white/60">
                  <div className="flex items-center gap-2">
                    {review.isVerified ? (
                      <div title="Verified Purchase" className="flex h-5 w-5 shrink-0 items-center justify-center text-blue-700 dark:text-blue-400">
                        <VerifiedIcon className="h-5 w-5" />
                      </div>
                    ) : (
                      <div title="Not Verified" className="flex h-5 w-5 shrink-0 items-center justify-center text-red-500 dark:text-red-400">
                        <VerifiedIcon className="h-5 w-5" />
                      </div>
                    )}
                    <span>{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  <div className="flex items-center gap-3">
                    <img 
                      src={review.productImage} 
                      alt={review.productName} 
                      className="h-10 w-10 rounded-lg object-cover bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5" 
                    />
                    <div className="flex flex-col gap-1">
                      <span>{review.productName}</span>
                      {review.isFeatured && (
                        <div title="Featured Review" className="flex h-5 w-5 items-center justify-center rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400">
                          <SparklesIcon className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black/60 dark:text-white/60">
                  {review.customerId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderStars(review.rating)}
                </td>
                <td className="px-6 py-4 text-black/70 dark:text-white/70">
                  <p className="line-clamp-2 max-w-md">{review.comment}</p>
                </td>
                <td className={twMerge("sticky right-0 bg-white px-6 py-4 text-right dark:bg-[#111111] whitespace-nowrap group-hover:bg-gray-50 dark:group-hover:bg-[#1a1a1a]", openDropdown === review.id ? "z-30" : "z-10")}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === review.id ? null : review.id);
                    }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-black/40 transition-colors hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="12" cy="5" r="1"></circle>
                      <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                  </button>
                  
                  {openDropdown === review.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                      <div className={twMerge(
                        "absolute right-6 z-20 flex w-48 flex-col gap-1 rounded-xl border border-black/10 bg-white p-1.5 shadow-lg dark:border-white/10 dark:bg-[#1a1a1a]",
                        index >= reviews.length - 2 ? "bottom-10" : "top-10"
                      )}>
                        <button
                          onClick={() => {
                            onEditReview(review.id);
                            setOpenDropdown(null);
                          }}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-black transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                        >
                          Edit Review
                        </button>
                        <button
                          onClick={() => {
                            onToggleFeatured(review.id);
                            setOpenDropdown(null);
                          }}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-black transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                        >
                          {review.isFeatured ? 'Unfeature' : 'Feature'} Review
                        </button>
                        <button
                          onClick={() => {
                            onToggleVerified(review.id);
                            setOpenDropdown(null);
                          }}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-black transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                        >
                          Mark as {review.isVerified ? 'Unverified' : 'Verified'}
                        </button>
                        <button
                          onClick={() => {
                            onDelete(review.id);
                            setOpenDropdown(null);
                          }}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          Delete Review
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
