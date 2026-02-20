import { type ReactNode } from 'react';

export const metadata = {
  title: 'Checkout | Fashion Friday',
  description:
    'Complete your order quickly and securely at Fashion Friday. Enter shipping details, choose payment, and confirm your purchase.',
  openGraph: {
    title: 'Checkout | Fashion Friday',
    description: 'Fast, secure, and simple checkout process for Fashion Friday customers.',
    type: 'website',
    url: 'https://www.fashionfriday.in/checkout',
  },
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return <main>{children}</main>;
}
