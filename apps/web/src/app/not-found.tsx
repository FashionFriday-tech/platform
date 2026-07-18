'use client';

import React, { useEffect, useState } from 'react';
import { Montserrat } from 'next/font/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ArrowLeftIcon } from '@ff/ui';

// Premium Sneaker & Streetwear Geometric Font (Nike / Supreme / Skater Aesthetic)
const streetwearFont = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
});

export default function NotFound() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main
      suppressHydrationWarning
      className="relative flex min-h-[calc(100vh-5rem)] w-full flex-col items-center justify-center overflow-hidden px-4 py-16"
    >
      {/* Background Monumental 404 Text with Premium Streetwear Font & Subtle Balanced Visibility */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
      >
        <span
          suppressHydrationWarning
          className={`${streetwearFont.className} bg-gradient-to-b from-zinc-400 via-zinc-300 to-zinc-200 bg-clip-text text-[60vw] leading-none font-semibold tracking-tight text-transparent sm:text-[50vw] md:text-[42vw] lg:text-[480px] dark:from-zinc-600 dark:via-zinc-700 dark:to-zinc-800`}
        >
          404
        </span>
      </div>

      {/* Foreground Center Content */}
      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        {/* Subtle Category Tag */}
        <p className="text-destructive mb-3 text-xs font-black tracking-[0.3em] uppercase">
          Seems Like You Are Lost
        </p>

        {/* Main Headline */}
        <h1
          suppressHydrationWarning
          className="text-foreground mb-4 text-3xl font-bold tracking-tight drop-shadow-md sm:text-5xl md:text-6xl"
        >
          Oops, the page was not found...
        </h1>

        {/* Dynamic Missing Page Path (hydrated safely on client only) */}
        {mounted && pathname && (
          <div className="border-border/60 bg-foreground/5 text-foreground-muted mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs">
            <span className="bg-destructive h-1.5 w-1.5 animate-pulse rounded-full" />
            <span className="max-w-[280px] truncate sm:max-w-md">{pathname}</span>
          </div>
        )}

        {/* Subtitle Message */}
        <p className="text-foreground-muted mb-8 max-w-md text-xs font-medium sm:text-sm">
          It looks like this page does not exist or has been removed from our catalog. Head back to
          the homepage to continue exploring.
        </p>

        {/* Single Go To Home Action Button */}
        <Link
          href="/"
          className="bg-foreground text-background inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-3.5 text-xs font-black tracking-wider uppercase shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Go To Home</span>
        </Link>
      </div>
    </main>
  );
}
