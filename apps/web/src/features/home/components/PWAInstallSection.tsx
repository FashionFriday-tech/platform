"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  CloseIcon,
  ShareIcon,
  ZapIcon,
  ShieldIcon,
  LockIcon,
  DownloadIcon,
  AppleLogoIcon,
  DownloadIconIOS,
} from "@ff/ui";
import { Iphone } from "@/components/ui/magicUi/iphone";
import Image from "next/image";

const FEATURES = [
  {
    icon: DownloadIcon,
    title: "Fast Download",
    desc: "Optimized assets for quick installs.",
  },
  {
    icon: ZapIcon,
    title: "Zero Latency",
    desc: "Instant loads and checkout.",
  },
  {
    icon: ShieldIcon,
    title: "Privacy & Security",
    desc: "No app store. No tracking.",
  },
  {
    icon: LockIcon,
    title: "Encrypted & Verified",
    desc: "Trusted by thousands.",
  },
];

/* ---------------- PWA Hook ---------------- */

function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();

    const ios =
      /iphone|ipad|ipod/.test(ua) ||
      (navigator.platform === "MacIntel" &&
        (navigator as any).maxTouchPoints > 1);

    setIsIOS(ios);

    // Detect already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    const beforeInstallHandler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const installedHandler = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", beforeInstallHandler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallHandler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const install = async () => {
    if (isInstalled) {
      window.location.href = "/";
      return;
    }

    // Android / Desktop
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return;
    }

    // iOS fallback
    setShowInstructions(true);
  };

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
  const {
    isInstalled,
    install,
    showInstructions,
    setShowInstructions,
    isIOS,
  } = usePWAInstall();

  return (
    <>
      {isInstalled ? null : (
        <section className="relative w-full overflow-hidden py-16 sm:py-20">
          <div className="container mx-auto flex flex-col items-center gap-16 px-6 md:flex-row md:gap-24 md:px-12">
            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex w-full justify-center md:w-1/2"
            >
              <Iphone className="w-65 lg:w-65" src="/images/model/ff-app.png" />
            </motion.div>

            {/* Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex w-full flex-col gap-6 md:w-1/2"
            >
              <motion.span
                variants={fadeInUp}
                className="flex w-fit items-center justify-center rounded-full border px-4 py-1 text-[10px] font-bold tracking-widest uppercase"
              >
                <DownloadIcon className="mr-2 text-xl" /> Install our Web App
              </motion.span>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl font-semibold md:text-5xl"
              >
                Your Daily Drop <br />
                <span className="text-neutral-400">On Your Homescreen.</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-foreground-muted max-w-md text-sm"
              >
                Native-app experience. Faster loads, offline access, instant
                notifications and exclusive drops.
              </motion.p>

              {/* Features */}
              <motion.div variants={fadeInUp} className="grid gap-4">
                {FEATURES.map(({ icon: Icon, title, desc }, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold uppercase">{title}</h4>
                      <p className="text-foreground-muted text-xs">{desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Install CTA */}
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
                        onClick={() => setShowInstructions(false)}
                        className="absolute top-2 right-2"
                      >
                        <CloseIcon className="h-4 w-4" />
                      </button>

                      <h5 className="mb-2 flex items-center gap-2 font-bold">
                        <AppleLogoIcon className="h-4 w-4" />
                        iOS Installation
                      </h5>

                      <ol className="list-decimal space-y-1 pl-4 text-xs">
                        <li>
                          Tap <ShareIcon className="inline h-3 w-3" /> Share
                        </li>
                        <li>Select Add to Home Screen</li>
                        <li>Tap Add</li>
                      </ol>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={install}
                  className="bg-foreground text-background flex w-full items-center justify-between rounded-full px-4 py-2 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-center">
                    <Image
                      src="/images/logos/ff-app-icon.png"
                      alt="FF"
                      width={32}
                      height={32}
                      className="mr-4 invert dark:invert-0"
                    />
                    <span className="text-sm font-bold">
                      {isInstalled ? "OPEN APP" : "FASHION FRIDAY"}
                    </span>
                  </div>
                  <div className="bg-background text-forground text-foreground flex items-center justify-center rounded-full px-6 py-2">
                    {isInstalled ? (
                      <span>Open</span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Install
                        <DownloadIconIOS />
                      </span>
                    )}
                  </div>
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}
