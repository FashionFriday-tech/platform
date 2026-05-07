import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageIcon } from '@ff/ui';
import Image from 'next/image';

interface AddCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, image: string, slug: string) => void;
}

export function AddCollectionModal({ isOpen, onClose, onSave }: AddCollectionModalProps) {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setName('');
      setImageUrl('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    onSave(
      name.trim(),
      imageUrl.trim() || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200', // Default fallback
      slug
    );

    onClose();
  };

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
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#111] border border-black/5 dark:border-white/5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/5 p-6 dark:border-white/5">
            <h2 className="text-xl font-bold text-black dark:text-white">
              Create New Collection
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-black/40 transition-colors hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-black/70 dark:text-white/70">
                Collection Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Summer Collection '25"
                className="w-full rounded-xl border border-black/10 bg-[#f8f9fa] px-4 py-3 text-sm text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222] dark:focus:ring-white/5"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black/70 dark:text-white/70">
                Collection Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageUrl(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="hidden"
                  id="collection-image-upload"
                />
                <label
                  htmlFor="collection-image-upload"
                  className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-black/20 bg-[#f8f9fa] py-2.5 px-4 text-sm text-black/60 transition-all hover:bg-black/5 dark:border-white/20 dark:bg-[#1a1a1a] dark:text-white/60 dark:hover:bg-white/5"
                >
                  {imageUrl ? (
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image width={500} height={500} src={imageUrl} alt="Preview" className="h-6 w-6 rounded-md object-cover bg-black/5 dark:bg-white/5" />
                        <span className="truncate text-black dark:text-white">Image selected</span>
                      </div>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Change</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 opacity-50" />
                      <span>Click to upload image...</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-black/5 bg-[#f8f9fa] p-6 dark:border-white/5 dark:bg-[#1a1a1a]">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 dark:bg-white dark:text-black"
            >
              Create Collection
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
