import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

import { ImageIcon } from '@ff/ui';
import { randomUUID } from 'crypto';
import { AnimatePresence, motion } from 'motion/react';

import { type ProductCategory } from '../types';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: ProductCategory, isEdit: boolean, originalSlug?: string) => void;
  initialData?: ProductCategory | null;
}

export function AddCategoryModal({ isOpen, onClose, onSave, initialData }: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Men' | 'Women' | 'Unisex'>('Men');
  const [logoUrl, setLogoUrl] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (initialData && isOpen) {
      setName(initialData.name);
      setGender(initialData.gender);
      setLogoUrl(initialData.image);
      setFileToUpload(null);
    } else if (isOpen) {
      setName('');
      setGender('Men');
      setLogoUrl('');
      setFileToUpload(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen || !mounted) {
    return null;
  }

  const handleSave = async () => {
    if (!name.trim()) {
      return;
    }

    setIsUploading(true);

    try {
      let finalLogoUrl = logoUrl.trim() ?? '/images/category-placeholder.png';

      if (fileToUpload) {
        const genderPrefix = gender === 'Unisex' ? 'unisex' : gender.toLowerCase();
        const uploadSlug = `${genderPrefix}-${name.trim()}`;

        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('slug', uploadSlug);
        formData.append('folder', 'categories');

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/upload`,
          {
            method: 'POST',
            body: formData,
          },
        );

        if (!res.ok) {
          throw new Error('Upload failed');
        }
        const data = await res.json();
        finalLogoUrl = data.url;

        // If we are replacing an existing Cloudflare logo, delete it
        if (
          initialData?.image &&
          initialData.image.startsWith('http') &&
          !initialData.image.includes('localhost')
        ) {
          try {
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/upload/batch`,
              {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls: [initialData.image] }),
              },
            );
          } catch (err) {
            console.error('Failed to cleanup old category image:', err);
          }
        }
      }

      const slug = `${gender === 'Unisex' ? 'unisex' : gender.toLowerCase()}-${name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')}`;

      onSave(
        {
          id: initialData?.id ?? `cat-${Date.now()}`,
          name: name.trim(),
          slug,
          gender,
          image: finalLogoUrl,
          productCount: initialData?.productCount ?? 0,
        },
        !!initialData,
        initialData?.slug,
      );

      // Reset form
      setName('');
      setGender('Men');
      setLogoUrl('');
      setFileToUpload(null);
      onClose();
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return createPortal(
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
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl dark:border-white/5 dark:bg-[#111]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/5 p-6 dark:border-white/5">
            <h2 className="text-xl font-bold text-black dark:text-white">
              {initialData ? 'Edit Category' : 'Add New Category'}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-black/40 transition-colors hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="space-y-6 p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-black/70 dark:text-white/70">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="e.g. Outerwear"
                className="w-full rounded-xl border border-black/10 bg-[#f8f9fa] px-4 py-3 text-sm text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222] dark:focus:ring-white/5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-black/70 dark:text-white/70">
                  Gender
                </label>
                <div className="flex flex-col gap-2">
                  {(['Men', 'Women', 'Unisex'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        setGender(g);
                      }}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all ${gender === g ? 'border-black bg-black/5 text-black dark:border-white dark:bg-white/10 dark:text-white' : 'border-transparent bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10'}`}
                    >
                      {g}
                      {gender === g && (
                        <div className="h-2 w-2 rounded-full bg-black dark:bg-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-black/70 dark:text-white/70">
                  Cover Image (3:4 Ratio)
                </label>
                <div className="relative w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const file = e.target.files[0];
                        setFileToUpload(file);
                        setLogoUrl(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                    id="category-image-upload"
                  />
                  <label
                    htmlFor="category-image-upload"
                    className="group flex aspect-[3/4] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-black/20 bg-[#f8f9fa] transition-all hover:bg-black/5 dark:border-white/20 dark:bg-[#1a1a1a] dark:hover:bg-white/5"
                  >
                    {logoUrl ? (
                      <div className="relative h-full w-full">
                        <Image fill src={logoUrl} alt="Category preview" className="object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                          <span className="text-xs font-bold text-white">Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-black/60 dark:text-white/60">
                        <ImageIcon className="h-8 w-8 opacity-50" />
                        <span className="text-xs font-medium">Upload Image</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-black/5 bg-[#f8f9fa] p-6 dark:border-white/5 dark:bg-[#1a1a1a]">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-black/5 disabled:opacity-50 dark:text-white dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || !logoUrl || isUploading}
              className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 dark:bg-white dark:text-black"
            >
              {isUploading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white dark:border-black/20 dark:border-t-black" />
              )}
              {isUploading ? 'Uploading...' : initialData ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
}
