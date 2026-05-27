'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

import {
  AppleLogoIcon,
  CloseIcon,
  DownloadIcon,
  DownloadIconIOS,
  LockIcon,
  ShareIcon,
  ShieldIcon,
  ZapIcon,
} from '@ff/ui';
import { AnimatePresence, motion, type Variants } from 'motion/react';

import { Iphone } from '@/components/ui/magicUi/iphone';

// --- Types ---

/**
 * The BeforeInstallPromptEvent is an experimental browser API.
 * We define it here to avoid 'any' and fix unsafe member access errors.
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Augment the global Navigator type for iOS-specific standalone checks
declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

const FEATURES = [
  {
    icon: DownloadIcon,
    title: 'Fast Download',
    desc: 'Optimized assets for quick installs.',
  },
  {
    icon: ZapIcon,
    title: 'Zero Latency',
    desc: 'Instant loads and checkout.',
  },
  {
    icon: ShieldIcon,
    title: 'Privacy & Security',
    desc: 'No app store. No tracking.',
  },
  {
    icon: LockIcon,
    title: 'Encrypted & Verified',
    desc: 'Trusted by thousands.',
  },
];

/* ---------------- PWA Hook ---------------- */

function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // FIX: Lazy initial state calculation.
  // This avoids calling setState inside useEffect, preventing cascading renders.
  const [isIOS] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    const ua = window.navigator.userAgent.toLowerCase();
    const isIPadPro = ua.includes('macintosh') && navigator.maxTouchPoints > 1;
    return /iphone|ipad|ipod/.test(ua) || isIPadPro;
  });

  useEffect(() => {
    // Detect if already installed / running in standalone mode
    const checkInstalledStatus = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

      if (isStandalone) {
        setIsInstalled(true);
      }
    };

    const beforeInstallHandler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const installedHandler = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    checkInstalledStatus();
    window.addEventListener('beforeinstallprompt', beforeInstallHandler);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallHandler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const install = useCallback(async () => {
    if (isInstalled) {
      window.location.href = '/';
      return;
    }

    // Android / Chrome / Edge flow
    if (deferredPrompt) {
      void deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
      return;
    }

    // iOS flow (Manual instructions needed)
    setShowInstructions(true);
  }, [deferredPrompt, isInstalled]);

  return {
    isInstalled,
    install,
    showInstructions,
    setShowInstructions,
    isIOS,
  };
}

/* ---------------- Animations ---------------- */

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeInUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ---------------- Component ---------------- */

export default function PWAInstallSection() {
  const { isInstalled, install, showInstructions, setShowInstructions } = usePWAInstall();

  // If the app is already installed, we don't need to show the installation prompt.
  if (isInstalled) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden pt-0 pb-16 sm:pt-0 sm:pb-20 bg-[#f5f1e6] dark:bg-[#f5f1e6] text-black dark:text-black">
      {/* Premium Banner Strip */}
      <div className="w-full bg-[#eae5d8] text-black py-7 mb-20 transition-colors">
        <div className="container mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          {/* Brand Logo Container */}
          <div className="relative h-[10vw] w-[10vw] max-h-16 max-w-16 sm:h-[6vw] sm:w-[6vw] lg:h-[4.5vw] lg:w-[4.5vw] overflow-hidden rounded-2xl bg-black p-[1.5vw] sm:p-[1vw] shadow-md flex items-center justify-center shrink-0">
            <Image
              src="/images/logos/ff-logo.png"
              alt="Fashion Friday"
              width={48}
              height={48}
              className="object-contain invert"
            />
          </div>
          {/* Banner Text with matching fluid viewport sizing */}
          <h2 className="text-center sm:text-left text-black font-black tracking-tighter uppercase leading-none text-[8.5vw] sm:text-[5vw] lg:text-[3.8vw]">
            It's Better On The Web App
          </h2>
        </div>
      </div>

      <div className="container mx-auto flex flex-col items-center gap-16 px-6 md:flex-row md:gap-24 md:px-12">
        {/* Visual: Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex w-full justify-center md:w-1/2"
        >
          <Iphone className="w-65 lg:w-65" src="/images/model/ff-app-product-page.webp" />
        </motion.div>

        {/* Content: Copy & Actions */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex w-full flex-col gap-6 md:w-1/2"
        >
          <motion.span
            variants={fadeInUp}
            className="flex w-fit items-center justify-center rounded-full border border-black/10 px-4 py-1 text-[10px] font-bold tracking-widest uppercase text-black dark:text-black"
          >
            <DownloadIcon className="mr-2 text-xl" /> Install our Web App
          </motion.span>

          <motion.h1 variants={fadeInUp} className="text-4xl font-semibold md:text-5xl text-black dark:text-black">
            Your Daily Drop <br />
            <span className="text-neutral-500">On Your Homescreen.</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-neutral-600 dark:text-neutral-600 max-w-md text-sm">
            Native-app experience. Faster loads, offline access, instant notifications and exclusive
            drops.
          </motion.p>

          {/* Features Grid */}
          <motion.div variants={fadeInUp} className="grid gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="flex gap-3 text-black dark:text-black">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase">{title}</h4>
                  <p className="text-neutral-600 dark:text-neutral-600 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Install CTA Container */}
          <motion.div variants={fadeInUp} className="max-w-sm">
            <AnimatePresence>
              {showInstructions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="relative mb-4 rounded-xl border p-4 text-sm"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowInstructions(false);
                    }}
                    className="absolute top-2 right-2 p-1 hover:opacity-70"
                    aria-label="Close instructions"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>

                  <h5 className="mb-2 flex items-center gap-2 font-bold">
                    <AppleLogoIcon className="h-4 w-4" />
                    iOS Installation
                  </h5>

                  <ol className="list-decimal space-y-1 pl-4 text-xs">
                    <li>
                      Tap <ShareIcon className="inline h-3 w-3" /> Share in Safari
                    </li>
                    <li>Select "Add to Home Screen"</li>
                    <li>Tap "Add" in the top right</li>
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => {
                void install();
              }}
              className="bg-foreground text-background flex w-full items-center justify-between rounded-full px-4 py-2 transition-transform active:scale-[0.98]"
            >
              <div className="flex items-center justify-center">
                <Image
                  src="/images/logos/ff-app-icon.png"
                  alt="FF App Icon"
                  width={32}
                  height={32}
                  className="mr-4 invert dark:invert-0"
                />
                <span className="text-sm font-bold tracking-tight">FASHION FRIDAY</span>
              </div>
              <div className="bg-background text-foreground flex items-center justify-center rounded-full px-6 py-2">
                <span className="flex items-center justify-center gap-2 text-sm font-bold">
                  Install
                  <DownloadIconIOS />
                </span>
              </div>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
