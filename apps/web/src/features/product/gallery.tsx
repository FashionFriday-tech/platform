'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

import { ImageIcon, PauseIcon, PlayIcon } from '@ff/ui';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';

export default function MediaStage({ images, videoUrl }: { images: string[]; videoUrl?: string }) {
  const [index, setIndex] = useState(0);
  const [activeMode, setActiveMode] = useState<'image' | 'video'>('image');
  const [isZoomed, setIsZoomed] = useState(false);

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

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (activeMode === 'video') {
      return;
    }
    const swipeThreshold = 50;
    const lastIndex = images.length - 1;
    if (!isZoomed) {
      if (info.offset.x < -swipeThreshold) {
        setIndex((prev) => (prev === lastIndex ? 0 : prev + 1));
      } else if (info.offset.x > swipeThreshold) {
        setIndex((prev) => (prev === 0 ? lastIndex : prev - 1));
      }
    }
  };

  return (
    <div className="flex w-full max-w-6xl flex-col gap-6 lg:flex-row">
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
                index === i && activeMode === 'image'
                  ? 'scale-95 border-black shadow-lg'
                  : 'border-transparent opacity-70 hover:scale-105 hover:opacity-100'
              }`}
            >
              <Image src={img} alt="Thumbnail" fill className="object-cover" />{' '}
            </button>
          ))}

          {/* Video Thumbnail Button */}
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
              src={images[0]}
              alt="Video Preview"
              fill
              className="object-cover blur-[1px]"
              sizes="100vw"
            />
          </button>
        </div>
      </div>

      {/* --- MAIN STAGE --- */}
      <div className="group relative w-full flex-1 touch-none select-none">
        {/* --- MEDIA VIEWPORT --- */}
        <div
          className="relative aspect-4/5 cursor-crosshair overflow-hidden rounded-[2.5rem] bg-white shadow-sm"
          onPointerDown={handleInteraction}
        >
          <AnimatePresence mode="wait">
            {activeMode === 'image' ? (
              <motion.div
                key={`img-wrap-${index}`}
                className="h-full w-full overflow-hidden bg-white"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.25 }}
              >
                <motion.div
                  className="flex h-full w-full items-center justify-center"
                  drag={isZoomed}
                  dragConstraints={{
                    left: -300,
                    right: 300,
                    top: -400,
                    bottom: 400,
                  }}
                  dragElastic={0.1}
                  onDragEnd={handleDragEnd}
                  animate={{
                    x: isZoomed ? undefined : 0,
                    y: isZoomed ? undefined : 0,
                    scale: isZoomed ? ZOOM_LEVEL : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                >
                  <motion.img
                    src={images[index]}
                    alt="Product Detail"
                    className="pointer-events-none h-full w-full object-cover"
                  />
                </motion.div>

                {/* Drag layer for swiping logic */}
                {!isZoomed && (
                  <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    className="absolute inset-0 z-10"
                  />
                )}
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
          {/* --- CAPSULE SWITCHER (Floating controls) --- */}
          <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
            <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/20 p-1 shadow-2xl backdrop-blur-xl">
              <button
                onClick={() => {
                  setActiveMode('image');
                  setIsZoomed(false);
                }}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase transition-all ${
                  activeMode === 'image'
                    ? 'bg-white text-gray-400'
                    : 'text-white opacity-60 hover:opacity-100'
                }`}
              >
                <ImageIcon size={14} /> {index + 1} / {images.length}
              </button>

              <button
                onClick={() => {
                  setActiveMode('video');
                  setIsZoomed(false);
                }}
                className={`flex items-center gap-1 rounded-full p-1 transition-all ${
                  activeMode === 'video' ? 'bg-white' : 'text-white opacity-60 hover:opacity-100'
                }`}
              >
                {activeMode !== 'video' ? (
                  <PlayIcon size={14} />
                ) : (
                  <PauseIcon size={14} fill="black" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
