'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Review } from '../../customers/data/mock-reviews';

interface EditReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
  onSave: (reviewId: string, newComment: string) => void;
}

export function EditReviewModal({ isOpen, onClose, review, onSave }: EditReviewModalProps) {
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (review) {
      setComment(review.comment);
    }
  }, [review]);

  if (!isOpen || !review) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#111111] dark:border dark:border-white/10"
        >
          <h2 className="mb-1 text-xl font-bold text-black dark:text-white">Edit Review</h2>
          <p className="mb-6 text-sm text-black/60 dark:text-white/60">
            Modify the comment for {review.productName} by {review.customerId}
          </p>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-black/10 bg-[#f8f9fa] p-4 text-sm text-black outline-none transition-colors focus:border-black/30 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:focus:border-white/30"
            placeholder="Review comment..."
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(review.id, comment);
                onClose();
              }}
              className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-black/90 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
