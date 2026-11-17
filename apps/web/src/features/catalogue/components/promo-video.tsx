'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

import { useInView } from 'motion/react';

interface PromoVideoProps {
  src: string;
  mediaType?: string;
  title?: string;
}

export function PromoVideo({ src, mediaType, title = 'Special Promotion' }: PromoVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });

  const cleanSrc = src.split('?')[0].toLowerCase();
  const isVideo =
    mediaType === 'video' ||
    cleanSrc.endsWith('.mp4') ||
    cleanSrc.endsWith('.webm') ||
    cleanSrc.endsWith('.ogg') ||
    cleanSrc.endsWith('.mov');

  const isGif = cleanSrc.endsWith('.gif');

  useEffect(() => {
    if (isVideo && videoRef.current) {
      if (isInView) {
        videoRef.current.play().catch(() => {
          // Ignore autoplay errors
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInView, isVideo]);

  return (
    <div ref={containerRef} className="bg-background-muted relative h-full w-full">
      {isVideo ? (
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          loop
          muted
          playsInline
        />
      ) : (
        isInView && (
          <Image
            src={src}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={isGif}
          />
        )
      )}
    </div>
  );
}
