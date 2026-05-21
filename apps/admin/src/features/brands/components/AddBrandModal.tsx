import React, { useState } from 'react';
import Image from 'next/image';

import { type Brand, type BrandCategory } from '@ff/schemas';
import { ImageIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

interface AddBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (brand: Brand, isEdit: boolean, originalSlug?: string) => void;
  initialData?: Brand | null;
}

const ALL_CATEGORIES: BrandCategory[] = ['footwear', 'clothing', 'watch', 'accessories', 'eyewear'];

export function AddBrandModal({ isOpen, onClose, onSave, initialData }: AddBrandModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');
  const [logoUrl, setLogoUrl] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<BrandCategory[]>([]);

  React.useEffect(() => {
    if (initialData && isOpen) {
      setName(initialData.name);
      setColor(initialData.color);
      setLogoUrl(initialData.logo);

      const categoryMap: Record<string, string> = {
        sneakers: 'footwear',
        fashion: 'clothing',
        luxury: 'clothing',
        watches: 'watch',
        electronics: 'accessories',
        streetwear: 'clothing',
        sportswear: 'clothing',
      };
      const mapped = initialData.categories.map((c) => categoryMap[c] || c);
      setCategories([...new Set(mapped)] as BrandCategory[]);
      setFileToUpload(null);
    } else if (isOpen) {
      setName('');
      setColor('#000000');
      setLogoUrl('');
      setFileToUpload(null);
      setCategories([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = async () => {
    if (!name.trim()) {
      return;
    }

    setIsUploading(true);

    try {
      let finalLogoUrl = logoUrl.trim() || '/images/brand-logos/zara.png';

      if (fileToUpload) {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('slug', name.trim());
        formData.append('folder', 'brands');

        const res = await fetch('http://localhost:3002/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        finalLogoUrl = data.url;

        // If we are replacing an existing Cloudflare logo, delete it
        if (
          initialData &&
          initialData.logo &&
          initialData.logo.startsWith('http') &&
          !initialData.logo.includes('localhost')
        ) {
          try {
            await fetch('http://localhost:3002/admin/upload/batch', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ urls: [initialData.logo] }),
            });
          } catch (err) {
            console.error('Failed to cleanup old brand logo:', err);
          }
        }
      }

      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      onSave(
        {
          name: name.trim(),
          slug,
          color,
          logo: finalLogoUrl,
          categories: categories.length > 0 ? categories : ['clothing'],
        },
        !!initialData,
        initialData?.slug,
      );

      // Reset form
      setName('');
      setColor('#000000');
      setLogoUrl('');
      setFileToUpload(null);
      setCategories([]);
      onClose();
    } catch (error) {
      console.error('Failed to save brand:', error);
      alert('Failed to save brand logo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleCategory = (cat: BrandCategory) => {
    setCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
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
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl dark:border-white/5 dark:bg-[#111]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/5 p-6 dark:border-white/5">
            <h2 className="text-xl font-bold text-black dark:text-white">
              {initialData ? 'Edit Brand' : 'Add New Brand'}
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
                Brand Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="e.g. Balenciaga"
                className="w-full rounded-xl border border-black/10 bg-[#f8f9fa] px-4 py-3 text-sm text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222] dark:focus:ring-white/5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-black/70 dark:text-white/70">
                  Brand Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      setColor(e.target.value);
                    }}
                    className="h-10 w-12 cursor-pointer rounded-xl bg-transparent"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => {
                      setColor(e.target.value);
                    }}
                    className="flex-1 rounded-xl border border-black/10 bg-[#f8f9fa] px-4 py-2 text-sm text-black uppercase transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:focus:border-white/20 dark:focus:bg-[#222] dark:focus:ring-white/5"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-black/70 dark:text-white/70">
                  Logo Image (1:1 Ratio)
                </label>
                <div className="relative w-24">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setFileToUpload(file);
                        setLogoUrl(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                    id="brand-logo-upload"
                  />
                  <label
                    htmlFor="brand-logo-upload"
                    className="group flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-black/20 bg-[#f8f9fa] transition-all hover:bg-black/5 dark:border-white/20 dark:bg-[#1a1a1a] dark:hover:bg-white/5"
                  >
                    {logoUrl ? (
                      <div className="relative h-full w-full">
                        <Image
                          fill
                          src={logoUrl}
                          alt="Logo preview"
                          className="object-contain p-2"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                          <span className="text-[10px] font-bold text-white">Change</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-black/60 dark:text-white/60">
                        <ImageIcon className="h-6 w-6 opacity-50" />
                        <span className="text-[10px] font-medium">Upload</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black/70 dark:text-white/70">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      toggleCategory(cat);
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                      categories.includes(cat)
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
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
              disabled={!name.trim() || !logoUrl || categories.length === 0 || isUploading}
              className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {isUploading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white dark:border-black/20 dark:border-t-black"></div>
              )}
              {isUploading ? 'Uploading...' : initialData ? 'Save Changes' : 'Add Brand'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
