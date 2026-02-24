import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Header } from '@/components/layout/Header';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import { SettingsProvider } from '@/context/SettingsContext';

import './globals.css';
import { ThemeProvider } from './providers/theme-provider';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fashionfriday.in'),
  title: {
    default: 'Fashion Friday | Style That Moves',
    template: '%s | Fashion Friday',
  },
  description:
    'Fashion Friday is an online fashion and footwear store offering trendy shoes and accessories at affordable prices in India.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Fashion Friday',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` ${geistSans.variable} ${geistMono.variable} bg-background text-foreground min-h-screen antialiased`}
        suppressHydrationWarning
      >
        <SettingsProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ServiceWorkerRegister />
            <Header />
            {children}
          </ThemeProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
