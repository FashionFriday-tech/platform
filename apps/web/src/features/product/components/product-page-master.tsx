'use client';

import { type JSX, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { type Product } from '@ff/schemas';
import {
  BellIcon,
  EyeIcon,
  FilledStarIcon,
  HeartFilledIcon,
  HeartIcon,
  RefreshCcwIcon,
  ShareIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  StarBadgeIcon,
  StarIcon,
  TruckIcon,
} from '@ff/ui';
import { toast } from 'sonner';

import { useCart } from '@/features/cart';
import { useWishlist } from '@/features/wishlist';

import { useLiveProductMetric } from '../hooks/use-live-product-metric';
import CTAStickyButtons from './cta-sticky-buttons';
import Gallery from './gallery';
import RelatedProducts from './related-products';
import ReviewSection from './review-section';
import ProductVariantPage from './variant-dropdown';

export default function ProductPageMaster({
  product,
  similarProducts,
}: {
  product: Product;
  similarProducts: Product[];
}): JSX.Element {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showWatchingPopup, setShowWatchingPopup] = useState(false);

  const { isItemWishlisted, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const productId = product.id;
  const isWishlisted = isItemWishlisted(productId);

  const displaySizes = product.attributes.sizes;

  const handleWishlistToggle = () => {
    void toggleWishlist({
      id: productId,
      name: product.name,
      slug: product.slug,
      price: product.price.sellingPrice,
      originalPrice: product.price.ogPrice,
      image: product.media.mainImage,
      category: Array.isArray(product.brand)
        ? product.brand[0]
        : (product.brand ?? 'Fashion Friday'),
    });
  };

  const handleAddToCart = () => {
    if (product.inventory.totalStock <= 0) {
      toast.error('This product is currently out of stock');
      return;
    }
    const chosenSize = selectedSize || (displaySizes.length > 0 ? displaySizes[0] : 'Standard');
    const chosenColor = product.attributes.colors?.[0] || 'Standard';

    void addItem({
      productId: product.id,
      size: chosenSize,
      color: chosenColor,
      quantity: 1,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        brand: Array.isArray(product.brand) ? product.brand : [product.brand || 'Fashion Friday'],
        ogPrice: product.price.ogPrice,
        sellingPrice: product.price.sellingPrice,
        mainImage: product.media.mainImage,
        totalStock: product.inventory.totalStock,
        sizes: product.attributes.sizes,
        colors: product.attributes.colors,
      },
    });
    toast.success(`Added ${product.name} (${chosenSize}) to Bag!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };
  const cols = Math.ceil(displaySizes.length < 6 ? displaySizes.length : displaySizes.length / 2);

  const handleShare = () => {
    const performShare = async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: product.name,
            text: `Check out the ${product.name} ${product.attributes.quality} Quality on Fashion Friday! \n\n`,
            url: window.location.href,
          });
        } catch {
          // Silent catch
        }
      }
    };

    void performShare();
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
              images={[product.media.mainImage, ...product.media.liveImages].filter(Boolean)}
              videoUrl={product.media.youtubeId}
            />
          </div>

          {/* RIGHT: Info & Purchase */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-6">
            <div>
              <div className="flex flex-col items-start justify-between">
                <div className="flex w-full items-center justify-between">
                  <div className="text-foreground-muted mb-2 flex items-center justify-center gap-4 text-[10px] font-black uppercase">
                    <Link href={`/brands/${String(product.brand).toLowerCase()}`}>
                      <Image
                        src="/images/brand-logos/nike.png"
                        alt={product.brand[0] ?? 'Brand Logo'}
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
                        <FilledStarIcon size={11} className="mb-0.5 text-yellow-400" />
                        {product.rating.averageRating}
                      </span>
                    </Link>

                    <span
                      onClick={() => {
                        setShowWatchingPopup(true);
                      }}
                      className="flex cursor-pointer items-center justify-center gap-1"
                    >
                      <EyeIcon size={11} className="mb-0.5 text-red-500" />
                      {liveMetric}+
                    </span>
                  </div>
                </div>
                <div className="flex w-full items-start justify-between gap-4">
                  <h1 className="text-foreground text-3xl leading-snug font-black tracking-tight uppercase md:text-4xl lg:text-5xl lg:leading-[1.2]">
                    {product.name}
                  </h1>
                  <button
                    onClick={handleShare}
                    className="border-border hover:bg-background-muted shrink-0 rounded-full border p-2.5 transition-all"
                  >
                    <ShareIcon size={18} />
                  </button>
                </div>
              </div>

              <p className="text-foreground-muted mt-3 text-xs leading-relaxed tracking-normal md:text-sm">
                {product.description}
              </p>
            </div>

            <div className="border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-green-500">
                  ₹{product.price.sellingPrice.toLocaleString()}
                </span>
                {product.price.ogPrice > product.price.sellingPrice && (
                  <span className="text-foreground-muted text-lg line-through">
                    ₹{product.price.ogPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-foreground-muted relative flex items-center justify-center gap-2 overflow-hidden rounded-full border pr-2 text-end text-[10px]">
                <span className="bg-foreground h-full rounded-full px-1.5 py-0.5">
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

            {displaySizes && displaySizes.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <label className="text-[10px] font-black tracking-widest uppercase">
                    Select Size {product.categoryId === 'SNEAKERS' ? '(EU)' : ''}
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
                      onClick={() => {
                        setSelectedSize(size);
                      }}
                      className={`rounded-full border py-1 font-semibold transition-all duration-300 ${
                        selectedSize === size
                          ? 'border-brand bg-brand text-brand-foreground scale-95'
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <section className="flex flex-col items-stretch gap-4 lg:flex-row">
              <div className="w-full lg:flex-1">
                {product.inventory.totalStock > 0 ? (
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="bg-foreground text-background flex w-full cursor-pointer items-center justify-center rounded-full py-3.5 text-2xl font-black uppercase transition-transform active:scale-95"
                  >
                    <span className="light:bg-[linear-gradient(90deg,#ffffff,#9ca3af,#ffffff,#656565,#ffffff)] animate-[glaze_5s_linear_infinite] bg-size-[400%_100%] bg-clip-text text-transparent dark:bg-[linear-gradient(90deg,#000000,#9ca3af,#000000,#9ca3af,#000000)]">
                      Buy Now
                    </span>
                  </button>
                ) : (
                  <button className="border-destructive text-destructive flex h-16 w-full items-center justify-center gap-3 rounded-full border-2 font-black tracking-[0.2em] uppercase">
                    <BellIcon size={20} />
                    Notify Me
                  </button>
                )}
              </div>

              <div className="bg-foreground text-background flex items-center gap-1 rounded-full p-1 shadow-2xl lg:flex-1">
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-all duration-300 active:scale-90 ${
                    isWishlisted
                      ? 'scale-105 bg-red-500/20 text-red-500'
                      : 'text-background hover:bg-background/10'
                  }`}
                >
                  {isWishlisted ? (
                    <HeartFilledIcon size={22} className="text-red-500" />
                  ) : (
                    <HeartIcon size={22} />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="bg-background text-foreground border-background flex h-14 flex-1 cursor-pointer items-center justify-center gap-3 rounded-full border-2 py-4 font-bold uppercase transition-all hover:scale-[1.02] active:scale-95"
                >
                  Add to Cart
                </button>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-3 pt-4">
              {[
                { icon: <TruckIcon size={18} />, label: 'Fast Delivery', sub: '2-4 Business Days' },
                {
                  icon: <RefreshCcwIcon size={18} />,
                  label: '7 Day Returns',
                  sub: 'Hassle-free policy',
                },
                {
                  icon: <ShieldCheckIcon size={18} />,
                  label: '100% Authentic',
                  sub: 'Quality checked',
                },
                { icon: <StarIcon size={18} />, label: 'Top Rated', sub: '4.8/5 Star Rating' },
              ].map((perk, i) => (
                <div
                  key={i}
                  className="border-border/60 bg-foreground/2 flex items-center gap-3 rounded-2xl border p-3"
                >
                  <div className="text-foreground-muted">{perk.icon}</div>
                  <div>
                    <p className="text-xs font-semibold">{perk.label}</p>
                    <p className="text-foreground-muted text-[10px]">{perk.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- WATCHING POPUP --- */}
      {showWatchingPopup && (
        <div
          onClick={() => {
            setShowWatchingPopup(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="border-border bg-background relative w-full max-w-sm overflow-hidden rounded-[2rem] border p-8 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                </span>
                <span className="text-xs font-bold tracking-widest text-red-500 uppercase">
                  Live Activity
                </span>
              </div>

              <div className="mb-4 flex items-center gap-2">
                <span className="text-4xl font-black">{liveMetric}+</span>
                <div className="rounded-full bg-red-500/10 p-2 text-red-500">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                </div>
              </div>

              <div className="mb-10 space-y-2">
                <p className="text-sm leading-relaxed text-zinc-400">
                  {liveMetric}+ peoples are watching the{' '}
                  <span className="text-foreground font-semibold">
                    {product.name.toUpperCase()}
                  </span>{' '}
                  right now.{' '}
                  <span className="underline">Secure yours before the item sold out.</span>
                </p>
              </div>

              <button
                onClick={() => {
                  setShowWatchingPopup(false);
                }}
                className="w-full rounded-full bg-white py-4 text-sm font-black tracking-wide text-black uppercase transition-colors hover:bg-zinc-200 active:scale-95"
              >
                View the drop
              </button>
            </div>
          </div>
        </div>
      )}

      <ReviewSection />
      <RelatedProducts products={similarProducts} />
      <CTAStickyButtons
        isWishlisted={isWishlisted}
        onWishlistToggle={handleWishlistToggle}
        onBuyNow={handleBuyNow}
        onCartClick={() => {
          router.push('/checkout');
        }}
      />
    </div>
  );
}
