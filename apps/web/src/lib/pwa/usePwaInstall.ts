'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<(prompt: BeforeInstallPromptEvent | null) => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    promptListeners.forEach((fn) => {
      fn(globalDeferredPrompt);
    });
  });

  window.addEventListener('appinstalled', () => {
    globalDeferredPrompt = null;
    promptListeners.forEach((fn) => {
      fn(null);
    });
    toast.success('Fashion Friday App installed successfully!');
  });
}

export type DevicePlatform = 'ios' | 'android' | 'desktop';

export function getDevicePlatform(): DevicePlatform {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'desktop';
  }

  const ua = navigator.userAgent.toLowerCase();
  const platformStr = (navigator.platform || '').toLowerCase();

  // 1. Android check (smartphones, tablets, Android webviews)
  if (ua.includes('android')) {
    return 'android';
  }

  // 2. Windows PC check
  if (ua.includes('windows') || platformStr.includes('win')) {
    return 'desktop';
  }

  // 3. Linux PC check (exclude Android)
  if (ua.includes('linux') && !ua.includes('android')) {
    return 'desktop';
  }

  // 4. iPhone & iPod
  if (/iphone|ipod/.test(ua)) {
    return 'ios';
  }

  // 5. iPad (legacy user agents)
  if (ua.includes('ipad')) {
    return 'ios';
  }

  // 6. Mac OS: distinguish real Mac laptop/desktop from iPadOS
  if (ua.includes('macintosh') || ua.includes('mac os') || platformStr.includes('mac')) {
    // iPadOS specifically has touch points AND standalone property in navigator
    const isIPad =
      'standalone' in navigator &&
      typeof navigator.maxTouchPoints === 'number' &&
      navigator.maxTouchPoints > 1;

    return isIPad ? 'ios' : 'desktop';
  }

  return 'desktop';
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    () => globalDeferredPrompt,
  );
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [platform, setPlatform] = useState<DevicePlatform>(() => getDevicePlatform());

  const isIos = platform === 'ios';
  const isAndroid = platform === 'android';
  const isDesktop = platform === 'desktop';

  useEffect(() => {
    setIsMounted(true);
    setPlatform(getDevicePlatform());

    const handlePromptChange = (prompt: BeforeInstallPromptEvent | null) => {
      setDeferredPrompt(prompt);
    };
    promptListeners.add(handlePromptChange);

    // Clean up any stale localStorage flag from previous versions
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('ff_web_pwa_installed');
      } catch {
        // Ignore storage access errors
      }
    }

    const checkIsInstalled = () => {
      if (typeof window === 'undefined') {
        return false;
      }

      // Check standalone / fullscreen / minimal-ui display modes
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches ||
        window.matchMedia('(display-mode: window-controls-overlay)').matches ||
        ('standalone' in navigator &&
          Boolean((navigator as unknown as { standalone?: boolean }).standalone)) ||
        document.referrer.includes('android-app://') ||
        window.location.search.includes('source=pwa');

      return isStandaloneMode;
    };

    setIsInstalled(checkIsInstalled());

    // Query getInstalledRelatedApps API if supported (Chromium / Edge / Android)
    if (typeof navigator !== 'undefined' && 'getInstalledRelatedApps' in navigator) {
      (navigator as unknown as { getInstalledRelatedApps: () => Promise<unknown[]> })
        .getInstalledRelatedApps()
        .then((apps) => {
          if (Array.isArray(apps)) {
            setIsInstalled(apps.length > 0 || checkIsInstalled());
          }
        })
        .catch(() => null);
    }

    // Listen for display-mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    }

    return () => {
      promptListeners.delete(handlePromptChange);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      }
    };
  }, []);

  const install = async (): Promise<boolean> => {
    const promptToUse = deferredPrompt ?? globalDeferredPrompt;
    if (promptToUse) {
      try {
        await promptToUse.prompt();
        const choice = await promptToUse.userChoice;
        if (choice.outcome === 'accepted') {
          globalDeferredPrompt = null;
          setDeferredPrompt(null);
          setIsInstalled(true);
          toast.success('Fashion Friday App installed successfully!');
        }
        return true;
      } catch (err) {
        console.error('Failed to trigger PWA install prompt:', err);
      }
    }

    if (isIos) {
      toast.info(
        'To install: Tap the Share button (⎋) in Safari, then select "Add to Home Screen" 📲',
        {
          duration: 6000,
        },
      );
    } else if (isAndroid) {
      toast.info(
        'To install: Tap the 3 dots menu (⋮) in Chrome, then select "Install app" or "Add to Home screen" 📲',
        {
          duration: 6000,
        },
      );
    } else {
      toast.info('To install: Click the install icon (⊕ or ⬇) in your browser address bar.', {
        duration: 5000,
      });
    }
    return false;
  };

  return {
    isMounted,
    isInstalled,
    canInstallPrompt: Boolean(deferredPrompt ?? globalDeferredPrompt),
    platform,
    isIos,
    isAndroid,
    isDesktop,
    install,
  };
}
