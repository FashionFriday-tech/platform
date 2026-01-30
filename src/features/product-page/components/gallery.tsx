"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Image as ImageIcon } from "lucide-react";

export default function MediaStage({
  images,
  videoUrl,
}: {
  images: string[];
  videoUrl: string;
}) {
  const [index, setIndex] = useState(0);
  const [activeMode, setActiveMode] = useState<"image" | "video">("image");
  const [isZoomed, setIsZoomed] = useState(false);

  const lastTap = useRef<number>(0);
  const ZOOM_LEVEL = 2.7;

  const handleInteraction = () => {
    if (activeMode !== "image") return;
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setIsZoomed(!isZoomed);
      lastTap.current = 0;
      return;
    }
    lastTap.current = now;
  };

  const handleDragEnd = (event: any, info: any) => {
    if (activeMode === "video") return;
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
    <div className="relative w-full group select-none touch-none">
      {/* --- MEDIA VIEWPORT --- */}
      <div
        className="relative aspect-3/4 rounded-[2.5rem] overflow-hidden cursor-crosshair bg-white"
        onPointerDown={handleInteraction}
      >
        <AnimatePresence mode="wait">
          {activeMode === "image" ? (
            <motion.div
              key={`img-wrap-${index}`}
              className="w-full h-full bg-white overflow-hidden"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className="w-full h-full flex items-center justify-center"
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
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              >
                <motion.img
                  src={images[index]}
                  alt="Product Detail"
                  className="w-full h-full object-cover pointer-events-none"
                />
              </motion.div>
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
              className="w-full h-full bg-black overflow-hidden flex justify-center items-center scale-125"
            >
              <iframe
                width={353}
                height={628}
                src={`https://www.youtube.com/embed/${videoUrl}`}
                title="Sneaker"
                frameBorder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- CAPSULE SWITCHER --- */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-black/20 backdrop-blur-xl border border-white/20 p-1 rounded-full flex items-center gap-1 shadow-2xl">
          <button
            onClick={() => {
              setActiveMode("image");
              setIsZoomed(false);
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeMode === "image"
                ? "bg-white text-gray-400"
                : "text-white opacity-60 hover:opacity-100"
            }`}
          >
            <ImageIcon size={14} /> {index + 1} / {images.length}
          </button>

          <button
            onClick={() => {
              setActiveMode("video");
              setIsZoomed(false);
            }}
            className={`flex items-center gap-1 p-1 rounded-full transition-all ${
              activeMode === "video"
                ? "bg-white text-gray-400"
                : "text-white opacity-60 hover:opacity-100"
            }`}
          >
            <Play
              size={14}
              fill={activeMode === "video" ? "black" : "currentColor"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
