'use client';

import { SearchIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { CustomSelect } from '../../../components/ui/CustomSelect';
import { useReviews } from '../hooks/useReviews';
import { EditReviewModal } from './EditReviewModal';
import { ReviewsTable } from './ReviewsTable';
import { ReviewStats } from './ReviewStats';

export default function ReviewsFeature() {
  const {
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

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      <div className="shrink-0">
        <ReviewStats />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-50 flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-4 xl:flex-row xl:items-center xl:justify-between dark:border-white/5 dark:bg-[#111111]"
        >
          <div className="relative max-w-md flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <SearchIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
            </div>
            <input
              type="text"
              placeholder="Search by product or comment..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-11 text-sm text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <CustomSelect
              options={verifiedOptions}
              value={verifiedFilter}
              onChange={(val) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
                setVerifiedFilter(val as any);
              }}
              className="z-50 w-40"
            />

            <CustomSelect
              options={featuredOptions}
              value={featuredFilter}
              onChange={(val) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
                setFeaturedFilter(val as any);
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
