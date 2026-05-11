import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Review } from '@ff/schemas';

const INITIAL_MOCK_REVIEWS: Review[] = [
  {
    id: uuidv4(),
    productId: '081794MT',
    userId: uuidv4(),
    userName: 'Alex M.',
    rating: 5,
    comment:
      'Absolutely love this piece. The quality is exceptional and it fits perfectly just as described in the size guide. Would definitely recommend to anyone.',
    productImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: uuidv4(),
    productId: '081794MT',
    userId: uuidv4(),
    userName: 'Jordan K.',
    rating: 5,
    comment:
      "The materials used are top notch. I've washed it twice already and it holds its shape and color flawlessly. Shipping was incredibly fast too.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
  },
  {
    id: uuidv4(),
    productId: '081794MT',
    userId: uuidv4(),
    userName: 'Sam R.',
    rating: 4,
    comment:
      'Overall a fantastic product. The design is super trendy. I would suggest sizing up if you prefer a more oversized, relaxed look.',
    productImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
  },
];

export function useProductReviews(productId: string) {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_MOCK_REVIEWS);
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 5,
    comment: '',
    productImage: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    userName: '',
    rating: 5,
    comment: '',
    productImage: '',
  });
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      switch (sortOption) {
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        default:
          return 0;
      }
    });
  }, [reviews, sortOption]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return '0.0';
    const total = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const handleAddSubmit = () => {
    if (!newReview.userName || !newReview.comment) return;
    const review: Review = {
      id: uuidv4(),
      productId,
      userId: uuidv4(),
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      productImage: newReview.productImage || undefined,
      createdAt: new Date(),
    };
    setReviews((prev) => [review, ...prev]);
    setIsAdding(false);
    setNewReview({ userName: '', rating: 5, comment: '', productImage: '' });
  };

  const handleEditSubmit = () => {
    if (!editingId || !editData.userName || !editData.comment) return;
    setReviews((prev) =>
      prev.map((rev) =>
        rev.id === editingId
          ? {
              ...rev,
              userName: editData.userName,
              rating: editData.rating,
              comment: editData.comment,
              productImage: editData.productImage || undefined,
            }
          : rev,
      ),
    );
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setMenuOpenId(null);
  };

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setEditData({
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      productImage: review.productImage || '',
    });
    setMenuOpenId(null);
  };

  return {
    reviews,
    sortOption,
    setSortOption,
    isSortOpen,
    setIsSortOpen,
    isAdding,
    setIsAdding,
    newReview,
    setNewReview,
    editingId,
    setEditingId,
    editData,
    setEditData,
    menuOpenId,
    setMenuOpenId,
    sortedReviews,
    averageRating,
    handleAddSubmit,
    handleEditSubmit,
    handleDelete,
    startEdit
  };
}
