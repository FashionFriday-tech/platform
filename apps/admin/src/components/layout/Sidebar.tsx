'use client';

import {
  HomeIcon,
  ActivityIcon,
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
      ? 'flex items-center space-x-3 rounded-lg bg-black px-3 py-2.5 text-white transition-all dark:bg-white dark:text-black'
      : 'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white';
  };

  const hasAccess = (allowedRoles: string[]) => allowedRoles.includes(role);

  return (
    <aside className="glass-panel relative sticky top-4 z-10 my-4 mr-2 ml-4 flex hidden h-[calc(100vh-2rem)] w-64 flex-shrink-0 flex-col overflow-hidden rounded-2xl border-black/5 md:flex dark:border-white/5">
      <div className="flex items-center space-x-3 p-6 pb-2">
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden">
          <img src="/images/logos/ff-logo.png" alt="Fashion Friday" className="h-full w-full object-contain" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">FashionFriday</h1>
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
                <HomeIcon className="h-5 w-5 opacity-70" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              {hasAccess(['SUPER_ADMIN', 'SALES_MANAGER']) && (
                <a href="#" className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
                  <ActivityIcon className="h-5 w-5 opacity-70" />
                  <span className="text-sm font-medium">Analytics</span>
                </a>
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
                  <ShoppingBagIcon className="h-5 w-5 opacity-70" />
                  <span className="text-sm font-medium">Orders</span>
                </div>
                <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs font-medium text-black dark:bg-white/10 dark:text-white">
                  16
                </span>
              </Link>
              <a href="#" className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
                <UsersIcon className="h-5 w-5 opacity-70" />
                <span className="text-sm font-medium">Customers</span>
              </a>
              <a href="#" className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
                <StarIcon className="h-5 w-5 opacity-70" />
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
                <PackageIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Products</span>
              </Link>
              <a href="#" className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
                <CategoryIcon className="h-5 w-5 opacity-70" />
                <span className="text-sm font-medium">Categories</span>
              </a>
              <a href="#" className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
                <StarBadgeIcon className="h-5 w-5 opacity-70" />
                <span className="text-sm font-medium">Brands</span>
              </a>
              <a href="#" className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
                <LayersIcon className="h-5 w-5 opacity-70" />
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
              <a href="#" className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
                <ZapIcon className="h-5 w-5 opacity-70" />
                <span className="text-sm font-medium">Campaigns</span>
              </a>
              <a href="#" className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
                <TagIcon className="h-5 w-5 opacity-70" />
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
                <a href="#" className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
                  <SettingsIcon className="h-5 w-5 opacity-70" />
                  <span className="text-sm font-medium">Settings</span>
                </a>
                <a href="#" className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
                  <ShieldCheckIcon className="h-5 w-5 opacity-70" />
                  <span className="text-sm font-medium">Security</span>
                </a>
              </>
            )}
            <a href="#" className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
              <LifeBuoyIcon className="h-5 w-5 opacity-70" />
              <span className="text-sm font-medium">Get Help</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </aside>
  );
}
