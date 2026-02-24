import React from 'react';
import Image from 'next/image';

import {
  ArrowUpRightIcon,
  GlobeIcon,
  MoveRightIcon,
  ShieldCheckIcon,
  StarIcon,
  ZapIcon,
} from '@ff/ui';

// Note: Ensure you have framer-motion installed for the smoothest experience
// npm install framer-motion

export default function AboutPage() {
  return (
    <div className="selection:bg-brand overflow-x-hidden bg-[#0a0a0a] font-sans text-white selection:text-black">
      {/* 1. HERO: THE CINEMATIC STATEMENT */}
      <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
        <div
          className="duration-3000 absolute inset-0 scale-110 bg-cover bg-fixed bg-center bg-no-repeat transition-transform hover:scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop')`,
            filter: 'brightness(0.3) grayscale(0.5)',
          }}
        />

        {/* Abstract linear Overlay */}
        <div className="bg-linear-to-b absolute inset-0 from-transparent via-black/40 to-[#0a0a0a]" />

        <div className="relative z-10 max-w-6xl px-4 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="bg-brand absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              <span className="bg-brand relative inline-flex h-2 w-2 rounded-full" />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">
              Reclaiming the Indian Narrative
            </p>
          </div>

          <h1 className="text-7xl font-black uppercase leading-[0.85] tracking-tighter text-white drop-shadow-2xl md:text-[12vw]">
            Style <br />
            <span className="from-brand to-brand-muted bg-linear-to-r via-white bg-clip-text text-transparent">
              Without Borders.
            </span>
          </h1>

          <p className="mx-auto mt-12 max-w-2xl text-lg font-light leading-relaxed text-white/60 md:text-xl">
            Bridging the gap between{' '}
            <span className="font-medium text-white">Global Luxury Aesthetics</span> and{' '}
            <span className="font-medium text-white">India's Ambition.</span>
          </p>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4 opacity-50">
          <p className="vertical-text text-[10px] uppercase tracking-[0.5em]">Scroll</p>
          <div className="from-brand bg-linear-to-b h-12 w-px to-transparent" />
        </div>
      </section>

      {/* 2. THE CATALYST: STORY & TRUST */}
      <section className="relative overflow-hidden px-6 py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-7">
            <h2 className="text-5xl font-black uppercase tracking-tighter md:text-7xl">
              The Mission <br />
              <span className="text-brand italic">Behind the Brand.</span>
            </h2>

            <div className="space-y-8 text-xl font-light leading-relaxed text-white/70">
              <p className="border-brand border-l-4 py-2 pl-8">
                "It started with a realization: Why should the youth of India be mocked for their
                fashion sense just because global labels are priced out of reach? High fashion isn't
                a privilege—it's a form of self-expression."
              </p>

              <p>
                In 2020, <span className="font-bold text-white">Fashion Friday</span> was born out
                of a rebellion. We saw a nation rising digitally but left behind aesthetically. We
                decided to bridge that gap by sourcing the finest surplus and master-quality pieces
                that don't just look the part—they feel the part.
              </p>

              <p className="text-white">
                We aren't just selling clothes; we are providing the "Armor of Confidence" for the
                next generation of Indian creators, entrepreneurs, and dreamers to stand tall on the
                global stage.
              </p>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="aspect-4/5 rounded-4xl group relative overflow-hidden border border-white/10">
              <div className="relative h-full w-full">
                <Image
                  src="/images/model/aj.png"
                  alt="Founder Vision"
                  fill
                  className="scale-125 object-cover grayscale transition-all duration-700"
                  sizes="100vw"
                />
              </div>
              <div className="bg-linear-to-t absolute inset-0 from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-brand mb-2 text-sm font-black uppercase italic tracking-widest">
                  Est. 2020
                </p>
                <p className="text-lg font-medium italic leading-tight text-white">
                  "Redefining what's possible for the Indian wardrobe."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST PILLARS (The "Why Us") */}
      <section className="bg-white px-6 py-24 text-black">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            <div className="space-y-4">
              <ShieldCheckIcon size={40} className="text-brand-dark" />
              <h4 className="text-xl font-black uppercase tracking-tighter">
                Uncompromised Quality
              </h4>
              <p className="text-sm leading-relaxed text-black/60">
                Every piece undergoes a rigorous 12-point quality check. If it’s not master-grade,
                it doesn’t make the cut.
              </p>
            </div>
            <div className="space-y-4">
              <GlobeIcon size={40} className="text-brand-dark" />
              <h4 className="text-xl font-black uppercase tracking-tighter">Global Trends</h4>
              <p className="text-sm leading-relaxed text-black/60">
                We track runways from Tokyo to Paris, bringing the most relevant streetwear to India
                in real-time.
              </p>
            </div>
            <div className="space-y-4">
              <StarIcon size={40} className="text-brand-dark" />
              <h4 className="text-xl font-black uppercase tracking-tighter">10k+ Community</h4>
              <p className="text-sm leading-relaxed text-black/60">
                More than customers, we are a brotherhood of style-conscious Indians across all 28
                states.
              </p>
            </div>
            <div className="space-y-4">
              <ZapIcon size={40} className="text-brand-dark" />
              <h4 className="text-xl font-black uppercase tracking-tighter">Fastest Shipping</h4>
              <p className="text-sm leading-relaxed text-black/60">
                Our logistics network ensures that whether you're in Mumbai or Mizoram, your style
                arrives fast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE PHILOSOPHY: FULL-WIDTH IMPACT */}
      <section className="bg-brand group relative overflow-hidden py-40 text-black">
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden opacity-10">
          <p className="animate-pulse whitespace-nowrap text-[20vw] font-black uppercase leading-none">
            EVERYDAY FRIDAY
          </p>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <h3 className="tracking-[ -0.05em] mb-12 text-5xl font-[1000] uppercase leading-[0.9] md:text-8xl">
            Why wait for <br />
            the weekend?
          </h3>
          <p className="mx-auto max-w-4xl text-xl font-medium italic leading-tight md:text-3xl">
            "We believe that looking like a million bucks shouldn't cost a million bucks. True
            confidence is the only luxury that matters, and we’ve made it accessible to everyone."
          </p>
        </div>
      </section>

      {/* 5. FUTURE ROADMAP: THE CALL TO ACTION */}
      <section className="mx-auto max-w-7xl px-6 py-40">
        <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
          <div>
            <span className="text-brand text-xs font-black uppercase tracking-[0.4em]">
              The Vision
            </span>
            <h2 className="mt-6 text-6xl font-black uppercase leading-[0.85] tracking-tighter md:text-8xl">
              More than <br /> a Store.
            </h2>
            <p className="mt-10 max-w-md text-lg text-white/50">
              We are evolving into India's premier fashion hub. From curated collections to original
              streetwear designs, we are building the future of Indian Gen-Z culture.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <button className="group relative overflow-hidden rounded-2xl bg-white px-12 py-8 text-xl font-black uppercase tracking-widest text-black transition-all hover:pr-16">
              <span className="relative z-10 flex items-center justify-between">
                Explore The Drop{' '}
                <ArrowUpRightIcon className="transition-transform group-hover:rotate-45" />
              </span>
              <div className="bg-brand absolute inset-0 translate-y-full transition-transform duration-500 group-hover:translate-y-0" />
            </button>

            <button className="group rounded-2xl border border-white/20 px-12 py-8 text-xl font-black uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:bg-white/10">
              <span className="flex items-center justify-between">
                Join the Community{' '}
                <MoveRightIcon className="transition-transform group-hover:translate-x-2" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER MINI */}
      <footer className="border-t border-white/10 px-6 py-10 pb-20 text-center">
        <p className="text-[10px] uppercase tracking-[1em] text-white/30">
          Fashion Friday © 2026 / Defined in India
        </p>
      </footer>
    </div>
  );
}
