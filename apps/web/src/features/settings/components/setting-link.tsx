import React from 'react';

import { ChevronRightIcon } from '@ff/ui';

interface SettingLinkProps {
  icon: React.ReactNode;
  label: string;
}

export function SettingLink({ icon, label }: SettingLinkProps) {
  return (
    <div className="hover:bg-foreground/5 group flex cursor-pointer items-center justify-between p-6 text-left transition-colors">
      <div className="flex items-center gap-4">
        <div className="bg-foreground text-background rounded-2xl p-3">{icon}</div>
        <span className="text-sm font-black tracking-tight uppercase italic transition-transform group-hover:translate-x-1">
          {label}
        </span>
      </div>
      <ChevronRightIcon size={18} className="text-foreground-subtle/30" />
    </div>
  );
}
