'use client';
import React, { useEffect, useRef, useState } from 'react';

import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  HandshakeIcon,
  InstagramIcon,
  SendIcon,
  SparklesIcon,
  StoreIcon,
  UsersIcon,
} from '@ff/ui';

interface InteractionCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag: string;
}

// CUSTOM SELECT WITH RADIO BUTTONS
const CustomSelect = ({ options, label }: { options: string[]; label: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative space-y-1" ref={dropdownRef}>
      <label className="text-foreground-subtle ml-4 text-[10px] font-black uppercase tracking-widest">
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border-border bg-background hover:border-brand flex w-full cursor-pointer items-center justify-between rounded-full border px-8 py-5 transition-colors"
      >
        <span className="select-none text-[11px] font-black uppercase tracking-widest">
          {selected}
        </span>
        <ChevronDownIcon
          size={16}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {isOpen && (
        <div className="bg-background border-border animate-in fade-in zoom-in-95 absolute left-0 top-full z-50 mt-2 w-full rounded-[2.5rem] border p-2 shadow-2xl duration-200">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
              className="hover:bg-background-muted group flex cursor-pointer items-center justify-between rounded-full px-6 py-4 text-sm font-black uppercase transition-colors"
            >
              <span>{option}</span>
              {/* CUSTOM RADIO BUTTON */}
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all ${
                  selected === option ? 'border-brand' : 'border-border'
                }`}
              >
                {selected === option && (
                  <div className="bg-brand animate-in zoom-in h-2 w-2 rounded-full duration-300" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ContactPage() {
  const inquiryOptions = [
    'Customer Support',
    'Influencer / Content Creator',
    'Brand / Seller Application',
    'Strategic Partner / Collab',
    'Press / Media',
  ];

  return (
    <div className="bg-background text-foreground min-h-screen pb-20 transition-colors duration-500">
      {/* 1. SOFT HERO SECTION */}
      <section className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-7xl space-y-8 text-center">
          <div className="border-border bg-background-muted inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em]">
            <span className="relative flex h-2 w-2">
              <span className="bg-brand absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span className="bg-brand relative inline-flex h-2 w-2 rounded-full"></span>
            </span>
            Direct Access Node
          </div>
          <h1 className="text-6xl font-black uppercase italic leading-[0.9] tracking-[-0.04em] md:text-[8vw]">
            Let's Build <br />
            <span className="text-foreground-subtle italic">The Future.</span>
          </h1>
          <p className="text-foreground-muted mx-auto max-w-xl text-lg font-medium italic">
            Whether you're looking for a fit, a partnership, or a platform to sell—you've reached
            the right coordinate.
          </p>
        </div>
      </section>

      {/* 2. THE CURVED INTERACTION TILES */}
      <section className="mx-auto mb-32 grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-4">
        <InteractionCard
          icon={<SparklesIcon size={24} />}
          title="Influencer"
          desc="Join our Ambassador Program"
          tag="Creators"
        />
        <InteractionCard
          icon={<StoreIcon size={24} />}
          title="Seller"
          desc="List your brand on our platform"
          tag="B2B"
        />
        <InteractionCard
          icon={<HandshakeIcon size={24} />}
          title="Partner"
          desc="Collaborations & Marketing"
          tag="Strategic"
        />
        <InteractionCard
          icon={<UsersIcon size={24} />}
          title="Support"
          desc="Order & Sizing Assistance"
          tag="Client"
        />
      </section>

      {/* 3. MULTI-PURPOSE DISPATCH CENTER */}
      <section className="mx-auto max-w-7xl">
        <div className="bg-background border-border relative overflow-hidden rounded-[4rem] border">
          <div className="relative z-10 grid grid-cols-1 gap-16 lg:grid-cols-12">
            {/* LEFT: INFO */}
            <div className="space-y-12 p-10 md:p-20 lg:col-span-5">
              <div className="space-y-6">
                <h2 className="text-5xl font-black uppercase italic leading-none tracking-tighter">
                  Drop us <br /> a note.
                </h2>
                <p className="text-foreground-muted max-w-sm font-medium leading-relaxed">
                  Select your inquiry type so we can route your message to the correct department
                  immediately.
                </p>
              </div>

              <div className="space-y-8">
                <div className="group flex cursor-pointer items-center gap-6">
                  <div className="bg-background border-border rounded-full border p-4 transition-transform group-hover:scale-110">
                    <InstagramIcon size={20} />
                  </div>
                  <span className="border-brand border-b text-sm font-black uppercase italic tracking-widest">
                    @fashionfriday.in
                  </span>
                </div>
                <div className="group flex cursor-pointer items-center gap-6">
                  <div className="bg-background border-border rounded-full border p-4 transition-transform group-hover:scale-110">
                    <ArrowUpRightIcon size={20} />
                  </div>
                  <span className="border-brand border-b text-sm font-black uppercase italic tracking-widest">
                    career@fashionfriday.com
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: THE FORM */}
            <div className="bg-background border-border rounded-[3rem] border p-6 shadow-2xl shadow-black/5 md:p-12 lg:col-span-7">
              <form className="space-y-8">
                <div className="space-y-1">
                  <CustomSelect label="I am reaching out as a..." options={inquiryOptions} />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="FULL NAME"
                    className="border-border focus:border-brand w-full rounded-full border bg-transparent px-8 py-5 text-[11px] font-black uppercase tracking-widest outline-none"
                  />
                  <input
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    className="border-border focus:border-brand w-full rounded-full border bg-transparent px-8 py-5 text-[11px] font-black uppercase tracking-widest outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-foreground-subtle ml-4 text-[10px] font-black uppercase tracking-widest">
                    Portfolio / Website Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="HTTPS://"
                    className="border-border focus:border-brand w-full rounded-full border bg-transparent px-8 py-5 text-[11px] font-black uppercase tracking-widest outline-none"
                  />
                </div>

                <textarea
                  rows={4}
                  placeholder="TELL US ABOUT YOUR VISION..."
                  className="border-border focus:border-brand rounded-4xl w-full resize-none border bg-transparent px-8 py-6 text-[11px] font-black uppercase tracking-widest outline-none"
                />

                <button className="bg-brand text-brand-foreground flex w-full items-center justify-center gap-4 rounded-full py-6 text-[11px] font-black uppercase tracking-[0.4em] transition-all hover:scale-[0.98] active:scale-[0.96]">
                  Send Transmission <SendIcon size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER MINI */}
      <footer className="px-6 py-10 pb-6 text-center">
        <p className="text-[10px] uppercase tracking-[1em] text-white/30">
          Fashion Friday © 2026 / Defined in India
        </p>
      </footer>
    </div>
  );
}

function InteractionCard({ icon, title, desc, tag }: InteractionCardProps) {
  return (
    <div className="bg-background border-border hover:bg-brand hover:text-brand-foreground group relative cursor-pointer overflow-hidden rounded-[3rem] border p-8 shadow-sm transition-all duration-500">
      <div className="absolute right-8 top-6 text-[10px] font-black uppercase tracking-widest opacity-20">
        {tag}
      </div>
      <div className="relative z-10 space-y-12">
        <div className="bg-background-muted group-hover:bg-brand-foreground group-hover:text-brand border-border w-fit rounded-2xl border p-4 transition-colors">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-2xl font-black uppercase italic tracking-tighter">
            {title}{' '}
            <ChevronRightIcon
              size={20}
              className="-translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
            />
          </h3>
          <p className="text-xs font-medium uppercase leading-tight tracking-widest opacity-60">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}
