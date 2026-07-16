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

    const checkIsInstalled = () => {
      if (typeof window === 'undefined') return false;

      // 1. Check local storage install persistence
      if (localStorage.getItem('ff_web_pwa_installed') === 'true') {
        return true;
      }

      // 2. Check standalone / fullscreen / minimal-ui display modes
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches ||
        window.matchMedia('(display-mode: window-controls-overlay)').matches ||
        ('standalone' in navigator && (navigator as unknown as { standalone: boolean }).standalone === true) ||
        document.referrer.includes('android-app://') ||
        window.location.search.includes('source=pwa');

      if (isStandaloneMode) {
        localStorage.setItem('ff_web_pwa_installed', 'true');
        return true;
      }

      return false;
    };

    const currentlyInstalled = checkIsInstalled();
    setIsInstalled(currentlyInstalled);

    // 3. Query getInstalledRelatedApps API if supported (Chromium / Edge / Android)
    if (typeof navigator !== 'undefined' && 'getInstalledRelatedApps' in navigator) {
      (navigator as unknown as { getInstalledRelatedApps: () => Promise<unknown[]> })
        .getInstalledRelatedApps()
        .then((apps) => {
          if (Array.isArray(apps) && apps.length > 0) {
            setIsInstalled(true);
            localStorage.setItem('ff_web_pwa_installed', 'true');
          }
        })
        .catch(() => {
          // Ignore unsupported / permission errors
        });
    }

    // Listen for display-mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        localStorage.setItem('ff_web_pwa_installed', 'true');
      }
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
      localStorage.setItem('ff_web_pwa_installed', 'true');
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
        localStorage.setItem('ff_web_pwa_installed', 'true');
      }
      return;
    }

    // iOS Safari or browser without direct prompt support
    const isIos =
      typeof navigator !== 'undefined' &&
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream: boolean }).MSStream;

    if (isIos) {
      toast.info('To install: Tap the Share button (⎋) in Safari, then select "Add to Home Screen" 📲', {
        duration: 6000,
      });
    } else {
      toast.info('To install: Click the install icon (⊕) in your browser address bar or menu.', {
        duration: 5000,
      });
    }
  };

  return {
    isMounted,
    isInstalled,
    canInstallPrompt: Boolean(deferredPrompt),
    install,
  };
}
