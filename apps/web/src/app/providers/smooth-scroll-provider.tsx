'use client';

import React, { useEffect } from 'react';

import Lenis from 'lenis';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable Lenis smooth scrolling on mobile/touch devices.
    // Native 120Hz momentum scrolling is far superior on phones and tablets,
    // and running Lenis touch interception causes mobile browsers (especially iOS Safari)
    // to detach position:fixed elements from the bottom of the viewport.
    const isTouchOrMobile =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

    if (isTouchOrMobile) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
    });

    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    let animId: number;
    function raf(time: number) {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }

    animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      delete (window as unknown as { lenis?: Lenis }).lenis;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
