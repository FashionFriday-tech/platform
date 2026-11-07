'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { TrashIcon } from '@ff/ui';
import { toast } from 'sonner';

import {
  deleteProduct as deleteProductApi,
  fetchProductById,
  updateProductStatus,
  updateProductStock,
} from '../services/api';
import { type Product } from '../types';
import { DeleteProductModal } from './DeleteProductModal';
import { ProductCustomerInteractions } from './ProductCustomerInteractions';
import { ProductPerformance } from './ProductPerformance';
import { ProductReviews } from './ProductReviews';

interface Props {
  productId: string;
}

function parseDescription(desc?: string): {
  specs: { label: string; value: string }[];
  narrative: string;
} {
  if (!desc) {
    return {
      specs: [],
      narrative:
        'Premium quality product crafted with precision and authentic luxury styling. Fits comfortably into your modern wardrobe.',
    };
  }

  // Look for patterns like BRAND : ... MODEL : ... TYPE : ... or KEY : VALUE
  const parts = desc.split(/(?=[A-Za-z0-9_\s]{2,15}\s*:\s*)/i);
  const specs: { label: string; value: string }[] = [];
  const narrativeParts: string[] = [];

  for (const part of parts) {
    const match = part.match(/^\s*([A-Za-z0-9_\s]{2,15})\s*:\s*([\s\S]+)$/);
    if (match) {
      const label = match[1].trim();
      const value = match[2].trim();
      if (label && value) {
        specs.push({ label, value });
      }
    } else if (part.trim()) {
      narrativeParts.push(part.trim());
    }
  }

  return {
    specs,
    narrative: narrativeParts.join(' ').trim(),
  };
}

