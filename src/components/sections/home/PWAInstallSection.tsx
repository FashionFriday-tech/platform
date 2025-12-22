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
  Star,
} from "lucide-react";
import { Iphone } from "@/components/ui/magicUi/iphone";

function usePWAInstall() {
  const [promptInstall, setPromptInstall] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()));

    const handler = (e: any) => {
      e.preventDefault();
      setPromptInstall(e);
    };

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = () => {
    if (promptInstall) promptInstall.prompt();
    else setShowInstructions(true);
  };

  return { isInstalled, install, showInstructions, setShowInstructions, isIOS };
}

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
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function PWAInstallSection() {
  const {
    isInstalled,
    install,
    showInstructions,
    setShowInstructions,
    isIOS,
  } = usePWAInstall();

  return (
    <section className="relative w-full text-neutral-900 overflow-hidden font-sans py-16 sm:py-20">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 md:gap-24">
        {/* iPhone Mockup */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="order-1 flex justify-center md:justify-end w-full md:w-1/2"
        >
          <Iphone
            className="lg:w-70 shadow-2xl rounded-4xl"
            src="images/model/ff-app.png"
          />
        </motion.div>

        {/* Info Column */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="order-2 flex flex-col w-full md:w-1/2 text-left gap-6"
        >
          {/* Badge */}
          <motion.span
            variants={fadeInUp}
            className="w-45 px-3 py-1 bg-neutral-100 border border-neutral-200 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 inline-block"
          >
            Progressive Web App
          </motion.span>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter leading-[1.1]"
          >
            The Vault <br />
            <span className="text-neutral-400">On Your Homescreen.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="text-neutral-500 text-sm md:text-base font-medium leading-relaxed max-w-md"
          >
            Experience the store like a native app. Get instant notifications
            for drops, smoother navigation, offline access, and exclusive "First
            Copy" access.
          </motion.p>

          {/* Feature Points */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wide">
                  Zero Latency
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Faster load times than browser. Instant checkout.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-black" />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wide">
                  Privacy & Security
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Direct install, no app store trace, fully secure transactions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-black" />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wide">
                  Encrypted & Verified
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  All data encrypted. Trusted by thousands of customers.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action / Install */}
          <motion.div variants={fadeInUp} className="mt-2 w-full max-w-sm">
            <AnimatePresence>
              {showInstructions && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                  className="overflow-hidden mb-4"
                >
                  <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-xl text-sm relative">
                    <button
                      onClick={() => setShowInstructions(false)}
                      className="absolute top-3 right-3 text-neutral-400 hover:text-black"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <h5 className="font-bold mb-3 flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />{" "}
                      {isIOS ? "iOS Installation" : "Android Installation"}
                    </h5>
                    {isIOS ? (
                      <ol className="space-y-2 text-neutral-600 text-xs font-medium list-decimal pl-4">
                        <li>
                          Tap the <Share className="inline w-3 h-3 mx-1" />{" "}
                          Share button.
                        </li>
                        <li>
                          Select <b>"Add to Home Screen"</b>.
                        </li>
                        <li>
                          Tap <b>Add</b> in the top right corner.
                        </li>
                      </ol>
                    ) : (
                      <ol className="space-y-2 text-neutral-600 text-xs font-medium list-decimal pl-4">
                        <li>Tap the browser menu (three dots).</li>
                        <li>
                          Select <b>"Install App"</b> or{" "}
                          <b>"Add to Home Screen"</b>.
                        </li>
                      </ol>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <button
                onClick={install}
                disabled={isInstalled}
                className="group w-full h-14 bg-black text-white rounded-full flex items-center justify-between px-4 pl-6 hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-lg shadow-black/10"
              >
                <span className="text-sm font-bold tracking-wide">
                  {isInstalled ? "OPEN APP" : "ADD TO HOME SCREEN"}
                </span>
                <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center transition-transform">
                  {isInstalled ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                </div>
              </button>
              <div className="mt-3 text-center flex flex-col sm:flex-row items-center justify-center gap-3 text-[10px] text-neutral-400 font-medium uppercase tracking-widest">
                <span>10k+ Downloads</span>

                <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-neutral-300" />

                <span className="flex items-center gap-1">
                  <span>4.5/5</span>
                  <span className="flex gap-0.5">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <Star className="w-3 h-3 text-yellow-400" />
                    <Star className="w-3 h-3 text-yellow-400" />
                    <Star className="w-3 h-3 text-yellow-400" />
                    <Star className="w-3 h-3 text-yellow-400/50" />{" "}
                  </span>
                </span>
              </div>
            </div>

            {!isInstalled && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-[10px] text-neutral-400 font-medium uppercase tracking-widest mt-2">
                <span>Powered by PWA</span>
                <span className="w-1 h-1 rounded-full bg-neutral-300 hidden sm:inline-block" />
                <span>2MB Size</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
