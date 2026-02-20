import { type ReactNode } from 'react';

export const metadata = {
  title: 'Shop Trendy Footwear & Fashion Accessories Online | Fashion Friday',
  description:
    'Discover the latest shoes, sneakers, and fashion accessories at affordable prices. Shop top-quality products online at Fashion Friday – fast delivery across India!',
  openGraph: {
    title: 'Shop Trendy Footwear & Fashion Accessories | Fashion Friday',
    description:
      "Browse the newest collection of shoes, sneakers, and accessories. Fashion Friday brings you high-quality fashion at prices you'll love.",
    type: 'website',
    url: 'https://www.fashionfriday.in/shop',
    images: [
      {
        url: '',
        width: 1200,
        height: 630,
        alt: 'Fashion Friday Shop - Trendy Footwear & Accessories',
      },
    ],
  },
};

export default function ShopLayout({ children }: { children: ReactNode }) {
  return <main>{children}</main>;
}
