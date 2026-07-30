'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowUpIcon,
  ArrowUpRightIcon,
  CheckCircleIcon,
  ChevronUpIcon,
  FacebookIcon,
  InstagramIcon,
  LockIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
  TruckIcon,
  TwitterIcon,
  WhatsAppIcon,
  YoutubeIcon,
} from '@ff/ui';
import { toast } from 'sonner';

const TICKER_ITEMS = [
  'EXPRESS PAN-INDIA DISPATCH',
  '100% VERIFIED AUTHENTIC APPAREL',
  'EXCLUSIVE VAULT DROPS EVERY FRIDAY',
  'VERIFIED SUPPLIERS & SELLERS',
  '7-DAY HASSLE-FREE RETURNS',
  'ZERO FAKES TOLERANCE',
  '256-BIT ENCRYPTED CHECKOUT',
];

const TRUST_PILLARS = [
  {
    icon: ShieldCheckIcon,
    title: '100% VERIFIED AUTHENTIC',
    desc: 'Zero fake tolerance. Every garment & sneaker rigorously inspected.',
  },
  {
    icon: TruckIcon,
    title: 'EXPRESS PAN-INDIA DELIVERY',
    desc: 'Real-time tracked dispatch covering 19,000+ pin codes nationwide.',
  },
  {
    icon: LockIcon,
    title: 'MILITARY-GRADE ENCRYPTION',
    desc: 'PCI-DSS certified 256-bit SSL encrypted payment infrastructure.',
  },
  {
    icon: RefreshCcwIcon,
    title: '7-DAY EFFORTLESS RETURNS',
    desc: 'Instant doorstep pickup with seamless exchanges and refunds.',
  },
];

const FOOTER_COLUMNS = [
  {
    title: 'SHOP',
    links: [
      { name: 'New Arrivals', href: '/collections/new-arrivals' },
      { name: 'Best Sellers', href: '/collections/best-sellers' },
      { name: 'Men’s Essentials', href: '/category/men' },
      { name: 'Women’s Essentials', href: '/category/women' },
      { name: 'Sneakers & Kicks', href: '/collections/footwear' },
      { name: 'Streetwear & Hoodies', href: '/collections/apparel' },
      { name: 'Accessories', href: '/collections/accessories' },
      { name: 'Gift Cards', href: '/gift-cards' },
    ],
  },
  {
    title: 'ASSISTANCE',
    links: [
      { name: 'Track Order', href: '/account/orders' },
      { name: 'Returns & Exchange', href: '/help/returns' },
      { name: 'Shipping Matrix', href: '/help/shipping' },
      { name: 'Size Matrix & Guide', href: '/help/size-guide' },
      { name: 'Payment Options', href: '/help/payments' },
      { name: 'Help & FAQs', href: '/help/faq' },
      { name: 'Contact Concierge', href: '/help/contact' },
    ],
  },
  {
    title: 'THE LABEL',
    links: [
      { name: 'About Fashion Friday', href: '/help/about' },
      { name: 'The Authenticity Standard', href: '/help/about' },
      { name: 'Content Partners', href: '/#content-partners' },
      { name: 'Sustainability Mission', href: '/sustainability' },
      { name: 'Store Locator', href: '/store-locator' },
      { name: 'Careers & Culture', href: '/careers' },
    ],
  },
  {
    title: 'LEGAL',
    links: [
      { name: 'Privacy Policy', href: '/help/privacy-policy' },
      { name: 'Terms & Conditions', href: '/help/terms-conditions' },
      { name: 'Refund & Returns Policy', href: '/help/returns' },
      { name: 'Shipping Policy', href: '/help/shipping' },
      { name: 'Cookie Policy', href: '/cookie-policy' },
      { name: 'Legal Disclaimer', href: '/disclaimer' },
    ],
  },
];

