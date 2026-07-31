'use client';

import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CameraIcon,
  CloseIcon,
  FilledStarIcon,
  InfoCircleIcon,
  LoaderIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  StarIcon,
  VerifiedIcon,
} from '@ff/ui';
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, wrap } from 'motion/react';

import { fetchUserOrdersAction } from '@/features/orders/services/orders.actions';
import { useAuthStore } from '@/store/auth-store';

interface Review {
  name: string;
  initials: string;
  comment: string;
  image: string;
  rating: number;
  membership: 'silver' | 'gold' | 'platinum';
}

interface ReviewSectionProps {
  productId?: string;
  productName?: string;
}

export default function ReviewSection({ productId, productName }: ReviewSectionProps = {}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Purchase Verification State
  const [hasPurchased, setHasPurchased] = useState<boolean | null>(null);
  const [isCheckingPurchase, setIsCheckingPurchase] = useState(false);
  const [purchaseCheckReason, setPurchaseCheckReason] = useState<
    'not_logged_in' | 'not_purchased' | 'general'
  >('general');

  // Form States
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const CHARACTER_LIMIT = 100;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const initialReviews: Review[] = [
    {
      name: 'Damon W.',
      initials: 'DW',
      comment:
        'Aggressive silhouette. Fabric is heavy and feels expensive. This is a total grail piece for any collection.',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      rating: 5,
      membership: 'silver',
    },
    {
      name: 'Sasha R.',
      initials: 'SR',
      comment:
        'Incredible attention to detail. Fits slightly oversized. The texture is exactly what I expected.',
      image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800',
      rating: 4,
      membership: 'gold',
    },
    {
      name: 'Leo K.',
      initials: 'LK',
      comment: 'The perfect staple. Color is richer in person. Highly recommend for daily wear.',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800',
      rating: 3,
      membership: 'platinum',
    },
  ];

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const duplicatedReviews = [...reviews, ...reviews, ...reviews, ...reviews];
  const [cardWidth, setCardWidth] = useState(600);
  const x = useMotionValue(0);
  const GAP = 32;
  const TOTAL_SET_WIDTH = reviews.length * (cardWidth + GAP);

  useEffect(() => {
    const updateWidth = () => {
      setCardWidth(window.innerWidth < 768 ? 400 : 600);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  useAnimationFrame((_t, delta) => {
    if (isPaused || isModalOpen || isFormOpen || isInfoOpen) {
      return;
    }
    // Normalize speed: 2px per frame @ 60fps (16.67ms)
    const moveBy = -1.5 * (delta / 16.67);
    const currentX = x.get();
    const newX = currentX + moveBy;
    x.set(wrap(-TOTAL_SET_WIDTH, 0, newX));
  });

  const nextModal = () => {
    setSelectedReview((prev) => (prev + 1) % reviews.length);
  };
  const prevModal = () => {
    setSelectedReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  /**
   * Only activates the review submit box if user has confirmed a purchase.
   * Otherwise, displays the info pop up box.
   */
  const handleInitiateReview = async (rating = 5) => {
    // 1. If not logged in -> not a confirmed purchaser
    if (!user) {
      setPurchaseCheckReason('not_logged_in');
      setIsInfoOpen(true);
      return;
    }

    // 2. If purchase is already verified in this session
    if (hasPurchased === true) {
      setNewRating(rating);
      setIsFormOpen(true);
      return;
    }

    // 3. Otherwise verify against user's orders
    setIsCheckingPurchase(true);
    try {
      const orders = await fetchUserOrdersAction();
      const confirmedOrder =
        Array.isArray(orders) &&
        orders.some((order: any) => {
          if (order.status === 'cancelled' || order.status === 'returned') {
            return false;
          }
          if (productId || productName) {
            if (Array.isArray(order.items)) {
              return order.items.some(
                (item: any) =>
                  (productId && item.id === productId) ||
                  (productName && item.name?.toLowerCase() === productName.toLowerCase()),
              );
            }
          }
          return true;
        });

      if (confirmedOrder) {
        setHasPurchased(true);
        setNewRating(rating);
        setIsFormOpen(true);
      } else {
        setHasPurchased(false);
        setPurchaseCheckReason('not_purchased');
        setIsInfoOpen(true);
      }
    } catch (err) {
      console.error('Failed to verify customer purchase:', err);
      setHasPurchased(false);
      setPurchaseCheckReason('not_purchased');
      setIsInfoOpen(true);
    } finally {
      setIsCheckingPurchase(false);
    }
  };

  const handleSubmitReview = () => {
    if (!newComment.trim() || newRating === 0) {
      toast.error('Please select a star rating and enter your review.');
      return;
    }

    const userName = user?.name?.trim() || 'Verified Buyer';
    const nameParts = userName.split(' ');
    const formattedName =
      nameParts.length > 1
        ? `${nameParts[0]} ${nameParts[1][0].toUpperCase()}.`
        : nameParts[0];

    const initials =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : userName.slice(0, 2).toUpperCase();

    const newReviewItem: Review = {
      name: formattedName,
      initials,
      comment: newComment.trim(),
      image:
        selectedImage || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      rating: newRating,
      membership: 'gold',
    };

    setReviews((prev) => [newReviewItem, ...prev]);
    setNewComment('');
    setNewRating(5);
    setSelectedImage(null);
    setIsFormOpen(false);
    toast.success('Thank you! Your verified review has been published.');
  };

  return (
    <div
      id="review-section"
      className="bg-background text-foreground scroll-mt-60 overflow-hidden px-6 py-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 flex max-w-3xl items-center justify-between">
          <div>
            <h2 className="text-[14px] font-black tracking-[0.3em] uppercase italic">Reviews</h2>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <FilledStarIcon
                  key={starIndex}
                  size={10}
                  className={starIndex < 4 ? 'fill-foreground text-foreground' : 'text-foreground'}
                />
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              setPurchaseCheckReason('general');
              setIsInfoOpen(true);
            }}
            className="text-foreground hover:text-foreground/80 flex items-center justify-center rounded-full p-2 transition-transform active:scale-95"
            aria-label="Review Integrity Guidelines"
          >
            <InfoCircleIcon size={20} />
          </button>
        </div>

        <div
          className="relative w-full overflow-visible"
          onMouseEnter={() => {
            setIsPaused(true);
          }}
          onMouseLeave={() => {
            setIsPaused(false);
          }}
        >
          <motion.div
            style={{ x }}
            drag="x"
            onDragStart={() => {
              setIsPaused(true);
            }}
            onDragEnd={() => {
              setIsPaused(false);
            }}
            onUpdate={(latest) => {
              const latestX = latest.x as number;
              if (latestX <= -TOTAL_SET_WIDTH || latestX >= 0) {
                x.set(wrap(-TOTAL_SET_WIDTH, 0, latestX));
              }
            }}
            className="flex w-max cursor-grab gap-4 active:cursor-grabbing"
          >
            {duplicatedReviews.map((rev, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedReview(i % reviews.length);
                  setIsModalOpen(true);
                }}
                className="bg-card text-card-foreground border-border hover:border-foreground/20 group pointer-events-auto flex w-[450px] shrink-0 flex-col items-start gap-4 rounded-[3rem] border p-3 shadow-2xl transition-all duration-300 md:w-[700px] md:p-6"
              >
                <div className="flex w-full items-center justify-between gap-6">
                  {/* High-End Image Cropping - 1:1 Aspect Ratio */}
                  <div className="relative aspect-square w-40 shrink-0 overflow-hidden rounded-[2.5rem] bg-zinc-800 shadow-2xl md:w-64">
                    <Image
                      src={rev.image}
                      alt="review"
                      fill
                      sizes="(max-width: 768px) 160px, 256px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>

                  <div className="flex flex-1 flex-col items-start gap-3 pr-4">
                    <div className="flex items-center justify-start gap-3">
                      {/* Detailed Membership Ring */}
                      <div
                        className={`rounded-full border border-dashed p-1 transition-transform duration-500 group-hover:rotate-45 ${
                          rev.membership === 'silver'
                            ? 'border-gray-400'
                            : rev.membership === 'gold'
                              ? 'border-yellow-400'
                              : 'border-rose-500'
                        }`}
                      >
                        <span className="bg-foreground text-background flex h-10 w-10 items-center justify-center rounded-full text-[16px] font-black uppercase italic">
                          {rev.initials}
                        </span>
                      </div>

                      <div className="flex flex-col text-left">
                        <span className="flex items-center text-[15px] leading-none font-black tracking-tight uppercase">
                          {rev.name}
                          <VerifiedIcon
                            className={`mb-0.5 ml-1.5 w-4 ${
                              rev.membership === 'silver'
                                ? 'text-gray-400'
                                : rev.membership === 'gold'
                                  ? 'text-yellow-500'
                                  : 'text-rose-600'
                            }`}
                          />
                        </span>

                        <div className="mt-1.5 flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, starIndex) => (
                            <FilledStarIcon
                              key={starIndex}
                              size={10}
                              className={
                                starIndex < rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground line-clamp-3 text-left text-sm leading-relaxed font-medium italic">
                      "{rev.comment}"
                    </p>

                    <span className="text-muted-foreground/40 group-hover:text-muted-foreground text-[9px] font-bold tracking-[0.2em] uppercase transition-colors">
                      Tap to expand
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Review Trigger Button with Interactive Stars */}
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="mt-10 flex w-full items-end justify-center gap-2">
          {Array.from({ length: 5 }).map((_, starIndex) => (
            <motion.button
              key={starIndex}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                void handleInitiateReview(starIndex + 1);
              }}
              type="button"
              className="cursor-pointer p-1"
              aria-label={`Rate ${starIndex + 1} Stars`}
            >
              <StarIcon
                size={40}
                className="text-foreground/30 hover:text-amber-400 hover:fill-amber-400 transition-colors"
              />
            </motion.button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            void handleInitiateReview(5);
          }}
          disabled={isCheckingPurchase}
          className="cursor-pointer flex items-center justify-center gap-2 py-1 text-center transition-opacity hover:opacity-80 active:scale-95"
        >
          {isCheckingPurchase ? (
            <span className="flex items-center gap-2 text-[10px] font-black tracking-widest text-foreground-muted uppercase">
              <LoaderIcon size={12} className="animate-spin text-foreground" />
              <span>Checking Purchase Status...</span>
            </span>
          ) : (
            <span className="flex animate-[glaze_5s_linear_infinite] items-center justify-center bg-[linear-gradient(90deg,hsl(var(--foreground)),hsl(var(--muted-foreground)),hsl(var(--foreground)),hsl(var(--muted-foreground)),hsl(var(--foreground)))] bg-size-[400%_100%] bg-clip-text text-[8px] font-black tracking-[0.5em] text-transparent uppercase">
              Drop Your Review
            </span>
          )}
        </button>
      </div>

      {/* --- INFO BOX MODAL (Shown for unverified users or info request) --- */}
      <AnimatePresence>
        {isInfoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-background/80 fixed inset-0 z-60 flex items-center justify-center p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-background border-border relative w-full max-w-md rounded-3xl border p-8 shadow-2xl"
            >
              <button
                onClick={() => {
                  setIsInfoOpen(false);
                }}
                className="text-foreground-muted hover:text-foreground absolute top-6 right-6 cursor-pointer transition-colors"
                aria-label="Close"
              >
                <CloseIcon size={20} />
              </button>

              <div className="space-y-6">
                <div className="bg-foreground text-background flex h-12 w-12 items-center justify-center rounded-2xl shadow-md">
                  <ShieldCheckIcon size={26} className="text-emerald-400" />
                </div>

                <div>
                  <h3 className="text-foreground text-2xl font-black tracking-tight uppercase">
                    Review Integrity
                  </h3>
                  <p className="text-foreground-muted mt-1 text-xs font-semibold uppercase tracking-wider">
                    Authentic Community Feedback Policy
                  </p>
                </div>

                {/* Contextual Notice */}
                {purchaseCheckReason === 'not_logged_in' && (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs font-medium text-amber-600 dark:text-amber-400">
                    <p className="font-bold uppercase tracking-wider">Sign In Required</p>
                    <p className="mt-1">
                      You must be signed in with the account used to purchase this piece to submit a review.
                    </p>
                  </div>
                )}

                {purchaseCheckReason === 'not_purchased' && (
                  <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-medium text-rose-600 dark:text-rose-400">
                    <p className="font-bold uppercase tracking-wider">Confirmed Purchase Required</p>
                    <p className="mt-1">
                      Reviews are strictly reserved for customers with a verified, completed order for this piece.
                    </p>
                  </div>
                )}

                <div className="text-foreground/80 space-y-3.5 text-xs leading-relaxed">
                  <div className="flex gap-3 text-left">
                    <ShoppingBagIcon className="shrink-0 text-foreground" size={18} />
                    <p>
                      <span className="text-foreground font-bold">Verified Buyers Only:</span> Only
                      customers with a confirmed purchase can submit reviews.
                    </p>
                  </div>
                  <div className="flex gap-3 text-left">
                    <ShieldCheckIcon className="shrink-0 text-emerald-500" size={18} />
                    <p>
                      <span className="text-foreground font-bold">Zero Fake Reviews:</span> Every
                      submission is cross-referenced with genuine order records.
                    </p>
                  </div>
                  <div className="flex gap-3 text-left">
                    <AlertTriangleIcon className="shrink-0 text-rose-500" size={18} />
                    <p>
                      <span className="text-foreground font-bold">Community Conduct:</span> No abusive
                      language or spam. Constructive critiques only.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  {purchaseCheckReason === 'not_logged_in' ? (
                    <>
                      <button
                        onClick={() => {
                          setIsInfoOpen(false);
                          router.push('/auth/login');
                        }}
                        className="bg-foreground text-background flex-1 cursor-pointer rounded-xl py-3.5 text-xs font-black tracking-widest uppercase transition-all hover:opacity-90 active:scale-95"
                      >
                        Sign In Now
                      </button>
                      <button
                        onClick={() => {
                          setIsInfoOpen(false);
                        }}
                        className="border-border text-foreground hover:bg-foreground/5 cursor-pointer rounded-xl border px-5 py-3.5 text-xs font-bold uppercase transition-colors"
                      >
                        Close
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setIsInfoOpen(false);
                      }}
                      className="bg-foreground text-background w-full cursor-pointer rounded-xl py-3.5 text-xs font-black tracking-widest uppercase transition-all hover:opacity-90 active:scale-95"
                    >
                      Understood
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- REVIEW DETAIL EXPAND MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6 backdrop-blur-2xl"
          >
            <button
              onClick={() => {
                setIsModalOpen(false);
              }}
              className="absolute top-8 right-8 text-white opacity-50 transition-opacity hover:opacity-100"
              aria-label="Close"
            >
              <CloseIcon size={32} />
            </button>
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_e, info) => {
                if (info.offset.x < -100) {
                  nextModal();
                }
                if (info.offset.x > 100) {
                  prevModal();
                }
              }}
              className="flex w-full max-w-5xl flex-col items-center gap-12 text-left md:flex-row"
            >
              <div className="aspect-square w-full overflow-hidden rounded-[3rem] md:w-1/2">
                <motion.img
                  key={selectedReview}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={reviews[selectedReview]?.image}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-6 md:w-1/2">
                <div className="flex items-center gap-4">
                  <span className="bg-foreground text-background flex h-14 w-14 items-center justify-center rounded-full text-xl font-black">
                    {reviews[selectedReview]?.initials}
                  </span>
                  <h2 className="text-foreground text-4xl leading-none font-black tracking-tighter uppercase italic">
                    {reviews[selectedReview]?.name}
                  </h2>
                </div>
                <p className="text-xl leading-tight font-medium text-white/90 italic md:text-3xl">
                  "{reviews[selectedReview]?.comment}"
                </p>
                <div className="flex gap-4 pt-8">
                  <button
                    onClick={prevModal}
                    className="rounded-full border border-white/20 p-4 transition-all duration-300 hover:bg-white hover:text-black"
                  >
                    <ArrowLeftIcon />
                  </button>
                  <button
                    onClick={nextModal}
                    className="rounded-full border border-white/20 p-4 transition-all duration-300 hover:bg-white hover:text-black"
                  >
                    <ArrowRightIcon />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- REDESIGNED REVIEW SUBMIT BOX (VERIFIED PURCHASERS ONLY) --- */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsFormOpen(false);
              }}
              className="bg-background/80 fixed inset-0 z-50 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[2.5rem] border-t p-6 shadow-2xl backdrop-blur-2xl sm:bottom-6 sm:rounded-3xl sm:border sm:p-8"
            >
              <div className="mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheckIcon size={14} />
                      <span className="text-[10px] font-black tracking-widest uppercase">
                        Verified Purchaser Submission
                      </span>
                    </div>
                    <h3 className="text-foreground text-xl font-bold tracking-tight uppercase">
                      Drop Your Review
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setIsFormOpen(false);
                    }}
                    className="text-foreground-muted hover:text-foreground flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border transition-colors active:scale-95"
                    aria-label="Close"
                  >
                    <CloseIcon size={18} />
                  </button>
                </div>

                {/* Rating Picker with Descriptive Feedback */}
                <div className="border-border bg-foreground/[0.02] flex flex-col items-center justify-center gap-2 rounded-2xl border py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground-muted text-[10px] font-bold tracking-widest uppercase">
                      Your Rating:
                    </span>
                    <span className="text-amber-500 text-xs font-black uppercase">
                      {(hoverRating || newRating) === 5
                        ? 'Exceptional (5/5)'
                        : (hoverRating || newRating) === 4
                          ? 'Very Good (4/5)'
                          : (hoverRating || newRating) === 3
                            ? 'Good (3/5)'
                            : (hoverRating || newRating) === 2
                              ? 'Fair (2/5)'
                              : 'Poor (1/5)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, starIndex) => {
                      const starValue = starIndex + 1;
                      const isFilled = starValue <= (hoverRating || newRating);
                      return (
                        <motion.button
                          key={starIndex}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setNewRating(starValue)}
                          type="button"
                          className="cursor-pointer p-1"
                          aria-label={`${starValue} Stars`}
                        >
                          <FilledStarIcon
                            size={32}
                            className={`transition-colors ${
                              isFilled
                                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]'
                                : 'text-border fill-transparent'
                            }`}
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Experience & Feedback */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-foreground text-[11px] font-bold tracking-wider uppercase">
                      Experience & Feedback
                    </label>
                    <span
                      className={`text-[10px] font-bold tracking-wider ${
                        CHARACTER_LIMIT - newComment.length < 0
                          ? 'text-rose-500'
                          : 'text-foreground-muted'
                      }`}
                    >
                      {CHARACTER_LIMIT - newComment.length} chars left
                    </span>
                  </div>

                  <div className="border-border/80 bg-foreground/[0.03] focus-within:border-foreground relative rounded-2xl border p-4 transition-all">
                    <textarea
                      value={newComment}
                      maxLength={CHARACTER_LIMIT}
                      onChange={(e) => {
                        setNewComment(e.target.value);
                      }}
                      placeholder="The cut, the feel, the vibe..."
                      rows={3}
                      className="text-foreground placeholder:text-foreground-muted/50 w-full resize-none bg-transparent text-sm font-medium outline-none"
                    />

                    {selectedImage && (
                      <div className="border-border/60 mt-3 flex items-center gap-3 border-t pt-3">
                        <div className="border-border relative h-16 w-16 overflow-hidden rounded-xl border">
                          <Image
                            src={selectedImage}
                            alt="Preview"
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedImage(null);
                            }}
                            className="bg-black/70 hover:bg-black absolute top-1 right-1 cursor-pointer rounded-full p-1 text-white transition-colors"
                            aria-label="Remove image"
                          >
                            <CloseIcon size={12} />
                          </button>
                        </div>
                        <span className="text-foreground-muted text-xs font-medium">Photo attached</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-border hover:border-foreground flex h-12 items-center justify-center gap-2 rounded-xl border px-4 transition-all cursor-pointer active:scale-95 ${
                      selectedImage
                        ? 'border-amber-400 bg-amber-400/10 text-amber-500'
                        : 'text-foreground'
                    }`}
                    title="Attach Photo"
                  >
                    <CameraIcon size={18} />
                    <span className="text-xs font-bold whitespace-nowrap">
                      {selectedImage ? 'Change Photo' : 'Add Photo'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitReview}
                    disabled={!newComment.trim() || newRating === 0}
                    className="bg-foreground text-background -skew-x-[12deg] flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-foreground font-black tracking-widest text-xs uppercase shadow-xl transition-all hover:opacity-95 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="skew-x-[12deg] flex items-center justify-center gap-2">
                      <span>Publish Review</span>
                      <ArrowRightIcon size={15} />
                    </span>
                  </button>
                </div>

                {/* Footnote */}
                <div className="text-foreground-muted flex items-center justify-center gap-1.5 pt-1 text-[10px] font-semibold">
                  <ShieldCheckIcon size={13} className="text-emerald-500" />
                  <span>Verified Buyer Review • Cross-referenced with confirmed order</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
