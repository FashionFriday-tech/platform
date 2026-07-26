import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Toaster } from 'sonner';

import { Header } from '@/components/layout/Header';
import { StoreInitializer } from '@/components/layout/StoreInitializer';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

import { SmoothScrollProvider } from './providers/smooth-scroll-provider';
import { ThemeProvider } from './providers/theme-provider';

import './globals.css';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fashionfriday.in'),
  title: {
    default: 'Fashion Friday | Style That Moves',
    template: '%s | Fashion Friday',
  },
  description:
    'Fashion Friday is an online fashion and footwear store offering trendy shoes and accessories at affordable prices in India.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Fashion Friday',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
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
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-precomposed.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground min-h-screen font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SmoothScrollProvider>
            <StoreInitializer />
            <ServiceWorkerRegister />
            <Header />
            {children}
            <Toaster position="top-center" richColors closeButton />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
