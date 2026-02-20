'use client';

import { type CSSProperties } from 'react';
import Image from 'next/image';

import { ShieldCheckIcon, TruckIcon, UsersIcon } from '@ff/ui';
import { motion } from 'framer-motion';

// --- Data ---

const features = [
  {
    id: '01',
    icon: ShieldCheckIcon,
    title: '100% Verified Sellers',
    desc: 'Zero tolerance for fakes. We only onboard top-rated, authentic sellers to ensure legitimacy.',
  },
  {
    id: '02',
    icon: UsersIcon,
    title: '1000+ Happy Customers',
    desc: 'Join the movement. Thousands of satisfied customers across India trusting us for their daily fits.',
  },
  {
    id: '03',
    icon: TruckIcon,
    title: 'Pan-India Shipping',
    desc: 'From Mumbai to Manipur, we deliver everywhere. Fast, trackable shipping to every pin code.',
  },
];

const reviewImages = [
  '/images/reviews/1.jpg',
  '/images/reviews/2.jpg',
  '/images/reviews/3.jpg',
  '/images/reviews/4.jpg',
  '/images/reviews/5.jpg',
  '/images/reviews/6.jpg',
  '/images/reviews/7.jpg',
  '/images/reviews/8.jpg',
  '/images/reviews/9.jpg',
  '/images/reviews/10.jpg',
];

// --- Interfaces ---

interface InfiniteColumnProps {
  images: string[];
  duration: number;
  reverse?: boolean;
}

// --- Components ---

const InfiniteColumn = ({ images, duration, reverse = false }: InfiniteColumnProps) => {
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
        className={`pause-on-hover flex cursor-pointer flex-col gap-4 ${
          reverse ? 'animate-scroll-down' : 'animate-scroll-up'
        }`}
        style={
          {
            '--duration': `${duration}s`,
          } as CSSProperties
        }
      >
        {loopImages.map((src, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 opacity-80 transition-all duration-300 hover:scale-[1.02] hover:border-white/30 hover:opacity-100 hover:shadow-2xl"
          >
            <Image
              src={src}
              alt={`Customer Review ${i}`}
              width={800}
              height={600}
              className="block h-auto w-full object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );
};

// --- Main Section ---
export default function SplitFeatureSection() {
  return (
    <section className="relative overflow-hidden font-sans">
      {/* <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url("/images/background/ff-x-sup.png")`,
        }}
      /> */}

      <div className="container mx-auto px-4 py-10 md:px-6 lg:px-8">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="relative z-10 flex flex-col justify-center py-20 lg:sticky lg:top-0 lg:h-screen lg:py-32">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="mb-6 text-5xl font-bold uppercase leading-[0.9] tracking-tighter md:text-7xl">
                Defined by <br />
                <span className="text-foreground-muted">Trust.</span>
              </h2>
              <p className="text-foreground-muted max-w-md text-lg leading-relaxed">
                Join over 1000+ happy customers across India. We don't just ship products; we
                deliver verified quality to every pin code in the country.
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
                  className="group flex cursor-default gap-6"
                >
                  <div className="border-forground relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border transition-colors duration-300">
                    <item.icon className="text-forground z-10 h-6 w-6 transition-colors duration-300" />
                    <div className="absolute inset-0 bg-white opacity-0 blur-xl transition-opacity duration-300" />
                  </div>
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-xl font-bold uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-foreground-muted max-w-sm text-sm leading-relaxed transition-colors duration-300">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="h-150 relative w-full overflow-hidden border-white/5 lg:h-screen lg:border-l">
            <div className="from-background via-blackground bg-linear-to-b pointer-events-none absolute left-0 right-0 top-0 z-20 h-24 to-transparent" />
            <div className="from-blackground via-background bg-linear-to-t pointer-events-none absolute -bottom-6 left-0 right-0 z-20 h-24 to-transparent" />

            <div className="grid h-full grid-cols-3 gap-3 p-4 lg:p-6">
              <div className="relative h-full overflow-hidden">
                <InfiniteColumn images={reviewImages.slice(0, 3)} duration={25} />
              </div>
              <div className="relative h-full overflow-hidden pt-24">
                <InfiniteColumn images={reviewImages.slice(3, 7)} duration={35} reverse={true} />
              </div>
              <div className="relative h-full overflow-hidden pt-12">
                <InfiniteColumn images={reviewImages.slice(7, 10)} duration={28} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
