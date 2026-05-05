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


      {/* Main Product Layout */}
      <div className="mb-20 grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
        {/* Left Column: Gallery (Sticky, 5 cols) */}
        <div className="lg:sticky lg:top-24 lg:col-span-5">
          <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] bg-black/5 dark:bg-white/5">
            {displayImages.length > 0 ? (
              <img
                src={displayImages[activeImageIndex]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-black/30 dark:text-white/30">
                <svg className="mb-4 h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-bold">No Image</span>
              </div>
            )}

            {/* Floating Thumbnails Dock */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-3xl bg-white p-3 shadow-xl backdrop-blur-xl dark:bg-black/70">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${activeImageIndex === idx ? 'scale-110 shadow-lg ring-2 ring-white dark:ring-black' : 'opacity-80 hover:scale-105 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Info & Details (Larger - 7 cols) */}
        <div className="space-y-8 lg:py-6 lg:col-span-7">
          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-black tracking-widest text-black/60 uppercase dark:text-white/60">
              {product.brand && (
                <span className="flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-1.5 shadow-sm transition-transform hover:-translate-y-0.5 dark:border-white/5 dark:bg-black">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[9px] text-white dark:bg-white dark:text-black">
                    {product.brand.charAt(0)}
                  </div>
                  {product.brand}
                </span>
              )}
              {product.quality && (
                <span className="flex items-center gap-1.5 rounded-full border border-yellow-500/10 bg-yellow-50 px-3 py-1.5 text-yellow-600 shadow-sm transition-transform hover:-translate-y-0.5 dark:bg-yellow-500/10 dark:text-yellow-500">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {product.quality}
                </span>
              )}
            </div>

            <button
              onClick={() => router.push(`/products/${productId}/edit`)}
              className="flex items-center space-x-2 rounded-full bg-black px-5 py-2 text-xs font-bold text-white shadow-lg shadow-black/20 transition-all hover:scale-105 hover:shadow-xl dark:bg-white dark:text-black dark:shadow-white/20"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Edit</span>
            </button>
          </div>

          {/* Title */}
          <div>
            <h1 className="mb-4 text-5xl leading-[1.1] font-black tracking-tighter uppercase md:text-2xl lg:text-4xl">
              {product.name}
            </h1>
            <p className="pr-4 text-base leading-relaxed font-medium text-black/60 dark:text-white/60 md:text-lg">
              {product.description || 'Premium quality product featuring stunning design and top-tier materials. Fits perfectly into your modern wardrobe.'}
            </p>
          </div>

          {/* Price & Availability Card */}
          <div className="flex flex-col gap-4 rounded-[2rem] bg-black/5 p-6 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-black/50 uppercase dark:text-white/50">Price</span>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-black dark:text-white">
                  ₹{product.sellingPrice.toFixed(2)}
                </span>
                {product.originalPrice > product.sellingPrice && (
                  <span className="text-lg font-bold text-black/40 line-through dark:text-white/40">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="h-px w-full bg-black/10 dark:bg-white/10 sm:h-12 sm:w-px"></div>

            <div className="flex flex-col items-start gap-2 sm:items-end">
              <span className="text-sm font-bold text-black/50 uppercase dark:text-white/50">Availability</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-1.5 shadow-sm dark:border-white/5 dark:bg-black">
                  <div className={`h-2.5 w-2.5 animate-pulse rounded-full ${product.stock < 100 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : product.stock < 500 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`}></div>
                  <span className="text-xs font-black uppercase text-black dark:text-white">{product.stock} in stock</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1.5 text-xs font-bold text-black/60 dark:bg-white/5 dark:text-white/60">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {liveSold} sold
                </div>
              </div>
            </div>
          </div>

          {/* Variants / Sizes */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4 pt-4">
                <span className="text-sm font-black tracking-widest text-black/80 uppercase dark:text-white/80">
                  Select Size
                </span>
              <div className="flex flex-wrap gap-3 mt-4">
                {product.variants.map((v) => (
                  <button
                    key={v}
                    className="group relative overflow-hidden rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-black shadow-sm transition-all hover:-translate-y-0.5 hover:border-black hover:shadow-md active:translate-y-0 dark:border-white/10 dark:bg-black dark:text-white dark:hover:border-white"
                  >
                    <span className="relative z-10">{v}</span>
                    <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white/5"></div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metrics & SEO Section */}
      <div className="mb-16 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
        {/* Left: SEO Details Bento */}
        <div className="group flex flex-col justify-between rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:border-white/5 dark:bg-black">
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-black tracking-widest uppercase">
                Search Engine Visibility
              </h3>
              <div className="rounded-full bg-green-500/10 p-2 text-green-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="mb-8 rounded-2xl border border-black/5 bg-black/5 p-6 transition-colors group-hover:bg-black/10 dark:border-white/5 dark:bg-white/5 dark:group-hover:bg-white/10">
              <div className="mb-2 break-all text-xs font-medium text-black/60 dark:text-white/60">
                fashionfriday.in &rsaquo; product &rsaquo; {product.seoSlug || 'item'}
              </div>
              <div className="mb-2 cursor-pointer text-xl leading-tight font-medium text-blue-600 hover:underline dark:text-blue-400">
                {product.seoTitle || product.name}
              </div>
              <div className="text-sm leading-relaxed text-black/70 dark:text-white/70">
                {product.seoDesc ||
                  product.description ||
                  'View this product on Fashion Friday. Discover the best styles and premium quality items.'}
              </div>
            </div>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div>
              <span className="mb-3 block text-[10px] font-black tracking-widest text-black/50 uppercase dark:text-white/50">
                Indexed Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-xl border border-black/5 bg-black/5 px-3 py-1.5 text-xs font-bold text-black/80 transition-colors hover:bg-black hover:text-white dark:border-white/5 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white dark:hover:text-black"
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
