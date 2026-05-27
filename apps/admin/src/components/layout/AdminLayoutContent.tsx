'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import { LoaderIcon, LockIcon } from '@ff/ui';

import { type Role, useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/features/auth';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Toaster } from 'sonner';

// Route prefix permission rules
const ROUTE_PERMISSIONS: { prefix: string; roles: Role[] }[] = [
  { prefix: '/analytics', roles: ['SUPER_ADMIN', 'SALES_MANAGER'] },
  { prefix: '/orders', roles: ['SUPER_ADMIN', 'SALES_MANAGER'] },
  { prefix: '/customers', roles: ['SUPER_ADMIN', 'SALES_MANAGER'] },
  { prefix: '/reviews', roles: ['SUPER_ADMIN', 'SALES_MANAGER'] },
  { prefix: '/products', roles: ['SUPER_ADMIN', 'PRODUCT_MANAGER'] },
  { prefix: '/categories', roles: ['SUPER_ADMIN', 'PRODUCT_MANAGER'] },
  { prefix: '/brands', roles: ['SUPER_ADMIN', 'PRODUCT_MANAGER'] },
  { prefix: '/collections', roles: ['SUPER_ADMIN', 'PRODUCT_MANAGER'] },
  { prefix: '/campaigns', roles: ['SUPER_ADMIN', 'SALES_MANAGER'] },
  { prefix: '/whatsapp-reviews', roles: ['SUPER_ADMIN', 'SALES_MANAGER'] },
  { prefix: '/team', roles: ['SUPER_ADMIN'] },
];

export function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname() || '';

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <LoaderIcon className="h-8 w-8 animate-spin text-black dark:text-white" />
          <p className="text-sm font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
            Initializing System
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  // Routing validation checks based on user role
  const isAuthorized = () => {
    // Basic root page and profile options are accessible globally
    if (pathname === '/' || pathname === '/profile') {
      return true;
    }

    const rule = ROUTE_PERMISSIONS.find(
      (r) => pathname === r.prefix || pathname.startsWith(r.prefix + '/'),
    );

    if (!rule) {
      return true; // NextJS fallback 404 page handler
    }

    return rule.roles.includes(user.role);
  };

  if (!isAuthorized()) {
    return (
      <>
        <Sidebar />
        <main className="relative flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
          <Header />
          <div className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10 text-red-500 dark:border-red-500/10 dark:bg-red-950/20 dark:text-red-400">
              <LockIcon className="h-10 w-10 animate-pulse" />
            </div>

            <h1 className="mb-2 text-3xl font-black tracking-tight text-black uppercase dark:text-white">
              Access Denied
            </h1>
            <p className="mb-6 max-w-md text-sm leading-relaxed font-semibold text-black/60 dark:text-white/60">
              Your security role (
              <span className="font-bold text-black dark:text-white">
                {user.role.replace('_', ' ')}
              </span>
              ) is not authorized to access{' '}
              <span className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">
                {pathname}
              </span>
              .
            </p>

            <a
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3 text-xs font-black tracking-wider text-white uppercase transition-all duration-300 hover:bg-black/85 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              Return to Dashboard
            </a>
          </div>
        </main>
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <main className="relative flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <div className="z-10 flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      </main>
      <Toaster position="top-right" richColors />
    </>
  );
}
