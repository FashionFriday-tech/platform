'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  ActivityIcon,
  CategoryIcon,
  LayersIcon,
  LifeBuoyIcon,
  MessageSquareIcon,
  PackageIcon,
  SearchIcon,
  SettingsIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  StarBadgeIcon,
  StarIcon,
  StoreIcon,
  TagIcon,
  TrendingUpIcon,
  UsersIcon,
  ZapIcon,
} from '@ff/ui';

import { useAuth } from '@/contexts/AuthContext';
import { useOrderStats } from '@/features/orders';

import { SidebarFooter } from './SidebarFooter';

interface SidebarProps {
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export function Sidebar({
  isMobileOpen: controlledMobileOpen,
  setIsMobileOpen: setControlledMobileOpen,
}: SidebarProps = {}) {
  const pathname = usePathname() ?? '';
  const { user } = useAuth();
  const { unplacedCount, isLoading: isStatsLoading } = useOrderStats();
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);

  const isMobileOpen = controlledMobileOpen ?? internalMobileOpen;
  const setIsMobileOpen = setControlledMobileOpen ?? setInternalMobileOpen;

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  if (!user) {
    return null;
  }
  const role = user.role;

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
    return isActive
      ? 'group is-active flex items-center space-x-3 rounded-full bg-black p-1.5 pr-4 text-white transition-all dark:bg-white dark:text-black'
      : 'group flex items-center space-x-3 rounded-full p-1.5 pr-4 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white';
  };

  const hasAccess = (allowedRoles: string[]) => allowedRoles.includes(role);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => {
            setIsMobileOpen(false);
          }}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-3 left-3 z-50 flex h-[calc(100vh-1.5rem)] w-64 flex-shrink-0 flex-col overflow-hidden rounded-3xl border border-black/5 bg-white/85 shadow-lg shadow-black/5 backdrop-blur-2xl transition-transform duration-300 md:static md:my-3 md:ml-3 md:translate-x-0 dark:border-white/10 dark:bg-[#0e0e0e]/85 dark:shadow-black/40 ${
          isMobileOpen
            ? 'translate-x-0 shadow-2xl'
            : '-translate-x-[calc(100%+2rem)] md:translate-x-0'
        }`}
      >
        <div className="flex items-center space-x-2 p-6 pb-0.5">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden">
            <Image
              width={500}
              height={500}
              src="/images/logos/ff-logo.png"
              alt="Fashion Friday"
              className="h-full w-full object-contain dark:invert"
            />
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                    <ActivityIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                  </div>
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
                {hasAccess(['SUPER_ADMIN', 'SALES_MANAGER']) && (
                  <Link href="/analytics" className={getLinkClass('/analytics')}>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                      <TrendingUpIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                    </div>
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
                <Link
                  href="/orders"
                  className={getLinkClass('/orders').replace('space-x-3', 'justify-between')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                      <ShoppingBagIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                    </div>
                    <span className="text-sm font-medium">Orders</span>
                  </div>
                  <span className="flex aspect-square h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/10 text-[11px] leading-none font-bold text-black transition-colors group-[.is-active]:bg-white/20 group-[.is-active]:text-white dark:bg-white/10 dark:text-white dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                    {isStatsLoading ? '...' : unplacedCount}
                  </span>
                </Link>
                <Link href="/customers" className={getLinkClass('/customers')}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                    <UsersIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                  </div>
                  <span className="text-sm font-medium">Customers</span>
                </Link>
                <Link href="/reviews" className={getLinkClass('/reviews')}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                    <StarIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                  </div>
                  <span className="text-sm font-medium">Reviews</span>
                </Link>
                <Link href="/feedback" className={getLinkClass('/feedback')}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                    <MessageSquareIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                  </div>
                  <span className="text-sm font-medium">Feedback</span>
                </Link>
                <Link href="/searches" className={getLinkClass('/searches')}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                    <SearchIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                  </div>
                  <span className="text-sm font-medium">User Searches</span>
                </Link>
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                    <PackageIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                  </div>
                  <span className="text-sm font-medium">Products</span>
                </Link>
                <Link href="/categories" className={getLinkClass('/categories')}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                    <CategoryIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                  </div>
                  <span className="text-sm font-medium">Categories</span>
                </Link>
                <Link href="/brands" className={getLinkClass('/brands')}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                    <StarBadgeIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                  </div>
                  <span className="text-sm font-medium">Brands</span>
                </Link>
                <Link href="/sellers" className={getLinkClass('/sellers')}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                    <StoreIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                  </div>
                  <span className="text-sm font-medium">Sellers</span>
                </Link>
                <Link href="/collections" className={getLinkClass('/collections')}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                    <LayersIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                  </div>
                  <span className="text-sm font-medium">Collections</span>
                </Link>
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
                <Link href="/campaigns" className={getLinkClass('/campaigns')}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                    <ZapIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                  </div>
                  <span className="text-sm font-medium">Campaigns</span>
                </Link>
                <Link href="/whatsapp-reviews" className={getLinkClass('/whatsapp-reviews')}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                    <StarIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                  </div>
                  <span className="text-sm font-medium">WhatsApp Reviews</span>
                </Link>
                <Link href="/product-requests" className={getLinkClass('/product-requests')}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                    <TagIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                  </div>
                  <span className="text-sm font-medium">Product Requests</span>
                </Link>
                <Link href="/faqs" className={getLinkClass('/faqs')}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                    <LifeBuoyIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                  </div>
                  <span className="text-sm font-medium">FAQs</span>
                </Link>
              </div>
            </div>
          )}

          {/* Administration Section */}
          {hasAccess(['SUPER_ADMIN']) && (
            <div>
              <p className="mb-2 px-3 text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                Administration
              </p>
              <div className="space-y-1">
                <Link href="/team" className={getLinkClass('/team')}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                    <UsersIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                  </div>
                  <span className="text-sm font-medium">Team & Roles</span>
                </Link>
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
                  <a
                    href="#"
                    className="group flex items-center space-x-3 rounded-full p-1.5 pr-4 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                      <SettingsIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                    </div>
                    <span className="text-sm font-medium">Settings</span>
                  </a>
                  <a
                    href="#"
                    className="group flex items-center space-x-3 rounded-full p-1.5 pr-4 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                      <ShieldCheckIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                    </div>
                    <span className="text-sm font-medium">Security</span>
                  </a>
                </>
              )}
              <a
                href="#"
                className="group flex items-center space-x-3 rounded-full p-1.5 pr-4 text-black/60 transition-all hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 transition-all group-[.is-active]:bg-white/20 dark:bg-white/5 dark:group-[.is-active]:bg-black dark:group-[.is-active]:text-white">
                  <LifeBuoyIcon className="h-4 w-4 opacity-70 transition-all group-[.is-active]:opacity-100" />
                </div>
                <span className="text-sm font-medium">Get Help</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Fixed bottom box with Profile, Fullscreen, Notifications, and Theme Mode */}
        <SidebarFooter />
      </aside>
    </>
  );
}
