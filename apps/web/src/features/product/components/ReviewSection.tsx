'use client';

import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CameraIcon,
  CloseIcon,
  FilledStarIcon,
  InfoCircleIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  StarIcon,
  TrashIcon,
  VerifiedIcon,
} from '@ff/ui';
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, wrap } from 'framer-motion';

interface Review {
  name: string;
  initials: string;
  comment: string;
  image: string;
  rating: number;
  membership: 'silver' | 'gold' | 'platinum';
}

export default function ReviewSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Form States
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
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

  const reviews: Review[] = [
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
    return () => window.removeEventListener('resize', updateWidth);
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

  const nextModal = () => setSelectedReview((prev) => (prev + 1) % reviews.length);
  const prevModal = () => setSelectedReview((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <div
      id="review-section"
      className="bg-background text-foreground scroll-mt-60 overflow-hidden px-6 py-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 flex max-w-3xl items-center justify-between">
          <div>
            <h2 className="text-[14px] font-black uppercase italic tracking-[0.3em]">Reviews</h2>
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
            onClick={() => setIsInfoOpen(true)}
            className="text-foreground flex items-center justify-center rounded-full shadow-xl transition-transform active:scale-95"
          >
            <InfoCircleIcon size={20} />
          </button>
        </div>
        <div
          className="relative w-full overflow-visible [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            style={{ x }}
            drag="x"
            onDragStart={() => setIsPaused(true)}
            onDragEnd={() => setIsPaused(false)}
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
                className="group bg-card text-card-foreground border-border pointer-events-auto flex w-[450px] shrink-0 flex-col items-start gap-4 rounded-[3rem] border p-3 shadow-2xl transition-all duration-300 hover:border-foreground/20 md:w-[700px] md:p-6"
              >
                <div className="flex w-full items-center justify-between gap-6">
                  {/* High-End Image Cropping - 1:1 Aspect Ratio */}
                  <div className="relative aspect-square w-40 shrink-0 overflow-hidden rounded-[2.5rem] bg-zinc-800 shadow-2xl md:w-64">
                    <Image
                      src={rev.image}
                      alt="review"
                      fill
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
                        <span className="bg-foreground text-background flex h-10 w-10 items-center justify-center rounded-full text-[16px] font-black italic uppercase">
                          {rev.initials}
                        </span>
                      </div>

                      <div className="flex flex-col text-left">
                        <span className="flex items-center text-[15px] font-black uppercase leading-none tracking-tight">
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
                          {[...Array(5)].map((_, starIndex) => (
                            <FilledStarIcon
                              key={starIndex}
                              size={10}
                              className={
                                starIndex < rev.rating ? 'text-yellow-400' : 'text-muted-foreground'
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground line-clamp-3 text-left text-sm font-medium italic leading-relaxed">
                      "{rev.comment}"
                    </p>

                    <span className="text-muted-foreground/30 text-[9px] font-bold uppercase tracking-[0.2em] transition-colors group-hover:text-muted-foreground/60">
                      Tap to expand
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <div className="mt-10 flex w-full items-end justify-center gap-2">
          {Array.from({ length: 5 }).map((_, starIndex) => (
            <StarIcon
              key={starIndex}
              size={42}
              onClick={() => {
                setNewRating(starIndex + 1);
                setIsFormOpen(true);
              }}
              className={`cursor-pointer text-white transition-colors`}
            />
          ))}
        </div>
        <p className="bg-size-[400%_100%] flex animate-[glaze_5s_linear_infinite] items-center justify-center bg-[linear-gradient(90deg,hsl(var(--foreground)),hsl(var(--muted-foreground)),hsl(var(--foreground)),hsl(var(--muted-foreground)),hsl(var(--foreground)))] bg-clip-text text-[8px] font-black uppercase tracking-[0.5em] text-transparent">
          Drop Your Review
        </p>
      </div>

      {/* --- INFO BOX MODAL --- */}
      <AnimatePresence>
        {isInfoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-60 fixed inset-0 flex items-center justify-center bg-black/80 p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card border-border relative w-full max-w-md rounded-[2.5rem] border p-8 shadow-2xl"
            >
              <button
                onClick={() => setIsInfoOpen(false)}
                className="text-muted-foreground hover:text-foreground absolute right-6 top-6 transition-colors"
              >
                <CloseIcon size={24} />
              </button>
              <div className="space-y-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                  <ShieldCheckIcon size={28} />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                  Review Integrity
                </h3>
                <div className="space-y-4 text-sm leading-relaxed text-white/70">
                  <div className="flex gap-3 text-left">
                    <ShoppingBagIcon className="shrink-0 text-white" size={18} />
                    <p>
                      <span className="font-bold text-white">Verified Buyers Only:</span> Only
                      customers with a confirmed purchase can submit reviews.
                    </p>
                  </div>
                  <div className="flex gap-3 text-left">
                    <ShieldCheckIcon className="shrink-0 text-white" size={18} />
                    <p>
                      <span className="font-bold text-white">Zero Fake Reviews:</span> Every
                      submission is cross-referenced with order IDs.
                    </p>
                  </div>
                  <div className="flex gap-3 text-left">
                    <AlertTriangleIcon className="shrink-0 text-rose-500" size={18} />
                    <p>
                      <span className="font-bold text-white">Community Conduct:</span> No abusive
                      language. Harassment results in permanent removal.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsInfoOpen(false)}
                  className="mt-4 w-full rounded-full bg-white py-4 text-xs font-black uppercase tracking-widest text-black"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6 backdrop-blur-2xl"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-8 top-8 text-white opacity-50 transition-opacity hover:opacity-100"
            >
              <CloseIcon size={32} />
            </button>
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
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
                  src={reviews[selectedReview].image}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-6 md:w-1/2">
                <div className="flex items-center gap-4">
                  <span className="bg-foreground text-background flex h-14 w-14 items-center justify-center rounded-full text-xl font-black">
                    {reviews[selectedReview].initials}
                  </span>
                  <h2 className="text-foreground text-4xl font-black uppercase italic leading-none tracking-tighter">
                    {reviews[selectedReview].name}
                  </h2>
                </div>
                <p className="text-xl font-medium italic leading-tight text-white/90 md:text-3xl">
                  "{reviews[selectedReview].comment}"
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

      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-card border-border fixed bottom-0 left-0 right-0 z-50 rounded-t-[3rem] border-t p-10 shadow-2xl"
            >
              <div className="mx-auto max-w-md space-y-8">
                <div className="text-foreground flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">
                    Drop your Review
                  </h3>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="transition-colors hover:text-white"
                  >
                    <CloseIcon size={20} />
                  </button>
                </div>

                <div className="relative space-y-3">
                  <div className="flex items-end justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20">
                      Experience & Media
                    </label>
                    <span
                      className={`text-[10px] font-black tracking-widest ${
                        CHARACTER_LIMIT - newComment.length < 0 ? 'text-red-500' : 'text-white/20'
                      }`}
                    >
                      {CHARACTER_LIMIT - newComment.length}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    {selectedImage && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-white/5"
                      >
                        <Image src={selectedImage} alt="Preview" fill className="object-cover" />
                        <button
                          onClick={() => setSelectedImage(null)}
                          className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </motion.div>
                    )}
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="The cut, the feel, the vibe..."
                      className={`h-32 flex-1 rounded-2xl border bg-white/5 p-5 text-sm text-white outline-none transition-colors ${
                        CHARACTER_LIMIT - newComment.length < 0
                          ? 'border-red-500/50'
                          : 'border-white/10 focus:border-white/40'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex w-full items-center justify-center gap-4">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <motion.button
                      key={starIndex}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setNewRating(starIndex + 1)}
                      type="button"
                    >
                      <StarIcon
                        size={28}
                        className={
                          starIndex < newRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-yellow-400'
                        }
                      />
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    className="flex-1 rounded-full bg-white py-4 text-xs font-black uppercase tracking-widest text-black transition-all active:scale-95 disabled:opacity-50"
                    disabled={newComment.length === 0 || newRating === 0}
                  >
                    Publish Review
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all ${
                      selectedImage
                        ? 'border-yellow-400 bg-yellow-400 text-black'
                        : 'border-white/10 bg-white/5 text-white/40 hover:text-white'
                    }`}
                  >
                    <CameraIcon size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
