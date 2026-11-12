'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ImageIcon,
  PauseIcon,
  PlayIcon,
} from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

export default function MediaStage({ images, videoUrl }: { images: string[]; videoUrl?: string }) {
  const [index, setIndex] = useState(0);
  const [activeMode, setActiveMode] = useState<'image' | 'video'>('image');
  const [isZoomed, setIsZoomed] = useState(false);

  const firstImage = images[0];
  useEffect(() => {
    setIndex(0);
    setIsZoomed(false);
    setActiveMode('image');
  }, [firstImage]);

  const safeIndex = images.length > 0 ? Math.min(Math.max(0, index), images.length - 1) : 0;
  const currentImage = images[safeIndex] || '/images/placeholder.png';

  const hasVideo = Boolean(
    videoUrl &&
    videoUrl.trim() !== '' &&
    videoUrl.trim() !== 'null' &&
    videoUrl.trim() !== 'undefined',
  );

  const lastTap = useRef<number>(0);
  const ZOOM_LEVEL = 2.7;

  const handleInteraction = () => {
    if (activeMode !== 'image') {
      return;
    }
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setIsZoomed(!isZoomed);
      lastTap.current = 0;
      return;
    }
    lastTap.current = now;
  };

  // Touch Swipe Gesture Tracking that preserves native vertical scrolling
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (activeMode !== 'image' || isZoomed) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isHorizontalSwipeRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (activeMode !== 'image' || isZoomed) return;
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;

    const diffX = e.touches[0].clientX - touchStartXRef.current;
    const diffY = e.touches[0].clientY - touchStartYRef.current;

    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        // If horizontal motion exceeds vertical, it's a gallery swipe.
        // If vertical motion exceeds horizontal, leave false so the browser scrolls naturally.
        isHorizontalSwipeRef.current = Math.abs(diffX) > Math.abs(diffY);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (activeMode !== 'image' || isZoomed) return;
    if (touchStartXRef.current === null || isHorizontalSwipeRef.current !== true) {
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      isHorizontalSwipeRef.current = null;
      return;
    }

    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const swipeThreshold = 40;
    const lastIndex = images.length - 1;

    if (diffX < -swipeThreshold) {
      setIndex((prev) => (prev === lastIndex ? 0 : prev + 1));
    } else if (diffX > swipeThreshold) {
      setIndex((prev) => (prev === 0 ? lastIndex : prev - 1));
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
    isHorizontalSwipeRef.current = null;
  };

  return (
    <div className="flex w-full max-w-6xl flex-col gap-6 lg:flex-row">
      {/* Desktop Left Thumbnails */}
      <div className="hidden h-[inherit] max-h-full w-50 shrink-0 flex-col gap-4 lg:flex">
        <div
          className="no-scrollbar flex flex-col gap-4 overflow-y-auto rounded-4xl"
          style={{ maxHeight: 'calc(100vh - 100px)' }}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i);
                setActiveMode('image');
                setIsZoomed(false);
              }}
              className={`relative aspect-4/5 w-full shrink-0 overflow-hidden rounded-4xl border-2 transition-all duration-300 ${
                safeIndex === i && activeMode === 'image'
                  ? 'scale-95 border-black shadow-lg'
                  : 'border-transparent opacity-70 hover:scale-105 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt="Thumbnail"
                fill
                sizes="(max-width: 768px) 80px, 100px"
                className="object-cover"
              />
            </button>
          ))}

          {/* Video Thumbnail Button */}
          {hasVideo && (
            <button
              onClick={() => {
                setActiveMode('video');
                setIsZoomed(false);
              }}
              className={`relative flex aspect-4/5 w-full shrink-0 items-center justify-center overflow-hidden rounded-4xl border-2 bg-gray-100 transition-all duration-300 ${
                activeMode === 'video'
                  ? 'scale-95 border-black shadow-lg'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <PlayIcon size={24} fill="white" className="text-white" />
              </div>
              <Image
                src={images[0] || '/images/placeholder.png'}
                alt="Video Preview"
                fill
                className="object-cover blur-[1px]"
                sizes="(max-width: 768px) 80px, 100px"
              />
            </button>
          )}
        </div>
      </div>

      {/* --- MAIN STAGE --- */}
      <div className="group relative w-full flex-1 touch-pan-y select-none">
        {/* --- MEDIA VIEWPORT --- */}
        <div
          className="relative aspect-4/5 cursor-crosshair overflow-hidden rounded-[2.5rem] bg-black shadow-sm touch-pan-y isolate [transform:translateZ(0)]"
          onClick={handleInteraction}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            {activeMode === 'image' ? (
              <motion.div
                key={`img-wrap-${safeIndex}-${currentImage}`}
                className="h-full w-full overflow-hidden bg-black touch-pan-y"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.25 }}
              >
                <motion.div
                  className="flex h-full w-full items-center justify-center overflow-hidden"
                  drag={isZoomed}
                  dragConstraints={{
                    left: -300,
                    right: 300,
                    top: -400,
                    bottom: 400,
                  }}
                  dragElastic={0.1}
                  animate={{
                    x: isZoomed ? undefined : 0,
                    y: isZoomed ? undefined : 0,
                    scale: isZoomed ? ZOOM_LEVEL : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                >
                  <motion.img
                    key={currentImage}
                    src={currentImage}
                    alt="Product Detail"
                    className="pointer-events-none h-full w-full min-h-full min-w-full shrink-0 object-cover"
                  />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="video-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full w-full scale-125 items-center justify-center overflow-hidden bg-black lg:scale-150"
              >
                <iframe
                  width={353}
                  height={628}
                  src={`https://www.youtube.com/embed/${videoUrl ?? ''}`}
                  title="Sneaker"
                  style={{ border: 0 }}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- PREV / NEXT ARROWS (Desktop only) --- */}
          {images.length > 1 && activeMode === 'image' && !isZoomed && (
            <div className="hidden lg:contents">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                }}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/70 focus:outline-none lg:flex"
              >
                <ChevronLeftIcon size={20} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                }}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/70 focus:outline-none lg:flex"
              >
                <ChevronRightIcon size={20} />
              </button>
            </div>
          )}

          {/* --- CAPSULE SWITCHER (Floating controls) --- */}
          {(images.length > 1 || hasVideo) && (
            <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
              <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/20 p-1 shadow-2xl backdrop-blur-xl">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMode('image');
                    setIsZoomed(false);
                  }}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase transition-all ${
                    activeMode === 'image'
                      ? 'bg-white text-gray-400'
                      : 'text-white opacity-60 hover:opacity-100'
                  }`}
                >
                  <ImageIcon size={14} /> {safeIndex + 1} / {images.length}
                </button>

                {hasVideo && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMode((prev) => (prev === 'video' ? 'image' : 'video'));
                      setIsZoomed(false);
                    }}
                    aria-label={activeMode === 'video' ? 'View Photos' : 'Watch Video'}
                    className={`flex items-center gap-1 rounded-full p-1 transition-all ${
                      activeMode === 'video'
                        ? 'bg-white text-black'
                        : 'text-white opacity-60 hover:opacity-100'
                    }`}
                  >
                    {activeMode !== 'video' ? (
                      <PlayIcon size={14} />
                    ) : (
                      <PauseIcon size={14} fill="black" />
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
