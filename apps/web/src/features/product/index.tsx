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
import { Product } from "@ff/schemas";
import Link from "next/link";
import ReviewSection from "./components/ReviewSection";
import RelatedProducts from "./components/RelatedProducts";
import ProductVariantPage from "./components/VariantDropdown";
import Image from "next/image";

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
    displaySizes.length < 6 ? displaySizes.length : displaySizes.length / 2,
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
      <section className="px-4 pt-2 md:px-8 lg:pt-26">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-12">
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
          <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-6">
            <div>
              {/* 1. Brand & Actions */}
              <div className="flex flex-col items-start justify-between">
                <div className="flex w-full items-center justify-between">
                  <div className="text-foreground-muted mb-2 flex items-center justify-center gap-4 text-[10px] font-black uppercase">
                    <Link
                      href={`/brands/${String(product.brand).toLowerCase()}`}
                    >
                      <Image
                        src="/images/brand-logos/nike.png"
                        alt={product.brand[0]}
                        width={40}
                        height={40}
                        className="invert"
                      />
                    </Link>

                    <Link href="/help/quality-guide">
                      <span className="flex items-center justify-center gap-1">
                        <StarBadgeIcon className="mb-0.5 inline-block text-blue-500" />
                        {product.attributes.quality}
                      </span>
                    </Link>

                    <Link href={`/product/${product.slug}#review-section`}>
                      <span className="flex items-center justify-center gap-1">
                        <FilledStarIcon
                          size={11}
                          className="mb-0.5 text-yellow-400"
                        />
                        {product.rating.averageRating}
                      </span>
                    </Link>

                    <span
                      onClick={() => setShowWatchingPopup(true)}
                      className="flex items-center justify-center gap-1"
                    >
                      <EyeIcon size={11} className="mb-0.5 text-red-500" />
                      {liveMetric}+
                    </span>
                  </div>
                </div>
                <div className="flex w-full items-start justify-between">
                  <h1 className="text-3xl leading-8 font-bold tracking-tighter uppercase italic md:text-5xl">
                    {product.name}
                  </h1>
                  <button
                    onClick={handleShare}
                    className="border-border hover:bg-background-muted mr-4 rounded-full border p-2 transition-all md:mt-2"
                  >
                    <ShareIcon size={18} />
                  </button>
                </div>
              </div>

              {/* 3. Description */}
              <p className="text-foreground/80 mt-2 text-xs leading-4 tracking-wider capitalize italic">
                {product.description}
              </p>
            </div>

            {/* 2. Pricing & Rating */}
            <div className="border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-green-500">
                  ₹{product.price.sellingPrice.toLocaleString()}{" "}
                  {/* Data from Variant */}
                </span>
                {product.price.ogPrice > product.price.sellingPrice && (
                  <span className="text-foreground-muted text-lg line-through">
                    ₹{product.price.ogPrice.toLocaleString()}{" "}
                    {/* Data from Variant */}
                  </span>
                )}
              </div>
              <p className="text-foreground-muted relative flex items-center justify-center gap-2 overflow-hidden rounded-full border pr-2 text-end text-[10px]">
                <span className="bg-foreground h-full rounded-full px-1.5">
                  <ShoppingCartIcon
                    size={12}
                    className="text-background inline-block scale-x-[-1]"
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
                <div className="flex items-end justify-between">
                  <label className="text-[10px] font-black tracking-widest uppercase">
                    Select Size (EU)
                  </label>
                  <Link
                    href="/help/size-guide"
                    className="text-foreground-subtle text-[9px] font-black uppercase underline"
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
                      className={`rounded-full border py-1 font-semibold transition-all duration-300 ${
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
            <section className="flex flex-col items-stretch gap-4 lg:flex-row">
              <div className="w-full lg:flex-1">
                {product.inventory.totalStock > 0 ? ( // Data from Variant
                  <div className="bg-foreground flex w-full cursor-pointer items-center justify-center rounded-full py-3.5 text-2xl font-black uppercase">
                    <span className="light:bg-[linear-gradient(90deg,#ffffff,#9ca3af,#ffffff,#656565,#ffffff)] animate-[glaze_5s_linear_infinite] bg-size-[400%_100%] bg-clip-text text-transparent dark:bg-[linear-gradient(90deg,#000000,#9ca3af,#000000,#9ca3af,#000000)]">
                      Buy Now
                    </span>
                  </div>
                ) : (
                  <button className="border-destructive text-destructive flex h-16 w-full items-center justify-center gap-3 rounded-full border-2 font-black tracking-[0.2em] uppercase">
                    <BellIcon size={20} />
                    Notify Me
                  </button>
                )}
              </div>

              <div className="bg-foreground text-background flex items-center gap-1 rounded-full p-1 shadow-2xl lg:flex-1">
                {/* Wishlist */}
                <button
                  onClick={() => setIsWishlisted((prev) => !prev)}
                  aria-label="Toggle wishlist"
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    isWishlisted
                      ? "bg-background text-foreground scale-100"
                      : "text-background hover:bg-background/10 scale-125 animate-pulse"
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
                  className={`border-background bg-background text-foreground flex h-14 flex-1 items-center justify-center gap-3 rounded-full border-2 py-4 font-bold uppercase transition-all hover:scale-[1.02] active:scale-95`}
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
                  className="bg-background border-border flex items-center gap-3 rounded-full border p-4"
                >
                  <div className="text-brand shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="text-[9px] leading-tight font-black uppercase">
                      {item.label}
                    </h4>
                    <p className="text-foreground-subtle text-[8px] font-bold">
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
        <div className="bg-background/60 fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-2xl transition-all">
          <div className="relative w-full max-w-[360px]">
            <div className="flex flex-col items-center justify-center rounded-[40px] border border-white/5 bg-black p-10 text-center text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
              {/* Simple Status Badge */}
              <div className="mb-8 flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                <span className="text-[10px] font-black tracking-[0.4em] text-zinc-400 uppercase">
                  Live
                </span>
              </div>

              {/* Massive Number with Arrows */}
              <div className="mb-6 flex items-center justify-center gap-4">
                <h2 className="text-6xl leading-none font-black tracking-tighter italic">
                  {liveMetric}
                </h2>
                <div className="flex animate-bounce flex-col text-red-500 transition-all duration-1000">
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
              <div className="mb-10 space-y-2">
                {/* <p className="text-lg font-bold tracking-tight text-white">
                  Demand is rising.
                </p> */}
                <p className="text-sm leading-relaxed text-zinc-400">
                  {liveMetric}+ peoples are watching the{" "}
                  <span className="text-foreground font-semibold">
                    "{product.name.toUpperCase()}"
                  </span>{" "}
                  right now.
                  <span className="underline">
                    Secure yours before the item sold out.
                  </span>
                </p>
              </div>

              {/* Clean Action Button */}
              <button
                onClick={() => setShowWatchingPopup(false)}
                className="w-full rounded-full bg-white py-4 text-sm font-black tracking-wide text-black uppercase transition-colors hover:bg-zinc-200 active:scale-95"
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
