import { ReactNode } from 'react';

export const metadata = {
  title: 'Admin Dashboard | Fashion Friday',
  description: 'Manage products, orders, users, and analytics from the Fashion Friday admin panel.',
  openGraph: {
    title: 'Admin Dashboard | Fashion Friday',
    description:
      'Access product management, order tracking, user accounts, and analytics for Fashion Friday.',
    type: 'website',
    url: 'https://www.fashionfriday.in/admin',
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <main>{children}</main>;
}
