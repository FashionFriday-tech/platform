'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { type Product } from '@ff/schemas';

import { ImageCropModal } from '@/components/ui/ImageCropModal';
import { Toast } from '@/components/ui/Toast';
import { AddColorModal } from '@/features/colors';
import { api } from '@/lib/api-client';

import { useAddProductForm } from '../hooks/useAddProductForm';
import { isFootwearCategory, isWatchCategory } from '../utils/constants';
import { LabelWithTick } from './LabelWithTick';
import { ProductSellerSelector } from './ProductSellerSelector';

function FieldErrorMessage({ error }: { error?: string }) {
  if (!error) {
    return null;
  }
  return (
    <p className="animate-in fade-in slide-in-from-top-1 mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-rose-500">
      <svg className="h-3.5 w-3.5 shrink-0 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      <span>{error}</span>
    </p>
  );
}

interface AddProductFormProps {
  initialData?: Product;
}

export function AddProductForm({ initialData }: AddProductFormProps) {
  const router = useRouter();
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [selectedSellerIds, setSelectedSellerIds] = useState<string[]>(() => {
    const rawIds = (initialData as any)?.sellerIds;
    if (Array.isArray(rawIds) && rawIds.length > 0) {
      return rawIds.filter(Boolean);
    }
    const single = (initialData as any)?.sellerId ?? (initialData as any)?.seller?.id;
    return single ? [single] : [];
  });
  const selectedSellerId = selectedSellerIds[0] ?? null;

  useEffect(() => {
    if (initialData) {
      const rawIds = (initialData as any)?.sellerIds;
      if (Array.isArray(rawIds) && rawIds.length > 0) {
        setSelectedSellerIds(rawIds.filter(Boolean));
      } else {
        const single = (initialData as any)?.sellerId ?? (initialData as any)?.seller?.id;
        setSelectedSellerIds(single ? [single] : []);
      }
    }
  }, [initialData]);
  const {
    sizes,
    toggleSize,
    clearSizes,
    selectAllSizes,
    gender,
    setGender,
    category,
    handleCategorySelect,
    quality,
    setQuality,
    tags,
    brandInput,
    setBrandInput,
    selectedBrandLogo,
    setSelectedBrandLogo,
    isBrandOpen,
    setIsBrandOpen,
    colorInput,
    setColorInput,
    selectedColorHex,
    selectedColors,
    setSelectedColors,
    toggleColor,
    removeColor,
    isColorOpen,
    setIsColorOpen,
    isAddColorModalOpen,
    newColorDefaultName,
    newColorDefaultHex,
    isSavingNewColor,
    openAddColorModal,
    closeAddColorModal,
    handleCreateAndSelectColor,
    videoLink,
    setVideoLink,
    embedUrl,
    videoId,
    isCategoryOpen,
    setIsCategoryOpen,
    isQualityOpen,
    setIsQualityOpen,
    productName,
    setProductName,
    productDesc,
    setProductDesc,
    basePrice,
    setBasePrice,
    ogPrice,
    setOgPrice,
    stock,
    setStock,
    gettingPrice,
    setGettingPrice,
    seoTitle,
    setSeoTitle,
    seoSlug,
    setSeoSlug,
    seoDesc,
    setSeoDesc,
    seoError,
    generateSEO,
    fileInputRef,
    images,
    setImages,
    draggedIndex,
    categoryRef,
    qualityRef,
    colorRef,
    brandRef,
    handleImageUpload,
    handlePasteFromClipboard,
    handleExternalDrop,
    handleReorder,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    removeImage,
    filteredColors,
    availableSizes,
    filteredBrands,
    progress,
    isUploading,
    originalFiles,
    handleReCrop,
    apiCategories,
    apiQualities,
    availableCollections,
    toggleCollection,
    liveWatching,
    setLiveWatching,
    liveSold,
    setLiveSold,
    averageRating,
    totalReviews,
    modelGroup,
    setModelGroup,
    availableModelGroups,
  } = useAddProductForm(initialData, { onToast: setToast });

  const [isExternalDragOver, setIsExternalDragOver] = useState(false);

  const handleDropzoneDragOver = (e: React.DragEvent) => {
    if (draggedIndex !== null) {
      handleDragOver(e);
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    if (!isExternalDragOver) {
      setIsExternalDragOver(true);
    }
  };

  const handleDropzoneDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExternalDragOver(false);
  };

  const handleDropzoneDrop = (e: React.DragEvent) => {
    if (draggedIndex !== null) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    setIsExternalDragOver(false);
    void handleExternalDrop(e);
  };

  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const nameRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const genderRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const ogPriceRef = useRef<HTMLDivElement>(null);
  const stockRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const { [field]: _removed, ...next } = prev;
      return next;
    });
  };

  useEffect(() => {
    if (images.length > 0 && fieldErrors.images) {
      clearFieldError('images');
    }
  }, [images.length, fieldErrors.images]);

  useEffect(() => {
    if (sizes.length > 0 && fieldErrors.sizes) {
      clearFieldError('sizes');
    }
  }, [sizes.length, fieldErrors.sizes]);

  const markTouched = (field: string) => {
    setTouched((p) => ({ ...p, [field]: true }));
  };

  const getStatus = (
    val: string | number,
    initVal: string | number | null | undefined,
    minLen: number,
    fieldName?: string,
  ): 'empty' | 'default' | 'valid' | 'error' => {
    if (fieldName && fieldErrors[fieldName]) {
      return 'error';
    }
    const valStr = String(val);
    if (valStr.trim().length < minLen) {
      return hasSubmitted ? 'error' : 'empty';
    }
    if (initialData && valStr === String(initVal ?? '')) {
      return 'default';
    }
    if (!initialData && fieldName && !touched[fieldName]) {
      return 'default';
    }
    return 'valid';
  };

  const getArrayStatus = (
    val: string[],
    initVal: string[] | undefined,
    fieldName?: string,
  ): 'empty' | 'default' | 'valid' | 'error' => {
    if (fieldName && fieldErrors[fieldName]) {
      return 'error';
    }
    if (val.length === 0) {
      return hasSubmitted ? 'error' : 'empty';
    }
    if (
      initialData &&
      val.length === initVal?.length &&
      [...val].sort().join(',') === [...initVal].sort().join(',')
    ) {
      return 'default';
    }
    if (!initialData && fieldName && !touched[fieldName]) {
      return 'default';
    }
    return 'valid';
  };

  const distinctCategoryNames = useMemo<string[]>(() => {
    const seen = new Set<string>();
    const names: string[] = [];
    for (const c of apiCategories) {
      if (c.name && !seen.has(c.name.toLowerCase())) {
        seen.add(c.name.toLowerCase());
        names.push(c.name);
      }
    }
    return names;
  }, [apiCategories]);

  const resolvedApiCategory = useMemo(() => {
    const targetCatName = category.toLowerCase();
    const selectedCatGender =
      gender.toUpperCase() === 'WOMAN' || gender.toUpperCase() === 'WOMEN' ? 'WOMEN' : 'MEN';

    return (
      apiCategories.find(
        (c) =>
          c.name.toLowerCase() === targetCatName && c.gender?.toUpperCase() === selectedCatGender,
      ) ??
      apiCategories.find((c) => c.name.toLowerCase() === targetCatName) ??
      apiCategories[0]
    );
  }, [category, gender, apiCategories]);

  const availableQualities = useMemo(() => {
    if (!apiQualities || apiQualities.length === 0) {
      return [];
    }

    const catLower = (category || '').toLowerCase().trim();
    const isFootwear = isFootwearCategory(category);
    const isWatch = isWatchCategory(category);

    const matching = apiQualities
      .filter((q) => {
        if (!category) {
          return true;
        }
        return q.categories.some((c) => {
          const cLower = c.toLowerCase().trim();
          if (cLower === catLower) {
            return true;
          }
          if (isFootwear && (cLower === 'footwear' || cLower === 'sneakers')) {
            return true;
          }
          if (isWatch && (cLower === 'watches' || cLower === 'watch')) {
            return true;
          }
          return false;
        });
      })
      .map((q) => q.name);

    if (matching.length === 0) {
      return apiQualities.map((q) => q.name);
    }

    return matching;
  }, [category, apiQualities]);

  const validateForm = (isDraft: boolean): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!productName.trim()) {
      errors.productName = 'Product name is required';
    } else if (productName.trim().length < 3) {
      errors.productName = 'Product name must be at least 3 characters';
    }

    if (!isDraft) {
      if (!productDesc.trim()) {
        errors.productDesc = 'Product description is required';
      } else if (productDesc.trim().length < 10) {
        errors.productDesc = 'Description must be at least 10 characters';
      }

      if (!category?.trim()) {
        errors.category = 'Please select a product category';
      }

      if (!brandInput.trim()) {
        errors.brand = 'Brand name is required';
      } else if (brandInput.trim().length < 2) {
        errors.brand = 'Brand name must be at least 2 characters';
      }

      if (!gender?.trim()) {
        errors.gender = 'Please select a target gender';
      }

      const cleanSelling = basePrice.replace(/,/g, '').trim();
      if (!cleanSelling) {
        errors.basePrice = 'Selling price is required';
      } else if (isNaN(Number(cleanSelling)) || Number(cleanSelling) <= 0) {
        errors.basePrice = 'Selling price must be greater than ₹0';
      }

      const cleanOg = ogPrice.replace(/,/g, '').trim();
      if (cleanOg) {
        if (isNaN(Number(cleanOg))) {
          errors.ogPrice = 'Original MRP must be a valid number';
        } else if (Number(cleanOg) < Number(cleanSelling)) {
          errors.ogPrice = 'Original MRP must be greater than or equal to selling price';
        }
      }

      const cleanStock = stock.replace(/,/g, '').trim();
      if (!cleanStock) {
        errors.stock = 'Stock quantity is required';
      } else if (isNaN(Number(cleanStock)) || Number(cleanStock) < 0) {
        errors.stock = 'Stock quantity must be 0 or greater';
      } else if (Number(cleanStock) > 100) {
        errors.stock = 'Stock quantity cannot exceed 100';
      }

      if (!quality?.trim()) {
        errors.quality = 'Please select a quality grade';
      }

      if (sizes.length === 0) {
        errors.sizes = 'Please select at least one available size';
      }

      if (images.length === 0) {
        errors.images = 'Please upload at least one product image';
      }
    }

    return errors;
  };

  const handleSaveProduct = async (statusOverride?: 'DRAFT' | 'PUBLISHED') => {
    const isDraft = statusOverride === 'DRAFT';
    setHasSubmitted(true);

    const validationErrors = validateForm(isDraft);
    setFieldErrors(validationErrors);

    const errorFields = Object.keys(validationErrors);
    if (errorFields.length > 0) {
      const firstField = errorFields[0];
      const firstMsg = validationErrors[firstField];

      setToast({
        message: firstMsg,
        type: 'error',
      });

      const refMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
        productName: nameRef,
        productDesc: descRef,
        category: categoryRef,
        brand: brandRef,
        gender: genderRef,
        basePrice: priceRef,
        ogPrice: ogPriceRef,
        stock: stockRef,
        quality: qualityRef,
        sizes: sizeRef,
        images: mediaRef,
      };

      const target = refMap[firstField];
      if (target?.current) {
        target.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (isDraft) {
      setIsSavingDraft(true);
    } else {
      setIsSaving(true);
    }

    const newlyUploadedUrls: string[] = [];

    try {
      setToast({
        message: isDraft ? 'Saving draft...' : 'Uploading images and saving product...',
        type: 'success',
      });

      const uploadBlob = async (blob: Blob | File, originalName: string, pName?: string) => {
        const file =
          blob instanceof File ? blob : new File([blob], originalName, { type: 'image/webp' });
        const formData = new FormData();
        formData.append('file', file);
        if (pName) {
          formData.append('slug', pName);
        }
        formData.append('folder', 'products');

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
        return data.url;
      };

      let finalImages: string[] = [];

      if (images.length > 0) {
        finalImages = await Promise.all(
          images.map(async (img) => {
            if (img.isNew && img.file) {
              const url = await uploadBlob(img.file, img.file.name, productName);
              newlyUploadedUrls.push(url);
              return url;
            }
            return img.url;
          }),
        );

        // Update local images state so uploaded URLs can be reused if user retries or re-saves
        setImages((prev) =>
          prev.map((img, idx) => {
            const uploadedUrl = finalImages[idx];
            if (uploadedUrl && img.isNew) {
              return {
                ...img,
                url: uploadedUrl,
                isNew: false,
                file: img.file,
              };
            }
            return img;
          }),
        );
      } else {
        // Safe fallback placeholder image if draft is saved without images
        finalImages = ['https://pub-e317eed21d2a444d893320e08f2a283d.r2.dev/placeholder.webp'];
      }

      const targetCatName = category.toLowerCase();
      const selectedCatGender =
        gender.toUpperCase() === 'WOMAN' || gender.toUpperCase() === 'WOMEN' ? 'WOMEN' : 'MEN';

      let selectedApiCategory = apiCategories.find(
        (c) =>
          c.name.toLowerCase() === targetCatName && c.gender?.toUpperCase() === selectedCatGender,
      );
      selectedApiCategory ??= apiCategories.find((c) => c.name.toLowerCase() === targetCatName);
      selectedApiCategory ??= apiCategories[0];

      if (!selectedApiCategory) {
        setToast({
          message: 'Please select a product category first.',
          type: 'warning',
        });
        return;
      }

      // Map frontend quality to backend enum
      let mappedQuality = quality
        .trim()
        .toUpperCase()
        .replace(/[-\s]+/g, '_');
      if (mappedQuality === 'ORIGINAL') {
        mappedQuality = 'UA';
      }
      if (mappedQuality === '5A') {
        mappedQuality = 'STANDARD';
      }

      const computedSlug =
        seoSlug.trim() ||
        productName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') ||
        `draft-${Date.now()}`;

      const safeDescription =
        productDesc.trim().length >= 10
          ? productDesc.trim()
          : productDesc.trim()
            ? `${productDesc.trim()} (Draft item)`
            : `${productName.trim()} description (Draft)`;

      const targetStatus: 'DRAFT' | 'PUBLISHED' =
        statusOverride ?? (initialData?.status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED');

      const payload = {
        name: productName.trim().toUpperCase(),
        description: safeDescription.toUpperCase(),
        status: targetStatus,
        categoryId: selectedApiCategory.id,
        sellerId:
          selectedSellerIds[0] && selectedSellerIds[0] !== 'none'
            ? selectedSellerIds[0]
            : undefined,
        sellerIds: selectedSellerIds.filter((id) => id && id !== 'none'),
        brand: brandInput.trim() ? [brandInput.trim().toUpperCase()] : ['FASHION FRIDAY'],
        modelGroup: modelGroup?.trim()
          ? modelGroup.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-')
          : undefined,
        gender: gender.toUpperCase() === 'WOMAN' ? 'WOMEN' : gender.toUpperCase(),
        attributes: {
          sizes: sizes.length > 0 ? sizes.map((s) => s.trim().toUpperCase()) : [],
          colors:
            selectedColors.length > 0
              ? selectedColors.map((c) => c.hex)
              : [
                  selectedColorHex ||
                    filteredColors.find(
                      (c) => c.name.toLowerCase() === colorInput.trim().toLowerCase(),
                    )?.hex ||
                    (colorInput.startsWith('#') ? colorInput : '#000000'),
                ],
          quality: mappedQuality.toUpperCase(),
        },
        price: {
          sellingPrice: Number(basePrice) || 0,
          gettingPrice: gettingPrice ? Number(gettingPrice) : 0,
          ogPrice: ogPrice ? Number(ogPrice) : Number(basePrice) || 0,
        },
        inventory: {
          totalStock: stock ? Math.min(100, Math.max(0, Number(stock))) : 0,
        },
        media: {
          mainImage:
            finalImages.find((u) => Boolean(u) && typeof u === 'string') ||
            'https://pub-e317eed21d2a444d893320e08f2a283d.r2.dev/placeholder.webp',
          promoImage: finalImages[1] || null,
          liveImages: finalImages.slice(2).filter((u) => Boolean(u)),
          youtubeId: videoId?.trim() ? videoId.trim() : null,
        },
        marketing: {
          collections: tags.map((t) => t.trim().toUpperCase()),
          seoTitle: seoTitle?.trim() ? seoTitle.trim().toUpperCase() : undefined,
          seoDescription: seoDesc?.trim() ? seoDesc.trim().toUpperCase() : undefined,
        },
        liveMatrix: {
          liveWatching: Math.max(0, Number(liveWatching) || 0),
          liveSold: Math.max(0, Number(liveSold) || 0),
        },
        rating: {
          averageRating: averageRating ? Math.min(5, Math.max(0, Number(averageRating))) : 4.5,
          totalReviews: Math.max(0, Number(totalReviews) || 0),
        },
        liveWatching: Math.max(0, Number(liveWatching) || 0),
        liveSold: Math.max(0, Number(liveSold) || 0),
        averageRating: averageRating ? Math.min(5, Math.max(0, Number(averageRating))) : 4.5,
        totalReviews: Math.max(0, Number(totalReviews) || 0),
        slug: computedSlug,
      };

      if (initialData) {
        await api.patch(`/admin/products/${initialData.id}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }

      // Immediately trigger storefront cache revalidation for instant reflection on product details page
      const storefrontUrl =
        process.env.NEXT_PUBLIC_STOREFRONT_URL ||
        (process.env.NODE_ENV === 'production'
          ? 'https://fashionfriday.in'
          : 'http://localhost:3000');
      const revalSecret = 'f2a7c9e1b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8';
      void fetch(
        `${storefrontUrl}/api/revalidate?secret=${revalSecret}&tag=product-${computedSlug}&path=/product/${computedSlug}`,
        { method: 'POST', mode: 'no-cors' },
      ).catch((err: unknown) => {
        void err;
      });

      setToast({
        message: isDraft
          ? 'Draft saved successfully!'
          : initialData
            ? 'Product updated successfully!'
            : 'Product created successfully!',
        type: 'success',
      });

      // Redirect to product list after a brief delay
      setTimeout(() => {
        router.push('/products');
      }, 1200);
    } catch (error: any) {
      console.error('Error saving product:', error);

      const isNetworkError =
        error?.message?.toLowerCase().includes('failed to fetch') ||
        error?.message?.toLowerCase().includes('network') ||
        (typeof navigator !== 'undefined' && !navigator.onLine);

      setToast({
        message: isNetworkError
          ? 'Network connection issue. Please check your internet connection and try again.'
          : error?.message || 'Failed to save product. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
      setIsSavingDraft(false);
    }
  };

  return (
    <div className="scrollbar-hide h-full w-full overflow-y-auto rounded-2xl pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 mb-4 rounded-2xl border-b border-black/5 bg-gray-50/90 p-3 backdrop-blur-md sm:mb-6 sm:px-4 sm:py-2.5 dark:border-white/5 dark:bg-black/90">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Icon + Page Name */}
          <div className="flex min-w-0 items-center space-x-2.5 pl-0 sm:space-x-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white shadow-md dark:bg-white dark:text-black">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold tracking-tight text-black sm:text-lg md:text-xl dark:text-white">
                {initialData ? 'Edit Product' : 'Add New Product'}
              </h1>
            </div>
          </div>

          {/* Right Desktop/Tablet Actions */}
          <div className="hidden items-center sm:flex">
            <div className="mr-3 flex items-center space-x-2 rounded-full border border-black/5 bg-white px-3 py-2 shadow-sm md:mr-4 md:px-4 dark:border-white/5 dark:bg-[#111111]">
              <span className="text-[11px] font-bold tracking-wider text-black/60 uppercase md:text-xs dark:text-white/60">
                Completion
              </span>
              <span className="text-xs font-black text-black md:text-sm dark:text-white">
                {progress.filled}/{progress.total}
              </span>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              {initialData && (
                <button
                  type="button"
                  onClick={() => {
                    router.back();
                  }}
                  className="flex items-center space-x-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-black/60 shadow-sm transition-colors hover:bg-black/5 md:px-5 md:text-sm dark:border-white/10 dark:bg-[#111111] dark:text-white/60 dark:hover:bg-white/5"
                >
                  <span>Cancel</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => void handleSaveProduct('DRAFT')}
                disabled={isSaving || isSavingDraft}
                className="flex items-center space-x-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold shadow-sm transition-colors hover:bg-black/5 disabled:opacity-50 md:px-5 md:text-sm dark:border-white/10 dark:bg-[#111111] dark:hover:bg-white/5"
              >
                <svg
                  className="h-4 w-4 text-black/60 dark:text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>{isSavingDraft ? 'Saving Draft...' : 'Save Draft'}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  void handleSaveProduct(initialData?.status === 'DRAFT' ? 'PUBLISHED' : undefined)
                }
                disabled={isSaving || isSavingDraft}
                className="flex items-center space-x-2 rounded-full bg-black px-5 py-2 text-xs font-bold text-white shadow-lg transition-opacity hover:opacity-90 disabled:opacity-50 md:px-6 md:text-sm dark:bg-white dark:text-black"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  {isSaving
                    ? 'Saving...'
                    : initialData
                      ? initialData.status === 'DRAFT'
                        ? 'Publish Product'
                        : 'Save Changes'
                      : 'Add Product'}
                </span>
              </button>
            </div>
          </div>

          {/* Right Mobile Actions (Save button + 3-dots action menu) */}
          <div className="relative flex items-center space-x-1.5 sm:hidden">
            <button
              type="button"
              onClick={() =>
                void handleSaveProduct(initialData?.status === 'DRAFT' ? 'PUBLISHED' : undefined)
              }
              disabled={isSaving || isSavingDraft}
              className="flex items-center space-x-1 rounded-full bg-black px-3.5 py-1.5 text-xs font-bold text-white shadow-md transition-transform active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{isSaving ? '...' : initialData ? 'Save' : 'Add'}</span>
            </button>

            {/* 3-dots popup trigger */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen((prev) => !prev);
              }}
              aria-label="More actions"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-sm active:bg-black/5 dark:border-white/10 dark:bg-[#111111] dark:text-white dark:active:bg-white/5"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>

            {/* Mobile Dropdown Popup */}
            {isMobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                  }}
                />
                <div className="absolute top-10 right-0 z-50 w-52 rounded-2xl border border-black/10 bg-white p-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#181818]">
                  <div className="mb-1 flex items-center justify-between border-b border-black/5 px-3 py-2 dark:border-white/5">
                    <span className="text-[11px] font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
                      Completion
                    </span>
                    <span className="text-xs font-black text-black dark:text-white">
                      {progress.filled}/{progress.total}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      void handleSaveProduct('DRAFT');
                    }}
                    disabled={isSaving || isSavingDraft}
                    className="flex w-full items-center space-x-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-black/80 hover:bg-black/5 disabled:opacity-50 dark:text-white/80 dark:hover:bg-white/5"
                  >
                    <svg
                      className="h-4 w-4 text-black/60 dark:text-white/60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>{isSavingDraft ? 'Saving Draft...' : 'Save Draft'}</span>
                  </button>

                  {initialData && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.back();
                      }}
                      className="flex w-full items-center space-x-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-red-600 hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left Column (General info, Pricing, SEO) - Order 2 on mobile/tablet (< lg), Order 1 on desktop (lg+) */}
        <div className="order-2 space-y-4 lg:order-1 lg:col-span-2">
          {/* General Information */}
          <div className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-7 dark:bg-[#111]">
            <h2 className="mb-4 text-base font-bold text-black sm:mb-6 sm:text-lg dark:text-white">
              General Information
            </h2>

            <div className="space-y-5">
              <div ref={nameRef}>
                <LabelWithTick
                  label="Name Product"
                  status={
                    fieldErrors.productName
                      ? 'error'
                      : getStatus(productName, initialData?.name, 3, 'productName')
                  }
                  rightElement={
                    <span className="font-mono text-xs font-semibold text-black/50 dark:text-white/50">
                      <span className={productName.length >= 200 ? 'font-bold text-amber-500' : ''}>
                        {productName.length}
                      </span>
                      <span className="opacity-40"> / 200</span>
                    </span>
                  }
                />
                <input
                  type="text"
                  maxLength={200}
                  value={productName}
                  onChange={(e) => {
                    setProductName(e.target.value.toUpperCase());
                    clearFieldError('productName');
                  }}
                  placeholder="PUFFER JACKET WITH POCKET DETAIL"
                  className={`w-full rounded-xl border ${
                    fieldErrors.productName
                      ? 'border-rose-500 ring-2 ring-rose-500/20'
                      : 'border-transparent focus:border-black/20 dark:focus:border-white/20'
                  } bg-black/5 px-4 py-3.5 text-sm font-medium text-black uppercase transition-all outline-none dark:bg-white/5 dark:text-white`}
                />
                <FieldErrorMessage error={fieldErrors.productName} />
              </div>

              <div ref={descRef}>
                <LabelWithTick
                  label="Description Product"
                  status={
                    fieldErrors.productDesc
                      ? 'error'
                      : getStatus(productDesc, initialData?.description, 10, 'productDesc')
                  }
                  rightElement={
                    <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-black/50 dark:text-white/50">
                      {productDesc.trim().length > 0 && productDesc.trim().length < 10 && (
                        <span className="font-sans text-[10px] font-bold text-rose-500 dark:text-rose-400">
                          (min 10)
                        </span>
                      )}
                      <span
                        className={productDesc.length >= 2000 ? 'font-bold text-amber-500' : ''}
                      >
                        {productDesc.length}
                      </span>
                      <span className="opacity-40"> / 2000</span>
                    </div>
                  }
                />
                <textarea
                  rows={4}
                  maxLength={2000}
                  value={productDesc}
                  onChange={(e) => {
                    setProductDesc(e.target.value);
                    clearFieldError('productDesc');
                  }}
                  placeholder="Cropped puffer jacket made of technical fabric. High neck and long sleeves..."
                  className={`w-full resize-none rounded-xl border ${
                    fieldErrors.productDesc
                      ? 'border-rose-500 ring-2 ring-rose-500/20'
                      : 'border-transparent focus:border-black/20 dark:focus:border-white/20'
                  } bg-black/5 px-4 py-3.5 text-sm leading-relaxed font-medium text-black transition-all outline-none dark:bg-white/5 dark:text-white`}
                />
                <FieldErrorMessage error={fieldErrors.productDesc} />
              </div>

              <div className="grid grid-cols-1 gap-5 pt-2 md:grid-cols-2">
                <div ref={genderRef}>
                  <LabelWithTick
                    label="Gender"
                    status={
                      fieldErrors.gender
                        ? 'error'
                        : getStatus(gender, initialData?.gender, 1, 'gender')
                    }
                  />
                  <div
                    className={`flex flex-wrap gap-2 rounded-xl p-1 transition-all ${fieldErrors.gender ? 'border border-rose-500 ring-2 ring-rose-500/20' : ''}`}
                  >
                    {['Men', 'Woman', 'Unisex'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          setGender(g);
                          markTouched('gender');
                          clearFieldError('gender');
                        }}
                        className={`flex h-10 min-w-[70px] items-center justify-center rounded-xl px-4 text-sm font-bold transition-all ${
                          gender === g
                            ? 'bg-black text-white shadow-md dark:bg-white dark:text-black'
                            : 'bg-black/5 text-black/70 hover:bg-black/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                  <FieldErrorMessage error={fieldErrors.gender} />
                </div>

                <div ref={categoryRef} className="relative">
                  <LabelWithTick
                    label="Product Category"
                    status={
                      fieldErrors.category
                        ? 'error'
                        : getStatus(category, initialData?.categoryId, 1, 'category')
                    }
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCategoryOpen(!isCategoryOpen);
                      markTouched('category');
                    }}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all outline-none ${
                      fieldErrors.category
                        ? 'border-rose-500 bg-rose-500/5 ring-2 ring-rose-500/20'
                        : isCategoryOpen
                          ? 'border-black/20 bg-transparent text-black dark:border-white/20 dark:text-white'
                          : 'border-transparent bg-black/5 text-black dark:bg-white/5 dark:text-white'
                    }`}
                  >
                    <span>{category || 'Select Category'}</span>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 dark:bg-white/10">
                      <svg
                        className={`h-3 w-3 text-black transition-transform dark:text-white ${isCategoryOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>
                  <FieldErrorMessage error={fieldErrors.category} />

                  {isCategoryOpen && (
                    <div className="absolute z-10 mt-2 max-h-60 w-full overflow-x-hidden overflow-y-auto rounded-xl border border-black/10 bg-white py-1 shadow-2xl dark:border-white/10 dark:bg-[#1a1a1a]">
                      {distinctCategoryNames.map((catName) => {
                        const isSelected = category.toLowerCase() === catName.toLowerCase();
                        return (
                          <button
                            key={catName}
                            type="button"
                            onClick={() => {
                              handleCategorySelect(catName);
                              markTouched('category');
                              clearFieldError('category');
                            }}
                            className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${isSelected ? 'bg-black/5 font-bold text-black dark:bg-white/5 dark:text-white' : 'text-black/70 dark:text-white/70'}`}
                          >
                            <span>{catName}</span>
                          </button>
                        );
                      })}
                      {distinctCategoryNames.length === 0 && (
                        <div className="px-4 py-3 text-center text-sm font-medium text-black/50 dark:text-white/50">
                          No categories found.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Assigned Seller / Vendor */}
              <div className="pt-2">
                <ProductSellerSelector
                  selectedSellerId={selectedSellerId}
                  selectedSellerIds={selectedSellerIds}
                  onSelectSellers={(ids) => {
                    setSelectedSellerIds(ids);
                  }}
                  categoryId={resolvedApiCategory?.id}
                  categoryName={category}
                  status="default"
                />
              </div>

              {/* Extra E-commerce Info */}
              <div className="grid grid-cols-1 gap-5 pt-2 md:grid-cols-2">
                <div ref={brandRef} className="relative">
                  <LabelWithTick
                    label="Brand"
                    status={
                      fieldErrors.brand
                        ? 'error'
                        : getStatus(brandInput, initialData?.brand?.[0], 2, 'brand')
                    }
                  />
                  <div className="relative flex items-center">
                    {selectedBrandLogo && (
                      <div className="absolute top-1/2 left-4 flex h-5 w-5 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-black/10 text-[10px] font-bold text-black/80 dark:bg-white/20 dark:text-white">
                        {selectedBrandLogo.startsWith('http') ||
                        selectedBrandLogo.startsWith('/') ? (
                          <img
                            src={selectedBrandLogo}
                            alt="Brand logo"
                            className="h-full w-full bg-white object-contain p-0.5"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          selectedBrandLogo
                        )}
                      </div>
                    )}
                    <input
                      type="text"
                      value={brandInput}
                      onChange={(e) => {
                        setBrandInput(e.target.value.toUpperCase());
                        setSelectedBrandLogo(null); // Clear selected logo if typing
                        setIsBrandOpen(true);
                        clearFieldError('brand');
                      }}
                      onFocus={() => {
                        setIsBrandOpen(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (filteredBrands.length > 0) {
                            const first = filteredBrands[0];
                            setBrandInput(first.name.toUpperCase());
                            setSelectedBrandLogo(first.logo ?? first.name.charAt(0).toUpperCase());
                            setIsBrandOpen(false);
                            clearFieldError('brand');
                          }
                        }
                      }}
                      placeholder="e.g. NIKE"
                      className={`w-full rounded-xl border ${
                        fieldErrors.brand
                          ? 'border-rose-500 ring-2 ring-rose-500/20'
                          : 'border-transparent focus:border-black/20 dark:focus:border-white/20'
                      } bg-black/5 text-black uppercase dark:bg-white/5 dark:text-white ${selectedBrandLogo ? 'pl-10' : 'px-4'} py-3.5 text-sm font-medium transition-all outline-none`}
                    />
                  </div>
                  <FieldErrorMessage error={fieldErrors.brand} />

                  {isBrandOpen && (
                    <div className="absolute z-10 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-black/10 bg-white py-1 shadow-2xl [-ms-overflow-style:none] [scrollbar-width:none] dark:border-white/10 dark:bg-[#1a1a1a] [&::-webkit-scrollbar]:hidden">
                      {filteredBrands.length > 0 ? (
                        filteredBrands.map((b) => (
                          <button
                            key={b.name}
                            onClick={() => {
                              setBrandInput(b.name);
                              setSelectedBrandLogo(b.logo ?? b.name.charAt(0).toUpperCase());
                              setIsBrandOpen(false);
                              clearFieldError('brand');
                            }}
                            className="flex w-full items-center space-x-3 px-4 py-2.5 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                          >
                            <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-black/5 text-xs font-bold text-black/80 dark:bg-white/10 dark:text-white/80">
                              {b.logo ? (
                                <img
                                  src={b.logo}
                                  alt={b.name}
                                  className="h-full w-full bg-white object-contain p-0.5"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                b.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <span className="text-sm font-medium text-black/80 dark:text-white/80">
                              {b.name}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-center text-sm font-medium text-black/50 dark:text-white/50">
                          No brands found. Hit enter to add "{brandInput}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div ref={colorRef} className="relative">
                  <div className="flex items-center justify-between">
                    <LabelWithTick
                      label="Product Colors"
                      status={
                        selectedColors.length > 0 || colorInput.trim().length > 0
                          ? 'valid'
                          : getStatus(colorInput, initialData?.attributes?.colors?.[0], 3)
                      }
                    />
                    <div className="flex items-center gap-2">
                      {selectedColors.length > 0 && (
                        <span className="text-[11px] font-semibold text-black/50 dark:text-white/50">
                          {selectedColors.length} selected
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          openAddColorModal(colorInput);
                        }}
                        className="flex items-center gap-1 rounded-lg border border-black/10 bg-black/5 px-2.5 py-1 text-[11px] font-bold text-black/80 transition-all hover:bg-black/10 hover:text-black dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
                        title="Add a new custom color to catalog"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span>Add Color</span>
                      </button>
                    </div>
                  </div>

                  {/* Selected Color Badges / Chips */}
                  {selectedColors.length > 0 && (
                    <div className="mb-2.5 flex flex-wrap gap-2">
                      {selectedColors.map((color) => (
                        <span
                          key={color.hex + color.name}
                          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white py-1 pr-2.5 pl-1.5 text-xs font-semibold shadow-xs transition-all dark:border-white/10 dark:bg-[#1a1a1a]"
                        >
                          <span
                            className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/15 shadow-inner dark:border-white/15"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-black dark:text-white">{color.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              removeColor(color.name);
                            }}
                            className="ml-0.5 rounded-full p-0.5 text-black/40 hover:bg-black/10 hover:text-black dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white"
                            title={`Remove ${color.name}`}
                          >
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Input Search Box */}
                  <div className="relative flex items-center">
                    <div className="pointer-events-none absolute left-3.5 flex items-center">
                      <svg
                        className="h-4 w-4 text-black/40 dark:text-white/40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={colorInput}
                      onChange={(e) => {
                        setColorInput(e.target.value);
                        setIsColorOpen(true);
                      }}
                      onFocus={() => {
                        setIsColorOpen(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (filteredColors.length > 0) {
                            const first = filteredColors[0];
                            toggleColor(first);
                            setColorInput('');
                          } else if (colorInput.trim()) {
                            openAddColorModal(colorInput);
                          }
                        }
                      }}
                      placeholder={
                        selectedColors.length > 0
                          ? 'Add another color...'
                          : 'Search and select colors (e.g. Black, White, Red)'
                      }
                      className="w-full rounded-xl border-transparent bg-black/5 py-3.5 pr-14 pl-10 text-sm font-medium text-black transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
                    />
                    {selectedColors.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedColors([]);
                        }}
                        className="absolute right-3 rounded-md px-1.5 py-0.5 text-[11px] font-bold text-black/40 transition-colors hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Dropdown Menu with Multi-Select Checks */}
                  {isColorOpen && (
                    <div className="absolute z-20 mt-2 max-h-64 w-full overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]">
                      <div className="flex items-center justify-between border-b border-black/5 px-4 py-2 text-[11px] font-bold tracking-wider text-black/50 uppercase dark:border-white/5 dark:text-white/50">
                        <span>Available Colors</span>
                        <span>{selectedColors.length} selected</span>
                      </div>
                      <div className="max-h-52 overflow-y-auto py-1">
                        {filteredColors.length > 0 ? (
                          filteredColors.map((c) => {
                            const isSelected = selectedColors.some(
                              (sc) =>
                                sc.hex.toLowerCase() === c.hex.toLowerCase() ||
                                sc.name.toLowerCase() === c.name.toLowerCase(),
                            );
                            return (
                              <button
                                key={c.id ?? c.name}
                                type="button"
                                onClick={() => {
                                  toggleColor(c);
                                  setColorInput('');
                                }}
                                className={`flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors ${
                                  isSelected
                                    ? 'bg-black/5 font-bold text-black dark:bg-white/10 dark:text-white'
                                    : 'text-black/80 hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/5'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div
                                    className="h-4 w-4 shrink-0 rounded-full border border-black/10 shadow-sm dark:border-white/20"
                                    style={{ backgroundColor: c.hex }}
                                  />
                                  <span className="text-sm">{c.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-black/40 dark:text-white/40">
                                    {c.hex}
                                  </span>
                                  {isSelected && (
                                    <svg
                                      className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className="p-4 text-center">
                            <p className="mb-2.5 text-xs font-medium text-black/50 dark:text-white/50">
                              {colorInput.trim()
                                ? `No color found matching "${colorInput.trim()}"`
                                : 'No colors available'}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                openAddColorModal(colorInput);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-black"
                            >
                              <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              <span>
                                {colorInput.trim()
                                  ? `+ Add "${colorInput.trim()}"`
                                  : '+ Add New Color'}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                      {filteredColors.length > 0 && (
                        <div className="border-t border-black/5 p-2 dark:border-white/5">
                          <button
                            type="button"
                            onClick={() => {
                              openAddColorModal(colorInput);
                            }}
                            className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold text-black/70 transition-colors hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            <span>
                              {colorInput.trim()
                                ? `+ Add "${colorInput.trim()}" as new color`
                                : '+ Add New Color'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Model / Style Group (Links different colorways of the same model) */}
                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <LabelWithTick
                      label="Model / Style Group"
                      status={modelGroup.trim().length > 0 ? 'valid' : 'default'}
                      rightElement={
                        <span className="text-[11px] font-medium text-black/50 dark:text-white/50">
                          Links different colors of this model on PDP
                        </span>
                      }
                    />
                    {modelGroup && (
                      <button
                        type="button"
                        onClick={() => setModelGroup('')}
                        className="text-[11px] font-bold text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={modelGroup}
                    onChange={(e) =>
                      setModelGroup(
                        e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, '-')
                          .replace(/[^a-z0-9_-]+/g, ''),
                      )
                    }
                    placeholder="e.g. dunk-low-retro or classic-tee"
                    className="w-full rounded-xl border border-transparent bg-black/5 px-4 py-3.5 text-sm font-medium text-black lowercase transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
                  />
                  {availableModelGroups.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                        Existing Model Groups:
                      </span>
                      {availableModelGroups.slice(0, 8).map((group) => (
                        <button
                          key={group}
                          type="button"
                          onClick={() => setModelGroup(group)}
                          className={`rounded-md border px-2 py-0.5 text-xs font-semibold transition-all ${
                            modelGroup === group
                              ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                              : 'border-black/10 bg-black/5 text-black/70 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10'
                          }`}
                        >
                          {group}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 pt-2 md:grid-cols-2">
                <div ref={sizeRef}>
                  <div className="flex items-center justify-between">
                    <LabelWithTick
                      label="Size"
                      status={
                        fieldErrors.sizes
                          ? 'error'
                          : getArrayStatus(sizes, initialData?.attributes?.sizes, 'sizes')
                      }
                    />
                    <div className="flex items-center gap-2.5">
                      {sizes.length < availableSizes.length && (
                        <button
                          type="button"
                          onClick={() => {
                            selectAllSizes();
                            markTouched('sizes');
                            clearFieldError('sizes');
                          }}
                          className="text-xs font-semibold text-black/50 transition-colors hover:text-black dark:text-white/50 dark:hover:text-white"
                        >
                          Select All
                        </button>
                      )}
                      {sizes.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            clearSizes();
                            markTouched('sizes');
                            clearFieldError('sizes');
                          }}
                          className="text-xs font-bold text-red-500 transition-colors hover:text-red-600 dark:text-red-400"
                        >
                          Clear All ({sizes.length})
                        </button>
                      )}
                    </div>
                  </div>
                  <div
                    className={`flex flex-wrap gap-2 rounded-xl p-1 transition-all ${fieldErrors.sizes ? 'border border-rose-500 ring-2 ring-rose-500/20' : ''}`}
                  >
                    {availableSizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          toggleSize(s);
                          markTouched('sizes');
                          clearFieldError('sizes');
                        }}
                        className={`flex h-10 min-w-[44px] items-center justify-center rounded-xl px-3 text-sm font-bold transition-colors ${sizes.includes(s) ? 'bg-black text-white shadow-md dark:bg-white dark:text-black' : 'bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <FieldErrorMessage error={fieldErrors.sizes} />
                </div>

                <div ref={qualityRef} className="relative">
                  <LabelWithTick
                    label="Quality"
                    status={
                      fieldErrors.quality
                        ? 'error'
                        : getStatus(quality, initialData?.attributes?.quality, 1, 'quality')
                    }
                  />
                  <button
                    onClick={() => {
                      setIsQualityOpen(!isQualityOpen);
                      markTouched('quality');
                    }}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all outline-none ${
                      fieldErrors.quality
                        ? 'border-rose-500 bg-rose-500/5 ring-2 ring-rose-500/20'
                        : isQualityOpen
                          ? 'border-black/20 bg-transparent text-black dark:border-white/20 dark:text-white'
                          : 'border-transparent bg-black/5 text-black dark:bg-white/5 dark:text-white'
                    }`}
                  >
                    <span>{quality}</span>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 dark:bg-white/10">
                      <svg
                        className={`h-3 w-3 text-black transition-transform dark:text-white ${isQualityOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>
                  <FieldErrorMessage error={fieldErrors.quality} />

                  {isQualityOpen && (
                    <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-black/10 bg-white py-1 shadow-2xl dark:border-white/10 dark:bg-[#1a1a1a]">
                      {availableQualities.map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setQuality(q);
                            setIsQualityOpen(false);
                            markTouched('quality');
                            clearFieldError('quality');
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${quality === q ? 'bg-black/5 text-black dark:bg-white/5 dark:text-white' : 'text-black/70 dark:text-white/70'}`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing And Stock */}
          <div className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-7 dark:bg-[#111]">
            <h2 className="mb-4 text-base font-bold text-black sm:mb-6 sm:text-lg dark:text-white">
              Pricing And Stock
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div ref={ogPriceRef}>
                <LabelWithTick
                  label="Original Price (MRP)"
                  status={
                    fieldErrors.ogPrice ? 'error' : ogPrice.trim().length > 0 ? 'valid' : 'default'
                  }
                />
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="text-sm font-bold text-black/50 dark:text-white/50">₹</span>
                  </div>
                  <input
                    type="text"
                    value={ogPrice}
                    onChange={(e) => {
                      setOgPrice(e.target.value);
                      clearFieldError('ogPrice');
                    }}
                    placeholder="4,999"
                    className={`w-full rounded-xl border ${
                      fieldErrors.ogPrice
                        ? 'border-rose-500 ring-2 ring-rose-500/20'
                        : 'border-transparent focus:border-black/20 dark:focus:border-white/20'
                    } bg-black/5 py-3.5 pr-4 pl-8 text-sm font-medium text-black line-through decoration-black/30 transition-all outline-none dark:bg-white/5 dark:text-white dark:decoration-white/30`}
                  />
                </div>
                <FieldErrorMessage error={fieldErrors.ogPrice} />
              </div>

              <div>
                <LabelWithTick
                  label="Getting Price"
                  status={gettingPrice.trim().length > 0 ? 'valid' : 'default'}
                />
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="text-sm font-bold text-black/50 dark:text-white/50">₹</span>
                  </div>
                  <input
                    type="text"
                    value={gettingPrice}
                    onChange={(e) => {
                      setGettingPrice(e.target.value);
                    }}
                    placeholder="2,500"
                    className="w-full rounded-xl border-transparent bg-black/5 py-3.5 pr-4 pl-8 text-sm font-medium text-black transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
                  />
                </div>
              </div>

              <div ref={priceRef}>
                <LabelWithTick
                  label="Selling Price"
                  status={
                    fieldErrors.basePrice
                      ? 'error'
                      : getStatus(basePrice, initialData?.price?.sellingPrice, 1, 'basePrice')
                  }
                />
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="text-sm font-bold text-black/50 dark:text-white/50">₹</span>
                  </div>
                  <input
                    type="text"
                    value={basePrice}
                    onChange={(e) => {
                      setBasePrice(e.target.value);
                      clearFieldError('basePrice');
                    }}
                    placeholder="3,999"
                    className={`w-full rounded-xl border ${
                      fieldErrors.basePrice
                        ? 'border-rose-500 ring-2 ring-rose-500/20'
                        : 'border-transparent focus:border-black/20 dark:focus:border-white/20'
                    } bg-black/5 py-3.5 pr-4 pl-8 text-sm font-medium text-black transition-all outline-none dark:bg-white/5 dark:text-white`}
                  />
                </div>
                <FieldErrorMessage error={fieldErrors.basePrice} />
              </div>

              <div ref={stockRef}>
                <LabelWithTick
                  label="Stock"
                  status={
                    fieldErrors.stock
                      ? 'error'
                      : getStatus(stock, initialData?.inventory?.totalStock, 1, 'stock')
                  }
                />
                <div className="relative mt-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={stock}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setStock('');
                      } else {
                        const num = Number(val);
                        setStock(String(Math.min(100, Math.max(0, num))));
                      }
                      clearFieldError('stock');
                    }}
                    placeholder="100"
                    className={`w-full rounded-xl border ${
                      fieldErrors.stock
                        ? 'border-rose-500 ring-2 ring-rose-500/20'
                        : 'border-transparent focus:border-black/20 dark:focus:border-white/20'
                    } bg-black/5 px-4 py-3.5 text-sm font-medium text-black transition-all outline-none dark:bg-white/5 dark:text-white`}
                  />
                  {stock === '0' && (
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded-md bg-rose-500/10 px-2 py-0.5 text-xs font-bold text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                      SOLD OUT
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-black/40 dark:text-white/40">
                  <span>Product count max 100</span>
                </div>
                <FieldErrorMessage error={fieldErrors.stock} />
              </div>
            </div>
          </div>

          {/* Search Engine Optimization */}
          <div className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-7 dark:bg-[#111]">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <h2 className="text-base font-bold text-black sm:text-lg dark:text-white">
                  Search Engine Optimization
                </h2>
                {seoError && (
                  <span className="rounded-md bg-[#FF0000]/10 px-2.5 py-1 text-xs font-bold text-[#FF0000]">
                    {seoError}
                  </span>
                )}
              </div>
              <button
                onClick={generateSEO}
                className="flex items-center space-x-1.5 rounded-full bg-black px-4 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Generate</span>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <LabelWithTick label="URL Slug" status={getStatus(seoSlug, initialData?.slug, 3)} />
                <div className="flex flex-col overflow-hidden rounded-xl border border-transparent bg-black/5 transition-all focus-within:border-black/20 sm:flex-row sm:items-center dark:bg-white/5 dark:focus-within:border-white/20">
                  <span className="shrink-0 border-b border-black/5 bg-black/[0.02] px-4 py-2 text-xs font-medium text-black/40 sm:border-r sm:border-b-0 sm:bg-transparent sm:py-3.5 sm:text-sm dark:border-white/5 dark:text-white/40">
                    fashionfriday.in/product/
                  </span>
                  <input
                    type="text"
                    value={seoSlug}
                    onChange={(e) => {
                      setSeoSlug(e.target.value);
                    }}
                    placeholder="product-name"
                    className="w-full bg-transparent px-4 py-2.5 text-sm font-medium text-black lowercase transition-all outline-none sm:py-3.5 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <LabelWithTick
                  label="Meta Title"
                  status={getStatus(seoTitle, initialData?.marketing?.seoTitle, 5)}
                  rightElement={
                    <span className="text-xs font-medium text-black/40 dark:text-white/40">
                      50-60 chars
                    </span>
                  }
                />
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => {
                    setSeoTitle(e.target.value);
                  }}
                  placeholder="Buy Puffer Jacket With Pocket Detail - Fashion Friday"
                  className="w-full rounded-xl border-transparent bg-black/5 px-4 py-3.5 text-sm font-medium text-black transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
                />
              </div>

              <div>
                <LabelWithTick
                  label="Meta Description"
                  status={getStatus(seoDesc, initialData?.marketing?.seoDescription, 10)}
                  rightElement={
                    <span className="text-xs font-medium text-black/40 dark:text-white/40">
                      150-160 chars
                    </span>
                  }
                />
                <textarea
                  rows={3}
                  value={seoDesc}
                  onChange={(e) => {
                    setSeoDesc(e.target.value);
                  }}
                  placeholder="Shop the latest Puffer Jacket with pocket details. Fast shipping, great deals, and premium materials. Buy now at Fashion Friday."
                  className="w-full resize-none rounded-xl border-transparent bg-black/5 px-4 py-3.5 text-sm leading-relaxed font-medium text-black transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
                />
              </div>
            </div>
          </div>

          {/* Live Activity Matrix */}
          <div className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-7 dark:bg-[#111]">
            <div className="mb-6 flex flex-col gap-3 border-b border-black/5 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-black sm:text-lg dark:text-white">
                    Live Activity Matrix
                  </h2>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-black/50 dark:text-white/50">
                  Real-time storefront urgency metrics (Social proof defaults to 4.5★ automatically)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const randomWatching = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
                    const randomSold = Math.floor(Math.random() * 101);
                    setLiveWatching(randomWatching.toString());
                    setLiveSold(randomSold.toString());
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-black/10 bg-black/5 px-3 py-1.5 text-xs font-semibold text-black/70 transition-all hover:bg-black/10 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
                  title="Generate new random numbers (Viewers: 1k-10k, Sold: 0-100)"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Re-roll Random</span>
                </button>
                <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-600 uppercase dark:bg-emerald-500/20 dark:text-emerald-400">
                  Live Signals
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* View Count (Live Watching) */}
              <div className="rounded-xl border border-black/5 bg-black/[0.02] p-4 transition-all dark:border-white/5 dark:bg-white/[0.02]">
                <div className="mb-2 flex items-center justify-between">
                  <LabelWithTick
                    label="Live Viewers"
                    status={liveWatching.trim().length > 0 ? 'valid' : 'default'}
                    subtitle="Active shoppers viewing this product"
                  />
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="relative mt-1">
                  <input
                    type="number"
                    min="0"
                    value={liveWatching}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || Number(val) >= 0) {
                        setLiveWatching(val);
                      }
                    }}
                    placeholder="e.g. 2450"
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-base font-bold text-black transition-all outline-none focus:border-black/30 dark:border-white/10 dark:bg-[#161618] dark:text-white dark:focus:border-white/30"
                  />
                </div>
                <p className="mt-2 text-[11px] font-medium text-black/40 dark:text-white/40">
                  Auto-randomized between 1,000 and 10,000
                </p>
              </div>

              {/* Sold in last 24h */}
              <div className="rounded-xl border border-black/5 bg-black/[0.02] p-4 transition-all dark:border-white/5 dark:bg-white/[0.02]">
                <div className="mb-2 flex items-center justify-between">
                  <LabelWithTick
                    label="Sold in Last 24 Hours"
                    status={liveSold.trim().length > 0 ? 'valid' : 'default'}
                    subtitle="Recent purchases for urgency tags"
                  />
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 dark:text-orange-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="relative mt-1">
                  <input
                    type="number"
                    min="0"
                    value={liveSold}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || Number(val) >= 0) {
                        setLiveSold(val);
                      }
                    }}
                    placeholder="e.g. 42"
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-base font-bold text-black transition-all outline-none focus:border-black/30 dark:border-white/10 dark:bg-[#161618] dark:text-white dark:focus:border-white/30"
                  />
                </div>
                <p className="mt-2 text-[11px] font-medium text-black/40 dark:text-white/40">
                  Auto-randomized between 0 and 100
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Media & Video Column - Order 1 on mobile/tablet (< lg), Order 2 on desktop (lg+) */}
        <div className="order-1 space-y-4 sm:space-y-6 lg:order-2">
          {/* Upload Img */}
          <div
            ref={mediaRef}
            className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-7 dark:bg-[#111]"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 sm:mb-6">
              <div>
                <h2 className="text-base font-bold text-black sm:text-lg dark:text-white">
                  Upload Media
                </h2>
                <p className="text-[11px] text-black/50 dark:text-white/50">
                  Paste copied image (Ctrl+V) or browse files
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handlePasteFromClipboard()}
                  disabled={isUploading || images.length >= 10}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-black/5 text-black/80 transition-all hover:bg-black/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
                  title="Paste copied image (Ctrl+V)"
                  aria-label="Paste copied image"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </button>
                <span className="text-xs font-bold text-black/50 dark:text-white/50">
                  {images.length}/10
                </span>
              </div>
            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />

            {isUploading ? (
              <div className="mb-4 flex aspect-[3/4] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
                <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
                <span className="text-sm font-bold text-black/80 dark:text-white/80">
                  Uploading...
                </span>
              </div>
            ) : images.length === 0 ? (
              <>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDropzoneDragOver}
                  onDragLeave={handleDropzoneDragLeave}
                  onDrop={handleDropzoneDrop}
                  className={`group relative mb-2 flex aspect-[3/4] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 transition-all select-none ${
                    fieldErrors.images
                      ? 'border-rose-500 bg-rose-500/5 ring-2 ring-rose-500/20'
                      : isExternalDragOver
                        ? 'scale-[1.01] border-black bg-black/10 dark:border-white dark:bg-white/10'
                        : 'border-dashed border-black/20 bg-black/5 hover:border-black/40 hover:bg-black/10 dark:border-white/20 dark:bg-white/5 dark:hover:border-white/40 dark:hover:bg-white/10'
                  }`}
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110 dark:bg-black">
                    <svg
                      className="h-5 w-5 text-black dark:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-black/80 dark:text-white/80">
                    Click to upload or drag images here
                  </span>
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-black/50 dark:text-white/50">
                    <span>or copy image & press</span>
                    <kbd className="rounded border border-black/15 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-black shadow-xs dark:border-white/15 dark:bg-[#1a1a1a] dark:text-white">
                      Ctrl + V
                    </kbd>
                  </div>
                  <span className="mt-1.5 text-[11px] font-medium text-black/40 dark:text-white/40">
                    Auto-crops to 3:4 ratio • Up to 10 images
                  </span>
                </div>
                <FieldErrorMessage error={fieldErrors.images} />
              </>
            ) : (
              <>
                {/* Main Image Preview */}
                <div
                  draggable
                  onDragStart={(e) => {
                    handleDragStart(e, 0);
                  }}
                  onDragOver={handleDragOver}
                  onDrop={(e) => {
                    handleDrop(e, 0);
                  }}
                  onDragEnd={handleDragEnd}
                  className={`group relative mb-4 aspect-[3/4] w-full cursor-grab overflow-hidden rounded-2xl border border-black/5 bg-black/5 transition-all select-none active:cursor-grabbing dark:border-white/5 dark:bg-white/5 ${draggedIndex === 0 ? 'scale-95 border-black/20 opacity-50 dark:border-white/20' : ''}`}
                >
                  <Image
                    draggable={false}
                    width={500}
                    height={500}
                    src={images[0].url}
                    alt="Main product"
                    className="pointer-events-none h-full w-full object-cover select-none"
                  />
                  <div className="pointer-events-none absolute top-3 left-3 rounded-lg border border-black/5 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-black/90">
                    <span className="text-xs font-bold text-black dark:text-white">Main Image</span>
                  </div>
                  <button
                    onClick={() => {
                      removeImage(images[0].id);
                    }}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-black/5 bg-white text-red-500 opacity-0 shadow-sm transition-transform group-hover:opacity-100 hover:scale-110 dark:border-white/5 dark:bg-black"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  {originalFiles[images[0].id] && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingImageId(images[0].id);
                      }}
                      className="absolute top-12 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-black/5 bg-white text-black opacity-0 shadow-sm transition-transform group-hover:opacity-100 hover:scale-110 dark:border-white/5 dark:bg-black dark:text-white"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M14.304 4.844l5.852 5.852M7 7H4a1 1 0 00-1 1v10a1 1 0 001 1h11a1 1 0 001-1v-4.5m2.409-9.91a2.017 2.017 0 010 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 012.852 0zM12.5 7.5L17 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Grid Previews */}
                <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
                  {images.slice(1).map((img, index) => {
                    const actualIndex = index + 1; // 1-based index in the array for the dropdown (0 is main)
                    return (
                      <div
                        key={img.id}
                        draggable
                        onDragStart={(e) => {
                          handleDragStart(e, actualIndex);
                        }}
                        onDragOver={handleDragOver}
                        onDrop={(e) => {
                          handleDrop(e, actualIndex);
                        }}
                        onDragEnd={handleDragEnd}
                        className={`group relative aspect-[3/4] cursor-grab overflow-hidden rounded-xl border border-black/5 bg-black/5 transition-all select-none active:cursor-grabbing dark:border-white/5 dark:bg-white/5 ${draggedIndex === actualIndex ? 'scale-95 border-black/20 opacity-50 dark:border-white/20' : ''}`}
                      >
                        <Image
                          draggable={false}
                          width={500}
                          height={500}
                          src={img.url}
                          alt={`Preview ${actualIndex}`}
                          className="pointer-events-none h-full w-full object-cover select-none"
                        />

                        {/* Position Number Overlay */}
                        <div className="pointer-events-auto absolute top-1.5 left-1.5 flex items-center overflow-hidden rounded-md bg-black/60 shadow-sm backdrop-blur-md">
                          <select
                            value={actualIndex}
                            onChange={(e) => {
                              handleReorder(actualIndex, parseInt(e.target.value));
                            }}
                            className="cursor-pointer appearance-none bg-transparent px-1.5 py-0.5 text-center text-[10px] font-bold text-white outline-none"
                            style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                          >
                            {images.map((_, i) => (
                              <option
                                key={i}
                                value={i}
                                className="bg-white text-black dark:bg-[#1a1a1a] dark:text-white"
                              >
                                {i === 0 ? 'Main' : i + 1}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => {
                            removeImage(img.id);
                          }}
                          className="absolute top-1.5 right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-black/5 bg-white text-red-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:border-white/5 dark:bg-black"
                        >
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>

                        {/* Crop button */}
                        {originalFiles[img.id] && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setEditingImageId(img.id);
                            }}
                            className="absolute top-8 right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-black/5 bg-white text-black opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:scale-110 dark:border-white/5 dark:bg-black dark:text-white"
                          >
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M14.304 4.844l5.852 5.852M7 7H4a1 1 0 00-1 1v10a1 1 0 001 1h11a1 1 0 001-1v-4.5m2.409-9.91a2.017 2.017 0 010 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 012.852 0zM12.5 7.5L17 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {images.length < 10 && (
                    <div
                      onClick={() => !isUploading && fileInputRef.current?.click()}
                      onDragOver={handleDropzoneDragOver}
                      onDragLeave={handleDropzoneDragLeave}
                      onDrop={handleDropzoneDrop}
                      className={`group flex aspect-[3/4] flex-col items-center justify-center rounded-xl border border-dashed transition-all select-none ${
                        isUploading
                          ? 'cursor-not-allowed bg-black/5 opacity-50 dark:bg-white/5'
                          : isExternalDragOver
                            ? 'cursor-pointer border-black bg-black/10 dark:border-white dark:bg-white/10'
                            : 'cursor-pointer border-black/20 hover:border-black/40 hover:bg-black/5 dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/5'
                      }`}
                    >
                      {isUploading ? (
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
                      ) : (
                        <>
                          <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-black/60 transition-transform group-hover:scale-110 dark:bg-white/10 dark:text-white/80">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </div>
                          <span className="text-[10px] font-bold text-black/60 dark:text-white/60">
                            Add Image
                          </span>
                          <span className="text-[8px] font-medium text-black/40 dark:text-white/40">
                            or Ctrl+V
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="border-t border-black/5 pt-4 dark:border-white/5">
              <LabelWithTick
                label="Embed Video (Optional)"
                status={!videoLink.trim() ? 'default' : videoId ? 'valid' : 'error'}
                subtitle="Paste a YouTube Shorts or Video URL (optional)"
              />

              {/* Embed Preview */}
              {videoId && (
                <div className="group relative mb-4 aspect-[3/4] w-full overflow-hidden rounded-xl border border-black/5 bg-black/5 shadow-sm dark:border-white/5 dark:bg-white/5">
                  {!isPlaying ? (
                    <div
                      className="relative h-full w-full cursor-pointer"
                      onClick={() => {
                        setIsPlaying(true);
                      }}
                    >
                      <Image
                        width={500}
                        height={500}
                        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                        alt="Video Thumbnail"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                          <svg
                            className="ml-1 h-8 w-8 text-black"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      className="absolute top-1/2 left-0 aspect-[9/16] w-full -translate-y-1/2"
                      src={embedUrl ?? ''}
                      title="YouTube Shorts player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              )}

              <div className="relative flex w-full items-center">
                <div className="absolute left-3">
                  <svg
                    className="h-4 w-4 text-black/40 dark:text-white/40"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.86-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={videoLink}
                  onChange={(e) => {
                    setVideoLink(e.target.value);
                    setIsPlaying(false);
                  }}
                  placeholder="Paste YouTube URL (optional)"
                  className="w-full rounded-xl border border-transparent bg-black/5 py-3 pr-4 pl-9 text-sm font-medium text-black transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
                />
              </div>
            </div>
          </div>

          {/* Product Collections */}
          <div className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-7 dark:bg-[#111]">
            <h2 className="mb-3 text-base font-bold text-black sm:mb-4 sm:text-lg dark:text-white">
              Product Collections
            </h2>

            {/* Multi-select Collection Chips (No tick icon) */}
            {availableCollections && availableCollections.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableCollections.map((colName) => {
                  const isSelected = tags.includes(colName);
                  return (
                    <button
                      key={colName}
                      type="button"
                      onClick={() => {
                        toggleCollection?.(colName);
                      }}
                      className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-black text-white shadow-md dark:bg-white dark:text-black'
                          : 'bg-black/5 text-black/70 hover:bg-black/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10'
                      }`}
                    >
                      <span>{colName}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs font-medium text-black/40 dark:text-white/40">
                No collections available.
              </p>
            )}
            <p className="mt-3 text-[10px] font-medium text-black/40 dark:text-white/40">
              Click collections above to select multiple
            </p>
          </div>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => {
            setToast(null);
          }}
        />
      )}
      {editingImageId && originalFiles[editingImageId] && (
        <ImageCropModal
          file={originalFiles[editingImageId]}
          onCropComplete={(croppedBlob) => {
            handleReCrop(editingImageId, croppedBlob, originalFiles[editingImageId].name);
            setEditingImageId(null);
          }}
          onCancel={() => {
            setEditingImageId(null);
          }}
        />
      )}
      <AddColorModal
        isOpen={isAddColorModalOpen}
        onClose={closeAddColorModal}
        onSave={handleCreateAndSelectColor}
        defaultName={newColorDefaultName}
        defaultHex={newColorDefaultHex}
        isSaving={isSavingNewColor}
      />
    </div>
  );
}
