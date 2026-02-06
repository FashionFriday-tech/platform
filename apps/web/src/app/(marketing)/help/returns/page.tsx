"use client";
import React from "react";
import {
  NavigationIcon,
  CameraIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  HistoryIcon,
  InfoIcon,
  ExternalLinkIcon,
} from "@ff/ui";
import { returnsData } from "@/data/returns";

export default function ReturnsRefundsPage() {
  return (
    <div className="bg-[#050505] text-[#f0f0f0] min-h-screen pb-32 selection:bg-brand selection:text-black font-sans uppercase">
      {/* 1. HEADER & TRUST STATEMENT */}
      <header className="pt-32 pb-20 px-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 w-fit">
          <NavigationIcon size={12} className="text-brand" />
          <span className="text-[10px] font-black tracking-[0.4em] text-brand">
            Support / Settlement Protocol
          </span>
        </div>
        <h1 className="text-7xl md:text-[9vw] font-black uppercase italic tracking-tighter leading-[0.8] mb-8">
          Returns & <br /> <span className="opacity-10">Refund.</span>
        </h1>
        <p className="max-w-2xl text-[11px] font-bold leading-relaxed opacity-40 tracking-widest italic lowercase">
          We prioritize fairness. Our policy is designed to protect genuine
          fashion enthusiasts while maintaining operational sustainability.
        </p>
      </header>

      {/* 2. THE REFUND FLOW DIAGRAM */}
      <section className="max-w-7xl mx-auto px-6 mt-12 mb-20">
        <div className="bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-10 md:p-16">
          <h3 className="text-[10px] font-black tracking-[0.5em] opacity-30 mb-12 text-center uppercase">
            Automated Wallet Credit Flow
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
            {[
              {
                title: "Initiation",
                desc: "Request via Orders page with unboxing proof.",
              },
              {
                title: "Validation",
                desc: "48-hour quality check at our central lab.",
              },
              {
                title: "Settlement",
                desc: "100% value added to your Architect Wallet.",
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <span className="text-4xl font-black italic opacity-10 absolute -top-6 -left-4">
                  0{i + 1}
                </span>
                <h4 className="text-sm font-black mb-2 text-brand">
                  {step.title}
                </h4>
                <p className="text-[10px] font-bold opacity-40 leading-relaxed italic">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE POLICY BENTO GRID */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {returnsData.map((section: any) => {
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              className="group bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 hover:border-brand/20 transition-all duration-500"
            >
              <div className="flex flex-col h-full">
                <div className="mb-10 p-4 bg-white/5 w-fit rounded-2xl text-brand group-hover:bg-brand group-hover:text-black transition-all duration-500">
                  <Icon size={24} />
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
                  {section.title}
                </h3>
                <p className="text-xs opacity-40 uppercase font-bold leading-relaxed mb-10 max-w-xs">
                  {section.description}
                </p>
                <div className="space-y-4 mt-auto">
                  {section.points.map((point: string, idx: any) => (
                    <div key={idx} className="flex items-start gap-3">
                      <ArrowRightIcon
                        size={14}
                        className="text-brand shrink-0 mt-0.5"
                      />
                      <span className="text-[10px] font-black tracking-widest opacity-70 italic leading-relaxed">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* 4. THE UNBOXING MANDATE & COD SECURITY */}
      <section className="max-w-7xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-brand p-12 rounded-[4rem] text-black">
          <div className="flex items-center gap-4 mb-6">
            <CameraIcon size={32} />
            <h3 className="text-4xl font-black italic tracking-tighter">
              The Unboxing Mandate
            </h3>
          </div>
          <p className="text-[11px] font-black uppercase leading-relaxed mb-8">
            Strict Protocol: Claims for damage, missing items, or wrong products
            require a continuous, uncut 360° unboxing video. The video must
            start from the sealed package showing the label clearly. Without
            this, the system will automatically reject the claim.
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="bg-black text-white px-4 py-2 rounded-lg text-[9px] font-black">
              MANDATORY VIDEO
            </span>
            <span className="bg-black/10 border border-black/20 px-4 py-2 rounded-lg text-[9px] font-black tracking-widest">
              24H WINDOW
            </span>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 p-12 rounded-[4rem] flex flex-col justify-between">
          <HistoryIcon size={32} className="text-brand opacity-50" />
          <div>
            <h4 className="text-2xl font-black italic tracking-tighter mb-4 uppercase">
              Anti-Abuse Control
            </h4>
            <p className="text-[10px] font-bold opacity-40 leading-relaxed uppercase italic">
              Patterned returns or excessive RTOs will result in
              soft-blacklisting, restricting future orders to Prepaid-only
              status.
            </p>
          </div>
        </div>
      </section>

      {/* 5. COD SERVICE CHARGE DISCLOSURE */}
      <section className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white/5 border border-white/5 p-12 rounded-[4rem]">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="p-8 bg-white/5 rounded-full shrink-0">
              <InfoIcon size={40} className="text-brand" />
            </div>
            <div>
              <h3 className="text-3xl font-black italic tracking-tighter mb-4 uppercase">
                COD Security Disclosure
              </h3>
              <p className="text-[11px] font-bold opacity-50 leading-relaxed uppercase mb-4 max-w-3xl">
                The Cash-on-Delivery fee is an additional service charge
                mandated by our logistics partners for cash handling and
                high-risk insurance. This amount is paid in advance to filter
                legitimate intent and protect against fraudulent bookings.
              </p>
              <p className="text-[11px] font-black text-brand tracking-widest">
                THIS FEE IS NON-REFUNDABLE AND NON-ADJUSTABLE AGAINST THE
                PRODUCT VALUE.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HELP & ESCALATION */}
      <footer className="mt-24 px-6 max-w-7xl mx-auto text-center">
        <div className="py-20 border-t border-white/5">
          <h5 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 mb-10">
            Still Unresolved?
          </h5>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <button className="bg-white text-black px-12 py-5 rounded-2xl font-black text-[10px] tracking-widest hover:bg-brand transition-colors">
              CHAT WITH DISPUTE TEAM
            </button>
            <button className="border border-white/20 px-12 py-5 rounded-2xl font-black text-[10px] tracking-widest hover:bg-white/5 transition-colors">
              VIEW HELP CENTER
            </button>
          </div>
        </div>
        <p className="text-[9px] font-black opacity-20 tracking-[0.4em] mt-10 italic">
          Architect Settlement Framework // Version 2.0.26
        </p>
      </footer>
    </div>
  );
}
