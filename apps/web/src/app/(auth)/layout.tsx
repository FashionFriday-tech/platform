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
    <div className="relative min-h-[100dvh] min-h-screen w-full bg-black text-white selection:bg-white selection:text-black">
      {/* Floating Exit Button */}
      <div className="fixed top-6 right-6 z-50">
        <Link
          href="/"
          className="group flex items-center gap-2 text-zinc-500 transition-all duration-300 hover:text-white"
        >
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Exit to Store</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-black/60 backdrop-blur-md transition-all group-hover:border-white group-hover:bg-white group-hover:text-black">
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

      <div className="flex min-h-[100dvh] min-h-screen w-full">
        {/* SHARED VISUAL SIDE (Pinned viewport on desktop) */}
        <div className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-1/2 lg:p-4">
          <ImageCarousel />
        </div>

        {/* DYNAMIC FORM SIDE (Scrollable 100vh / min-h-screen) */}
        <div className="flex min-h-[100dvh] min-h-screen w-full flex-col justify-between overflow-y-auto px-4 py-16 sm:px-8 lg:w-1/2 lg:px-12 lg:py-12">
          <div className="my-auto flex w-full flex-col items-center justify-center">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
