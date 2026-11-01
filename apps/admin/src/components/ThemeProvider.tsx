'use client';

import * as React from 'react';
import type { ThemeProviderProps } from 'next-themes';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';

function ThemeColorWatcher({
  lightColor = '#ffffff',
  darkColor = '#0e0e0e',
}: {
  lightColor?: string;
  darkColor?: string;
}) {
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    if (!resolvedTheme || typeof document === 'undefined') return;
    const isDark = resolvedTheme === 'dark';
    const color = isDark ? darkColor : lightColor;

    // Update or insert theme-color meta tag for mobile browsers / PWA
    const metas = document.querySelectorAll('meta[name="theme-color"]');
    if (metas.length > 0) {
      metas.forEach((meta) => {
        meta.removeAttribute('media');
        meta.setAttribute('content', color);
      });
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      document.head.appendChild(meta);
    }

    // Update iOS status bar meta tag
    let appleMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!appleMeta) {
      appleMeta = document.createElement('meta');
      appleMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
      document.head.appendChild(appleMeta);
    }
    appleMeta.setAttribute('content', isDark ? 'black-translucent' : 'default');
  }, [resolvedTheme, lightColor, darkColor]);

  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeColorWatcher lightColor="#ffffff" darkColor="#0e0e0e" />
      {children}
    </NextThemesProvider>
  );
}
