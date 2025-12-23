"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, Users, RefreshCcw } from "lucide-react";
import { CSSProperties } from "react";

// --- Data ---

const features = [
  {
    id: "01",
    icon: ShieldCheck,
    title: "100% Verified Sellers",
    desc:
      "Zero tolerance for fakes. We only onboard top-rated, authentic sellers to ensure legitimacy.",
  },
  {
    id: "02",
    icon: Users,
    title: "1000+ Happy Customers",
    desc:
      "Join the movement. Thousands of satisfied customers across India trusting us for their daily fits.",
  },
  {
    id: "03",
    icon: Truck,
    title: "Pan-India Shipping",
    desc:
      "From Mumbai to Manipur, we deliver everywhere. Fast, trackable shipping to every pin code.",
  },
];

const reviewImages = [
  "/images/reviews/1.jpg",
  "/images/reviews/2.jpg",
  "/images/reviews/3.jpg",
  "/images/reviews/4.jpg",
  "/images/reviews/5.jpg",
  "/images/reviews/6.jpg",
  "/images/reviews/7.jpg",
  "/images/reviews/8.jpg",
  "/images/reviews/9.jpg",
  "/images/reviews/10.jpg",
];

// --- Interfaces ---

interface InfiniteColumnProps {
  images: string[];
  duration: number;
  reverse?: boolean;
}

// --- Components ---

const InfiniteColumn = ({
  images,
  duration,
  reverse = false,
}: InfiniteColumnProps) => {
  const loopImages = [...images, ...images, ...images];

  return (
    <>
      <style jsx global>{`
        @keyframes scrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        @keyframes scrollDown {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }

        .animate-scroll-up {
          animation: scrollUp var(--duration) linear infinite;
        }

        .animate-scroll-down {
          animation: scrollDown var(--duration) linear infinite;
        }

        /* The Important Fix: Force pause on hover */
        .pause-on-hover:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      <div
        className={`flex flex-col gap-4 pause-on-hover cursor-pointer ${
          reverse ? "animate-scroll-down" : "animate-scroll-up"
        }`}
        style={
          {
            "--duration": `${duration}s`,
          } as CSSProperties
        }
      >
        {loopImages.map((src, i) => (
          <div
            key={i}
            className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 transition-all duration-300 hover:scale-[1.02] hover:border-white/30 hover:shadow-2xl opacity-80 hover:opacity-100"
          >
            <img
              src={src}
              alt={`Customer Review ${i}`}
              className="w-full h-auto object-cover block"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-tr from-white/5 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>
    </>
  );
};

// --- Main Section ---
export default function SplitFeatureSection() {
  return (
    <section className="relative bg-[#050505] text-white overflow-hidden font-sans ">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* LEFT SIDE */}
          <div className="relative py-20 lg:py-32 flex flex-col justify-center lg:sticky lg:top-0 lg:h-screen z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-[0.9] mb-6">
                Defined by <br />
                <span className="text-neutral-500">Trust.</span>
              </h2>
              <p className="text-lg text-white/80 max-w-md leading-relaxed">
                Join over 1000+ happy customers across India. We don't just ship
                products; we deliver verified quality to every pin code in the
                country.
              </p>
            </motion.div>

            <div className="space-y-8">
              {features.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-6 group cursor-default"
                >
                  <div className="relative shrink-0 w-16 h-16 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden transition-colors duration-300 group-hover:bg-white group-hover:border-white">
                    <item.icon className="w-6 h-6 text-white transition-colors duration-300 group-hover:text-black z-10" />
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wide mb-2 flex items-center gap-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/50 font-medium leading-relaxed max-w-sm transition-colors duration-300 group-hover:text-white/80">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative h-150 lg:h-screen w-full overflow-hidden bg-[#050505] lg:border-l border-white/5">
            <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-[#050505] via-[#050505]/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#050505] via-[#050505]/80 to-transparent z-20 pointer-events-none" />

            <div className="grid grid-cols-3 gap-3 p-4 lg:p-6 h-full">
              <div className="h-full overflow-hidden relative">
                <InfiniteColumn
                  images={reviewImages.slice(0, 3)}
                  duration={25}
                />
              </div>
              <div className="h-full overflow-hidden relative pt-24">
                <InfiniteColumn
                  images={reviewImages.slice(3, 7)}
                  duration={35}
                  reverse={true}
                />
              </div>
              <div className="h-full overflow-hidden relative pt-12">
                <InfiniteColumn
                  images={reviewImages.slice(7, 10)}
                  duration={28}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