export function ProductDetailView({ productId }: Props) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!product) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteProductApi(product.id);
      toast.success('Product deleted successfully');
      router.push('/products');
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      toast.error(err?.message || 'Failed to delete product');
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!product || product.status === 'Draft' || isUpdatingStatus) {
      return;
    }
    const previousStatus = product.status;
    const newStatus: 'Active' | 'Inactive' = previousStatus === 'Active' ? 'Inactive' : 'Active';

    // Optimistic update
    setProduct({ ...product, status: newStatus });
    setIsUpdatingStatus(true);

    try {
      await updateProductStatus(product.id, newStatus);
      toast.success(`Product status marked as ${newStatus}`);
    } catch (err: any) {
      console.error('Failed to update product status:', err);
      setProduct({ ...product, status: previousStatus });
      toast.error(err?.message || 'Failed to update product status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleToggleSoldOut = async () => {
    if (!product || isUpdatingStock) {
      return;
    }
    const isCurrentlySoldOut = product.stock <= 0;
    const nextStock = isCurrentlySoldOut ? 100 : 0;
    const prevStock = product.stock;

    // Optimistic update
    setProduct({ ...product, stock: nextStock });
    setIsUpdatingStock(true);

    try {
      await updateProductStock(product.id, nextStock);
      toast.success(
        nextStock === 0
          ? 'Product marked as Sold Out (Stock set to 0)'
          : 'Product restocked to 100 units',
      );
    } catch (err: any) {
      console.error('Failed to update product stock:', err);
      setProduct({ ...product, stock: prevStock });
      toast.error(err?.message || 'Failed to update product stock');
    } finally {
      setIsUpdatingStock(false);
    }
  };

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchProductById(productId);
        if (data) {
          setProduct(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [productId]);

  const parsedDescription = useMemo(
    () => parseDescription(product?.description),
    [product?.description],
  );

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-black dark:border-white/10 dark:border-t-white" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center rounded-3xl border border-black/5 bg-white/50 p-8 shadow-xl backdrop-blur-xl dark:border-white/5 dark:bg-black/50">
        <h2 className="mb-2 text-2xl font-black text-black dark:text-white">Product Not Found</h2>
        <p className="mb-6 text-sm font-medium text-black/50 dark:text-white/50">
          The product you are looking for does not exist or has been removed.
        </p>
        <button
          onClick={() => {
            router.push('/products');
          }}
          className="cursor-pointer rounded-full bg-black px-6 py-2.5 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105 dark:bg-white dark:text-black"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  const displayImages = product.images?.length
    ? product.images
    : product.imageUrl
      ? [product.imageUrl]
      : [];

  const liveSold = Math.max(0, Number(product.liveSold ?? product.liveMatrix?.liveSold ?? 0));
  const liveWatching = Math.max(
    0,
    Number(product.liveWatching ?? product.liveMatrix?.liveWatching ?? 0),
  );

  const sellingPrice = Number(product.sellingPrice || 0);
  const originalPrice = Number(product.originalPrice || 0);
  const discountPercent =
    originalPrice > sellingPrice && originalPrice > 0
      ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
      : 0;

  return (
    <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto pb-20 text-black transition-colors dark:text-white">
      {/* Top Header: Breadcrumb & Primary Action Bar */}
      <div className="mb-6 flex flex-col gap-4 border-b border-black/5 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
        {/* Left: Back & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-xs font-bold text-black shadow-sm transition-all hover:bg-black hover:text-white dark:border-white/10 dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Inventory</span>
          </button>
          <div className="hidden items-center gap-2 text-xs font-medium text-black/40 sm:flex dark:text-white/40">
            <span>/</span>
            <span className="capitalize">{product.category || 'Products'}</span>
            {product.brand && (
              <>
                <span>/</span>
                <span className="font-semibold text-black/70 dark:text-white/70">
                  {product.brand}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Actions Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Toggle Badge */}
          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={product.status === 'Draft' || isUpdatingStatus}
            className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
              product.status === 'Active'
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400'
                : product.status === 'Draft'
                  ? 'cursor-not-allowed border-yellow-500/20 bg-yellow-500/10 text-yellow-700 opacity-60 dark:text-yellow-500'
                  : 'border-zinc-300 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
            }`}
            title={
              product.status === 'Draft'
                ? 'Cannot activate draft products directly'
                : `Click to switch to ${product.status === 'Active' ? 'Inactive' : 'Active'}`
            }
          >
            <span
              className={`h-2 w-2 rounded-full ${
                product.status === 'Active'
                  ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]'
                  : product.status === 'Draft'
                    ? 'bg-yellow-500'
                    : 'bg-zinc-400'
              }`}
            />
            <span>{product.status}</span>
          </button>

          {/* Sold Out Toggle Button */}
          <button
            type="button"
            onClick={handleToggleSoldOut}
            disabled={isUpdatingStock}
            className={`flex cursor-pointer items-center space-x-2 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all ${
              product.stock <= 0
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:border-rose-500/40 dark:bg-rose-500/20 dark:text-rose-400'
                : 'border-black/10 bg-white text-black hover:bg-black/5 dark:border-white/10 dark:bg-black dark:text-white dark:hover:bg-white/10'
            }`}
            title={
              product.stock <= 0
                ? 'Currently Sold Out. Click to restock to 100.'
                : 'Click to mark this product as Sold Out'
            }
          >
            <span
              className={`h-2 w-2 rounded-full ${
                product.stock <= 0 ? 'animate-pulse bg-rose-500' : 'bg-emerald-500'
              }`}
            />
            <span>{product.stock <= 0 ? 'Restock (100)' : 'Mark Sold Out'}</span>
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => {
              router.push(`/products/${productId}/edit`);
            }}
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-black px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 dark:bg-white dark:text-black"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <span>Edit</span>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => {
              setIsDeleteModalOpen(true);
            }}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/5 px-3.5 py-1.5 text-xs font-bold text-rose-600 transition-all hover:bg-rose-500/10 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400"
          >
            <TrashIcon className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Showcase Layout */}
      <div className="mb-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
        {/* Left Column: Gallery (Sticky, 5 cols) */}
        <div className="lg:sticky lg:top-6 lg:col-span-5">
          <div className="space-y-3">
            {/* Main Image Frame */}
            <div className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-black/5 bg-black/[0.03] dark:border-white/5 dark:bg-white/[0.03]">
              {displayImages.length > 0 ? (
                <Image
                  width={600}
                  height={600}
                  src={displayImages[activeImageIndex]}
                  alt={product.name}
                  priority
                  className="h-full w-full object-contain p-4 transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center text-black/30 dark:text-white/30">
                  <svg
                    className="mb-3 h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xs font-bold">No Image</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip (Below image, unobtrusive) */}
            {displayImages.length > 1 && (
              <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto py-1">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveImageIndex(idx);
                    }}
                    className={`relative h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border bg-black/[0.02] p-1 transition-all dark:bg-white/[0.02] ${
                      activeImageIndex === idx
                        ? 'border-black ring-2 ring-black/20 dark:border-white dark:ring-white/20'
                        : 'border-black/10 opacity-70 hover:opacity-100 dark:border-white/10'
                    }`}
                  >
                    <Image
                      width={100}
                      height={100}
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Info & Details (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Eyebrow: Brand, Quality, Monospace ID */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {product.brand && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/5 px-3 py-1 font-bold tracking-wider text-black uppercase dark:border-white/10 dark:bg-white/10 dark:text-white">
                {product.brand}
              </span>
            )}
            {product.quality && (
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 font-bold text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-400">
                <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {product.quality}
              </span>
            )}

            {/* Single Unified Product ID Pill */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 font-mono text-xs font-semibold text-black/70 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/70">
              <span className="text-[10px] font-bold text-black/40 uppercase dark:text-white/40">
                ID
              </span>
              <span>{product.id}</span>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(product.id);
                  toast.success('Product ID copied');
                }}
                className="cursor-pointer text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
                title="Copy ID"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Product Title */}
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>
          </div>

          {/* Description & Structured Specifications */}
          {parsedDescription.specs.length > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {parsedDescription.specs.map((s, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-black/5 bg-black/[0.02] p-2.5 dark:border-white/5 dark:bg-white/[0.02]"
                  >
                    <div className="text-[10px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                      {s.label}
                    </div>
                    <div className="mt-0.5 truncate text-xs font-bold text-black dark:text-white">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
              {parsedDescription.narrative && (
                <p className="text-xs leading-relaxed text-black/70 dark:text-white/70">
                  {parsedDescription.narrative}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
              {parsedDescription.narrative}
            </p>
          )}

          {/* Price & Availability Bento Card */}
          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/[0.02]">
            {/* Price section */}
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                  Selling Price
                </span>
                <div className="mt-0.5 flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-black tracking-tight text-black dark:text-white">
                    ₹{sellingPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  {originalPrice > sellingPrice && (
                    <span className="text-base font-medium text-black/40 line-through dark:text-white/40">
                      ₹{originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
              </div>

              {discountPercent > 0 && (
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-extrabold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="my-4 h-px w-full bg-black/5 dark:bg-white/5" />

            {/* Live Stats Bento */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {/* Stock status */}
              <button
                type="button"
                onClick={handleToggleSoldOut}
                disabled={isUpdatingStock}
                className="group flex cursor-pointer items-center gap-2.5 rounded-xl border border-black/5 bg-white p-3 text-left shadow-sm transition-all hover:border-black/20 hover:shadow-md dark:border-white/5 dark:bg-black/60 dark:hover:border-white/20"
                title={
                  product.stock <= 0
                    ? 'Currently Sold Out. Click to restock to 100.'
                    : 'Click to mark this product as Sold Out'
                }
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    product.stock <= 0
                      ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                      : product.stock <= 20
                        ? 'bg-amber-500'
                        : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-black/40 uppercase dark:text-white/40">
                    <span>Stock</span>
                    <span className="text-[9px] font-semibold text-black/40 group-hover:text-black/80 dark:text-white/40 dark:group-hover:text-white/80">
                      {product.stock <= 0 ? 'Restock' : 'Set Sold Out'}
                    </span>
                  </div>
                  <div className="truncate text-xs font-bold text-black dark:text-white">
                    {product.stock <= 0 ? 'Sold Out' : `${Math.min(100, product.stock)} in stock`}
                  </div>
                </div>
              </button>

              {/* Total Orders Sold */}
              <div className="flex items-center gap-2.5 rounded-xl border border-black/5 bg-white p-3 shadow-sm dark:border-white/5 dark:bg-black/60">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/5 text-black/70 dark:bg-white/10 dark:text-white/70">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-black/40 uppercase dark:text-white/40">
                    Total Sold
                  </div>
                  <div className="truncate text-xs font-bold text-black dark:text-white">
                    {liveSold} units
                  </div>
                </div>
              </div>

              {/* Live Traffic */}
              <div className="flex items-center gap-2.5 rounded-xl border border-black/5 bg-white p-3 shadow-sm dark:border-white/5 dark:bg-black/60">
                <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-black/40 uppercase dark:text-white/40">
                    Live Traffic
                  </div>
                  <div className="truncate text-xs font-bold text-black dark:text-white">
                    {liveWatching > 0 ? `${liveWatching} browsing` : 'Active'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Variants / Sizes */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
                  Available Sizes ({product.variants.length})
                </span>
                {selectedSize && (
                  <span className="text-xs font-semibold text-black/40 dark:text-white/40">
                    Selected: <strong className="text-black dark:text-white">{selectedSize}</strong>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedSize === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => {
                        setSelectedSize(isSelected ? null : v);
                      }}
                      className={`cursor-pointer rounded-xl border px-4 py-2 text-xs font-bold transition-all ${
                        isSelected
                          ? 'border-black bg-black text-white shadow-md dark:border-white dark:bg-white dark:text-black'
                          : 'border-black/10 bg-white text-black/80 hover:border-black/30 hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:border-white/30 dark:hover:bg-white/10'
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metrics & SEO Section */}
      <div className="mb-16 grid grid-cols-1 items-stretch gap-8 xl:grid-cols-12">
        {/* Left: SEO Details Bento */}
        <div className="group flex flex-col justify-between rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-all sm:p-7 xl:col-span-5 dark:border-white/5 dark:bg-black/60">
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xs font-black tracking-widest text-black/60 uppercase dark:text-white/60">
                Search Engine Visibility
              </h3>
              <div className="rounded-full bg-emerald-500/10 p-1.5 text-emerald-600 dark:text-emerald-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-black/5 bg-black/[0.02] p-5 dark:border-white/5 dark:bg-white/[0.02]">
              <div className="mb-1.5 text-xs font-medium break-all text-black/50 dark:text-white/50">
                fashionfriday.in &rsaquo; product &rsaquo; {product.seoSlug ?? 'item'}
              </div>
              <div className="mb-1.5 text-lg font-bold text-blue-600 dark:text-blue-400">
                {product.seoTitle ?? product.name}
              </div>
              <div className="text-xs leading-relaxed text-black/70 dark:text-white/70">
                {product.seoDesc ??
                  product.description ??
                  'View this product on Fashion Friday. Discover the best styles and premium quality items.'}
              </div>
            </div>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div>
              <span className="mb-2.5 block text-[10px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                Indexed Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-black/5 bg-black/5 px-2.5 py-1 text-xs font-semibold text-black/70 dark:border-white/5 dark:bg-white/5 dark:text-white/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Performance Matrix */}
        <div className="w-full xl:col-span-7">
          <ProductPerformance product={product} />
        </div>
      </div>

      {/* Customer Engagement & Interactions (Wishlist, Cart, Notify Me, Views) */}
      <div className="mb-16">
        <ProductCustomerInteractions productId={product.id} productName={product.name} />
      </div>

      {/* Reviews Section */}
      <ProductReviews
        productId={product.id}
        productCategory={product.category ?? 'uncategorized'}
        productName={product.name}
      />

      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
        onConfirm={handleDeleteConfirm}
        productName={product.name}
        isDeleting={isDeleting}
      />
    </div>
  );
}
