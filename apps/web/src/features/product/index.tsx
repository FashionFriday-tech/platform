"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Bell,
  Heart,
  Share2,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  HeartPlus,
  Eye,
  ShoppingCart,
} from "lucide-react";
import { RiShieldStarFill } from "react-icons/ri";
import { useLiveProductMetric } from "@/features/product/hooks/useLiveProductMetric";

import Gallery from "./components/gallery";
import { Product } from "@/data/store-data";
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
  const activeVariant = product.variants[0];
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(true);

  // Use sizes from the variant if they exist, otherwise fallback to your hardcoded list
  const displaySizes = activeVariant.sizes || [
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
  ];
  const cols = Math.ceil(
    displaySizes.length < 6 ? displaySizes.length : displaySizes.length / 2
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out the ${product.name} on Fashion Friday!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed", err);
      }
    }
  };

  const liveMetric = useLiveProductMetric(product.staticNumber);

  return (
    <div className="bg-background text-foreground min-h-screen pb-10 transition-colors">
      {/* --- MAIN PRODUCT GRID --- */}
      <section className="px-4 md:px-8 pt-2 lg:pt-26">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          {/* LEFT: Gallery */}
          <div className="lg:col-span-6">
            <Gallery
              images={[product.promoImage, ...activeVariant.images].filter(Boolean)}
              videoUrl={product.videoUrl}
            />
          </div>

          {/* RIGHT: Info & Purchase */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-8">
            {/* 1. Brand & Actions */}
            <div className="flex flex-col justify-between items-start">
              <div className="flex justify-between items-center w-full">
                <div className="flex justify-center items-center gap-4 text-[10px] font-black uppercase text-foreground-muted mb-2">
                  <img
                    src="/images/brand-logos/nike.png"
                    alt={product.brand}
                    className="w-10 invert"
                  />
                  <span className="flex justify-center items-center gap-1">
                    <RiShieldStarFill className="inline-block text-blue-500 mb-0.5" />
                    {product.quality}
                  </span>
                  <span className="flex justify-center items-center gap-1">
                    <Star
                      size={11}
                      className="text-yellow-400 mb-0.5 fill-yellow-400"
                    />
                    4.5
                  </span>
                  <span className="flex justify-center items-center gap-1">
                    <Eye size={11} className="text-red-500 mb-0.5" />
                    {liveMetric}+
                  </span>
                </div>
              </div>
              <div className="w-full flex justify-between items-center">
                <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter leading-8">
                  {product.name}
                </h1>
                <button
                  onClick={handleShare}
                  className="p-2 mr-4 rounded-full border border-border hover:bg-background-muted transition-all"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* 3. Description */}
            <p className="text-sm text-foreground leading-relaxed">
              {product.description}
            </p>

            {/* 2. Pricing & Rating */}
            <div className="flex items-center justify-between border-border">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-foreground">
                  ₹{activeVariant.price.toLocaleString()}{" "}
                  {/* Data from Variant */}
                </span>
                {activeVariant.ogPrice > activeVariant.price && (
                  <span className="text-lg line-through text-foreground-muted">
                    ₹{activeVariant.ogPrice.toLocaleString()}{" "}
                    {/* Data from Variant */}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-foreground-subtle border rounded-full pl-4 pr-2 py-0.5 uppercase text-end">
                <span className="text-foreground font-semibold">45+ </span>{" "}
                purchases in the last hour{" "}
                <ShoppingCart size={12} className="inline-block" />
              </p>
            </div>

            <ProductVariantPage />

            {/* 4. Size Selection */}
            {product.category === "sneakers" && (
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
                {activeVariant.stock > 0 ? ( // Data from Variant
                  <div className="w-full bg-foreground py-3.5 flex justify-center items-center text-2xl font-black uppercase rounded-full cursor-pointer">
                    <span className="light:bg-[linear-gradient(90deg,#ffffff,#9ca3af,#ffffff,#656565,#ffffff)] bg-size-[400%_100%] dark:bg-[linear-gradient(90deg,#000000,#9ca3af,#000000,#9ca3af,#000000)] bg-clip-text text-transparent animate-[glaze_5s_linear_infinite]">
                      Buy Now
                    </span>
                  </div>
                ) : (
                  <button className="w-full h-16 border-2 border-destructive text-destructive font-black uppercase tracking-[0.2em] rounded-full flex items-center justify-center gap-3">
                    <Bell size={20} />
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
                    <Heart size={20} fill="currentColor" />
                  ) : (
                    <HeartPlus size={20} />
                  )}
                </button>

                {/* Add to Cart */}
                <button
                  className={`py-4 h-14 flex-1 rounded-full font-bold uppercase flex items-center justify-center gap-3 transition-all border-2 border-background bg-background text-foreground hover:scale-[1.02] active:scale-95`}
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>
              </div>
            </section>

            {/* 6. Trust Cards */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              {[
                {
                  icon: <Truck size={18} />,
                  label: "Fast Delivery",
                  sub: "2-4 Business Days",
                },
                {
                  icon: <RotateCcw size={18} />,
                  label: "7 Day Returns",
                  sub: "Hassle-free policy",
                },
                {
                  icon: <ShieldCheck size={18} />,
                  label: "Authentic Quality",
                  sub: `${activeVariant.quality} Grade`, // Data from Variant
                },
                {
                  icon: <Star size={18} />,
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

      {/* --- REVIEWS HIGHLIGHT --- */}
      <ReviewSection />
      <RelatedProducts products={similarProducts} />
    </div>
  );
}
