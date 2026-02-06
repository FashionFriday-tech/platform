"use client";
import React from "react";
import { shippingData } from "@/data/shipping";
import {
  NavigationIcon,
  LifeBuoyIcon,
  AlertTriangleIcon,
  CameraIcon,
} from "@ff/ui";

export default function ShippingDeliveryPage() {
  return (
    <div className="bg-[#050505] text-[#f0f0f0] min-h-screen pb-32 selection:bg-brand selection:text-black font-sans">
      {/* 1. MINIMALIST HEADER */}
      <header className="pt-32 pb-20 px-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 w-fit">
          <NavigationIcon size={12} className="text-brand" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand">
            Support / Logistics Protocol
          </span>
        </div>
        <h1 className="text-7xl md:text-[9vw] font-black uppercase italic tracking-tighter leading-[0.8] mb-8">
          Shipping & <br /> <span className="opacity-10">Delivery.</span>
        </h1>
        <p className="max-w-2xl text-[11px] font-bold uppercase leading-relaxed opacity-40 tracking-widest italic">
          Transparent transit. No promises, only ranges. We provide the gear;
          our logistics partners provide the speed.
        </p>
      </header>

      {/* 2. THE TRANSIT JOURNEY MAP */}
      <div className="max-w-7xl mx-auto px-6 mt-12 mb-20">
        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 mb-12 text-center">
            Standard Transit Lifecycle
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Dispatch", time: "24-48 Hours" },
              { label: "Metro", time: "2-4 Days" },
              { label: "Non-Metro", time: "5-7 Days" },
              { label: "Remote", time: "7-10 Days" },
            ].map((step, i) => (
              <div key={i} className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase text-brand mb-1 tracking-widest">
                  {step.label}
                </p>
                <p className="text-xl font-bold italic tracking-tighter opacity-80">
                  {step.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. CORE POLICY BENTO GRID */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {shippingData.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="group bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 hover:border-brand/20 transition-all duration-500"
            >
              <div className="flex flex-col h-full">
                <div className="mb-10 p-4 bg-white/5 w-fit rounded-2xl text-brand group-hover:bg-brand group-hover:text-black transition-all duration-500">
                  <Icon size={24} />
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
                  {item.title}
                </h3>
                <p className="text-xs opacity-40 uppercase font-bold leading-relaxed mb-10 max-w-xs">
                  {item.description}
                </p>
                <div className="space-y-4 mt-auto">
                  {item.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="h-1 w-1 bg-brand rounded-full shrink-0" />
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* FAILED DELIVERY & PROTECTION (CRITICAL RESOLUTION FLOW) */}
      <section className="max-w-7xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RTO Card */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-[3rem] p-12">
          <div className="flex items-center gap-4 mb-8">
            <AlertTriangleIcon className="text-brand" size={28} />
            <h3 className="text-3xl font-black italic tracking-tighter">
              Failed Delivery (RTO)
            </h3>
          </div>
          <div className="space-y-6 text-xs font-bold opacity-50 tracking-wide leading-relaxed">
            <p>
              1. COURIER ATTEMPTS: OUR PARTNERS WILL ATTEMPT DELIVERY A MAXIMUM
              OF 3 TIMES.
            </p>
            <p>
              2. NON-DELIVERY: IF THE CUSTOMER IS UNAVAILABLE OR THE ADDRESS IS
              INCORRECT, THE PACKAGE IS RETURNED TO ORIGIN (RTO).
            </p>
            <p>
              3. RE-SHIPPING: RESHIPPING AN RTO PACKAGE REQUIRES A SECOND
              SHIPPING FEE (₹150-₹200) PAYABLE IN ADVANCE.
            </p>
          </div>
        </div>

        {/* Protection Card */}
        <div className="bg-brand rounded-[3rem] p-12 text-black flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-8">
            <CameraIcon size={28} />
            <h3 className="text-3xl font-black italic tracking-tighter">
              Damaged Packages
            </h3>
          </div>
          <p className="text-[11px] font-black leading-relaxed mb-8 italic">
            MANDATORY: YOU MUST RECORD A CONTINUOUS, UNCUT 360° UNBOXING VIDEO
            STARTING FROM THE SEALED PACKAGE. WITHOUT THIS VIDEO, NO CLAIM FOR
            DAMAGE OR MISSING ITEMS WILL BE PROCESSED. REPORT WITHIN 24H.
          </p>
          <div className="flex gap-4">
            <div className="bg-black text-white px-6 py-3 rounded-xl text-[9px] font-black tracking-[0.2em]">
              VIDEO REQUIRED
            </div>
            <div className="bg-black/10 border border-black/20 px-6 py-3 rounded-xl text-[9px] font-black tracking-[0.2em]">
              24H WINDOW
            </div>
          </div>
        </div>
      </section>

      {/* ESCALATION HELP */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="border border-white/5 rounded-[4rem] p-12 md:p-20 flex flex-col items-center text-center">
          <LifeBuoyIcon size={48} className="text-brand mb-8 opacity-50" />
          <h2 className="text-5xl font-black italic tracking-tighter mb-6">
            Need Escalation?
          </h2>
          <p className="max-w-xl text-[10px] font-bold opacity-40 tracking-[0.2em] mb-12">
            ONLY CONTACT SUPPORT IF YOUR TRACKING HAS NOT UPDATED FOR 4+ DAYS OR
            THE ESTIMATED DELIVERY WINDOW HAS EXPIRED.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
            <button className="flex-1 bg-white text-black py-5 rounded-2xl font-black tracking-widest text-[10px] hover:bg-brand transition-colors">
              CHAT WITH LOGISTICS
            </button>
            <button className="flex-1 border border-white/20 py-5 rounded-2xl font-black tracking-widest text-[10px] hover:bg-white/5 transition-colors">
              VIEW ORDER STATUS
            </button>
          </div>
        </div>
      </section>

      {/* NAV FOOTER */}
      <nav className="mt-32 max-w-7xl mx-auto px-6 border-t border-white/5 pt-20 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex gap-10">
          <a
            href="/help/returns"
            className="text-[10px] font-black opacity-30 hover:opacity-100 hover:text-brand transition-all"
          >
            Returns Policy
          </a>
          <a
            href="/help/faq"
            className="text-[10px] font-black opacity-30 hover:opacity-100 hover:text-brand transition-all"
          >
            Common FAQ
          </a>
          <a
            href="/terms"
            className="text-[10px] font-black opacity-30 hover:opacity-100 hover:text-brand transition-all"
          >
            Full Terms
          </a>
        </div>
        <p className="text-[9px] font-black opacity-20 tracking-[0.4em]">
          ARCHITECT SYSTEMS // 2026 LOGISTICS
        </p>
      </nav>
    </div>
  );
}
