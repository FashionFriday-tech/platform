// eslint-disable-next-line unicorn/filename-case
'use client';

import { type Variants } from 'motion/react';

import { useAuth } from '@/contexts/AuthContext';

export function useDashboard() {
  const { user } = useAuth();

  const hasAccess = (allowedRoles: string[]) => {
    if (!user) {
      return false;
    }
    return allowedRoles.includes(user.role);
  };

  // Animation variants
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user: user!,
    hasAccess,
    container,
    item,
  };
}
