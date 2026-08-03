import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import ImageCarousel from '@/components/ui/sections/ImageCarousel';

import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Sign in | Fashion Friday',
  description: 'Secure login and account access for Fashion Friday customers.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Fashion Friday Authentication',
    description: 'Secure access to your Fashion Friday account.',
    type: 'website',
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh] h-screen w-screen overflow-hidden bg-black text-white selection:bg-white selection:text-black">
      <style>{`
        html, body {
          overflow: hidden !important;
          height: 100dvh !important;
          max-height: 100dvh !important;
          overscroll-behavior: none !important;
          touch-action: pan-x none !important;
        }
      `}</style>

      {/* Floating Exit Button */}
      <div className="fixed top-5 right-5 z-50 sm:top-6 sm:right-6">
        <Link
          href="/"
          className="group flex items-center gap-2 text-zinc-500 transition-all duration-300 hover:text-white"
        >
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Exit to Store</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-black/60 backdrop-blur-md transition-all group-hover:border-white group-hover:bg-white group-hover:text-black sm:h-10 sm:w-10">
            <Image
              src="/images/logos/ff-logo.png"
              alt="Fashion Friday Logo"
              width={25}
              height={25}
              className="mt-0.5 invert group-hover:invert-0"
            />
          </div>
        </Link>
      </div>

      <div className="flex h-full w-full overflow-hidden">
        {/* SHARED VISUAL SIDE (Pinned viewport on desktop) */}
        <div className="hidden h-full overflow-hidden lg:flex lg:w-1/2 lg:p-4">
          <ImageCarousel />
        </div>

        {/* DYNAMIC FORM SIDE (Strict 100vh, fixed center position, zero overflow) */}
        <div className="flex h-full w-full items-center justify-center overflow-hidden px-4 py-2 sm:px-8 lg:w-1/2 lg:px-12">
          <div className="flex h-[380px] w-full max-w-sm items-center justify-center overflow-hidden sm:max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
