"use client";

import { useState } from "react";
import {
  BellIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
  ShieldCheckIcon,
  TruckIcon,
  RefreshCcwIcon,
  EyeIcon,
  ShoppingCartIcon,
  StarBadgeIcon,
  FilledStarIcon,
} from "@ff/ui";
import { useLiveProductMetric } from "@/features/product/hooks/useLiveProductMetric";

import Gallery from "./components/gallery";
import { Product } from "@ff/types";
import Link from "next/link";
import ReviewSection from "./components/ReviewSection";
import RelatedProducts from "./components/RelatedProducts";
import ProductVariantPage from "./components/VariantDropdown";

export default function ProductPageMaster({
  product,
  similarProducts,
}: {
  product: Product;
  similarProducts: Product[];
}) {
  // 1. Map the first variant as the active data source to maintain your design
  // const activeVariant = product.variants[0];
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(true);

  // Use sizes from the variant if they exist, otherwise fallback to your hardcoded list
  const displaySizes = product.attributes.sizes;

  const cols = Math.ceil(
    displaySizes.length < 6 ? displaySizes.length : displaySizes.length / 2
  );

  const [showWatchingPopup, setShowWatchingPopup] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out the ${product.name} ${product.attributes.quality} Quality on Fashion Friday! \n\n`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed", err);
      }
    }
  };

  const liveMetric = useLiveProductMetric(product.liveMatrix.liveWatching);

  return (
    <div className="bg-background text-foreground min-h-screen pb-10 transition-colors">
      {/* --- MAIN PRODUCT GRID --- */}
      <section className="px-4 md:px-8 pt-2 lg:pt-26">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          {/* LEFT: Gallery */}
          <div className="lg:col-span-6">
            <Gallery
              images={[
                product.media.mainImage,
                ...product.media.liveImages,
              ].filter(Boolean)}
              videoUrl={product.media.youtubeId}
            />
          </div>

          {/* RIGHT: Info & Purchase */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-6">
            <div>
              {/* 1. Brand & Actions */}
              <div className="flex flex-col justify-between items-start">
                <div className="flex justify-between items-center w-full">
                  <div className="flex justify-center items-center gap-4 text-[10px] font-black uppercase text-foreground-muted mb-2">
                    <Link
                      href={`/brands/${String(product.brand).toLowerCase()}`}
                    >
                      <img
                        src="/images/brand-logos/nike.png"
                        alt={product.brand[0]}
                        className="w-10 invert"
                      />
                    </Link>

                    <Link href="/help/quality-guide">
                      <span className="flex justify-center items-center gap-1">
                        <StarBadgeIcon className="inline-block text-blue-500 mb-0.5" />
                        {product.attributes.quality}
                      </span>
                    </Link>

                    <Link href={`/product/${product.slug}#review-section`}>
                      <span className="flex justify-center items-center gap-1">
                        <FilledStarIcon
                          size={11}
                          className="text-yellow-400 mb-0.5"
                        />
                        {product.rating.averageRating}
                      </span>
                    </Link>

                    <span
                      onClick={() => setShowWatchingPopup(true)}
                      className="flex justify-center items-center gap-1"
                    >
                      <EyeIcon size={11} className="text-red-500 mb-0.5" />
                      {liveMetric}+
                    </span>
                  </div>
                </div>
                <div className="w-full flex justify-between items-start">
                  <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter leading-8 italic">
                    {product.name}
                  </h1>
                  <button
                    onClick={handleShare}
                    className="p-2 md:mt-2 mr-4 rounded-full border border-border hover:bg-background-muted transition-all"
                  >
                    <ShareIcon size={18} />
                  </button>
                </div>
              </div>

              {/* 3. Description */}
              <p className="mt-2 text-xs capitalize text-foreground/80 leading-4 tracking-wider italic">
                {product.description}
              </p>
            </div>

            {/* 2. Pricing & Rating */}
            <div className="flex items-center justify-between border-border">
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-green-500">
                  ₹{product.price.sellingPrice.toLocaleString()}{" "}
                  {/* Data from Variant */}
                </span>
                {product.price.ogPrice > product.price.sellingPrice && (
                  <span className="text-lg line-through text-foreground-muted">
                    ₹{product.price.ogPrice.toLocaleString()}{" "}
                    {/* Data from Variant */}
                  </span>
                )}
              </div>
              <p className="relative flex justify-center items-center text-[10px] text-foreground-muted border rounded-full pr-2 text-end overflow-hidden gap-2">
                <span className="bg-foreground h-full rounded-full px-1.5">
                  <ShoppingCartIcon
                    size={12}
                    className="inline-block scale-x-[-1] text-background"
                  />
                  <span className="text-background font-semibold">
                    {product.liveMatrix.liveSold}+
                  </span>
                </span>
                <span> sold in last 24h</span>
              </p>
            </div>

            <ProductVariantPage />

            {/* 4. Size Selection */}
            {product.category === "Sneakers" && (
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black uppercase tracking-widest">
                    Select Size (EU)
                  </label>
                  <Link
                    href="/help/size-guide"
                    className="text-[9px] font-black uppercase underline text-foreground-subtle"
                  >
                    Size Guide
                  </Link>
                </div>
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  }}
                >
                  {displaySizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-1 rounded-full border font-semibold transition-all duration-300 ${
                        selectedSize === size
                          ? "border-brand bg-brand text-brand-foreground scale-95"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 5. CTA Buttons */}
            <section className="flex flex-col lg:flex-row items-stretch gap-4">
              <div className="w-full lg:flex-1">
                {product.inventory.totalStock > 0 ? ( // Data from Variant
                  <div className="w-full bg-foreground py-3.5 flex justify-center items-center text-2xl font-black uppercase rounded-full cursor-pointer">
                    <span className="light:bg-[linear-gradient(90deg,#ffffff,#9ca3af,#ffffff,#656565,#ffffff)] bg-size-[400%_100%] dark:bg-[linear-gradient(90deg,#000000,#9ca3af,#000000,#9ca3af,#000000)] bg-clip-text text-transparent animate-[glaze_5s_linear_infinite]">
                      Buy Now
                    </span>
                  </div>
                ) : (
                  <button className="w-full h-16 border-2 border-destructive text-destructive font-black uppercase tracking-[0.2em] rounded-full flex items-center justify-center gap-3">
                    <BellIcon size={20} />
                    Notify Me
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1 bg-foreground text-background rounded-full p-1 shadow-2xl lg:flex-1">
                {/* Wishlist */}
                <button
                  onClick={() => setIsWishlisted((prev) => !prev)}
                  aria-label="Toggle wishlist"
                  className={`h-14 w-14 shrink-0 flex items-center justify-center
                rounded-full transition-all duration-300 ${
                  isWishlisted
                    ? "bg-background text-foreground scale-100"
                    : "text-background hover:bg-background/10 animate-pulse scale-125"
                }`}
                >
                  {isWishlisted ? (
                    <HeartIcon size={20} fill="currentColor" />
                  ) : (
                    <HeartIcon size={20} />
                  )}
                </button>

                {/* Add to Cart */}
                <button
                  className={`py-4 h-14 flex-1 rounded-full font-bold uppercase flex items-center justify-center gap-3 transition-all border-2 border-background bg-background text-foreground hover:scale-[1.02] active:scale-95`}
                >
                  Add to Cart
                </button>
              </div>
            </section>

            {/* 6. Trust Cards */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              {[
                {
                  icon: <TruckIcon size={18} />,
                  label: "Fast Delivery",
                  sub: "2-4 Business Days",
                },
                {
                  icon: <RefreshCcwIcon size={18} />,
                  label: "7 Day Returns",
                  sub: "Hassle-free policy",
                },
                {
                  icon: <ShieldCheckIcon size={18} />,
                  label: "Authentic Quality",
                  sub: `${product.attributes.quality} Grade`, // Data from Variant
                },
                {
                  icon: <StarIcon size={18} />,
                  label: "Top Rated",
                  sub: "Trusted by 5k+ users",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-4 rounded-full bg-background border border-border flex items-center gap-3"
                >
                  <div className="text-brand shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="text-[9px] font-black uppercase leading-tight">
                      {item.label}
                    </h4>
                    <p className="text-[8px] text-foreground-subtle font-bold">
                      {item.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {showWatchingPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-2xl transition-all p-6">
          <div className="relative w-full max-w-[360px]">
            <div className="flex flex-col justify-center items-center text-center bg-black text-white rounded-[40px] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5">
              {/* Simple Status Badge */}
              <div className="flex items-center gap-2 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                  Live
                </span>
              </div>

              {/* Massive Number with Arrows */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <h2 className="text-6xl font-black tracking-tighter leading-none italic">
                  {liveMetric}
                </h2>
                <div className="flex flex-col text-red-500 animate-bounce transition-all duration-1000">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-20"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>

              {/* Simplified Copy */}
              <div className="space-y-2 mb-10">
                {/* <p className="text-lg font-bold tracking-tight text-white">
                  Demand is rising.
                </p> */}
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {liveMetric}+ peoples are watching the <span className="text-foreground font-semibold">"{product.name.toUpperCase()}"</span> right
                  now.
                  <span className="underline">Secure yours before the item sold out.</span>
                </p>
              </div>

              {/* Clean Action Button */}
              <button
                onClick={() => setShowWatchingPopup(false)}
                className="w-full rounded-full bg-white py-4 text-black text-sm font-black uppercase tracking-wide hover:bg-zinc-200 transition-colors active:scale-95"
              >
                View the drop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- REVIEWS HIGHLIGHT --- */}
      <ReviewSection />
      <RelatedProducts products={similarProducts} />
    </div>
  );
}
