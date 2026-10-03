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
  metadataBase: new URL('https://www.fashionfriday.in'),
  title: {
    default: 'Fashion Friday | Buy Streetwear, Sneakers & Hype Apparel India',
    template: '%s | Fashion Friday',
  },
  description:
    'Shop India’s freshest streetwear, hype sneakers, oversized hoodies & luxury clogs at Fashion Friday. Pan-India Cash on Delivery (COD), express dispatch & 7-day hassle-free returns. Explore the weekly drop now!',
  keywords: [
    'Fashion Friday',
    'Fashion Friday India',
    'Streetwear India',
    'Buy Sneakers Online India',
    'Trending Sneakers',
    'Oversized T-Shirts',
    'Streetwear Hoodies',
    'Clogs and Slides',
    'Hype Shoes India',
    'Urban Fashion Store',
    'Men Streetwear Online',
    'Women Streetwear Online',
    'Cash On Delivery Clothing India',
    'Sneaker Drops India',
  ],
  authors: [{ name: 'Fashion Friday' }],
  creator: 'Fashion Friday',
  publisher: 'Fashion Friday',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.fashionfriday.in',
    siteName: 'Fashion Friday',
    title: 'Fashion Friday | Buy Streetwear, Sneakers & Hype Apparel India',
    description:
      'Shop India’s freshest streetwear, hype sneakers, oversized hoodies & luxury clogs at Fashion Friday. Pan-India Cash on Delivery (COD), express dispatch & 7-day hassle-free returns.',
    images: [
      {
        url: '/images/logos/ff-app-icon.png',
        width: 1200,
        height: 1200,
        alt: 'Fashion Friday - Premium Streetwear & Sneakers India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fashion Friday | Buy Streetwear, Sneakers & Hype Apparel India',
    description:
      'Shop India’s freshest streetwear, hype sneakers, oversized hoodies & luxury clogs at Fashion Friday. Pan-India Cash on Delivery (COD) & express dispatch.',
    images: ['/images/logos/ff-app-icon.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Fashion Friday',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48 32x32 16x16', type: 'image/x-icon' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon-precomposed.png', sizes: '180x180', type: 'image/png' },
    ],
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
        {/* Google Search Favicon Standards (multiples of 48px square + ICO) */}
        <link rel="icon" href="/favicon.ico" sizes="48x48 32x32 16x16" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-precomposed.png" />

        {/* Structured Data (JSON-LD) for Google Brand Knowledge Graph & Logo */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://www.fashionfriday.in/#organization',
                  name: 'Fashion Friday',
                  url: 'https://www.fashionfriday.in',
                  logo: {
                    '@type': 'ImageObject',
                    '@id': 'https://www.fashionfriday.in/#logo',
                    url: 'https://www.fashionfriday.in/favicon-96x96.png',
                    contentUrl: 'https://www.fashionfriday.in/favicon-96x96.png',
                    caption: 'Fashion Friday Logo',
                    width: '96',
                    height: '96',
                  },
                  image: 'https://www.fashionfriday.in/images/logos/ff-app-icon.png',
                  sameAs: ['https://instagram.com/fashionfriday.in', 'https://wa.me/919995551234'],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://www.fashionfriday.in/#website',
                  url: 'https://www.fashionfriday.in',
                  name: 'Fashion Friday',
                  alternateName: ['Fashion Friday India', 'fashionfriday.in'],
                  publisher: {
                    '@id': 'https://www.fashionfriday.in/#organization',
                  },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate:
                        'https://www.fashionfriday.in/products?search={search_term_string}',
                    },
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
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
