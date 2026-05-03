"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "../types";
import { fetchProductById } from "../services/api";
import { ProductReviews } from "./ProductReviews";
import { ProductPerformance } from "./ProductPerformance";

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
      <div className="flex-1 flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-black/10 dark:border-white/10 border-t-black dark:border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-3xl border border-black/5 dark:border-white/5 shadow-xl">
        <h2 className="text-3xl font-black mb-2 text-black dark:text-white">Product Not Found</h2>
        <p className="text-black/50 dark:text-white/50 mb-8 font-medium">The product you are looking for does not exist or has been removed.</p>
        <button onClick={() => router.push("/products")} className="px-8 py-4 bg-black text-white dark:bg-white dark:text-black font-bold rounded-full hover:scale-105 transition-transform shadow-lg">
          Back to Inventory
        </button>
      </div>
    );
  }

  const displayImages = product.images?.length ? product.images : (product.imageUrl ? [product.imageUrl] : []);

  // Mock Data for specific UI sections
  const liveSold = 142;
  const averageRating = 4.8;

  return (
    <div className="flex-1 flex flex-col min-h-0 pb-20 overflow-y-auto scrollbar-hide text-black dark:text-white transition-colors">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <button onClick={() => router.push("/products")} className="flex items-center space-x-2 text-sm font-bold text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          <span>Back to Products</span>
        </button>

        <button 
          onClick={() => router.push(`/products/${productId}/edit`)} 
          className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          <span>Edit Product</span>
        </button>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
        
        {/* Left Column: Gallery (Smaller - 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-black/5 dark:bg-white/5 relative shadow-md">
            {displayImages.length > 0 ? (
              <img src={displayImages[activeImageIndex]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full text-black/30 dark:text-white/30">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-sm font-bold">No Image</span>
              </div>
            )}
          </div>
          
          {displayImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-1">
              {displayImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden transition-all ${activeImageIndex === idx ? 'ring-2 ring-black dark:ring-white scale-[1.02] shadow-sm' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info & Details (Larger - 7 cols) */}
        <div className="lg:col-span-7 lg:sticky lg:top-8 space-y-6">
          
          {/* Badges & Meta */}
          <div className="flex items-center gap-4 text-[10px] font-black uppercase text-black/50 dark:text-white/50 tracking-wider">
            {product.brand && (
              <span className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-md text-black dark:text-white">
                <div className="w-4 h-4 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-[8px]">{product.brand.charAt(0)}</div>
                {product.brand}
              </span>
            )}
            {product.quality && (
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                {product.quality}
              </span>
            )}
            <span className="flex items-center gap-1 text-yellow-500">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              {averageRating}
            </span>
            <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded-md animate-pulse">Live</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-tight">
            {product.name}
          </h1>

          {/* Description */}
          <p className="text-sm font-medium text-black/60 dark:text-white/60 leading-relaxed italic pr-4">
            {product.description || "Premium quality product featuring stunning design and top-tier materials. Fits perfectly into your modern wardrobe."}
          </p>

          {/* Pricing & Stock */}
          <div className="flex items-center justify-between border-y border-black/10 dark:border-white/10 py-4 mt-2">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black text-green-600 dark:text-green-400">
                ₹{product.sellingPrice.toFixed(2)}
              </span>
              {product.originalPrice > product.sellingPrice && (
                <span className="text-lg font-bold text-black/40 dark:text-white/40 line-through">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-black/50 dark:text-white/50 border border-black/10 dark:border-white/10 rounded-full px-2 py-1 bg-black/5 dark:bg-white/5">
              <span className="bg-black text-white dark:bg-white dark:text-black rounded-full px-1.5 py-0.5 shadow-sm">
                <svg className="w-3 h-3 inline-block -mt-0.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {liveSold}+
              </span>
              <span className="pr-1 tracking-wider uppercase">Sold in last 24h</span>
            </div>
          </div>

          {/* Variants / Sizes */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-black/70 dark:text-white/70">Available Sizes</span>
                <span className="text-[9px] font-black uppercase underline text-black/40 dark:text-white/40 cursor-pointer">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <div key={v} className="px-4 py-2 border-2 border-black/10 dark:border-white/10 rounded-full text-sm font-bold bg-white dark:bg-black text-black dark:text-white">
                    {v}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Metrics & SEO Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-stretch">
        
        {/* Left: SEO Details */}
        <div className="p-8 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col">
          <h3 className="text-sm font-black uppercase tracking-widest mb-6">Search Engine Visibility</h3>
          
          <div className="bg-white dark:bg-black p-6 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 mb-6 flex-1">
            <div className="text-xs font-medium text-black/60 dark:text-white/60 truncate mb-2">
              fashionfriday.in &rsaquo; product &rsaquo; {product.seoSlug || "item"}
            </div>
            <div className="text-blue-600 dark:text-blue-400 text-xl font-medium cursor-pointer hover:underline mb-2 line-clamp-1 leading-tight">
              {product.seoTitle || product.name}
            </div>
            <div className="text-black/70 dark:text-white/70 text-sm line-clamp-3 leading-relaxed">
              {product.seoDesc || product.description || "View this product on Fashion Friday. Discover the best styles and premium quality items."}
            </div>
          </div>
          
          {product.tags && product.tags.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase text-black/50 dark:text-white/50 tracking-wider block mb-2">Indexed Tags</span>
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg bg-white dark:bg-black text-xs font-bold shadow-sm">#{tag}</span>
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
