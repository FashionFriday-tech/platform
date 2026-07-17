'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

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

    // Capture standard install prompt on Chrome/Edge/Android
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for successful installation event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      toast.success('Fashion Friday App installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      }
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstalled(true);
      }
      return;
    }

    // iOS Safari or browser without direct prompt support
    const isIos =
      typeof navigator !== 'undefined' &&
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream: boolean }).MSStream;

    if (isIos) {
      toast.info(
        'To install: Tap the Share button (⎋) in Safari, then select "Add to Home Screen" 📲',
        {
          duration: 6000,
        },
      );
    } else {
      toast.info(
        'To install: Click the install icon (⊕ or ⬇) in your browser address bar or menu.',
        {
          duration: 5000,
        },
      );
    }
  };

  return {
    isMounted,
    isInstalled,
    canInstallPrompt: Boolean(deferredPrompt),
    install,
  };
}
