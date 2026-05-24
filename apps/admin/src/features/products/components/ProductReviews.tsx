'use client';

import { useMemo, useState, useEffect } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';

import type { Review } from '@ff/schemas';
interface Props {
  productId: string;
  productCategory?: string;
  productName?: string;
}

const cropImageTo3x4 = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      
      const targetRatio = 3 / 4;
      const sourceRatio = img.width / img.height;
      
      let drawWidth = img.width;
      let drawHeight = img.height;
      let offsetX = 0;
      let offsetY = 0;

      if (sourceRatio > targetRatio) {
        drawWidth = img.height * targetRatio;
        offsetX = (img.width - drawWidth) / 2;
      } else {
        drawHeight = img.width / targetRatio;
        offsetY = (img.height - drawHeight) / 2;
      }

      canvas.width = drawWidth;
      canvas.height = drawHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas ctx not available'));
      
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight, 0, 0, drawWidth, drawHeight);
      
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Canvas toBlob failed'));
        const croppedFile = new File([blob], file.name, { type: file.type });
        resolve(croppedFile);
      }, file.type);
    };
    img.onerror = reject;
    img.src = url;
  });
};

export function ProductReviews({ 
  productId, 
  productCategory = 'uncategorized', 
  productName = 'product'
}: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>(
    'newest',
  );
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newReview, setNewReview] = useState<{
    userName: string;
    rating: number;
    comment: string;
    productImage: string;
    imageFile: File | null;
  }>({
    userName: '',
    rating: 5,
    comment: '',
    productImage: '',
    imageFile: null,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    userName: string;
    rating: number;
    comment: string;
    productImage: string;
    imageFile: File | null;
  }>({
    userName: '',
    rating: 5,
    comment: '',
    productImage: '',
    imageFile: null,
  });
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/products/${productId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      switch (sortOption) {
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [reviews, sortOption]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return 0;
    }
    const total = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const uploadImage = async (file: File, reviewerName: string): Promise<string | null> => {
    const formData = new FormData();
    formData.append('folder', `reviews/${productCategory}`);
    const uniqueId = Math.random().toString(36).substring(2, 6);
    
    // Sanitize strings for SEO (lowercase, only alphanumeric, hyphens instead of spaces)
    const sanitizeForSeo = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const seoName = sanitizeForSeo(productName);
    
    // SEO Best Practice: [product-name]-review-fashion-friday-[id]
    formData.append('slug', `${seoName}-review-fashion-friday-${uniqueId}`);
    formData.append('file', file);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
    } catch (err) {
      console.error('Upload failed', err);
    }
    return null;
  };

  const handleAddSubmit = async () => {
    if (!newReview.userName || newReview.userName.trim().length < 4) {
      toast.error('Customer name must be at least 4 characters long.');
      return;
    }
    if (!newReview.comment) {
      toast.error('Review comment cannot be empty.');
      return;
    }
    setIsLoading(true);

    let finalImageUrl = newReview.productImage;
    if (newReview.imageFile) {
      const uploadedUrl = await uploadImage(newReview.imageFile, newReview.userName);
      if (uploadedUrl) finalImageUrl = uploadedUrl;
    }

    try {
      const payload = {
        userName: newReview.userName,
        rating: newReview.rating,
        comment: newReview.comment,
        productImage: finalImageUrl || undefined,
        isActive: true, // Auto-verify admin created reviews
      };
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        toast.success('Review submitted successfully! It will appear once verified.');
        await fetchReviews();
        setIsAdding(false);
        setNewReview({ userName: '', rating: 5, comment: '', productImage: '', imageFile: null });
      } else {
        toast.error('Failed to submit review. Check payload size or network.');
      }
    } catch (err) {
      toast.error('An error occurred submitting the review.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editingId) return;
    if (!editData.userName || editData.userName.trim().length < 4) {
      toast.error('Customer name must be at least 4 characters long.');
      return;
    }
    if (!editData.comment) {
      toast.error('Review comment cannot be empty.');
      return;
    }
    setIsLoading(true);

    let finalImageUrl = editData.productImage;
    if (editData.imageFile) {
      const uploadedUrl = await uploadImage(editData.imageFile, editData.userName);
      if (uploadedUrl) finalImageUrl = uploadedUrl;
    }

    try {
      const payload = {
        userName: editData.userName,
        rating: editData.rating,
        comment: editData.comment,
        productImage: finalImageUrl || undefined,
      };
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/products/${productId}/reviews/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        await fetchReviews();
        setEditingId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/products/${productId}/reviews/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchReviews();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setMenuOpenId(null);
    }
  };

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setEditData({
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      productImage: review.productImage || '',
      imageFile: null,
    });
    setMenuOpenId(null);
  };


  return (
    <div className="border-t border-black/10 pt-16 dark:border-white/10">
      {/* Header & Controls */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="mb-2 text-3xl font-black tracking-tighter text-black uppercase italic dark:text-white">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center text-yellow-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${i > parseFloat(averageRating as string) ? 'text-black/10 dark:text-white/10' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-bold text-black dark:text-white">
              {averageRating} out of 5
            </span>
            <span className="text-sm font-bold text-black/40 dark:text-white/40">
              ({reviews.length} reviews)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => {
                setIsSortOpen(!isSortOpen);
              }}
              className="flex items-center gap-2 rounded-full border border-black/10 bg-transparent px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
            >
              {sortOption === 'newest' && 'Newest First'}
              {sortOption === 'oldest' && 'Oldest First'}
              {sortOption === 'highest' && 'Highest Rating'}
              {sortOption === 'lowest' && 'Lowest Rating'}
              <svg
                className={`h-4 w-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isSortOpen && (
              <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-[#1a1a1a]">
                {[
                  { id: 'newest', label: 'Newest First' },
                  { id: 'oldest', label: 'Oldest First' },
                  { id: 'highest', label: 'Highest Rating' },
                  { id: 'lowest', label: 'Lowest Rating' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSortOption(opt.id as any);
                      setIsSortOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-xs font-bold text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/5 ${sortOption === opt.id ? 'bg-black/5 dark:bg-white/5' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
            }}
            className="rounded-full bg-black px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 dark:bg-white dark:text-black"
          >
            Add Review
          </button>
        </div>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="animate-in fade-in slide-in-from-top-4 mb-8 rounded-2xl border border-black/10 bg-black/5 p-8 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h3 className="mb-4 text-lg font-black text-black uppercase dark:text-white">
            Create New Review
          </h3>
          <div className="flex flex-col gap-8 md:flex-row">
            {/* Left: Image Upload */}
            <div className="flex w-full shrink-0 flex-col gap-2 md:w-[200px]">
              <label className="text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
                Product Image
              </label>
              <div className="flex flex-1 flex-col items-center gap-4">
                {newReview.productImage ? (
                  <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
                    <Image
                      width={500}
                      height={500}
                      src={newReview.productImage}
                      alt="Preview"
                      className="h-full w-full object-contain"
                    />
                    <button
                      onClick={() => setNewReview({ ...newReview, productImage: '', imageFile: null })}
                      className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label className="flex aspect-[3/4] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-black/20 bg-white transition-colors hover:bg-black/5 dark:border-white/20 dark:bg-black dark:hover:bg-white/5">
                    <svg className="h-8 w-8 text-black/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const croppedFile = await cropImageTo3x4(file);
                            setNewReview({ ...newReview, imageFile: croppedFile, productImage: URL.createObjectURL(croppedFile) });
                          } catch (err) {
                            console.error('Cropping failed', err);
                          }
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div className="flex flex-1 flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={newReview.userName}
                    onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black outline-none dark:border-white/10 dark:bg-black dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
                    Rating
                  </label>
                  <div className="flex h-[46px] items-center gap-1 px-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className={`transition-colors hover:text-yellow-500 ${
                          star <= newReview.rating ? 'text-yellow-500' : 'text-black/20 dark:text-white/20'
                        }`}
                      >
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="mb-1 block text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
                  Comment
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black outline-none dark:border-white/10 dark:bg-black dark:text-white"
                  placeholder="Write the review here..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleAddSubmit}
                  disabled={!newReview.userName || newReview.userName.trim().length < 4 || !newReview.productImage}
                  className="rounded-full bg-black px-6 py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
                >
                  Submit Review
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="rounded-full border border-black/10 px-6 py-2.5 text-sm font-bold text-black hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {sortedReviews.length === 0 && !isAdding ? (
          <div className="col-span-full py-12 text-center text-sm font-bold text-black/50 dark:text-white/50">
            No reviews found.
          </div>
        ) : (
          sortedReviews.map((review) => (
            <div
              key={review.id}
              className="group relative flex flex-col gap-6 rounded-2xl border border-black/5 bg-black/5 p-6 md:flex-row dark:border-white/5 dark:bg-white/5"
            >
              {/* Context Menu */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => {
                    setMenuOpenId(menuOpenId === review.id ? null : review.id);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-black/50 shadow-sm backdrop-blur-md transition-colors hover:bg-black/10 dark:bg-black/80 dark:text-white/50 dark:hover:bg-white/10"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
                {menuOpenId === review.id && (
                  <div className="absolute right-0 mt-1 w-32 overflow-hidden rounded-xl border border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-[#1a1a1a]">
                    <button
                      onClick={() => {
                        startEdit(review);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/5"
                    >
                      Edit Review
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(review.id);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-500 hover:bg-red-500/10"
                    >
                      Delete Review
                    </button>
                  </div>
                )}
              </div>

              {/* Editing State */}
              {editingId === review.id ? (
                <div className="mt-1 flex w-full flex-col gap-8 md:flex-row">
                  {/* Left: Image */}
                  <div className="flex w-full shrink-0 flex-col gap-2 md:w-[160px]">
                    {editData.productImage ? (
                      <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
                        <Image
                          width={500}
                          height={500}
                          src={editData.productImage}
                          alt="Preview"
                          className="h-full w-full object-contain"
                        />
                        <button
                          onClick={() => setEditData({ ...editData, productImage: '', imageFile: null })}
                          className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black"
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex aspect-[3/4] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-black/20 bg-white transition-colors hover:bg-black/5 dark:border-white/20 dark:bg-black dark:hover:bg-white/5">
                        <svg className="h-6 w-6 text-black/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-[9px] font-bold text-black/40 dark:text-white/40 uppercase">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const croppedFile = await cropImageTo3x4(file);
                                setEditData({ ...editData, imageFile: croppedFile, productImage: URL.createObjectURL(croppedFile) });
                              } catch (err) {
                                console.error('Cropping failed', err);
                              }
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  {/* Right: Details */}
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        type="text"
                        value={editData.userName}
                        onChange={(e) => setEditData({ ...editData, userName: e.target.value })}
                        className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-bold text-black outline-none dark:border-white/10 dark:bg-black dark:text-white"
                        placeholder="Customer Name"
                      />
                      <div className="flex items-center gap-1 px-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditData({ ...editData, rating: star })}
                            className={`transition-colors hover:text-yellow-500 ${
                              star <= editData.rating ? 'text-yellow-500' : 'text-black/20 dark:text-white/20'
                            }`}
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <textarea
                      value={editData.comment}
                      onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                      rows={3}
                      className="w-full resize-none rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-medium text-black outline-none dark:border-white/10 dark:bg-black dark:text-white"
                      placeholder="Review comment..."
                    />
                    
                    <div className="flex items-center gap-2">
                      <button
                        disabled={isLoading || !editData.userName || editData.userName.trim().length < 4 || !editData.productImage}
                        onClick={handleEditSubmit}
                        className="rounded-lg bg-black px-4 py-1.5 text-xs font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
                      >
                        {isLoading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-lg border border-black/10 px-4 py-1.5 text-xs font-bold text-black hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Image Section (Matches web app) */}
                  {review.productImage && (
                    <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-xl bg-black/5 shadow-sm md:w-32 lg:w-40 dark:bg-white/5">
                      <Image
                        width={500}
                        height={500}
                        src={review.productImage}
                        alt="review"
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="flex flex-1 flex-col items-start pt-2 pr-4">
                    <div className="mb-3 flex items-center text-yellow-500">
                      {[...Array(5)].map((_, idx) => (
                        <svg
                          key={idx}
                          className={`h-4 w-4 ${idx >= review.rating ? 'text-black/10 dark:text-white/10' : ''}`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>

                    <p className="mb-4 text-sm leading-relaxed font-medium text-black/70 italic dark:text-white/70">
                      "{review.comment}"
                    </p>

                    <div className="mt-auto flex w-full items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-[10px] font-black text-white uppercase dark:bg-white dark:text-black">
                          {review.userName.slice(0, 2)}
                        </span>
                        <span className="text-xs font-black tracking-tight text-black uppercase dark:text-white">
                          {review.userName}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold tracking-widest text-black/40 uppercase dark:text-white/40">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
