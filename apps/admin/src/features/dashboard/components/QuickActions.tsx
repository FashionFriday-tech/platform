'use client';

import React from 'react';
import Link from 'next/link';

import { ArrowUpRightIcon, PackageIcon, PlusIcon, ShoppingBagIcon, TagIcon } from '@ff/ui';

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  badge: string;
  colorClass: string;
}

const ACTIONS: QuickActionProps[] = [
  {
    title: 'Add Product',
    description: 'Create new catalog item',
    icon: PackageIcon,
    href: '/products/add',
    badge: 'Catalog',
    colorClass: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  },
  {
    title: 'Process Orders',
    description: 'Review pending orders',
    icon: ShoppingBagIcon,
    href: '/orders?status=PENDING',
    badge: 'Fulfillment',
    colorClass: 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
  },
  {
    title: 'Campaigns',
    description: 'Launch promotional banner',
    icon: TagIcon,
    href: '/campaigns',
    badge: 'Marketing',
    colorClass: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
  },
  {
    title: 'Invite Team',
    description: 'Add staff or admin',
    icon: PlusIcon,
    href: '/team?action=invite',
    badge: 'Access',
    colorClass: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  },
];

export function QuickActions() {
  return (
    <div className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-black/5 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#141417]">
      <div>
        <div className="flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/5">
          <div>
            <h2 className="text-lg font-bold text-black dark:text-white">Quick Actions</h2>
            <p className="mt-0.5 text-xs text-black/60 dark:text-white/60">
              One-click operational workflows
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {ACTIONS.map((action, idx) => (
            <Link
              key={idx}
              href={action.href}
              className="group relative flex flex-col justify-between gap-3 rounded-2xl border border-black/5 bg-black/[0.015] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-black/15 hover:bg-black/[0.04] hover:shadow-md dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/20 dark:hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${action.colorClass}`}
                >
                  <action.icon className="h-5 w-5" />
                </div>
                <ArrowUpRightIcon className="h-4 w-4 text-black/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-black dark:text-white/30 dark:group-hover:text-white" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-black dark:text-white">{action.title}</h3>
                </div>
                <p className="mt-0.5 text-xs text-black/50 dark:text-white/50">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-black/5 pt-4 dark:border-white/5">
        <p className="text-center text-[11px] font-medium text-black/40 dark:text-white/40">
          Admin shortcuts for quick management
        </p>
      </div>
    </div>
  );
}
