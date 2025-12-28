"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Download,
  Check,
  X,
  Share,
  Smartphone,
  Zap,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { Iphone } from "@/components/ui/magicUi/iphone";

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
      window.removeEventListener(
        "beforeinstallprompt",
        beforeInstallHandler
      );
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
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16 md:gap-24">

        {/* Phone */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <Iphone
            className="w-56 lg:w-72 shadow-2xl rounded-4xl"
            src="/images/model/ff-app.png"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full md:w-1/2 flex flex-col gap-6"
        >
          <motion.span
            variants={fadeInUp}
            className="px-4 py-1 border rounded-full text-[10px] tracking-widest uppercase font-bold w-fit"
          >
            Progressive Web App
          </motion.span>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-semibold leading-tight"
          >
            The Vault <br />
            <span className="text-neutral-400">On Your Homescreen.</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-neutral-500 max-w-md text-sm"
          >
            Native-app experience. Faster loads, offline access, instant
            notifications and exclusive drops.
          </motion.p>

          {/* Features */}
          <motion.div variants={fadeInUp} className="grid gap-4">
            {[Zap, ShieldCheck, Lock].map((Icon, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 rounded-full border flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase">
                    {i === 0
                      ? "Zero Latency"
                      : i === 1
                      ? "Privacy & Security"
                      : "Encrypted & Verified"}
                  </h4>
                  <p className="text-xs text-neutral-500">
                    {i === 0
                      ? "Instant loads and checkout."
                      : i === 1
                      ? "No app store. No tracking."
                      : "Trusted by thousands."}
                  </p>
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
                  className="mb-4 p-4 border rounded-xl text-sm relative"
                >
                  <button
                    onClick={() => setShowInstructions(false)}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <h5 className="font-bold flex items-center gap-2 mb-2">
                    <Smartphone className="w-4 h-4" />
                    iOS Installation
                  </h5>

                  <ol className="list-decimal pl-4 text-xs space-y-1">
                    <li>
                      Tap <Share className="inline w-3 h-3" /> Share
                    </li>
                    <li>Select Add to Home Screen</li>
                    <li>Tap Add</li>
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={install}
              className="w-full h-14 bg-black text-white rounded-full flex items-center justify-between px-6 active:scale-[0.98]"
            >
              <span className="text-sm font-bold">
                {isInstalled ? "OPEN APP" : "ADD TO HOME SCREEN"}
              </span>
              <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center">
                {isInstalled ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Download className="w-5 h-5" />
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
