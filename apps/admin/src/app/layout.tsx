import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Panel | Fashion Friday",
  description: "Fashion Friday business management and administration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scrollbar-hide">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-black text-black dark:text-white min-h-screen flex scrollbar-hide`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Sidebar />
  
          <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden h-screen">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-black/5 dark:bg-white/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            
            <Header />
  
            <div className="flex-1 ml-2 mr-4 z-10 overflow-hidden flex flex-col min-h-0 mb-4">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
