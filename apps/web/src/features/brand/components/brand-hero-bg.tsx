'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useInView } from 'motion/react';

interface BrandHeroBgProps {
  poster?: string | null;
  name: string;
}

export function BrandHeroBg({ poster, name }: BrandHeroBgProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });

  return (
    <div ref={ref} className="absolute inset-0 z-0">
      <style>
        {`
          @keyframes pan-x {
            0% { object-position: 0% 50%; }
            50% { object-position: 100% 50%; }
            100% { object-position: 0% 50%; }
          }
          @keyframes pan-y {
            0% { object-position: 50% 0%; }
            50% { object-position: 50% 100%; }
            100% { object-position: 50% 0%; }
          }
          .animate-hero-bg {
            animation: pan-x 60s ease-in-out infinite;
          }
          @media (min-width: 768px) {
            .animate-hero-bg {
              animation: pan-y 60s ease-in-out infinite;
            }
          }
        `}
      </style>
      <Image
        src={poster || '/images/bg-hero.png'}
        alt={name}
        fill
        className="object-cover opacity-80 animate-hero-bg"
        style={{ animationPlayState: isInView ? 'running' : 'paused' }}
        priority
      />
    </div>
  );
}
