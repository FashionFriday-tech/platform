'use client';

import { Variants } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';

export function useDashboard() {
  const { user } = useAuth();
  const role = user.role;

  const hasAccess = (allowedRoles: string[]) => allowedRoles.includes(role);

  // Animation variants
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return {
    user,
    hasAccess,
    container,
    item,
  };
}
