import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Fashion Friday | Trendy Footwear & Fashion',
    template: '%s | Fashion Friday',
  },
  description:
    'Fashion Friday offers trendy footwear and fashion accessories at affordable prices across India.',
  openGraph: {
    siteName: 'Fashion Friday',
    type: 'website',
  },
  alternates: {
    canonical: 'https://fashionfriday.in',
  },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
