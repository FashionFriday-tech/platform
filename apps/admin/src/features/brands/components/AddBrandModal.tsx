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

function isDarkColor(hexColor?: string): boolean {
  if (!hexColor) return true;
  const hex = hexColor.replace('#', '');
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  }
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  }
  return true;
}

export function AddBrandModal({ isOpen, onClose, onSave, initialData }: AddBrandModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');
  const [logoUrl, setLogoUrl] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<BrandCategory[]>([]);
  const [isActive, setIsActive] = useState(true);

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
      const mapped = initialData.categories.map((c) => categoryMap[c] ?? c);
      setCategories([...new Set(mapped)] as BrandCategory[]);
      setIsActive(initialData.isActive !== false);
      setFileToUpload(null);
    } else if (isOpen) {
      setName('');
      setColor('#000000');
      setLogoUrl('');
      setFileToUpload(null);
      setCategories([]);
      setIsActive(true);
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
      let finalLogoUrl = logoUrl.trim() ?? '/images/brand-logos/zara.png';

      if (fileToUpload) {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('slug', name.trim());
        formData.append('folder', 'brands');

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
          initialData?.logo &&
          initialData.logo !== finalLogoUrl &&
          initialData.logo.startsWith('http') &&
          !initialData.logo.includes('localhost')
        ) {
          try {
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/upload/batch`,
              {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls: [initialData.logo] }),
              },
            );
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
          ...(initialData?.id ? { id: initialData.id } : {}),
          name: name.trim(),
          slug,
          color,
          logo: finalLogoUrl,
          categories: categories.length > 0 ? categories : ['clothing'],
          isActive,
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
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4">
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
          className="relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl sm:rounded-3xl dark:border-white/5 dark:bg-[#111]"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-black/5 p-4 sm:p-6 dark:border-white/5">
            <h2 className="text-lg font-bold text-black sm:text-xl dark:text-white">
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
          <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto p-4 sm:space-y-6 sm:p-6">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-black/70 sm:text-sm dark:text-white/70">
                Brand Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="e.g. Balenciaga"
                className="w-full rounded-xl border border-black/10 bg-[#f8f9fa] px-3.5 py-2.5 text-xs text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 sm:px-4 sm:py-3 sm:text-sm dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222] dark:focus:ring-white/5"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col justify-between gap-3 sm:gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-black/70 sm:text-sm dark:text-white/70">
                    Brand Color
                  </label>
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => {
                        setColor(e.target.value);
                      }}
                      className="h-9 w-11 shrink-0 cursor-pointer rounded-xl bg-transparent sm:h-10 sm:w-12"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => {
                        setColor(e.target.value);
                      }}
                      className="flex-1 rounded-xl border border-black/10 bg-[#f8f9fa] px-3 py-2 font-mono text-xs text-black uppercase transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 sm:px-4 sm:py-2 sm:text-sm dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:focus:border-white/20 dark:focus:bg-[#222] dark:focus:ring-white/5"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-black/70 sm:text-sm dark:text-white/70">
                    Image Link
                  </label>
                  <input
                    type="text"
                    value={fileToUpload ? '' : logoUrl}
                    onChange={(e) => {
                      setFileToUpload(null);
                      setLogoUrl(e.target.value);
                    }}
                    placeholder="Paste URL..."
                    className="w-full rounded-xl border border-black/10 bg-[#f8f9fa] px-3 py-2 text-xs text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 sm:px-4 sm:py-2.5 sm:text-sm dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222] dark:focus:ring-white/5"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-black/70 sm:text-sm dark:text-white/70">
                  Logo Preview
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
                    id="brand-logo-upload"
                  />
                  <label
                    htmlFor="brand-logo-upload"
                    style={{ backgroundColor: color || undefined }}
                    className="group flex h-36 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-black/20 bg-[#f8f9fa] transition-all hover:opacity-95 sm:h-auto sm:aspect-square dark:border-white/20 dark:bg-[#1a1a1a]"
                  >
                    {logoUrl ? (
                      <div className="relative h-full w-full">
                        <img
                          src={logoUrl}
                          alt="Logo preview"
                          className={`h-full w-full object-contain p-3 sm:p-4 ${color ? (isDarkColor(color) ? 'invert' : 'invert-0') : 'dark:invert'}`}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                          <span className="text-xs font-bold text-white sm:text-sm">Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-black/60 sm:gap-2 dark:text-white/60">
                        <ImageIcon className="h-6 w-6 opacity-50 sm:h-8 sm:w-8" />
                        <span className="text-[11px] font-medium sm:text-xs">Upload Image</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-black/70 sm:text-sm dark:text-white/70">
                Categories
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      toggleCategory(cat);
                    }}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize transition-all sm:px-3 sm:py-1.5 sm:text-xs ${
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

            {/* Brand Status Switch */}
            <div className="flex items-center justify-between rounded-xl border border-black/5 bg-[#f8f9fa] p-3 sm:rounded-2xl sm:p-4 dark:border-white/5 dark:bg-[#1a1a1a]">
              <div>
                <p className="text-xs font-semibold text-black sm:text-sm dark:text-white">Enable Brand</p>
                <p className="text-[10px] text-black/50 sm:text-xs dark:text-white/50">
                  {isActive
                    ? 'Brand will be active and visible in the store'
                    : 'Brand will be disabled and hidden from the store'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsActive(!isActive);
                }}
                className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors focus:outline-none ${
                  isActive ? 'bg-emerald-500' : 'bg-zinc-600'
                }`}
                aria-label="Toggle brand active state"
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                    isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-black/5 bg-[#f8f9fa] p-3.5 sm:gap-3 sm:p-6 dark:border-white/5 dark:bg-[#1a1a1a]">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 rounded-xl px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-black/5 disabled:opacity-50 sm:flex-initial sm:py-2.5 sm:text-sm dark:text-white dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || !logoUrl || categories.length === 0 || isUploading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 sm:flex-initial sm:px-6 sm:py-2.5 sm:text-sm dark:bg-white dark:text-black"
            >
              {isUploading && (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white dark:border-black/20 dark:border-t-black" />
              )}
              {isUploading ? 'Uploading...' : initialData ? 'Save Changes' : 'Add Brand'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
