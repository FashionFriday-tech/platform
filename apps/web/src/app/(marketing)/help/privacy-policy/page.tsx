'use client';
import React from 'react';

import {
  DatabaseIcon,
  EyeOffIcon,
  FileSearchIcon,
  GlobeIcon,
  LockIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
  TrashIcon,
  UserCheckIcon,
} from '@ff/ui';

const policyData = [
  {
    title: '01. Data Acquisition [The Input]',
    content:
      'We collect information necessary to calibrate your shopping experience. This includes Personal Identifiers (Name, Email, Shipping Protocol), Anatomical Data (Body/Foot measurements for the Fit Architect), and Technical Identifiers (IP Address, Browser Metadata, Cookie ID).',
    icon: <DatabaseIcon size={20} className="text-brand" />,
  },
  {
    title: '02. Logic Processing [Usage]',
    content:
      'Your data is utilized to: (A) Process transactions and logistics. (B) Calibrate size recommendations via our Neural Engine. (C) Execute security protocols to prevent fraudulent acquisitions. (D) Communicate system updates and drop alerts.',
    icon: <RefreshCcwIcon size={20} className="text-brand" />,
  },
  {
    title: '03. Encryption Standards [Security]',
    content:
      'All data exists behind a 256-bit AES encryption layer. Payment information is tokenized via Tier-1 PCI-DSS compliant gateways. We never store raw credit card digits on our internal servers.',
    icon: <LockIcon size={20} className="text-brand" />,
  },
  {
    title: '04. Third-Party Transmission',
    content:
      'Data is only transmitted to essential logistical partners (e.g., DHL, FedEx) and payment processors. We do not sell anatomical or behavioral data to third-party marketing aggregates.',
    icon: <GlobeIcon size={20} className="text-brand" />,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="selection:bg-brand min-h-screen bg-[#050505] pb-32 font-sans text-[#f0f0f0] selection:text-black">
      {/* 1. PROTOCOL HEADER */}
      <header className="mx-auto max-w-7xl px-6 pt-24 pb-16 text-center md:text-left">
        <div className="bg-brand/10 border-brand/20 mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 md:mx-0">
          <ShieldCheckIcon size={12} className="text-brand" />
          <span className="text-brand text-[9px] font-black tracking-[0.5em] uppercase">
            Security Standard v4.0.26
          </span>
        </div>
        <h1 className="mb-8 text-6xl leading-[0.8] font-black tracking-tighter uppercase italic md:text-[8vw]">
          Privacy <br /> <span className="italic opacity-10">Protocol.</span>
        </h1>
        <p className="max-w-xl text-[11px] leading-relaxed font-bold tracking-widest uppercase italic opacity-40">
          Last Updated: Jan 28, 2026. This document governs the data architecture of our ecosystem.
        </p>
      </header>

      {/* 2. MODULAR CONTENT GRID */}
      <main className="mx-auto max-w-7xl space-y-4 px-6">
        {policyData.map((section, idx) => (
          <div
            key={idx}
            className="hover:border-brand/30 rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] p-8 transition-all duration-500 md:p-12"
          >
            <div className="flex flex-col items-start gap-8 md:flex-row">
              <div className="shrink-0 rounded-2xl bg-white/5 p-4">{section.icon}</div>
              <div className="space-y-4">
                <h2 className="text-2xl font-black tracking-tighter uppercase italic">
                  {section.title}
                </h2>
                <p className="text-[13px] leading-relaxed font-medium tracking-tight uppercase opacity-50">
                  {section.content}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* 3. DETAILED RIGHTS SECTION (GDPR/CCPA) */}
        <div className="mt-12 rounded-[3.5rem] border border-white/5 bg-white/5 p-10 md:p-20">
          <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
            <div className="space-y-8">
              <h3 className="text-4xl leading-none font-black tracking-tighter uppercase italic">
                User <br /> Rights <br /> Archive.
              </h3>
              <p className="text-xs leading-loose font-bold tracking-widest uppercase opacity-40">
                Under global data protection laws, you possess the following rights regarding your
                digital footprint in our archive:
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  label: 'Right to Erasure',
                  desc: 'Request absolute deletion of your neural/anatomical data.',
                  icon: <TrashIcon size={16} />,
                },
                {
                  label: 'Right to Portability',
                  desc: 'Download a structured dump of your stored information.',
                  icon: <FileSearchIcon size={16} />,
                },
                {
                  label: 'Right to Rectification',
                  desc: 'Update inaccurate identifiers or measurement profiles.',
                  icon: <UserCheckIcon size={16} />,
                },
                {
                  label: 'Right to Object',
                  desc: 'Withdraw consent for specific automated processing logic.',
                  icon: <EyeOffIcon size={16} />,
                },
              ].map((right, i) => (
                <div
                  key={i}
                  className="hover:border-brand/20 flex items-start gap-4 rounded-3xl border border-white/5 bg-black/40 p-6 transition-colors"
                >
                  <div className="text-brand mt-1">{right.icon}</div>
                  <div>
                    <h4 className="mb-1 text-[11px] font-black tracking-widest uppercase">
                      {right.label}
                    </h4>
                    <p className="text-[10px] leading-tight font-medium uppercase italic opacity-40">
                      {right.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* 4. CONTACT FOOTER */}
      <footer className="mx-auto mt-24 max-w-5xl px-6">
        <div className="bg-brand relative space-y-8 overflow-hidden rounded-[4rem] p-12 text-center text-black md:p-24">
          <div className="relative z-10">
            <h2 className="text-5xl leading-[0.8] font-black tracking-tighter uppercase italic md:text-7xl">
              Data <br /> Security <br /> Desk.
            </h2>
            <p className="mx-auto mt-8 max-w-md text-xs font-bold uppercase italic opacity-70">
              If you have inquiries regarding our encryption methods or wish to trigger the Erasure
              Protocol, contact our Data Protection Officer.
            </p>
            <div className="mt-12 flex flex-col justify-center gap-4 md:flex-row">
              <button className="rounded-full bg-black px-10 py-5 text-[10px] font-black tracking-widest text-white uppercase transition-transform hover:scale-105">
                Email DPO: security@fashionfriday.in
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