// Brand colors for social icons
const SOCIAL_LINKS = [
  {
    icon: InstagramIcon,
    href: 'https://instagram.com/fashionfriday.in',
    label: 'Instagram',
    colorClass:
      'text-[#E1306C] border-[#E1306C]/40 hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C] hover:shadow-[0_0_15px_rgba(225,48,108,0.4)]',
  },
  {
    icon: WhatsAppIcon,
    href: 'https://wa.me/919995551234',
    label: 'WhatsApp',
    colorClass:
      'text-[#25D366] border-[#25D366]/40 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] hover:shadow-[0_0_15px_rgba(37,211,102,0.4)]',
  },
  {
    icon: YoutubeIcon,
    href: 'https://youtube.com/@fashionfriday',
    label: 'YouTube',
    colorClass:
      'text-[#FF0000] border-[#FF0000]/40 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]',
  },
  {
    icon: TwitterIcon,
    href: 'https://x.com/fashionfriday.in',
    label: 'X (Twitter)',
    colorClass:
      'text-white border-zinc-700 hover:bg-white hover:text-black hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]',
  },
  {
    icon: FacebookIcon,
    href: 'https://facebook.com/fashionfriday.in',
    label: 'Facebook',
    colorClass:
      'text-[#1877F2] border-[#1877F2]/40 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:shadow-[0_0_15px_rgba(24,119,242,0.4)]',
  },
];

// Clean SVGs for payment methods
function UpiLogo() {
  return (
    <svg viewBox="0 0 52 20" className="h-4.5 w-auto" aria-label="UPI">
      <path d="M12 2 L20 10 L12 18 L7 18 L15 10 L7 2 Z" fill="#00B050" />
      <path d="M18 2 L26 10 L18 18 L13 18 L21 10 L13 2 Z" fill="#FF7800" />
      <text
        x="29"
        y="15"
        fontFamily="system-ui, sans-serif"
        fontWeight="900"
        fontSize="12"
        fill="#FFFFFF"
      >
        UPI
      </text>
    </svg>
  );
}

function GPayLogo() {
  return (
    <svg viewBox="0 0 56 20" className="h-4.5 w-auto" aria-label="Google Pay">
      <path
        d="M11 10 C11 9.4 10.9 8.8 10.8 8.2 L5.5 8.2 L5.5 10.3 L8.6 10.3 C8.4 11.2 7.9 11.9 7.2 12.3 L7.2 14.1 L9.4 14.1 C10.7 12.9 11 11.2 11 10 Z"
        fill="#4285F4"
      />
      <path
        d="M5.5 15.5 C7 15.5 8.2 15 9.1 14.1 L6.9 12.3 C6.3 12.7 5.6 13 4.8 13 C3.3 13 2 12 1.6 10.7 L-0.6 10.7 L-0.6 12.4 C0.3 14.2 2.3 15.5 4.8 15.5 Z"
        transform="translate(0.6,-0.3)"
        fill="#34A853"
      />
      <path
        d="M2.2 10.4 C2.1 10 2 9.6 2 9.2 C2 8.8 2.1 8.4 2.2 8 L2.2 6.3 L-0.03 6.3 C-0.5 7.2 -0.7 8.2 -0.7 9.2 C-0.7 10.2 -0.5 11.2 -0.03 12.1 L2.2 10.4 Z"
        transform="translate(0.6,-0.3)"
        fill="#FBBC05"
      />
      <path
        d="M5.5 4.9 C6.3 4.9 7.1 5.2 7.6 5.7 L9.3 4 C8.3 3.1 7 2.6 5.5 2.6 C3 2.6 1 3.8 0.1 5.6 L2.3 7.3 C2.7 6 4 4.9 5.5 4.9 Z"
        transform="translate(0.6,-0.3)"
        fill="#EA4335"
      />
      <text
        x="14"
        y="14"
        fontFamily="system-ui, sans-serif"
        fontWeight="800"
        fontSize="11"
        fill="#FFFFFF"
      >
        Pay
      </text>
    </svg>
  );
}

function PhonePeLogo() {
  return (
    <svg viewBox="0 0 72 20" className="h-4.5 w-auto" aria-label="PhonePe">
      <circle cx="10" cy="10" r="9" fill="#5F259F" />
      <path
        d="M7 5.5 L12 5.5 C13.8 5.5 14.8 6.5 14.8 8 C14.8 9.5 13.8 10.5 12 10.5 L9.5 10.5 L9.5 15 L7 15 Z M9.5 7.2 L9.5 8.8 L11.5 8.8 C12.2 8.8 12.6 8.5 12.6 8 C12.6 7.5 12.2 7.2 11.5 7.2 Z"
        fill="#FFFFFF"
      />
      <text
        x="24"
        y="14"
        fontFamily="system-ui, sans-serif"
        fontWeight="800"
        fontSize="10.5"
        fill="#FFFFFF"
      >
        PhonePe
      </text>
    </svg>
  );
}

