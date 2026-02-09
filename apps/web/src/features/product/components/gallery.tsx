"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayIcon, ImageIcon, PauseIcon } from "@ff/ui";

export default function MediaStage({
  images,
  videoUrl,
}: {
  images: string[];
  videoUrl?: string;
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
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
      <div className="hidden lg:flex flex-col gap-4 w-50 shrink-0 h-[inherit] max-h-full">
        <div
          className="flex flex-col gap-4 overflow-y-auto no-scrollbar rounded-4xl"
          style={{ maxHeight: "calc(100vh - 100px)" }}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i);
                setActiveMode("image");
                setIsZoomed(false);
              }}
              className={`relative aspect-4/5 w-full shrink-0 rounded-4xl overflow-hidden border-2 transition-all duration-300 ${
                index === i && activeMode === "image"
                  ? "border-black scale-95 shadow-lg"
                  : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
              }`}
            >
              <img
                src={img}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
            </button>
          ))}

          {/* Video Thumbnail Button */}
          <button
            onClick={() => {
              setActiveMode("video");
              setIsZoomed(false);
            }}
            className={`relative aspect-[4/5] w-full shrink-0 rounded-[2rem] overflow-hidden border-2 bg-gray-100 flex items-center justify-center transition-all duration-300 ${
              activeMode === "video"
                ? "border-black scale-95 shadow-lg"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <PlayIcon size={24} fill="white" className="text-white" />
            </div>
            <img
              src={images[0]}
              alt="Video Preview"
              className="w-full h-full object-cover blur-[1px]"
            />
          </button>
        </div>
      </div>

      {/* --- MAIN STAGE --- */}
      <div className="relative w-full group select-none touch-none flex-1">
        {/* --- MEDIA VIEWPORT --- */}
        <div
          className="relative aspect-4/5 rounded-[2.5rem] overflow-hidden cursor-crosshair bg-white shadow-sm"
          onPointerDown={handleInteraction}
        >
          <AnimatePresence mode="wait">
            {activeMode === "image" ? (
              <motion.div
                key={`img-wrap-${index}`}
                className="w-full h-full bg-white overflow-hidden"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
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
                className="w-full h-full bg-black overflow-hidden flex justify-center items-center scale-125 lg:scale-150"
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
          {/* --- CAPSULE SWITCHER (Floating controls) --- */}
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
                    ? "bg-white"
                    : "text-white opacity-60 hover:opacity-100"
                }`}
              >
                {activeMode !== "video" ? (
                  <PlayIcon size={14} />
                ) : (
                  <PauseIcon
                    size={14}
                    fill={activeMode === "video" ? "black" : "currentColor"}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
