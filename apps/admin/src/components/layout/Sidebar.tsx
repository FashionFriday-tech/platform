'use client';

import {
  ActivityIcon,
  TrendingUpIcon,
  ShoppingBagIcon,
  PackageIcon,
  CategoryIcon,
  StarBadgeIcon,
  LayersIcon,
  UsersIcon,
  StarIcon,
  ZapIcon,
  TagIcon,
  SettingsIcon,
  ShieldCheckIcon,
  LifeBuoyIcon,
} from '@ff/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function Sidebar() {
  const pathname = usePathname() || '';
  const { user } = useAuth();
  const role = user.role;

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
    return isActive
      ? 'group is-active flex items-center space-x-3 rounded-full bg-black p-1.5 pr-4 text-white transition-all dark:bg-white dark:text-black'
      : 'group flex items-center space-x-3 rounded-full p-1.5 pr-4 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white';
  };

  const hasAccess = (allowedRoles: string[]) => allowedRoles.includes(role);

  return (
    <aside className="bg-transparent relative sticky top-0 z-10 flex hidden h-screen w-64 flex-shrink-0 flex-col md:flex">
      <div className="flex items-center space-x-2 p-6 pb-0.5">
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden">
          <img src="/images/logos/ff-logo.png" alt="Fashion Friday" className="h-full w-full object-contain" />
        </div>
        <h1 className="text-lg font-black uppercase">FashionFriday</h1>
      </div>

      <nav className="scrollbar-hide flex-1 space-y-6 overflow-y-auto px-4 py-6">
        
        {/* Overview Section */}
        {hasAccess(['SUPER_ADMIN', 'SALES_MANAGER', 'PRODUCT_MANAGER']) && (
          <div>
            <p className="mb-2 px-3 text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
              Overview
            </p>
            <div className="space-y-1">
              <Link href="/" className={getLinkClass('/')}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black/20"><ActivityIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" /></div>
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              {hasAccess(['SUPER_ADMIN', 'SALES_MANAGER']) && (
                <Link href="/analytics" className={getLinkClass('/analytics')}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black/20"><TrendingUpIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" /></div>
                  <span className="text-sm font-medium">Analytics</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Sales Section */}
        {hasAccess(['SUPER_ADMIN', 'SALES_MANAGER']) && (
          <div>
            <p className="mb-2 px-3 text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
              Sales
            </p>
            <div className="space-y-1">
              <Link href="/orders" className={getLinkClass('/orders').replace('space-x-3', 'justify-between')}>
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black/20"><ShoppingBagIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" /></div>
                  <span className="text-sm font-medium">Orders</span>
                </div>
                <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs font-medium text-black dark:bg-white/10 dark:text-white">
                  16
                </span>
              </Link>
              <Link href="/customers" className={getLinkClass('/customers')}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black/20"><UsersIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" /></div>
                <span className="text-sm font-medium">Customers</span>
              </Link>
              <a href="#" className="group flex items-center space-x-3 rounded-full p-1.5 pr-4 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black/20"><StarIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" /></div>
                <span className="text-sm font-medium">Reviews</span>
              </a>
            </div>
          </div>
        )}

        {/* Catalog Section */}
        {hasAccess(['SUPER_ADMIN', 'PRODUCT_MANAGER']) && (
          <div>
            <p className="mb-2 px-3 text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
              Catalog
            </p>
            <div className="space-y-1">
              <Link href="/products" className={getLinkClass('/products')}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black/20"><PackageIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" /></div>
                <span className="text-sm font-medium">Products</span>
              </Link>
              <a href="#" className="group flex items-center space-x-3 rounded-full p-1.5 pr-4 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black/20"><CategoryIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" /></div>
                <span className="text-sm font-medium">Categories</span>
              </a>
              <a href="#" className="group flex items-center space-x-3 rounded-full p-1.5 pr-4 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black/20"><StarBadgeIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" /></div>
                <span className="text-sm font-medium">Brands</span>
              </a>
              <a href="#" className="group flex items-center space-x-3 rounded-full p-1.5 pr-4 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black/20"><LayersIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" /></div>
                <span className="text-sm font-medium">Collections</span>
              </a>
            </div>
          </div>
        )}

        {/* Marketing Section */}
        {hasAccess(['SUPER_ADMIN', 'SALES_MANAGER']) && (
          <div>
            <p className="mb-2 px-3 text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
              Marketing
            </p>
            <div className="space-y-1">
              <a href="#" className="group flex items-center space-x-3 rounded-full p-1.5 pr-4 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black/20"><ZapIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" /></div>
                <span className="text-sm font-medium">Campaigns</span>
              </a>
              <a href="#" className="group flex items-center space-x-3 rounded-full p-1.5 pr-4 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black/20"><TagIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" /></div>
                <span className="text-sm font-medium">Discounts</span>
              </a>
            </div>
          </div>
        )}

        {/* System Section */}
        <div>
          <p className="mb-2 px-3 text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
            System
          </p>
          <div className="space-y-1">
            {hasAccess(['SUPER_ADMIN']) && (
              <>
                <a href="#" className="group flex items-center space-x-3 rounded-full p-1.5 pr-4 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black/20"><SettingsIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" /></div>
                  <span className="text-sm font-medium">Settings</span>
                </a>
                <a href="#" className="group flex items-center space-x-3 rounded-full p-1.5 pr-4 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black/20"><ShieldCheckIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" /></div>
                  <span className="text-sm font-medium">Security</span>
                </a>
              </>
            )}
            <a href="#" className="group flex items-center space-x-3 rounded-full p-1.5 pr-4 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black/20"><LifeBuoyIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" /></div>
              <span className="text-sm font-medium">Get Help</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </aside>
  );
}