function PaytmLogo() {
  return (
    <svg viewBox="0 0 54 18" className="h-4 w-auto" aria-label="Paytm">
      <text
        x="0"
        y="14"
        fontFamily="system-ui, sans-serif"
        fontWeight="900"
        fontSize="14"
        fill="#00BAF2"
      >
        Pay
      </text>
      <text
        x="28"
        y="14"
        fontFamily="system-ui, sans-serif"
        fontWeight="900"
        fontSize="14"
        fill="#002970"
        className="dark:fill-white"
      >
        tm
      </text>
    </svg>
  );
}

function VisaLogo() {
  return (
    <svg viewBox="0 0 50 16" className="h-3.5 w-auto" aria-label="Visa">
      <text
        x="0"
        y="13"
        fontFamily="system-ui, sans-serif"
        fontWeight="900"
        fontStyle="italic"
        fontSize="16"
        fill="#1A1F71"
        className="dark:fill-white"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg viewBox="0 0 34 22" className="h-4.5 w-auto" aria-label="Mastercard">
      <circle cx="11" cy="11" r="9" fill="#EB001B" />
      <circle cx="23" cy="11" r="9" fill="#F79E1B" fillOpacity="0.9" />
      <path
        d="M17 4.8 C15.4 6.5 14.4 8.6 14.4 11 C14.4 13.4 15.4 15.5 17 17.2 C18.6 15.5 19.6 13.4 19.6 11 C19.6 8.6 18.6 6.5 17 4.8 Z"
        fill="#FF5F00"
      />
    </svg>
  );
}

function RuPayLogo() {
  return (
    <svg viewBox="0 0 58 18" className="h-3.5 w-auto" aria-label="RuPay">
      <text
        x="0"
        y="14"
        fontFamily="system-ui, sans-serif"
        fontWeight="900"
        fontSize="14"
        fill="#005B9E"
        className="dark:fill-white"
      >
        Ru
      </text>
      <text
        x="21"
        y="14"
        fontFamily="system-ui, sans-serif"
        fontWeight="900"
        fontStyle="italic"
        fontSize="14"
        fill="#0F75BD"
      >
        Pay
      </text>
      <polygon points="48,2 53,2 49,15 44,15" fill="#F37023" />
      <polygon points="52,2 57,2 53,15 48,15" fill="#0F75BD" />
    </svg>
  );
}

