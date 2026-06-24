'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

import { useInView } from 'motion/react';

interface PromoVideoProps {
  src: string;
}

export function PromoVideo({ src }: PromoVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });

  const isGif = src.toLowerCase().endsWith('.gif');

  useEffect(() => {
    if (!isGif && videoRef.current) {
      if (isInView) {
        videoRef.current.play().catch(() => {
          // Ignore autoplay errors
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInView, isGif]);

  return (
    <div ref={containerRef} className="bg-background-muted relative h-full w-full">
      {isGif ? (
        isInView && (
          <Image
            src={src}
            alt="Promotion"
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
        )
      ) : (
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          loop
          muted
          playsInline
        />
      )}
    </div>
  );
}
