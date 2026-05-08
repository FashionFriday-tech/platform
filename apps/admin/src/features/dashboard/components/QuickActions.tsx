import React from 'react';
import Link from 'next/link';
import { PlusIcon, ShoppingBagIcon, PackageIcon, TagIcon } from '@ff/ui';

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  colorClass: string;
}

const ACTIONS: QuickActionProps[] = [
  {
    title: 'Add Product',
    description: 'Create a new inventory item',
    icon: PackageIcon,
    href: '/products/add',
    colorClass: 'bg-blue-500 text-white shadow-blue-500/30',
  },
  {
    title: 'Process Orders',
    description: 'Fulfill pending shipments',
    icon: ShoppingBagIcon,
    href: '/orders?status=PENDING',
    colorClass: 'bg-orange-500 text-white shadow-orange-500/30',
  },
  {
    title: 'New Campaign',
    description: 'Launch a promotional banner',
    icon: TagIcon,
    href: '/campaigns?action=new',
    colorClass: 'bg-purple-500 text-white shadow-purple-500/30',
  },
  {
    title: 'Invite Team',
    description: 'Add a new staff member',
    icon: PlusIcon,
    href: '/team?action=invite',
    colorClass: 'bg-green-500 text-white shadow-green-500/30',
  },
];

  export function QuickActions() {
    return (
      <div className="flex h-full flex-col gap-6 rounded-3xl border border-white/50 bg-white/90 p-8 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#111111]/90">
        <div>
          <h2 className="text-xl font-bold text-black dark:text-white">Quick Actions</h2>
          <p className="mt-1 text-sm font-medium text-black/70 dark:text-white/70">Common operational tasks</p>
        </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ACTIONS.map((action, idx) => (
          <Link
            key={idx}
            href={action.href}
            className="group flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/5 dark:bg-[#1a1a1a]"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-transform group-hover:scale-110 ${action.colorClass}`}>
              <action.icon className="h-6 w-6" />
            </div>
              <div>
                <h3 className="font-bold text-black dark:text-white">{action.title}</h3>
                <p className="mt-1 text-xs font-medium text-black/60 dark:text-white/60">{action.description}</p>
              </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