function CodLogo() {
  return (
    <div className="flex items-center gap-1.5 font-mono text-[9px] font-black tracking-widest text-emerald-400">
      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[8px] text-emerald-300">
        COD
      </span>
      <span className="text-zinc-400">AVAILABLE</span>
    </div>
  );
}

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email?.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setIsSubscribed(true);
    toast.success("YOU'RE IN. Watch your inbox for secret Friday drop links.");
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full overflow-hidden border-t border-zinc-800/80 bg-zinc-950 font-sans text-zinc-100 select-none dark:bg-black">
      {/* 1. STREETWEAR MARQUEE TICKER */}
      <div className="relative border-b border-zinc-800/60 bg-zinc-900/60 py-2.5 backdrop-blur-md">
        <style>{`
          @keyframes footer-ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-footer-ticker {
            display: flex;
            width: max-content;
            animation: footer-ticker 30s linear infinite;
          }
          .animate-footer-ticker:hover {
            animation-play-state: paused;
          }

          /* Luxury luminous shining light animation sweep across crossed boxes */
          @keyframes footer-card-shine {
            0% {
              transform: translateX(-150%) skewX(-20deg);
              opacity: 0;
            }
            15% {
              opacity: 1;
            }
            45% {
              transform: translateX(150%) skewX(-20deg);
              opacity: 1;
            }
            46%, 100% {
              transform: translateX(150%) skewX(-20deg);
              opacity: 0;
            }
          }
          .footer-shine-sweep {
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.03) 20%,
              rgba(255, 255, 255, 0.22) 50%,
              rgba(255, 255, 255, 0.03) 75%,
              transparent 100%
            );
            animation: footer-card-shine 4.8s ease-in-out infinite;
          }
        `}</style>
        <div className="animate-footer-ticker flex items-center text-[10px] font-black tracking-[0.25em] whitespace-nowrap text-zinc-400 uppercase">
          {[0, 1].map((set) => (
            <div key={set} className="flex items-center gap-6 pr-6">
              {TICKER_ITEMS.map((item, idx) => (
                <span key={idx} className="flex items-center gap-6">
                  <span className="text-zinc-200 transition-colors hover:text-white">{item}</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-600" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 2. MOBILE OPEN / CLOSE TOGGLE BUTTON */}
      <div className="border-b border-zinc-800 bg-zinc-900/80 px-4 py-3.5 sm:hidden">
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          className="flex w-full items-center justify-between text-xs font-black tracking-[0.2em] text-zinc-300 uppercase transition-colors hover:text-white"
          aria-expanded={isOpen}
        >
          <span>{isOpen ? 'CLOSE FOOTER' : 'MORE ABOUT FASHION FRIDAY'}</span>
          <ChevronUpIcon
            size={16}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`}
          />
        </button>
      </div>

      {/* 3. FOOTER MAIN CONTENT WRAPPER (Always open on desktop, toggled on mobile) */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:block`}>
        <div className="container mx-auto px-4 pt-10 md:px-6 lg:px-8">
          {/* A. CROSSED VIP DROP NEWSLETTER BOX WITH SHINING LIGHT ANIMATION */}
          <div className="group relative mb-14 -skew-x-[6deg] overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 p-6 shadow-2xl transition-all hover:border-zinc-700 sm:-skew-x-[8deg] md:p-10">
            {/* Luminous Shining Light Sweep */}
            <div className="footer-shine-sweep pointer-events-none absolute -top-1/2 -bottom-1/2 -left-1/2 h-[200%] w-[200%]" />

            <div className="relative z-10 grid skew-x-[6deg] grid-cols-1 items-center gap-8 sm:skew-x-[8deg] lg:grid-cols-12 lg:gap-12">
              <div className="text-center lg:col-span-7 lg:text-left">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/80 px-3 py-1 text-[9px] font-black tracking-[0.25em] text-zinc-300 uppercase">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  VIP Access
                </div>
                <h3 className="text-3xl font-black tracking-tighter text-white uppercase italic sm:text-4xl md:text-5xl">
                  NEVER MISS A DROP.
                </h3>
                <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed font-medium text-zinc-400 sm:text-sm lg:mx-0">
                  Join the underground. Get secret drop links, restock alerts, and member-only
                  private sales delivered straight to your inbox before the general release.
                </p>
              </div>

              <div className="lg:col-span-5">
                {isSubscribed ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-emerald-400">
                    <CheckCircleIcon size={20} className="shrink-0" />
                    <p className="text-xs font-bold tracking-wider uppercase">
                      You’re on the list. Watch your inbox every Friday.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                    <div className="relative flex -skew-x-[12deg] items-center overflow-hidden rounded-xl border border-zinc-700 bg-black/80 transition-all focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-400">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        placeholder="ENTER YOUR EMAIL ADDRESS"
                        className="w-full skew-x-[12deg] bg-transparent px-4 py-3.5 text-xs font-semibold text-white uppercase outline-none placeholder:text-zinc-500"
                        required
                      />
                      <button
                        type="submit"
                        className="group flex shrink-0 items-center justify-center bg-white px-5 py-3.5 text-xs font-black tracking-widest text-black uppercase transition-all hover:bg-zinc-200 active:scale-95"
                      >
                        <span className="flex skew-x-[12deg] items-center gap-2">
                          <span>JOIN</span>
                          <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </button>
                    </div>
                    <p className="text-center text-[10px] font-medium tracking-wide text-zinc-500 uppercase lg:text-left">
                      No spam. Only high-heat drops & private archive access.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* B. CROSSED TRUST PILLARS BOXES WITH SHINING LIGHT ANIMATION */}
          <div className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_PILLARS.map((pillar, idx) => (
              <div
                key={idx}
                className="group relative -skew-x-[6deg] overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition-all duration-300 hover:border-zinc-600 hover:bg-zinc-900/80 sm:-skew-x-[8deg]"
              >
                {/* Luminous Shining Light Sweep */}
                <div className="footer-shine-sweep pointer-events-none absolute -top-1/2 -bottom-1/2 -left-1/2 h-[200%] w-[200%]" />

                <div className="relative z-10 flex skew-x-[6deg] items-start gap-4 sm:skew-x-[8deg]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-white transition-colors group-hover:border-zinc-500">
                    <pillar.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black tracking-wider text-white uppercase">
                      {pillar.title}
                    </h4>
                    <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">{pillar.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* C. MAIN NAVIGATION GRID & BRAND IDENTIFIERS */}
          <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* BRAND COLUMN: Centered on small device, left-aligned on desktop */}
            <div className="flex flex-col items-center text-center lg:col-span-4 lg:items-start lg:text-left">
              {/* OLD SET IMAGE LOGO */}
              <Link href="/" className="inline-block">
                <Image
                  src="/images/logos/ff-logo2.png"
                  alt="Fashion Friday"
                  width={160}
                  height={45}
                  className="h-9 w-auto invert dark:invert-0"
                />
              </Link>
              <p className="mt-4 max-w-sm text-xs leading-relaxed font-medium text-zinc-400">
                Style That Moves. High-grade streetwear, limited sneaker editions, and luxury daily
                essentials curated for the new generation across India.
              </p>

              {/* SOCIAL ICONS WITH OFFICIAL BRAND COLORS: Centered on small device, left on desktop */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                {SOCIAL_LINKS.map((social, idx) => (
                  <Link
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`flex h-10 w-10 -skew-x-[12deg] items-center justify-center overflow-hidden rounded-lg border bg-zinc-900/70 transition-all duration-200 hover:-translate-y-1 hover:scale-105 ${social.colorClass}`}
                  >
                    <span className="skew-x-[12deg]">
                      <social.icon size={18} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* LINK COLUMNS */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
              {FOOTER_COLUMNS.map((col) => (
                <div key={col.title} className="flex flex-col">
                  <h4 className="mb-4 text-[11px] font-black tracking-[0.25em] text-white uppercase">
                    {col.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="group inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 transition-colors duration-200 hover:text-white"
                        >
                          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                            {link.name}
                          </span>
                          <ArrowUpRightIcon
                            size={12}
                            className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* D. ACCEPTED PAYMENT METHODS AS ACCURATE SVG LOGOS */}
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-y border-zinc-800/80 py-5">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <span className="mr-1 text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">
                SECURE PAYMENTS:
              </span>
              <div className="flex h-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
                <UpiLogo />
              </div>
              <div className="flex h-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
                <GPayLogo />
              </div>
              <div className="flex h-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
                <PhonePeLogo />
              </div>
              <div className="flex h-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
                <PaytmLogo />
              </div>
              <div className="flex h-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
                <VisaLogo />
              </div>
              <div className="flex h-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
                <MastercardLogo />
              </div>
              <div className="flex h-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
                <RuPayLogo />
              </div>
              <div className="flex h-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
                <CodLogo />
              </div>
            </div>

            {/* BACK TO TOP BUTTON */}
            <button
              type="button"
              onClick={scrollToTop}
              className="group flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 text-[10px] font-black tracking-widest text-zinc-300 uppercase transition-all hover:border-zinc-500 hover:bg-white hover:text-black active:scale-95"
              aria-label="Back to top of page"
            >
              <span>BACK TO TOP</span>
              <ArrowUpIcon
                size={12}
                className="transition-transform group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM SUB-FOOTER BAR (With mobile clearance) */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 pt-6 pb-28 text-[11px] font-medium text-zinc-500 sm:pb-8 lg:flex-row lg:gap-4">
          <div className="order-1 flex flex-1 justify-center text-center lg:order-1 lg:justify-start lg:text-left">
            &copy; {new Date().getFullYear()} FASHION FRIDAY. ALL RIGHTS RESERVED. // MADE FOR THE
            CULTURE.
          </div>

          <div className="order-3 flex flex-1 flex-col items-center justify-center gap-3 lg:order-2">
            <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-600 uppercase">
              Developed By
            </span>
            <Link
              href="https://unity11solutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <Image
                src="/images/unity-logos/unity11-logo.gif"
                alt="Unity11 logo icon"
                width={44}
                height={44}
                className="h-11 w-11"
                unoptimized
              />
              <Image
                src="/images/unity-logos/unity11-text-logo.png"
                alt="Unity11 text logo"
                width={120}
                height={32}
                className="h-6 w-auto"
                priority
              />
            </Link>
          </div>

          <div className="order-2 flex flex-1 items-center justify-center lg:order-3 lg:justify-end">
            <span>CURATED IN INDIA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
