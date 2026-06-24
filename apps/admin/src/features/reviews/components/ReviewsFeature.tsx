'use client';

import React, { useEffect, useRef, useState } from 'react';

import { SearchIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { CustomSelect } from '../../../components/ui/CustomSelect';
import { useReviews } from '../hooks/useReviews';
import { EditReviewModal } from './EditReviewModal';
import { ReviewsTable } from './ReviewsTable';
import { ReviewStats } from './ReviewStats';

export default function ReviewsFeature() {
  const {
    reviews,
    searchQuery,
    setSearchQuery,
    ratingFilter,
    setRatingFilter,
    verifiedFilter,
    setVerifiedFilter,
    featuredFilter,
    setFeaturedFilter,
    setEditingReviewId,
    ratingOptions,
    verifiedOptions,
    featuredOptions,
    sortField,
    sortDirection,
    handleSort,
    handleDelete,
    handleToggleVerified,
    handleToggleFeatured,
    handleEditSave,
    filteredAndSortedReviews,
    editingReview,
  } = useReviews();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  const hasActiveFilters =
    verifiedFilter !== 'all' || featuredFilter !== 'all' || ratingFilter !== 'all';
  const activeFilterCount =
    (verifiedFilter !== 'all' ? 1 : 0) +
    (featuredFilter !== 'all' ? 1 : 0) +
    (ratingFilter !== 'all' ? 1 : 0);

  const handleClear = () => {
    setVerifiedFilter('all');
    setFeaturedFilter('all');
    setRatingFilter('all');
  };

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      <div className="shrink-0">
        <ReviewStats reviews={reviews} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-40 flex items-center justify-between gap-2 rounded-2xl border border-black/5 bg-white p-2.5 sm:p-3 md:p-4 dark:border-white/5 dark:bg-[#111111]"
        >
          {/* Left: Search Input (fills remaining space) */}
          <div className="relative min-w-0 flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-3.5">
              <SearchIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
            </div>
            <input
              type="text"
              placeholder="Search by product or comment..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="block w-full truncate rounded-xl border border-black/5 bg-[#f8f9fa] py-2 pr-8 pl-9 text-xs text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 sm:py-2.5 sm:pl-10 sm:text-sm dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Desktop Inline Controls (xl:flex) */}
          <div className="hidden items-center gap-3 xl:flex">
            <CustomSelect
              options={verifiedOptions}
              value={verifiedFilter}
              onChange={(val) => {
                setVerifiedFilter(val as 'all' | 'verified' | 'unverified');
              }}
              className="z-50 w-40"
            />

            <CustomSelect
              options={featuredOptions}
              value={featuredFilter}
              onChange={(val) => {
                setFeaturedFilter(val as 'all' | 'featured' | 'unfeatured');
              }}
              className="z-50 w-36"
            />

            <CustomSelect
              options={ratingOptions}
              value={ratingFilter.toString()}
              onChange={(val) => {
                setRatingFilter(val === 'all' ? 'all' : Number(val));
              }}
              className="z-50 w-36"
            />
          </div>

          {/* Right Controls: Unified Filter Button (screens < xl) */}
          <div className="relative shrink-0 xl:hidden" ref={filterRef}>
            <button
              type="button"
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
              }}
              className={`flex items-center space-x-1 rounded-xl border px-2.5 py-2 text-xs font-medium transition-all sm:space-x-1.5 sm:px-3 sm:text-sm ${
                hasActiveFilters
                  ? 'border-transparent bg-black text-white shadow-md dark:bg-white dark:text-black'
                  : 'border-black/5 bg-[#f8f9fa] text-black/70 hover:bg-black/5 hover:text-black dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white'
              }`}
            >
              <svg
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Detailed Filters Modal */}
            {isFilterOpen && (
              <>
                {/* Mobile Backdrop */}
                <div
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
                  onClick={() => {
                    setIsFilterOpen(false);
                  }}
                />

                <div className="fixed inset-x-3 bottom-3 z-50 flex max-h-[85vh] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-2xl backdrop-blur-2xl duration-200 md:absolute md:top-full md:right-0 md:bottom-auto md:left-auto md:mt-2 md:w-[320px] dark:border-white/10 dark:bg-[#111111]/95">
                  <div className="flex items-center justify-between border-b border-black/5 p-4 pb-3 dark:border-white/5">
                    <h3 className="text-base font-bold text-black dark:text-white">
                      Detailed Filters
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsFilterOpen(false);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-black/50 hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto p-4">
                    {/* Verified Status */}
                    <div>
                      <label className="mb-2 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                        Verification Status
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {verifiedOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setVerifiedFilter(opt.value as 'all' | 'verified' | 'unverified');
                            }}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                              verifiedFilter === opt.value
                                ? 'border-transparent bg-black text-white dark:bg-white dark:text-black'
                                : 'border-black/10 bg-black/5 text-black/60 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/60'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Featured Status */}
                    <div>
                      <label className="mb-2 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                        Featured Status
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {featuredOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setFeaturedFilter(opt.value as 'all' | 'featured' | 'unfeatured');
                            }}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                              featuredFilter === opt.value
                                ? 'border-transparent bg-black text-white dark:bg-white dark:text-black'
                                : 'border-black/10 bg-black/5 text-black/60 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/60'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rating Options */}
                    <div>
                      <label className="mb-2 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                        Rating
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {ratingOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setRatingFilter(opt.value === 'all' ? 'all' : Number(opt.value));
                            }}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                              ratingFilter.toString() === opt.value
                                ? 'border-transparent bg-black text-white dark:bg-white dark:text-black'
                                : 'border-black/10 bg-black/5 text-black/60 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/60'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex items-center space-x-3 border-t border-black/10 bg-white/5 p-4 backdrop-blur-md dark:border-white/10 dark:bg-black/5">
                    <button
                      type="button"
                      onClick={handleClear}
                      className="flex-1 rounded-xl px-4 py-2 text-xs font-medium text-black/60 transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsFilterOpen(false);
                      }}
                      className="flex-1 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key="reviews-table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <ReviewsTable
              reviews={filteredAndSortedReviews}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onDelete={handleDelete}
              onToggleVerified={handleToggleVerified}
              onToggleFeatured={handleToggleFeatured}
              onEditReview={(id) => {
                setEditingReviewId(id);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <EditReviewModal
        isOpen={!!editingReview}
        onClose={() => {
          setEditingReviewId(null);
        }}
        review={editingReview}
        onSave={handleEditSave}
      />
    </div>
  );
}
