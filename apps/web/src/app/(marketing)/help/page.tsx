'use client';

import Link from 'next/link';

import { ArrowDownIconIOS, ArrowUpRightIcon, MailIcon, MessageIcon, PhoneIcon } from '@ff/ui';

import { helpSections } from './constants';

export default function HelpHub() {
  const handleEmailClick = () => {
    const email = 'help@fashionfriday.in';
    const subject = 'Support Request';

    const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    } else {
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}`,
        '_blank',
      );
    }
  };

  return (
    <div className="animate-in fade-in duration-1000">
      {/* 1. HERO SECTION */}
      <section className="flex h-screen items-center justify-center px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-32 text-center md:pb-0">
          <h2 className="text-7xl font-black uppercase italic leading-[0.8] tracking-tighter md:text-[10rem]">
            How can we <span className="text-foreground-subtle">Help You?</span>
          </h2>
          <p className="text-foreground-muted mx-auto max-w-xl text-sm md:text-xl">
            Our support team and resources are available 24/7 to ensure your experience is seamless.
          </p>
        </div>

        <div className="bottom-30 absolute left-1/2 -translate-x-1/2 transform animate-bounce md:bottom-20">
          <ArrowDownIconIOS size={32} className="text-foreground-muted" />
        </div>
      </section>

      {/* 2. LIVE SUPPORT GRID (WhatsApp & Chat) */}
      <section className="mb-10 grid h-auto grid-cols-1 gap-4 md:h-64 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="https://wa.me/+917558969093"
          className="border-border rounded-4xl group flex items-center justify-between border p-12 transition-all duration-500 hover:bg-[#25D366]"
        >
          <div className="flex items-center gap-6">
            <div className="bg-background-muted rounded-full p-4 group-hover:bg-white/20">
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
        </Link>
        <Link
          href="tel:+91 7558969093"
          className="border-border rounded-4xl group flex items-center justify-between border p-12 transition-all duration-500 hover:bg-[#2576d3]"
        >
          {' '}
          <div className="flex items-center gap-6">
            <div className="bg-background-muted rounded-full p-4 group-hover:bg-white/20">
              <PhoneIcon className="group-hover:text-white" size={32} />
            </div>
            <div className="text-start">
              <h3 className="text-3xl font-black uppercase group-hover:text-white">
                Live Call Support
              </h3>
              <p className="text-foreground-muted group-hover:text-white/80">Available Mon-Fri</p>
            </div>
          </div>
          <ArrowUpRightIcon className="group-hover:text-white" size={32} />
        </Link>
        <button
          onClick={handleEmailClick}
          className="border-border rounded-4xl group flex w-full items-center justify-between border p-12 text-start transition-all duration-500 hover:bg-[#d32525]"
        >
          <div className="flex items-center gap-6">
            <div className="bg-background-muted rounded-full p-4 group-hover:bg-white/20">
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
      <section className="mb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {helpSections.map((item, index) => (
          <Link
            key={item.id}
            href={item.href}
            className={`border-border hover:bg-foreground aspect-3/2 rounded-4xl group relative flex flex-col justify-between border-y p-12 transition-all duration-700 lg:border-x`}
          >
            <div className="flex items-start justify-between">
              <div className="bg-background-muted group-hover:bg-background group-hover:text-foreground rounded-2xl p-4">
                <item.icon />
              </div>
              <ArrowUpRightIcon className="text-foreground md:text-background transition-all group-hover:opacity-100 md:opacity-0" />
            </div>
            <div>
              <p className="text-brand mb-2 text-[10px] font-black uppercase italic tracking-widest">
                Ref. FF-0{index + 1}
              </p>
              <h3 className="group-hover:text-background text-4xl font-black uppercase leading-none tracking-tighter transition-colors">
                {item.label}
              </h3>
              <p className="text-foreground-subtle group-hover:text-background/60 mt-2 text-sm transition-colors">
                {item.tagline}
              </p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
