import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import { ImageIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import api from '@/lib/api-client';

import { type ProductCategory } from '../types';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: ProductCategory, isEdit: boolean, originalSlug?: string) => void;
  initialData?: ProductCategory | null;
  existingCategories?: ProductCategory[];
}

interface SizeGroup {
  id: string;
  label: string;
  items: string[];
}

const BASE_SIZE_GROUPS: SizeGroup[] = [
  {
    id: 'footwear_uk',
    label: 'Footwear (UK Sizes)',
    items: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'],
  },
  {
    id: 'apparel',
    label: 'Apparel / Tops',
    items: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'],
  },
  {
    id: 'bottoms',
    label: 'Pants / Waist Sizes',
    items: ['28', '30', '32', '34', '36', '38', '40', '42'],
  },
  {
    id: 'standard',
    label: 'Free Size & Accessories',
    items: ['Free Size', 'One Size', '40mm', '42mm', '44mm'],
  },
];

export function AddCategoryModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingCategories,
}: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Men' | 'Women' | 'Unisex'>('Men');
  const [logoUrl, setLogoUrl] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sizes, setSizes] = useState<string[]>([]);
  const [customSizeInput, setCustomSizeInput] = useState('');

  // Dynamically collect custom/extra sizes across other categories and current selection
  const extraSizes = React.useMemo(() => {
    const known = new Set(
      BASE_SIZE_GROUPS.flatMap((g) => g.items.map((i) => i.toLowerCase())),
    );
    const extras: string[] = [];

    if (existingCategories) {
      for (const cat of existingCategories) {
        if (Array.isArray(cat.sizes)) {
          for (const s of cat.sizes) {
            if (
              !known.has(s.toLowerCase()) &&
              !extras.some((e) => e.toLowerCase() === s.toLowerCase())
            ) {
              extras.push(s);
            }
          }
        }
      }
    }
    for (const s of sizes) {
      if (
        !known.has(s.toLowerCase()) &&
        !extras.some((e) => e.toLowerCase() === s.toLowerCase())
      ) {
        extras.push(s);
      }
    }
    return extras;
  }, [existingCategories, sizes]);

  React.useEffect(() => {
    setMounted(true);
    if (initialData && isOpen) {
      setName(initialData.name);
      setGender(initialData.gender);
      setLogoUrl(initialData.image);
      setSizes(Array.isArray(initialData.sizes) ? initialData.sizes : []);
      setCustomSizeInput('');
      setFileToUpload(null);
    } else if (isOpen) {
      setName('');
      setGender('Men');
      setLogoUrl('');
      setSizes([]);
      setCustomSizeInput('');
      setFileToUpload(null);
    }
  }, [initialData, isOpen]);

  const toggleSize = (sizeToToggle: string) => {
    setSizes((prev) => {
      const exists = prev.some((s) => s.toLowerCase() === sizeToToggle.toLowerCase());
      if (exists) {
        return prev.filter((s) => s.toLowerCase() !== sizeToToggle.toLowerCase());
      }
      return [...prev, sizeToToggle];
    });
  };

  const toggleGroup = (groupItems: string[]) => {
    setSizes((prev) => {
      const allSelected = groupItems.every((item) =>
        prev.some((s) => s.toLowerCase() === item.toLowerCase()),
      );
      if (allSelected) {
        // Deselect all items from this group
        return prev.filter(
          (s) => !groupItems.some((item) => item.toLowerCase() === s.toLowerCase()),
        );
      }
      // Select all items from this group
      const newItems = groupItems.filter(
        (item) => !prev.some((s) => s.toLowerCase() === item.toLowerCase()),
      );
      return [...prev, ...newItems];
    });
  };

  const handleAddCustomSize = () => {
    const clean = customSizeInput.trim();
    if (!clean) return;
    if (!sizes.some((s) => s.toLowerCase() === clean.toLowerCase())) {
      setSizes((prev) => [...prev, clean]);
    }
    setCustomSizeInput('');
  };

  const handleRemoveSize = (sToRemove: string) => {
    setSizes((prev) => prev.filter((s) => s.toLowerCase() !== sToRemove.toLowerCase()));
  };

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
        const uploadSlug = `${genderPrefix}-${name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')}`;

        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('slug', uploadSlug);
        formData.append('folder', 'categories');

        const data = await api.upload<{ url: string }>(formData);
        finalLogoUrl = data.url;

        // If we are replacing an existing Cloudflare logo, delete it
        if (
          initialData?.image &&
          initialData.image !== finalLogoUrl &&
          initialData.image.startsWith('http') &&
          !initialData.image.includes('localhost')
        ) {
          try {
            await api.delete('/admin/upload/batch', {
              body: JSON.stringify({ urls: [initialData.image] }),
            });
          } catch (err) {
            console.error('Failed to cleanup old category image:', err);
          }
        }
      }

      const slug =
        initialData?.slug && initialData.name === name.trim() && initialData.gender === gender
          ? initialData.slug
          : `${gender === 'Unisex' ? 'unisex' : gender.toLowerCase()}-${name
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
          sizes,
        },
        !!initialData,
        initialData?.slug,
      );

      // Reset form
      setName('');
      setGender('Men');
      setLogoUrl('');
      setSizes([]);
      setCustomSizeInput('');
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
          className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl dark:border-white/5 dark:bg-[#111]"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-black/5 p-6 dark:border-white/5">
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
          <div className="scrollbar-thin max-h-[calc(92vh-145px)] space-y-6 overflow-y-auto p-6">
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
                        {}
                        <img
                          src={logoUrl}
                          alt="Category preview"
                          className="h-full w-full object-cover"
                        />
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

            {/* Dynamic Category Size Labels */}
            <div className="rounded-2xl border border-black/10 bg-[#f8f9fa] p-4.5 dark:border-white/10 dark:bg-[#161616]">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-bold text-black dark:text-white">
                    Category Size Labels {sizes.length > 0 ? `(${sizes.length} selected)` : ''}
                  </label>
                  <p className="mt-0.5 text-xs text-black/50 dark:text-white/50">
                    Click items to toggle them on or off for this category
                  </p>
                </div>
                {sizes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSizes([])}
                    className="text-xs font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Dynamic Size Groups with Clickable Items */}
              <div className="mt-4 space-y-3">
                {BASE_SIZE_GROUPS.map((group) => {
                  const allSelected = group.items.every((item) =>
                    sizes.some((s) => s.toLowerCase() === item.toLowerCase()),
                  );
                  return (
                    <div
                      key={group.id}
                      className="rounded-xl border border-black/5 bg-white p-3 dark:border-white/5 dark:bg-[#1a1a1a]"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-black/70 uppercase dark:text-white/70">
                          {group.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleGroup(group.items)}
                          className="text-[11px] font-semibold text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
                        >
                          {allSelected ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => {
                          const isSelected = sizes.some(
                            (s) => s.toLowerCase() === item.toLowerCase(),
                          );
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => toggleSize(item)}
                              className={`rounded-lg border px-2.5 py-1 text-xs font-bold transition-all ${
                                isSelected
                                  ? 'border-black bg-black text-white shadow-xs dark:border-white dark:bg-white dark:text-black'
                                  : 'border-black/10 bg-[#f8f9fa] text-black/60 hover:border-black/30 hover:bg-black/5 dark:border-white/10 dark:bg-[#222] dark:text-white/60 dark:hover:bg-white/10'
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Additional / Custom Sizes */}
                {extraSizes.length > 0 && (
                  <div className="rounded-xl border border-black/5 bg-white p-3 dark:border-white/5 dark:bg-[#1a1a1a]">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-black/70 uppercase dark:text-white/70">
                        Custom &amp; Catalog Sizes
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {extraSizes.map((item) => {
                        const isSelected = sizes.some(
                          (s) => s.toLowerCase() === item.toLowerCase(),
                        );
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleSize(item)}
                            className={`rounded-lg border px-2.5 py-1 text-xs font-bold transition-all ${
                              isSelected
                                ? 'border-black bg-black text-white shadow-xs dark:border-white dark:bg-white dark:text-black'
                                : 'border-black/10 bg-[#f8f9fa] text-black/60 hover:border-black/30 hover:bg-black/5 dark:border-white/10 dark:bg-[#222] dark:text-white/60 dark:hover:bg-white/10'
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Add Custom Size Input */}
              <div className="mt-3.5 flex gap-2">
                <input
                  type="text"
                  value={customSizeInput}
                  onChange={(e) => setCustomSizeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomSize();
                    }
                  }}
                  placeholder="Type new custom size (e.g. UK 13, 44mm, Small)..."
                  className="flex-1 rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs font-medium text-black placeholder-black/30 outline-none focus:border-black/30 dark:border-white/10 dark:bg-[#202020] dark:text-white dark:placeholder-white/30"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSize}
                  className="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
                >
                  + Add Size
                </button>
              </div>

              {/* Selected Sizes Chips Summary */}
              {sizes.length > 0 && (
                <div className="mt-3 border-t border-black/5 pt-3 dark:border-white/5">
                  <span className="text-[10px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                    Selected for this category:
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {sizes.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-black/15 bg-black/5 px-2.5 py-0.5 text-xs font-bold text-black dark:border-white/15 dark:bg-white/10 dark:text-white"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(s)}
                          className="ml-0.5 text-black/40 hover:text-rose-500 dark:text-white/40 dark:hover:text-rose-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-black/5 bg-[#f8f9fa] p-6 dark:border-white/5 dark:bg-[#1a1a1a]">
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
