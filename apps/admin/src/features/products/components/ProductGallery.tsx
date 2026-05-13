'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Props {
  productName: string;
  displayImages: string[];
}

export function ProductGallery({ productName, displayImages }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="lg:sticky lg:top-24 lg:col-span-5">
      <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] bg-black/5 dark:bg-white/5">
        {displayImages.length > 0 ? (
          <Image
            width={500}
            height={500}
            src={displayImages[activeImageIndex]}
            alt={productName}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-black/30 dark:text-white/30">
            <svg className="mb-4 h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-bold">No Image</span>
          </div>
        )}

        {/* Floating Thumbnails Dock */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-3xl bg-white p-3 shadow-xl backdrop-blur-xl dark:bg-black/70">
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveImageIndex(idx);
                }}
                className={`relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${activeImageIndex === idx ? 'scale-110 shadow-lg ring-2 ring-white dark:ring-black' : 'opacity-80 hover:scale-105 hover:opacity-100'}`}
              >
                <Image
                  width={500}
                  height={500}
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
