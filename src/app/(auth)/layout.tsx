import type { Metadata } from "next";
import "@/app/globals.css";

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
   <main>{children}</main>
  );
}
