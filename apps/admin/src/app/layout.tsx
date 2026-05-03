import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

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
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 glass-panel ml-4 my-4 mr-2 flex flex-col hidden md:flex rounded-2xl overflow-hidden relative z-10 border-black/5 dark:border-white/5 sticky top-4 h-[calc(100vh-2rem)]">
            <div className="p-6 pb-2 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-lg shadow-lg">
                F
              </div>
              <h1 className="text-xl font-bold tracking-tight">FashionFriday</h1>
            </div>
            
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-5 scrollbar-hide">
              {/* Menu Section */}
              <div>
                <p className="px-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider mb-3">Menu</p>
                <div className="space-y-1">
                  <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
                    <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    <span className="font-medium text-sm">Dashboard</span>
                  </a>
                  <a href="#" className="flex items-center justify-between px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                      <span className="font-medium text-sm">Order</span>
                    </div>
                    <span className="bg-black/10 dark:bg-white/10 text-black dark:text-white text-xs py-0.5 px-2 rounded-full font-medium">16</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
                    <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <span className="font-medium text-sm">Customers</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
                    <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span className="font-medium text-sm">Message</span>
                  </a>
                </div>
              </div>
  
              {/* Tools Section */}
              <div>
                <p className="px-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider mb-3">Tools</p>
                <div className="space-y-1">
                  <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    <span className="font-medium text-sm">Product</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
                    <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    <span className="font-medium text-sm">Integrations</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
                    <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    <span className="font-medium text-sm">Analytic</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
                    <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span className="font-medium text-sm">Invoice</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
                    <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                    <span className="font-medium text-sm">Discount</span>
                  </a>
                </div>
              </div>
  
              {/* Settings Section */}
              <div>
                <p className="px-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider mb-3">Settings</p>
                <div className="space-y-1">
                  <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
                    <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="font-medium text-sm">Settings</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
                    <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    <span className="font-medium text-sm">Security</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
                    <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="font-medium text-sm">Get Help</span>
                  </a>
                  <ThemeToggle />
                </div>
              </div>
            </nav>
          </aside>
  
          <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden h-screen">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-black/5 dark:bg-white/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            
            <header className="sticky top-4 h-20 flex-shrink-0 flex items-center justify-between px-8 z-30 mt-4 mb-4 ml-2 mr-4 rounded-2xl glass-panel">
              <div className="flex-1 flex items-center">
                <button className="md:hidden mr-4 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                
                <div className="hidden md:flex items-center flex-1 max-w-md">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-black/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white text-sm rounded-full focus:ring-black/20 dark:focus:ring-white/20 focus:border-black/30 dark:focus:border-white/30 block pl-10 pr-12 py-2 placeholder-black/30 dark:placeholder-white/30 transition-all outline-none"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-xs text-black/30 dark:text-white/30 font-mono border border-black/10 dark:border-white/10 rounded px-1.5">⌘K</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors relative group">
                  <svg className="w-4 h-4 text-black/70 dark:text-white/70 group-hover:text-black dark:group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-black dark:bg-white ring-2 ring-white dark:ring-black"></span>
                </button>
                
                <button className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors relative group">
                  <svg className="w-4 h-4 text-black/70 dark:text-white/70 group-hover:text-black dark:group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-black dark:bg-white ring-2 ring-white dark:ring-black"></span>
                </button>
  
                <div className="h-6 w-px bg-black/10 dark:bg-white/10 mx-2"></div>
  
                <div className="flex items-center space-x-3 cursor-pointer group">
                  <div className="w-9 h-9 rounded-full bg-black/10 dark:bg-white/20 overflow-hidden flex items-center justify-center relative">
                     <span className="text-xs font-bold text-black dark:text-white">JS</span>
                     <div className="absolute inset-0 bg-black/5 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-black dark:text-white group-hover:text-black/80 dark:group-hover:text-white/90">Jimmy Sullivan</p>
                    <p className="text-xs text-black/50 dark:text-white/50">Odama Store</p>
                  </div>
                </div>
              </div>
            </header>
  
            <div className="flex-1 ml-2 mr-4 z-10 overflow-hidden flex flex-col min-h-0 mb-4">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
