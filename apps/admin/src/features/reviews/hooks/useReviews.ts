// eslint-disable-next-line unicorn/filename-case
'use client';

import { useMemo, useState } from 'react';

import { mockReviews } from '../services/mock-reviews';
import { type Review } from '../types';

export function useReviews() {
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
    setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, isVerified: !r.isVerified } : r)));
  };

  const handleToggleFeatured = (reviewId: string) => {
    setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, isFeatured: !r.isFeatured } : r)));
  };

  const handleEditSave = (reviewId: string, newComment: string) => {
    setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, comment: newComment } : r)));
  };

  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) => r.productName.toLowerCase().includes(q) || r.comment.toLowerCase().includes(q),
      );
    }

    if (ratingFilter !== 'all') {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-conversion
      result = result.filter((r) => r.rating === Number(ratingFilter));
    }

    if (verifiedFilter === 'verified') {
      result = result.filter((r) => r.isVerified);
    }
    if (verifiedFilter === 'unverified') {
      result = result.filter((r) => !r.isVerified);
    }

    if (featuredFilter === 'featured') {
      result = result.filter((r) => r.isFeatured);
    }
    if (featuredFilter === 'unfeatured') {
      result = result.filter((r) => !r.isFeatured);
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
  }, [
    reviews,
    searchQuery,
    ratingFilter,
    verifiedFilter,
    featuredFilter,
    sortField,
    sortDirection,
  ]);

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const editingReview = reviews.find((r) => r.id === editingReviewId) || null;

  return {
    reviews,
    searchQuery,
    setSearchQuery,
    ratingFilter,
    setRatingFilter,
    verifiedFilter,
    setVerifiedFilter,
    featuredFilter,
    setFeaturedFilter,
    editingReviewId,
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
  };
}
