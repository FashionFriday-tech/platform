import type { Metadata } from "next";
import "@/app/globals.css";
import ImageCarousel from "@/components/ui/sections/ImageCarousel";

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
