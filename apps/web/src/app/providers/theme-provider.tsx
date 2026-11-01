'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps, useTheme } from 'next-themes';

export function updateStatusThemeColor(isDark: boolean) {
  if (typeof document === 'undefined') return;
  const color = isDark ? '#000000' : '#ffffff';

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
}

function ThemeColorWatcher() {
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    if (!resolvedTheme) return;
    updateStatusThemeColor(resolvedTheme === 'dark');
  }, [resolvedTheme]);

  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeColorWatcher />
      {children}
    </NextThemesProvider>
  );
}
