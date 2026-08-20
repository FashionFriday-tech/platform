'use client';

import React, { useRef, useEffect } from 'react';
import { useInView } from 'motion/react';
import Image from 'next/image';

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
    <div ref={containerRef} className="w-full h-full relative bg-background-muted">
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
          className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
          loop
          muted
          playsInline
        />
      )}
    </div>
  );
}
