import type { Metadata } from "next";
import "@/app/globals.css";
import ImageCarousel from "@/components/ui/sections/ImageCarousel";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sign in | Fashion Friday",
  description: "Secure login and account access for Fashion Friday customers.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Fashion Friday Authentication",
    description: "Secure access to your Fashion Friday account.",
    type: "website",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex w-full text-white selection:bg-black selection:text-white items-center justify-center bg-black p-4">
      <div className="absolute top-6 right-6 z-50">
        <Link
          href="/"
          className="group flex  items-center gap-2 text-zinc-500 hover:text-white transition-all duration-300"
        >
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
            Exit to Store
          </span>
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 group-hover:border-white group-hover:bg-white group-hover:text-black transition-all">
            <Image
              src="/images/logos/ff-logo.png"
              alt="Fashion Friday Logo"
              width={25}
              height={25}
              className="invert mt-0.5 group-hover:invert-0"
            />
          </div>
        </Link>
      </div>
      <div className="flex w-full h-full overflow-hidden">
        {/* SHARED VISUAL SIDE */}
        <div className="hidden lg:flex w-1/2 p-4">
          <ImageCarousel />
        </div>

        {/* DYNAMIC FORM SIDE */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
