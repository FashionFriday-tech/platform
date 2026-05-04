'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../types';
import { fetchProductById } from '../services/api';
import { ProductReviews } from './ProductReviews';
import { ProductPerformance } from './ProductPerformance';

interface Props {
  productId: string;
}

export function ProductDetailView({ productId }: Props) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchProductById(productId);
        if (data) setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex flex-1 justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-black dark:border-white/10 dark:border-t-white"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center rounded-3xl border border-black/5 bg-white/50 shadow-xl backdrop-blur-xl dark:border-white/5 dark:bg-black/50">
        <h2 className="mb-2 text-3xl font-black text-black dark:text-white">Product Not Found</h2>
        <p className="mb-8 font-medium text-black/50 dark:text-white/50">
          The product you are looking for does not exist or has been removed.
        </p>
        <button
          onClick={() => router.push('/products')}
          className="rounded-full bg-black px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105 dark:bg-white dark:text-black"
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

  // Mock Data for specific UI sections
  const liveSold = 142;
  const averageRating = 4.8;

  return (
    <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto pb-20 text-black transition-colors dark:text-white">
      {/* Top Bar Navigation */}
      <div className="mb-6 flex items-center justify-between pt-2">
        <button
          onClick={() => router.push('/products')}
          className="flex items-center space-x-2 text-sm font-bold text-black/50 transition-colors hover:text-black dark:text-white/50 dark:hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back to Products</span>
        </button>

        <button
          onClick={() => router.push(`/products/${productId}/edit`)}
          className="flex items-center space-x-2 rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105 dark:bg-white dark:text-black"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          <span>Edit Product</span>
        </button>
      </div>

      {/* Main Product Layout */}
      <div className="mb-16 grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        {/* Left Column: Gallery (Smaller - 5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-black/5 shadow-md dark:bg-white/5">
            {displayImages.length > 0 ? (
              <img
                src={displayImages[activeImageIndex]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-black/30 dark:text-white/30">
                <svg
                  className="mb-4 h-16 w-16"
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
                <span className="text-sm font-bold">No Image</span>
              </div>
            )}
          </div>

          {displayImages.length > 1 && (
            <div className="scrollbar-hide flex items-center gap-3 overflow-x-auto py-1">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl transition-all ${activeImageIndex === idx ? 'scale-[1.02] shadow-sm ring-2 ring-black dark:ring-white' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info & Details (Larger - 7 cols) */}
        <div className="space-y-6 lg:sticky lg:top-8 lg:col-span-7">
          {/* Badges & Meta */}
          <div className="flex items-center gap-4 text-[10px] font-black tracking-wider text-black/50 uppercase dark:text-white/50">
            {product.brand && (
              <span className="flex items-center gap-1.5 rounded-md bg-black/5 px-2.5 py-1 text-black dark:bg-white/5 dark:text-white">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-black text-[8px] text-white dark:bg-white dark:text-black">
                  {product.brand.charAt(0)}
                </div>
                {product.brand}
              </span>
            )}
            {product.quality && (
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {product.quality}
              </span>
            )}
            <span className="flex items-center gap-1 text-yellow-500">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {averageRating}
            </span>
            <span className="animate-pulse rounded-md bg-red-500/10 px-2 py-1 text-red-500">
              Live
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl leading-tight font-black tracking-tighter uppercase italic md:text-5xl">
            {product.name}
          </h1>

          {/* Description */}
          <p className="pr-4 text-sm leading-relaxed font-medium text-black/60 italic dark:text-white/60">
            {product.description ||
              'Premium quality product featuring stunning design and top-tier materials. Fits perfectly into your modern wardrobe.'}
          </p>

          {/* Pricing & Stock */}
          <div className="mt-2 flex items-center justify-between border-y border-black/10 py-4 dark:border-white/10">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black text-green-600 dark:text-green-400">
                ₹{product.sellingPrice.toFixed(2)}
              </span>
              {product.originalPrice > product.sellingPrice && (
                <span className="text-lg font-bold text-black/40 line-through dark:text-white/40">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-2 py-1 text-[10px] font-bold text-black/50 dark:border-white/10 dark:bg-white/5 dark:text-white/50">
              <span className="rounded-full bg-black px-1.5 py-0.5 text-white shadow-sm dark:bg-white dark:text-black">
                <svg
                  className="-mt-0.5 mr-1 inline-block h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {liveSold}+
              </span>
              <span className="pr-1 tracking-wider uppercase">Sold in last 24h</span>
            </div>
          </div>

          {/* Variants / Sizes */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <span className="text-[10px] font-black tracking-widest text-black/70 uppercase dark:text-white/70">
                  Available Sizes
                </span>
                <span className="cursor-pointer text-[9px] font-black text-black/40 uppercase underline dark:text-white/40">
                  Size Guide
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <div
                    key={v}
                    className="rounded-full border-2 border-black/10 bg-white px-4 py-2 text-sm font-bold text-black dark:border-white/10 dark:bg-black dark:text-white"
                  >
                    {v}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metrics & SEO Section */}
      <div className="mb-16 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
        {/* Left: SEO Details */}
        <div className="flex flex-col rounded-[2.5rem] border border-black/5 bg-black/5 p-8 dark:border-white/5 dark:bg-white/5">
          <h3 className="mb-6 text-sm font-black tracking-widest uppercase">
            Search Engine Visibility
          </h3>

          <div className="mb-6 flex-1 rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-black">
            <div className="mb-2 truncate text-xs font-medium text-black/60 dark:text-white/60">
              fashionfriday.in &rsaquo; product &rsaquo; {product.seoSlug || 'item'}
            </div>
            <div className="mb-2 line-clamp-1 cursor-pointer text-xl leading-tight font-medium text-blue-600 hover:underline dark:text-blue-400">
              {product.seoTitle || product.name}
            </div>
            <div className="line-clamp-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
              {product.seoDesc ||
                product.description ||
                'View this product on Fashion Friday. Discover the best styles and premium quality items.'}
            </div>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div>
              <span className="mb-2 block text-[10px] font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                Indexed Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold shadow-sm dark:bg-black"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Performance Matrix */}
        <div className="w-full">
          <ProductPerformance product={product} />
        </div>
      </div>

      {/* Reviews Section */}
      <ProductReviews productId={product.id} />
    </div>
  );
}
