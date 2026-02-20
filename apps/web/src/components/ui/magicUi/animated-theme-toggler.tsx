'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';

import { MoonIcon, SunIcon } from '@ff/ui';

import { cn } from '@/lib/utils';

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<'button'> {
  duration?: number;
}

export const AnimatedThemeToggler = ({
  className,
  duration = 500,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  const toggleTheme = useCallback(async () => {
    const isDark = resolvedTheme === 'dark';

    // Check if the browser supports View Transitions
    if (!buttonRef.current || !document.startViewTransition) {
      setTheme(isDark ? 'light' : 'dark');
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(isDark ? 'light' : 'dark');
      });
    }).ready;

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top),
    );

    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
      },
      {
        duration,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      },
    );
  }, [resolvedTheme, setTheme, duration]);

  // Prevent hydration mismatch by returning placeholder on server
  if (!mounted) {
    return <div className={cn('h-10 w-10', className)} />;
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      // FIX: Handle async promise safely to avoid @typescript-eslint/no-misused-promises
      onClick={() => {
        void toggleTheme();
      }}
      className={cn('hover:bg-secondary relative rounded-full p-2 transition-colors', className)}
      {...props}
    >
      {resolvedTheme === 'dark' ? (
        <SunIcon className="text-text-primary h-5 w-5" />
      ) : (
        <MoonIcon className="text-text-primary h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
