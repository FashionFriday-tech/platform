import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AuthProvider } from '@/contexts/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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
        className={`${geistSans.variable} ${geistMono.variable} scrollbar-hide flex min-h-screen bg-gray-50 text-black antialiased dark:bg-black dark:text-white`}
      >
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <Sidebar />

            <main className="relative flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
              {/* Subtle background glow */}
              <div className="pointer-events-none absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-black/5 blur-[120px] dark:bg-white/5"></div>

              <Header />

              <div className="z-10 mr-4 mb-4 ml-2 flex min-h-0 flex-1 flex-col overflow-hidden">
                {children}
              </div>
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
