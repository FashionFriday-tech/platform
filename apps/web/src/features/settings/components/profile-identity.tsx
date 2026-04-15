import React from 'react';

import { ChevronRightIcon } from '@ff/ui';

interface ProfileIdentityProps {
  initials: string;
  user: { name?: string | null; email?: string | null; phone?: string | null } | null;
  onClick: () => void;
}

export function ProfileIdentity({ initials, user, onClick }: ProfileIdentityProps) {
  return (
    <section
      onClick={onClick}
      className="bg-background border-border/40 flex cursor-pointer items-center gap-5 rounded-[2.5rem] border p-8 shadow-sm"
    >
      <div className="bg-foreground text-background flex h-20 w-20 items-center justify-center rounded-full text-3xl font-black uppercase italic">
        {initials}
      </div>
      <div className="flex-1 text-left">
        <h2 className="text-xl leading-none font-black tracking-tight uppercase italic">
          {user ? user.name || user.phone : 'Guest User'}
        </h2>
        <p className="text-foreground-subtle mt-2 text-[10px] font-bold tracking-widest uppercase opacity-60">
          {user ? user.email || user.phone : 'Sign in to sync account'}
        </p>
      </div>
      <ChevronRightIcon size={20} className="text-foreground-subtle/30" />
    </section>
  );
}
