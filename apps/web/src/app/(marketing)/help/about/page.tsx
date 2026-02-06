import React from "react";
import {
  MoveRightIcon,
  ShieldCheckIcon,
  ZapIcon,
  StarIcon,
  ArrowUpRightIcon,
  GlobeIcon,
} from "@ff/ui";

// Note: Ensure you have framer-motion installed for the smoothest experience
// npm install framer-motion

export default function AboutPage() {
  return (
    <div className="bg-[#0a0a0a] text-white selection:bg-brand selection:text-black font-sans overflow-x-hidden">
      {/* 1. HERO: THE CINEMATIC STATEMENT */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-fixed bg-center bg-no-repeat transition-transform duration-3000 scale-110 hover:scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop')`,
            filter: "brightness(0.3) grayscale(0.5)",
          }}
        />

        {/* Abstract linear Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/40 to-[#0a0a0a]" />

        <div className="relative z-10 text-center px-4 max-w-6xl">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 border border-white/20 rounded-full bg-white/5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
            </span>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">
              Reclaiming the Indian Narrative
            </p>
          </div>

          <h1 className="text-7xl md:text-[12vw] font-black uppercase tracking-tighter leading-[0.85] text-white drop-shadow-2xl">
            Style <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand via-white to-brand-muted">
              Without Borders.
            </span>
          </h1>

          <p className="mt-12 text-lg md:text-xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
            Bridging the gap between{" "}
            <span className="text-white font-medium">
              Global Luxury Aesthetics
            </span>{" "}
            and{" "}
            <span className="text-white font-medium">India's Ambition.</span>
          </p>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
          <p className="text-[10px] uppercase tracking-[0.5em] vertical-text">
            Scroll
          </p>
          <div className="w-px h-12 bg-linear-to-b from-brand to-transparent" />
        </div>
      </section>

      {/* 2. THE CATALYST: STORY & TRUST */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 space-y-12">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
              The Mission <br />
              <span className="text-brand italic">Behind the Brand.</span>
            </h2>

            <div className="space-y-8 text-xl text-white/70 leading-relaxed font-light">
              <p className="border-l-4 border-brand pl-8 py-2">
                "It started with a realization: Why should the youth of India be
                mocked for their fashion sense just because global labels are
                priced out of reach? High fashion isn't a privilege—it's a form
                of self-expression."
              </p>

              <p>
                In 2020,{" "}
                <span className="text-white font-bold">Fashion Friday</span> was
                born out of a rebellion. We saw a nation rising digitally but
                left behind aesthetically. We decided to bridge that gap by
                sourcing the finest surplus and master-quality pieces that don't
                just look the part—they feel the part.
              </p>

              <p className="text-white">
                We aren't just selling clothes; we are providing the "Armor of
                Confidence" for the next generation of Indian creators,
                entrepreneurs, and dreamers to stand tall on the global stage.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-4/5 rounded-4xl overflow-hidden border border-white/10 relative group">
              <img
                src="/images/model/aj.png"
                className="w-full h-full object-cover grayscale transition-all duration-700 scale-125"
                alt="Founder Vision"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-brand font-black text-sm uppercase tracking-widest mb-2 italic">
                  Est. 2020
                </p>
                <p className="text-white text-lg font-medium leading-tight italic">
                  "Redefining what's possible for the Indian wardrobe."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST PILLARS (The "Why Us") */}
      <section className="bg-white text-black py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <ShieldCheckIcon size={40} className="text-brand-dark" />
              <h4 className="text-xl font-black uppercase tracking-tighter">
                Uncompromised Quality
              </h4>
              <p className="text-black/60 text-sm leading-relaxed">
                Every piece undergoes a rigorous 12-point quality check. If it’s
                not master-grade, it doesn’t make the cut.
              </p>
            </div>
            <div className="space-y-4">
              <GlobeIcon size={40} className="text-brand-dark" />
              <h4 className="text-xl font-black uppercase tracking-tighter">
                Global Trends
              </h4>
              <p className="text-black/60 text-sm leading-relaxed">
                We track runways from Tokyo to Paris, bringing the most relevant
                streetwear to India in real-time.
              </p>
            </div>
            <div className="space-y-4">
              <StarIcon size={40} className="text-brand-dark" />
              <h4 className="text-xl font-black uppercase tracking-tighter">
                10k+ Community
              </h4>
              <p className="text-black/60 text-sm leading-relaxed">
                More than customers, we are a brotherhood of style-conscious
                Indians across all 28 states.
              </p>
            </div>
            <div className="space-y-4">
              <ZapIcon size={40} className="text-brand-dark" />
              <h4 className="text-xl font-black uppercase tracking-tighter">
                Fastest Shipping
              </h4>
              <p className="text-black/60 text-sm leading-relaxed">
                Our logistics network ensures that whether you're in Mumbai or
                Mizoram, your style arrives fast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE PHILOSOPHY: FULL-WIDTH IMPACT */}
      <section className="relative py-40 bg-brand text-black overflow-hidden group">
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden select-none">
          <p className="text-[20vw] font-black uppercase leading-none whitespace-nowrap animate-pulse">
            EVERYDAY FRIDAY
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h3 className="text-5xl md:text-8xl font-[1000] uppercase tracking-[ -0.05em] leading-[0.9] mb-12">
            Why wait for <br />
            the weekend?
          </h3>
          <p className="text-xl md:text-3xl font-medium max-w-4xl mx-auto leading-tight italic">
            "We believe that looking like a million bucks shouldn't cost a
            million bucks. True confidence is the only luxury that matters, and
            we’ve made it accessible to everyone."
          </p>
        </div>
      </section>

      {/* 5. FUTURE ROADMAP: THE CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-6 py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-brand font-black uppercase tracking-[0.4em] text-xs">
              The Vision
            </span>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mt-6 leading-[0.85]">
              More than <br /> a Store.
            </h2>
            <p className="text-white/50 max-w-md mt-10 text-lg">
              We are evolving into India's premier fashion hub. From curated
              collections to original streetwear designs, we are building the
              future of Indian Gen-Z culture.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <button className="group relative overflow-hidden bg-white text-black px-12 py-8 rounded-2xl font-black uppercase tracking-widest text-xl transition-all hover:pr-16">
              <span className="relative z-10 flex items-center justify-between">
                Explore The Drop{" "}
                <ArrowUpRightIcon className="group-hover:rotate-45 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-brand translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>

            <button className="group border border-white/20 backdrop-blur-sm text-white px-12 py-8 rounded-2xl font-black uppercase tracking-widest text-xl hover:bg-white/10 transition-all">
              <span className="flex items-center justify-between">
                Join the Community{" "}
                <MoveRightIcon className="group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER MINI */}
      <footer className="py-10 border-t border-white/10 px-6 text-center pb-20">
        <p className="text-[10px] text-white/30 uppercase tracking-[1em]">
          Fashion Friday © 2026 / Defined in India
        </p>
      </footer>
    </div>
  );
}
