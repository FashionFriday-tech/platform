import type { Metadata } from 'next';
import { Mulish } from 'next/font/google';

import { AdminLayoutContent } from '@/components/layout/AdminLayoutContent';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';

import './globals.css';

const mulish = Mulish({
  style: ['normal', 'italic'],
  variable: '--font-mulish',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Admin Panel | Fashion Friday',
  description: 'Fashion Friday business management and administration.',
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
        className={`${mulish.variable} scrollbar-hide flex min-h-screen bg-slate-50 font-sans text-black antialiased dark:bg-slate-950 dark:text-white`}
      >
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {/* Mesh Gradient Background */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-teal-100/50 blur-[120px] dark:bg-teal-900/20" />
              <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-rose-100/50 blur-[120px] dark:bg-rose-900/20" />
              <div className="absolute -bottom-40 left-1/4 h-[600px] w-[600px] rounded-full bg-violet-100/50 blur-[120px] dark:bg-violet-900/20" />
              <div className="absolute -right-40 -bottom-40 h-[600px] w-[600px] rounded-full bg-amber-100/40 blur-[120px] dark:bg-amber-900/20" />
            </div>

            <AdminLayoutContent>{children}</AdminLayoutContent>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
