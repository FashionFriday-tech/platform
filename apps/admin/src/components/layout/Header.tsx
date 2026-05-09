'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth, Role } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  ActivityIcon,
  ShoppingBagIcon,
  PackageIcon,
  UsersIcon,
  StarIcon,
  StarBadgeIcon,
  CategoryIcon,
  LayersIcon,
  ZapIcon,
} from '@ff/ui';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const getPageInfo = () => {
    if (pathname === '/') return { title: 'Dashboard', showBack: false, icon: ActivityIcon };
    if (pathname.startsWith('/orders/')) return { title: 'Order Details', showBack: true, icon: ShoppingBagIcon };
    if (pathname === '/orders') return { title: 'Orders Management', showBack: false, icon: ShoppingBagIcon };
    if (pathname.startsWith('/products/')) return { title: 'Product Details', showBack: true, icon: PackageIcon };
    if (pathname === '/products') return { title: 'Products', showBack: false, icon: PackageIcon };
    if (pathname === '/customers') return { title: 'Customers', showBack: false, icon: UsersIcon };
    if (pathname === '/reviews') return { title: 'Reviews', showBack: false, icon: StarIcon };
    if (pathname === '/brands') return { title: 'Brands', showBack: false, icon: StarBadgeIcon };
    if (pathname.startsWith('/categories/')) return { title: 'Category Details', showBack: true, icon: CategoryIcon };
    if (pathname === '/categories') return { title: 'Categories', showBack: false, icon: CategoryIcon };
    if (pathname.startsWith('/collections/')) return { title: 'Collection Details', showBack: true, icon: LayersIcon };
    if (pathname === '/collections') return { title: 'Collections', showBack: false, icon: LayersIcon };
    if (pathname === '/campaigns') return { title: 'Campaigns', showBack: false, icon: ZapIcon };
    if (pathname === '/team') return { title: 'Team & Roles', showBack: false, icon: UsersIcon };
    
    // Fallback logic
    const segments = pathname.split('/').filter(Boolean);
    const title = segments.length > 0 
      ? segments[0].charAt(0).toUpperCase() + segments[0].slice(1) 
      : 'Dashboard';
      
    return { title, showBack: segments.length > 1, icon: ActivityIcon };
  };

  const { title, showBack, icon: Icon } = getPageInfo();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 flex h-16 mt-4 flex-shrink-0 items-center justify-between px-6 bg-transparent">
      <div className="flex flex-1 items-center">
        <button className="mr-4 text-black/70 hover:text-black md:hidden dark:text-white/70 dark:hover:text-white">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="flex flex-1 items-center gap-4">
          {showBack && (
            <button 
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center text-black transition-all active:scale-95 dark:text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-3">
            <Icon className="h-8 w-8 text-black dark:text-white" />
            <h1 className="text-2xl font-bold uppercase text-black tracking-[-0.05rem] dark:text-white">{title}</h1>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
              });
            } else {
              if (document.exitFullscreen) {
                document.exitFullscreen();
              }
            }
          }}
          className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <svg className="h-4 w-4 text-black/70 group-hover:text-black dark:text-white/70 dark:group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>

        <button className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10">
          <svg
            className="h-4 w-4 text-black/70 group-hover:text-black dark:text-white/70 dark:group-hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-black ring-2 ring-white dark:bg-white dark:ring-black"></span>
        </button>

        <button className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10">
          <svg
            className="h-4 w-4 text-black/70 group-hover:text-black dark:text-white/70 dark:group-hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-black ring-2 ring-white dark:bg-white dark:ring-black"></span>
        </button>

        <div className="mx-2 h-6 w-px bg-black/10 dark:bg-white/10"></div>

        <Link 
          href="/profile"
          className="group flex cursor-pointer items-center space-x-3"
        >
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-black dark:bg-white">
            <span className="text-xs font-bold text-white dark:text-black">{user.initials}</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-black group-hover:text-black/85 dark:text-white dark:group-hover:text-white/90">
              {user.name}
            </p>
            <p className="text-xs text-black/50 dark:text-white/50">{user.role.replace('_', ' ')}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
