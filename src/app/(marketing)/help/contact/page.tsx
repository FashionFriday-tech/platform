"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Users,
  Sparkles,
  Store,
  Handshake,
  SendHorizontal,
  ArrowUpRight,
  Instagram,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

interface InteractionCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag: string;
}

// CUSTOM SELECT WITH RADIO BUTTONS
const CustomSelect = ({
  options,
  label,
}: {
  options: string[];
  label: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative space-y-1" ref={dropdownRef}>
      <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-4">
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-full px-8 py-5 border border-border bg-background flex items-center justify-between cursor-pointer hover:border-brand transition-colors"
      >
        <span className="uppercase font-black tracking-widest text-[11px] select-none">
          {selected}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-background border border-border rounded-[2.5rem] shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
              className="flex items-center justify-between px-6 py-4 rounded-full uppercase font-black  text-sm hover:bg-background-muted cursor-pointer transition-colors group"
            >
              <span>{option}</span>
              {/* CUSTOM RADIO BUTTON */}
              <div
                className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === option ? "border-brand" : "border-border"
                }`}
              >
                {selected === option && (
                  <div className="h-2 w-2 rounded-full bg-brand animate-in zoom-in duration-300" />
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
    "Customer Support",
    "Influencer / Content Creator",
    "Brand / Seller Application",
    "Strategic Partner / Collab",
    "Press / Media",
  ];

  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-500 pb-20">
      {/* 1. SOFT HERO SECTION */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background-muted text-[10px] font-black uppercase tracking-[0.3em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
            </span>
            Direct Access Node
          </div>
          <h1 className="text-6xl md:text-[8vw] font-black uppercase tracking-[-0.04em] leading-[0.9] italic">
            Let's Build <br />
            <span className="text-foreground-subtle italic">The Future.</span>
          </h1>
          <p className="max-w-xl mx-auto text-foreground-muted text-lg font-medium italic">
            Whether you're looking for a fit, a partnership, or a platform to
            sell—you've reached the right coordinate.
          </p>
        </div>
      </section>

      {/* 2. THE CURVED INTERACTION TILES */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        <InteractionCard
          icon={<Sparkles size={24} />}
          title="Influencer"
          desc="Join our Ambassador Program"
          tag="Creators"
        />
        <InteractionCard
          icon={<Store size={24} />}
          title="Seller"
          desc="List your brand on our platform"
          tag="B2B"
        />
        <InteractionCard
          icon={<Handshake size={24} />}
          title="Partner"
          desc="Collaborations & Marketing"
          tag="Strategic"
        />
        <InteractionCard
          icon={<Users size={24} />}
          title="Support"
          desc="Order & Sizing Assistance"
          tag="Client"
        />
      </section>

      {/* 3. MULTI-PURPOSE DISPATCH CENTER */}
      <section className="max-w-7xl mx-auto">
        <div className="bg-background rounded-[4rem] border border-border relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
            {/* LEFT: INFO */}
            <div className="lg:col-span-5 space-y-12 p-10 md:p-20">
              <div className="space-y-6">
                <h2 className="text-5xl font-black uppercase tracking-tighter leading-none italic">
                  Drop us <br /> a note.
                </h2>
                <p className="text-foreground-muted leading-relaxed max-w-sm font-medium">
                  Select your inquiry type so we can route your message to the
                  correct department immediately.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="p-4 bg-background rounded-full border border-border group-hover:scale-110 transition-transform">
                    <Instagram size={20} />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest italic border-b border-brand">
                    @fashionfriday.in
                  </span>
                </div>
                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="p-4 bg-background rounded-full border border-border group-hover:scale-110 transition-transform">
                    <ArrowUpRight size={20} />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest italic border-b border-brand">
                    career@fashionfriday.com
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: THE FORM */}
            <div className="lg:col-span-7 bg-background rounded-[3rem] p-6 md:p-12 border border-border shadow-2xl shadow-black/5">
              <form className="space-y-8">
                <div className="space-y-1">
                  <CustomSelect
                    label="I am reaching out as a..."
                    options={inquiryOptions}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="FULL NAME"
                    className="w-full rounded-full px-8 py-5 border border-border focus:border-brand outline-none uppercase font-black tracking-widest text-[11px] bg-transparent"
                  />
                  <input
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    className="w-full rounded-full px-8 py-5 border border-border focus:border-brand outline-none uppercase font-black tracking-widest text-[11px] bg-transparent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-4">
                    Portfolio / Website Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="HTTPS://"
                    className="w-full rounded-full px-8 py-5 border border-border focus:border-brand outline-none uppercase font-black tracking-widest text-[11px] bg-transparent"
                  />
                </div>

                <textarea
                  rows={4}
                  placeholder="TELL US ABOUT YOUR VISION..."
                  className="w-full rounded-4xl px-8 py-6 border border-border focus:border-brand outline-none uppercase font-black tracking-widest text-[11px] resize-none bg-transparent"
                />

                <button className="w-full bg-brand text-brand-foreground py-6 rounded-full font-black uppercase tracking-[0.4em] text-[11px] hover:scale-[0.98] active:scale-[0.96] transition-all flex items-center justify-center gap-4">
                  Send Transmission <SendHorizontal size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER MINI */}
      <footer className="py-10 px-6 text-center pb-6">
        <p className="text-[10px] text-white/30 uppercase tracking-[1em]">
          Fashion Friday © 2026 / Defined in India
        </p>
      </footer>
    </div>
  );
}

function InteractionCard({ icon, title, desc, tag }: InteractionCardProps) {
  return (
    <div className="group p-8 bg-background border border-border rounded-[3rem] hover:bg-brand hover:text-brand-foreground transition-all duration-500 cursor-pointer relative overflow-hidden shadow-sm">
      <div className="absolute top-6 right-8 opacity-20 text-[10px] font-black uppercase tracking-widest">
        {tag}
      </div>
      <div className="space-y-12 relative z-10">
        <div className="p-4 bg-background-muted rounded-2xl w-fit group-hover:bg-brand-foreground group-hover:text-brand transition-colors border border-border">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-2">
            {title}{" "}
            <ChevronRight
              size={20}
              className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all"
            />
          </h3>
          <p className="text-xs font-medium opacity-60 leading-tight uppercase tracking-widest">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}
