"use client";

import Link from "next/link";
import { helpSections } from "./constants";
import {
  ArrowUpRightIcon,
  MessageIcon,
  PhoneIcon,
  MailIcon,
  ArrowDownIconIOS,
} from "@ff/ui";

export default function HelpHub() {
  const handleEmailClick = () => {
    const email = "help@fashionfriday.in";
    const subject = "Support Request";

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(
        subject
      )}`;
    } else {
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(
          subject
        )}`,
        "_blank"
      );
    }
  };

  return (
    <div className="animate-in fade-in duration-1000">
      {/* 1. HERO SECTION */}
      <section className="h-screen flex justify-center items-center px-6">
        <div className="max-w-7xl mx-auto text-center flex flex-col gap-6 pb-32 md:pb-0">
          <h2 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] italic">
            How can we <span className="text-foreground-subtle">Help You?</span>
          </h2>
          <p className="text-sm md:text-xl text-foreground-muted max-w-xl mx-auto">
            Our support team and resources are available 24/7 to ensure your
            experience is seamless.
          </p>
        </div>

        <div className="absolute bottom-30 md:bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDownIconIOS size={32} className="text-foreground-muted" />
        </div>
      </section>

      {/* 2. LIVE SUPPORT GRID (WhatsApp & Chat) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-auto md:h-64 mb-10">
        <a
          href="https://wa.me/+917558969093"
          className="group p-12 flex items-center justify-between hover:bg-[#25D366] transition-all duration-500 rounded-4xl border border-border"
        >
          <div className="flex items-center gap-6">
            <div className="p-4 bg-background-muted rounded-full group-hover:bg-white/20">
              <MessageIcon className="group-hover:text-white" size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase group-hover:text-white">
                WhatsApp Support
              </h3>
              <p className="text-foreground-muted group-hover:text-white/80">
                Average response: 24h
              </p>
            </div>
          </div>
          <ArrowUpRightIcon className="group-hover:text-white" size={32} />
        </a>
        <a
          href="tel:+91 7558969093"
          className="group p-12 flex items-center justify-between hover:bg-[#2576d3] transition-all duration-500 rounded-4xl border border-border"
        >
          {" "}
          <div className="flex items-center gap-6">
            <div className="p-4 bg-background-muted rounded-full group-hover:bg-white/20">
              <PhoneIcon className="group-hover:text-white" size={32} />
            </div>
            <div className="text-start">
              <h3 className="text-3xl font-black uppercase group-hover:text-white">
                Live Call Support
              </h3>
              <p className="text-foreground-muted group-hover:text-white/80">
                Available Mon-Fri
              </p>
            </div>
          </div>
          <ArrowUpRightIcon className="group-hover:text-white" size={32} />
        </a>
        <button
          onClick={handleEmailClick}
          className="group p-12 flex items-center text-start justify-between hover:bg-[#d32525] transition-all duration-500 rounded-4xl border border-border w-full"
        >
          <div className="flex items-center gap-6">
            <div className="p-4 bg-background-muted rounded-full group-hover:bg-white/20">
              <MailIcon className="group-hover:text-white" size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase group-hover:text-white">
                Email Support
              </h3>
              <p className="text-foreground-muted group-hover:text-white/80">
                Average response: 48h
              </p>
            </div>
          </div>
          <ArrowUpRightIcon className="group-hover:text-white" size={32} />
        </button>
      </section>

      {/* 3. POLICY GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-20">
        {helpSections.map((item, index) => (
          <Link
            key={item.id}
            href={item.href}
            className={`group relative p-12 aspect-3/2 flex flex-col justify-between border-y lg:border-x border-border transition-all duration-700 hover:bg-foreground rounded-4xl
            `}
          >
            <div className="flex justify-between items-start">
              <div className="p-4 bg-background-muted rounded-2xl group-hover:bg-background group-hover:text-foreground">
                <item.icon />
              </div>
              <ArrowUpRightIcon className="md:opacity-0 group-hover:opacity-100 transition-all text-foreground md:text-background" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand mb-2 italic">
                Ref. FF-0{index + 1}
              </p>
              <h3 className="text-4xl font-black uppercase tracking-tighter group-hover:text-background leading-none transition-colors">
                {item.label}
              </h3>
              <p className="text-sm text-foreground-subtle mt-2 group-hover:text-background/60 transition-colors">
                {item.tagline}
              </p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
