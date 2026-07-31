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
  const [selectedSize, setSelectedSize] = useState<string | null>(
    () => product.attributes?.sizes?.[0] ?? null,
  );
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

  const handleAddToCart = (): boolean => {
    const totalStock = product.inventory?.totalStock ?? 10;
    if (totalStock <= 0) {
      toast.error('This product is currently out of stock');
      return false;
    }
    const chosenSize =
      selectedSize || (displaySizes && displaySizes.length > 0 ? displaySizes[0] : 'Standard');
    if (!selectedSize && displaySizes && displaySizes.length > 0) {
      setSelectedSize(displaySizes[0]);
    }
    const chosenColor = product.attributes?.colors?.[0] || 'Standard';

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
        ogPrice: product.price?.ogPrice ?? 0,
        sellingPrice: product.price?.sellingPrice ?? 0,
        mainImage: product.media?.mainImage ?? '',
        totalStock,
        sizes: product.attributes?.sizes ?? [],
        colors: product.attributes?.colors ?? [],
      },
    });
    toast.success(`Added ${product.name} (${chosenSize}) to Bag!`);
    return true;
  };

  const handleBuyNow = () => {
    const added = handleAddToCart();
    if (added) {
      router.push('/checkout/cart');
    }
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
    <div className="bg-background text-foreground min-h-screen pb-16 transition-colors md:pb-6">
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
                <div className="mb-3 flex w-full items-center justify-between">
                  <div className="text-foreground-muted flex flex-wrap items-center gap-3 text-[10px] font-black uppercase sm:gap-4">
                    <Link href={`/brands/${String(product.brand).toLowerCase()}`}>
                      <Image
                        src="/images/brand-logos/nike.png"
                        alt={product.brand[0] ?? 'Brand Logo'}
                        width={36}
                        height={36}
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

                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share product"
                    className="border-border hover:bg-background-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all active:scale-90"
                  >
                    <ShareIcon size={16} />
                  </button>
                </div>

                <h1 className="text-foreground text-3xl leading-tight font-black tracking-tight uppercase md:text-4xl md:leading-[1.1] lg:text-5xl lg:leading-[1.05]">
                  {product.name}
                </h1>
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
                  className="grid gap-2 lg:flex lg:flex-nowrap lg:gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  }}
                >
                  {displaySizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(size);
                      }}
                      className={`-skew-x-[12deg] cursor-pointer overflow-hidden rounded-lg border py-1 text-center transition-all duration-200 active:scale-95 lg:flex-1 lg:px-2 ${
                        selectedSize === size
                          ? 'scale-[0.98] border-zinc-900 bg-black text-white shadow-md dark:border-zinc-100 dark:bg-white dark:text-black'
                          : 'text-foreground hover:bg-foreground/5 border-zinc-300/80 bg-transparent hover:border-zinc-500 dark:border-zinc-800 dark:hover:border-zinc-600'
                      }`}
                    >
                      <span className="inline-block skew-x-[12deg] text-xs font-black tracking-wider uppercase sm:text-sm">
                        {size}
                      </span>
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
                    className="group flex h-12 w-full -skew-x-[12deg] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-black text-white shadow-lg transition-all hover:border-zinc-600 hover:shadow-xl active:scale-95 dark:border-zinc-300 dark:bg-white dark:text-black dark:hover:border-zinc-100"
                  >
                    <span className="skew-x-[12deg] text-sm font-black tracking-widest uppercase sm:text-base">
                      Buy Now
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="border-destructive text-destructive flex h-12 w-full -skew-x-[12deg] cursor-not-allowed items-center justify-center gap-3 overflow-hidden rounded-xl border-2 font-black tracking-[0.2em] uppercase"
                  >
                    <span className="flex skew-x-[12deg] items-center gap-2">
                      <BellIcon size={20} />
                      Notify Me
                    </span>
                  </button>
                )}
              </div>

              <div className="flex h-12 w-full items-center gap-2.5 lg:flex-1">
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`flex h-12 w-12 shrink-0 -skew-x-[12deg] items-center justify-center overflow-hidden rounded-xl border shadow-lg transition-all duration-200 active:scale-90 ${
                    isWishlisted
                      ? 'border-zinc-900 bg-black text-white dark:border-zinc-100 dark:bg-white dark:text-black'
                      : 'border-zinc-300 bg-transparent text-zinc-800 hover:border-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="skew-x-[12deg]">
                    {isWishlisted ? (
                      <HeartFilledIcon
                        size={20}
                        className="fill-white text-white dark:fill-black dark:text-black"
                      />
                    ) : (
                      <HeartIcon size={20} />
                    )}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="group flex h-12 flex-1 -skew-x-[12deg] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-white font-black text-black shadow-lg transition-all hover:bg-zinc-100 hover:shadow-xl active:scale-95 dark:border-zinc-300 dark:bg-black dark:text-white dark:hover:bg-zinc-900"
                >
                  <span className="skew-x-[12deg] text-sm font-black tracking-widest uppercase sm:text-base">
                    Add to Cart
                  </span>
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
                  className="-skew-x-[12deg] overflow-hidden rounded-xl border border-zinc-300/80 bg-zinc-50/50 p-3 shadow-xs transition-all hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/60 dark:hover:border-zinc-700"
                >
                  <div className="flex skew-x-[12deg] items-center gap-3">
                    <div className="text-foreground-muted shrink-0">{perk.icon}</div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black tracking-wider uppercase">
                        {perk.label}
                      </p>
                      <p className="text-foreground-muted truncate text-[10px]">{perk.sub}</p>
                    </div>
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
          router.push('/checkout/cart');
        }}
      />
    </div>
  );
}
