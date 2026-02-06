"use client";
import React from "react";
import {
  ScaleIcon,
  ShieldCheckIcon,
  CameraIcon,
  TruckIcon,
  AlertTriangleIcon,
  UserCheckIcon,
  CreditCardIcon,
  BoxIcon,
  GavelIcon,
  GlobeIcon,
  LockIcon,
  RefreshCcwIcon,
  EyeIcon,
  MessageSquareIcon,
  InfoIcon,
} from "@ff/ui";

import { termsData } from "@/data/terms";

export default function MasterTermsPage() {
  return (
    <div className="bg-[#050505] text-[#f0f0f0] min-h-screen pb-32 selection:bg-brand selection:text-black font-sans">
      {/* 1. HEADER */}
      <header className="pt-24 pb-20 px-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 w-fit">
          <ScaleIcon size={12} className="text-brand" />
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-brand">
            Legal Framework
          </span>
        </div>
        <h1 className="text-6xl md:text-[9vw] font-black uppercase italic tracking-tighter leading-[0.8] mb-10">
          Terms <span className="opacity-50 italic">&</span> conditions
        </h1>
        <p className="max-w-2xl text-[11px] font-bold uppercase leading-relaxed opacity-40 tracking-widest italic">
          No fluff. No courtroom poetry. Just the standard protocol for a
          precision fashion exchange.
        </p>
      </header>

      {/* 2. BENTO GRID (1-9) */}
      <main className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {termsData.map((sector: any) => (
          <div
            key={sector.id}
            className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 hover:border-brand/30 transition-all duration-500"
          >
            <div className="mb-8 p-4 bg-white/5 w-fit rounded-2xl">
              <sector.icon />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4">
              {sector.title}
            </h3>
            <p className="text-[11px] font-medium opacity-50 leading-relaxed uppercase italic">
              {sector.content}
            </p>
          </div>
        ))}
      </main>

      {/* 3. LEGAL PROTECTION SECTIONS (10-15) */}
      <section className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white/5 rounded-[4rem] p-10 md:p-20 border border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-brand mb-4 flex items-center gap-2">
                <LockIcon size={14} /> 10. Intellectual Property
              </h4>
              <p className="text-[10px] opacity-40 font-bold uppercase leading-relaxed">
                All images, branding, and Fit Architect logic belong to us. No
                scraping or resale of assets is permitted.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-brand mb-4 flex items-center gap-2">
                <EyeIcon size={14} /> 11. Liability & Indemnity
              </h4>
              <p className="text-[10px] opacity-40 font-bold uppercase leading-relaxed">
                Liability is capped to order value. You agree to indemnify us
                against claims arising from your misuse of the platform.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-brand mb-4 flex items-center gap-2">
                <GlobeIcon size={14} /> 12. Jurisdiction & Law
              </h4>
              <p className="text-[10px] opacity-40 font-bold uppercase leading-relaxed">
                Governed by the laws of India. Any disputes will be settled in
                our registered city courts only.
              </p>
            </div>
          </div>

          <div className="space-y-8 flex flex-col justify-center bg-black/40 p-12 rounded-[3rem] border border-white/5">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
              Protocol <br /> Updates.
            </h3>
            <p className="text-[10px] opacity-40 font-bold uppercase leading-relaxed italic">
              13. Terms can be updated without notice. Continued use implies
              acceptance.
              <br />
              <br />
              14. Wear-and-tear is not a defect. <br />
              <br />
              15. Comfort perception is subjective and not a ground for return.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CONTACT INFO (16) */}
      <footer className="mt-24 px-6 max-w-7xl mx-auto text-center border-t border-white/5 pt-16">
        <div className="flex flex-col items-center gap-6">
          <MessageSquareIcon size={32} className="text-brand opacity-50" />
          <div className="space-y-2">
            <h5 className="text-xs font-black uppercase tracking-widest">
              16. Contact Protocol
            </h5>
            <p className="text-[10px] opacity-40 uppercase font-bold">
              Legal Business Name: [Your Company Name]
            </p>
            <p className="text-[10px] opacity-40 uppercase font-bold">
              Support: support@yourdomain.com
            </p>
          </div>
          <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-20 mt-10">
            © 2026 Architect Systems // All Protocols Active.
          </p>
        </div>
      </footer>
    </div>
  );
}
