import React from 'react';

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  time: string;
}

export function ActivityItem({ icon, title, desc, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-6 py-6">
      {/* Icon Circle */}
      <div className="bg-background border-border text-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border shadow-sm">
        {icon}
      </div>

      {/* Text Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
          <h3 className="text-foreground text-sm font-bold tracking-tight uppercase">{title}</h3>
          <span className="text-foreground-subtle shrink-0 text-[10px] font-medium tracking-widest uppercase">
            {time}
          </span>
        </div>
        <p className="text-foreground-muted mt-1 max-w-lg text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
