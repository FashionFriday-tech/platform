import '@/app/globals.css';

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import ImageCarousel from '@/components/ui/sections/ImageCarousel';

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
    <div className="flex h-screen w-full items-center justify-center bg-black p-4 text-white selection:bg-black selection:text-white">
      <div className="absolute top-6 right-6 z-50">
        <Link
          href="/"
          className="group flex items-center gap-2 text-zinc-500 transition-all duration-300 hover:text-white"
        >
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Exit to Store</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 transition-all group-hover:border-white group-hover:bg-white group-hover:text-black">
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
        {/* SHARED VISUAL SIDE */}
        <div className="hidden w-1/2 p-4 lg:flex">
          <ImageCarousel />
        </div>

        {/* DYNAMIC FORM SIDE */}
        <div className="flex w-full flex-col items-center justify-center p-4 lg:w-1/2">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
