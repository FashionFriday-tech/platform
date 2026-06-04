'use client';

import { useEffect, useMemo, useState } from 'react';

import { type Review } from '../types';

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'unfeatured'>('all');

  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/reviews`,
      );
      if (res.ok) {
        const data = (await res.json()) as {
          id: string;
          userName?: string;
          userId?: string;
          productId: string;
          product?: { name?: string; image?: string };
          productImage?: string;
          rating: number;
          comment: string;
          createdAt: string;
          isActive: boolean;
        }[];
        // Map backend data to frontend Review format
        const formattedReviews: Review[] = data.map((item) => ({
          id: item.id,
          customerId: item.userName ?? item.userId ?? 'guest',
          productId: item.productId,
          productName: item.product?.name ?? 'Unknown Product',
          productImage: item.productImage ?? item.product?.image ?? '',
          rating: item.rating,
          comment: item.comment,
          date: new Date(item.createdAt).toISOString().split('T')[0],
          isVerified: item.isActive, // Mapping isActive to isVerified in UI
          isFeatured: false, // We don't have isFeatured in DB yet
        }));
        setReviews(formattedReviews);
      }
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  };

  useEffect(() => {
    void fetchReviews();
  }, []);

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

  const handleDelete = async (reviewId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/reviews/${reviewId}`,
        {
          method: 'DELETE',
        },
      );
      if (res.ok) {
        setReviews(reviews.filter((r) => r.id !== reviewId));
      }
    } catch (err) {
      console.error('Failed to delete review', err);
    }
  };

  const handleToggleVerified = async (reviewId: string) => {
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) {
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/reviews/${reviewId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: !review.isVerified }),
        },
      );
      if (res.ok) {
        setReviews(
          reviews.map((r) => (r.id === reviewId ? { ...r, isVerified: !r.isVerified } : r)),
        );
      }
    } catch (err) {
      console.error('Failed to toggle verified', err);
    }
  };

  const handleToggleFeatured = (reviewId: string) => {
    setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, isFeatured: !r.isFeatured } : r)));
  };

  const handleEditSave = async (reviewId: string, newComment: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/reviews/${reviewId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comment: newComment }),
        },
      );
      if (res.ok) {
        setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, comment: newComment } : r)));
      }
    } catch (err) {
      console.error('Failed to save review', err);
    }
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
      result = result.filter((r) => r.rating === ratingFilter);
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

  const editingReview = reviews.find((r) => r.id === editingReviewId) ?? null;

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
