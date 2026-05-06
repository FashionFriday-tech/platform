'use client';

import React, { useState, useMemo } from 'react';
import { ReviewStats } from './components/ReviewStats';
import { ReviewsTable } from './components/ReviewsTable';
import { mockReviews, Review } from '../customers/data/mock-reviews';
import { SearchIcon, FilterIcon } from '@ff/ui';

export default function ReviewsFeature() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

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
  }, [reviews, searchQuery, ratingFilter, sortField, sortDirection]);

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="shrink-0">
        <ReviewStats />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black/40 dark:text-white/40" />
          <input
            type="text"
            placeholder="Search by product or comment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-black/30 dark:border-white/10 dark:bg-black dark:focus:border-white/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterIcon className="h-5 w-5 text-black/60 dark:text-white/60" />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="rounded-xl border border-black/10 bg-white py-2 pl-4 pr-10 text-sm outline-none dark:border-white/10 dark:bg-black"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-hidden min-h-[400px]">
        <ReviewsTable 
          reviews={filteredAndSortedReviews}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
