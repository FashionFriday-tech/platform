'use client';

import * as React from 'react';
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
  useTheme,
} from 'next-themes';

export function updateStatusThemeColor(isDark: boolean) {
  if (typeof document === 'undefined') {
    return;
  }
  const color = isDark ? '#000000' : '#ffffff';

  // 1. Force root elements' inline background & colorScheme so iOS Safari samples the right color
  if (document.documentElement) {
    document.documentElement.style.backgroundColor = color;
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }
  if (document.body) {
    document.body.style.backgroundColor = color;
    document.body.style.colorScheme = isDark ? 'dark' : 'light';
  }

  // 2. WebKit bug workaround: remove all existing theme-color meta tags completely
  // Calling setAttribute on existing tag does not trigger Safari status bar / toolbar repaint
  document.querySelectorAll('meta[name="theme-color"]').forEach((el) => {
    el.remove();
  });

  // 3. Create fresh theme-color meta tag
  const meta = document.createElement('meta');
  meta.setAttribute('name', 'theme-color');
  meta.setAttribute('content', color);
  document.head.appendChild(meta);

  // 4. Update iOS apple-mobile-web-app-status-bar-style
  document.querySelectorAll('meta[name="apple-mobile-web-app-status-bar-style"]').forEach((el) => {
    el.remove();
  });
  const appleMeta = document.createElement('meta');
  appleMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
  appleMeta.setAttribute('content', isDark ? 'black-translucent' : 'default');
  document.head.appendChild(appleMeta);
}

function ThemeColorWatcher() {
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    if (!resolvedTheme) {
      return;
    }
    updateStatusThemeColor(resolvedTheme === 'dark');
  }, [resolvedTheme]);

  React.useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    // MutationObserver catches theme class additions/removals synchronously
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      updateStatusThemeColor(isDark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

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
