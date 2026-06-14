'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';

interface MobileHeaderProps {
  isMobileOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

function getPageTitle(pathname: string): string {
  if (pathname === '/') return 'Dashboard';
  if (pathname.startsWith('/orders/')) return 'Order Details';
  if (pathname === '/orders') return 'Orders';
  if (pathname.startsWith('/products/add')) return 'Add Product';
  if (pathname.endsWith('/edit')) return 'Edit Product';
  if (pathname.startsWith('/products/')) return 'Product Details';
  if (pathname === '/products') return 'Products';
  if (pathname.startsWith('/customers/')) return 'Customer Details';
  if (pathname === '/customers') return 'Customers';
  if (pathname === '/reviews') return 'Reviews';
  if (pathname === '/feedback') return 'Feedback';
  if (pathname === '/searches') return 'User Searches';
  if (pathname === '/product-requests') return 'Product Requests';
  if (pathname.includes('/add-products')) return 'Add Products';
  if (pathname.startsWith('/categories/add')) return 'Add Category';
  if (pathname.startsWith('/categories/')) return 'Category Details';
  if (pathname === '/categories') return 'Categories';
  if (pathname.startsWith('/collections/add')) return 'Add Collection';
  if (pathname.startsWith('/collections/')) return 'Collection Details';
  if (pathname === '/collections') return 'Collections';
  if (pathname === '/brands') return 'Brands';
  if (pathname.startsWith('/sellers/')) return 'Seller Details';
  if (pathname === '/sellers') return 'Sellers';
  if (pathname === '/campaigns') return 'Campaigns';
  if (pathname === '/whatsapp-reviews') return 'WhatsApp Reviews';
  if (pathname === '/faqs') return 'FAQs';
  if (pathname === '/team') return 'Team & Roles';
  if (pathname === '/profile') return 'Profile';
  if (pathname.startsWith('/notifications')) return 'Notifications';
  if (pathname === '/activity') return 'Activity';
  if (pathname === '/analytics') return 'Analytics';

  // Fallback for custom or deeply nested route
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return 'Dashboard';
  const lastSegment = segments[segments.length - 1];
  return lastSegment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function MobileHeader({
  isMobileOpen = false,
  onToggleMobileMenu,
}: MobileHeaderProps) {
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const { user } = useAuth();

  if (!user || pathname === '/login') {
    return null;
  }

  const pageTitle = getPageTitle(pathname);
  const showBack = pathname !== '/';

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between border-b border-black/5 bg-white/95 px-3 backdrop-blur-md md:hidden dark:border-white/10 dark:bg-[#0e0e0e]/95">
      {/* Left: iOS Back Button */}
      <div className="flex h-10 w-10 items-center justify-center">
        {showBack ? (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full text-black/80 transition-colors hover:bg-black/5 hover:text-black active:scale-95 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <svg
              className="h-6 w-6 -ml-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.25}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        ) : null}
      </div>

      {/* Center: Page Name (Centered iOS style) */}
      <div className="pointer-events-none absolute inset-x-14 flex items-center justify-center text-center">
        <h1 className="truncate text-base font-semibold tracking-tight text-black dark:text-white">
          {pageTitle}
        </h1>
      </div>

      {/* Right: Menu icon */}
      <div className="flex h-10 w-10 items-center justify-center">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label={isMobileOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          className="flex h-10 w-10 items-center justify-center rounded-full text-black/80 transition-colors hover:bg-black/5 hover:text-black active:scale-95 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
        >
          {isMobileOpen ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}

// Re-export as Header for convenience
export { MobileHeader as Header };
