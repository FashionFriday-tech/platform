'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ExternalLinkIcon, UserIcon as UIIcon } from '@ff/ui';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/auth-store';

import { quickLinks } from '../data/profile';

export function QuickLinksGrid() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 sm:gap-6 lg:grid-cols-5">
      {quickLinks.map((link, _index) => {
        const isLogoutLink = 'action' in link && link.action === 'logout';
        const displayLabel = isLogoutLink && !user ? 'Login' : link.label;
        const displayDescription =
          isLogoutLink && !user ? 'Sign in to your account' : link.description;
        const Icon = isLogoutLink && !user ? UIIcon : link.icon;
        const targetHref = isLogoutLink && !user ? '/login' : link.href;

        const content = (
          <>
            {/* Icon Container - Uses semantic background-muted */}
            <div className="border-border group-hover:bg-foreground group-hover:text-background relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-all duration-500 group-hover:rotate-6 sm:mb-6 sm:h-16 sm:w-16 sm:rounded-3xl">
              <Icon size={24} />
            </div>

            {/* Content Area */}
            <div className="flex-1 sm:flex-none">
              <h3 className="text-foreground text-lg tracking-tighter uppercase sm:text-xl sm:font-bold">
                {displayLabel}
              </h3>
              <p className="text-foreground mt-2 hidden text-xs leading-relaxed font-medium tracking-widest uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:block">
                {displayDescription}
              </p>
            </div>

            {/* Visual indicator for mobile links */}
            <div className="text-foreground-subtle group-hover:text-foreground transition-colors sm:hidden">
              <ExternalLinkIcon className="opacity-40" />
            </div>
          </>
        );

        const className =
          'bg-background border-border sm:bg-background-muted/30 hover:bg-background sm:hover:shadow-foreground/5 sm:hover:border-foreground/20 group relative flex items-center gap-6 border-b p-4 transition-all duration-500 sm:flex-col sm:items-center sm:rounded-4xl sm:border sm:p-6 sm:text-center sm:hover:-translate-y-2 sm:hover:shadow-2xl';

        if (isLogoutLink && user) {
          return (
            <button key={link.label} onClick={handleLogout} className={className}>
              {content}
            </button>
          );
        }

        return (
          <Link key={link.label} href={targetHref || '#'} className={className}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}
