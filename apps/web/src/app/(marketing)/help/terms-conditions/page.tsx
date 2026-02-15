'use client';
import React from 'react';
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
} from '@ff/ui';

import { termsData } from '@/data/terms';

export default function MasterTermsPage() {
  return (
    <div className="selection:bg-brand min-h-screen bg-[#050505] pb-32 font-sans text-[#f0f0f0] selection:text-black">
      {/* 1. HEADER */}
      <header className="mx-auto max-w-7xl border-b border-white/5 px-6 pt-24 pb-20">
        <div className="bg-brand/10 border-brand/20 mb-6 flex w-fit items-center gap-2 rounded-full border px-4 py-1.5">
          <ScaleIcon size={12} className="text-brand" />
          <span className="text-brand text-[9px] font-black tracking-[0.5em] uppercase">
            Legal Framework
          </span>
        </div>
        <h1 className="mb-10 text-6xl leading-[0.8] font-black tracking-tighter uppercase italic md:text-[9vw]">
          Terms <span className="italic opacity-50">&</span> conditions
        </h1>
        <p className="max-w-2xl text-[11px] leading-relaxed font-bold tracking-widest uppercase italic opacity-40">
          No fluff. No courtroom poetry. Just the standard protocol for a precision fashion
          exchange.
        </p>
      </header>

      {/* 2. BENTO GRID (1-9) */}
      <main className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
        {termsData.map((sector: any) => (
          <div
            key={sector.id}
            className="hover:border-brand/30 rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] p-10 transition-all duration-500"
          >
            <div className="mb-8 w-fit rounded-2xl bg-white/5 p-4">
              <sector.icon />
            </div>
            <h3 className="mb-4 text-xl font-black tracking-tighter uppercase italic">
              {sector.title}
            </h3>
            <p className="text-[11px] leading-relaxed font-medium uppercase italic opacity-50">
              {sector.content}
            </p>
          </div>
        ))}
      </main>

      {/* 3. LEGAL PROTECTION SECTIONS (10-15) */}
      <section className="mx-auto mt-6 max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-20 rounded-[4rem] border border-white/5 bg-white/5 p-10 md:p-20 lg:grid-cols-2">
          <div className="space-y-12">
            <div>
              <h4 className="text-brand mb-4 flex items-center gap-2 text-xs font-black tracking-widest uppercase">
                <LockIcon size={14} /> 10. Intellectual Property
              </h4>
              <p className="text-[10px] leading-relaxed font-bold uppercase opacity-40">
                All images, branding, and Fit Architect logic belong to us. No scraping or resale of
                assets is permitted.
              </p>
            </div>
            <div>
              <h4 className="text-brand mb-4 flex items-center gap-2 text-xs font-black tracking-widest uppercase">
                <EyeIcon size={14} /> 11. Liability & Indemnity
              </h4>
              <p className="text-[10px] leading-relaxed font-bold uppercase opacity-40">
                Liability is capped to order value. You agree to indemnify us against claims arising
                from your misuse of the platform.
              </p>
            </div>
            <div>
              <h4 className="text-brand mb-4 flex items-center gap-2 text-xs font-black tracking-widest uppercase">
                <GlobeIcon size={14} /> 12. Jurisdiction & Law
              </h4>
              <p className="text-[10px] leading-relaxed font-bold uppercase opacity-40">
                Governed by the laws of India. Any disputes will be settled in our registered city
                courts only.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-8 rounded-[3rem] border border-white/5 bg-black/40 p-12">
            <h3 className="text-3xl leading-none font-black tracking-tighter uppercase italic">
              Protocol <br /> Updates.
            </h3>
            <p className="text-[10px] leading-relaxed font-bold uppercase italic opacity-40">
              13. Terms can be updated without notice. Continued use implies acceptance.
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
      <footer className="mx-auto mt-24 max-w-7xl border-t border-white/5 px-6 pt-16 text-center">
        <div className="flex flex-col items-center gap-6">
          <MessageSquareIcon size={32} className="text-brand opacity-50" />
          <div className="space-y-2">
            <h5 className="text-xs font-black tracking-widest uppercase">16. Contact Protocol</h5>
            <p className="text-[10px] font-bold uppercase opacity-40">
              Legal Business Name: [Your Company Name]
            </p>
            <p className="text-[10px] font-bold uppercase opacity-40">
              Support: support@yourdomain.com
            </p>
          </div>
          <p className="mt-10 text-[8px] font-black tracking-[0.4em] uppercase opacity-20">
            © 2026 Architect Systems // All Protocols Active.
          </p>
        </div>
      </footer>
    </div>
  );
}
