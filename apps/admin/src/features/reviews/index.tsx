'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ReviewStats } from './components/ReviewStats';
import { ReviewsTable } from './components/ReviewsTable';
import { EditReviewModal } from './components/EditReviewModal';
import { mockReviews, Review } from '../customers/data/mock-reviews';
import { SearchIcon, FilterIcon } from '@ff/ui';
import { CustomSelect } from '../../components/ui/CustomSelect';

export default function ReviewsFeature() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'unfeatured'>('all');
  
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const ratingOptions = [
    { label: 'All Ratings', value: 'all' },
    { label: '5 Stars', value: '5' },
    { label: '4 Stars', value: '4' },
    { label: '3 Stars', value: '3' },
    { label: '2 Stars', value: '2' },
    { label: '1 Star', value: '1' },
  ];

  const verifiedOptions = [
    { label: 'All Verification', value: 'all' },
    { label: 'Verified Only', value: 'verified' },
    { label: 'Unverified Only', value: 'unverified' },
  ];

  const featuredOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Featured Only', value: 'featured' },
    { label: 'Not Featured', value: 'unfeatured' },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = (reviewId: string) => {
    setReviews(reviews.filter((r) => r.id !== reviewId));
  };

  const handleToggleVerified = (reviewId: string) => {
    setReviews(reviews.map((r) => 
      r.id === reviewId ? { ...r, isVerified: !r.isVerified } : r
    ));
  };

  const handleToggleFeatured = (reviewId: string) => {
    setReviews(reviews.map((r) => 
      r.id === reviewId ? { ...r, isFeatured: !r.isFeatured } : r
    ));
  };

  const handleEditSave = (reviewId: string, newComment: string) => {
    setReviews(reviews.map((r) => 
      r.id === reviewId ? { ...r, comment: newComment } : r
    ));
  };

  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.productName.toLowerCase().includes(q) || 
        r.comment.toLowerCase().includes(q)
      );
    }

    if (ratingFilter !== 'all') {
      result = result.filter(r => r.rating === ratingFilter);
    }

    if (verifiedFilter === 'verified') result = result.filter(r => r.isVerified);
    if (verifiedFilter === 'unverified') result = result.filter(r => !r.isVerified);
    
    if (featuredFilter === 'featured') result = result.filter(r => r.isFeatured);
    if (featuredFilter === 'unfeatured') result = result.filter(r => !r.isFeatured);

    return result.sort((a, b) => {
      if (sortField === 'rating') {
        return sortDirection === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      }
      if (sortField === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });
  }, [reviews, searchQuery, ratingFilter, verifiedFilter, featuredFilter, sortField, sortDirection]);

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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-11 text-sm text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60">
              <FilterIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Filters:</span>
            </div>

            <CustomSelect
              options={verifiedOptions}
              value={verifiedFilter}
              onChange={(val) => setVerifiedFilter(val as any)}
              className="w-40 z-50"
            />

            <CustomSelect
              options={featuredOptions}
              value={featuredFilter}
              onChange={(val) => setFeaturedFilter(val as any)}
              className="w-36 z-50"
            />

            <CustomSelect
              options={ratingOptions}
              value={ratingFilter.toString()}
              onChange={(val) => setRatingFilter(val === 'all' ? 'all' : Number(val))}
              className="w-36 z-50"
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
            className="flex-1 min-h-0 overflow-hidden flex flex-col"
          >
            <ReviewsTable 
              reviews={filteredAndSortedReviews}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onDelete={handleDelete}
              onToggleVerified={handleToggleVerified}
              onToggleFeatured={handleToggleFeatured}
              onEditReview={(id) => setEditingReviewId(id)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <EditReviewModal 
        isOpen={!!editingReviewId}
        onClose={() => setEditingReviewId(null)}
        review={reviews.find(r => r.id === editingReviewId) || null}
        onSave={handleEditSave}
      />
    </div>
  );
}
