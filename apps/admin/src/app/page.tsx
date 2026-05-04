'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ActivityIcon, ShoppingBagIcon, UsersIcon, PackageIcon } from '@ff/ui';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();
  const role = user.role;

  const hasAccess = (allowedRoles: string[]) => allowedRoles.includes(role);

  return (
    <div className="flex h-full w-full flex-col gap-8 overflow-y-auto p-4 scrollbar-hide md:p-8">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111] md:p-8">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Welcome back, {user.name}!
        </h1>
        <p className="text-black/50 dark:text-white/50">
          Here is what's happening with your store today.
        </p>
      </div>

      {/* Role Specific Content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {hasAccess(['SUPER_ADMIN', 'SALES_MANAGER']) && (
          <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5">
                <ActivityIcon className="h-5 w-5 opacity-70" />
              </div>
              <p className="text-sm font-bold tracking-wider text-black/50 uppercase dark:text-white/50">Total Sales</p>
            </div>
            <p className="text-3xl font-black">₹1,24,500</p>
            <p className="text-sm text-green-600 dark:text-green-400">+14.5% from yesterday</p>
          </div>
        )}

        {hasAccess(['SUPER_ADMIN', 'SALES_MANAGER']) && (
          <Link href="/orders" className="group flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:border-black/30 dark:border-white/10 dark:bg-[#111] dark:hover:border-white/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                <ShoppingBagIcon className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold tracking-wider text-black/50 uppercase dark:text-white/50">Pending Orders</p>
            </div>
            <p className="text-3xl font-black">16</p>
            <p className="text-sm text-black/50 dark:text-white/50 group-hover:text-black dark:group-hover:text-white">Needs fulfillment →</p>
          </Link>
        )}

        {hasAccess(['SUPER_ADMIN', 'PRODUCT_MANAGER']) && (
          <Link href="/products" className="group flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:border-black/30 dark:border-white/10 dark:bg-[#111] dark:hover:border-white/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                <PackageIcon className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold tracking-wider text-black/50 uppercase dark:text-white/50">Low Stock</p>
            </div>
            <p className="text-3xl font-black">24</p>
            <p className="text-sm text-black/50 dark:text-white/50 group-hover:text-black dark:group-hover:text-white">Products need restock →</p>
          </Link>
        )}

        {hasAccess(['SUPER_ADMIN', 'SALES_MANAGER']) && (
          <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5">
                <UsersIcon className="h-5 w-5 opacity-70" />
              </div>
              <p className="text-sm font-bold tracking-wider text-black/50 uppercase dark:text-white/50">New Customers</p>
            </div>
            <p className="text-3xl font-black">48</p>
            <p className="text-sm text-green-600 dark:text-green-400">+5.2% from last week</p>
          </div>
        )}
      </div>
      
      {/* Additional sections based on role can go here */}
      <div className="flex-1 rounded-2xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#111]">
        <h2 className="mb-6 text-xl font-bold">Recent Activity</h2>
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-black/20 bg-black/[0.02] dark:border-white/20 dark:bg-white/[0.02]">
          <p className="font-semibold text-black/40 dark:text-white/40">Activity feed will be displayed here</p>
        </div>
      </div>

    </div>
  );
}
