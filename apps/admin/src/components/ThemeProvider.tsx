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

  const applyColors = React.useCallback(
    (isDark: boolean) => {
      if (typeof document === 'undefined') return;
      const color = isDark ? darkColor : lightColor;

      if (document.documentElement) {
        document.documentElement.style.backgroundColor = color;
        document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
      }
      if (document.body) {
        document.body.style.backgroundColor = color;
        document.body.style.colorScheme = isDark ? 'dark' : 'light';
      }

      // WebKit bug workaround: remove all existing theme-color meta tags completely
      document.querySelectorAll('meta[name="theme-color"]').forEach((el) => el.remove());
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      meta.setAttribute('content', color);
      document.head.appendChild(meta);

      // Update iOS status bar meta tag
      document
        .querySelectorAll('meta[name="apple-mobile-web-app-status-bar-style"]')
        .forEach((el) => el.remove());
      const appleMeta = document.createElement('meta');
      appleMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
      appleMeta.setAttribute('content', isDark ? 'black-translucent' : 'default');
      document.head.appendChild(appleMeta);
    },
    [darkColor, lightColor],
  );

  React.useEffect(() => {
    if (!resolvedTheme) return;
    applyColors(resolvedTheme === 'dark');
  }, [resolvedTheme, applyColors]);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      applyColors(isDark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, [applyColors]);

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
