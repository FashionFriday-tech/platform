import React from 'react';

interface ProfileSectionProps {
  title: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
  badge?: React.ReactNode;
}

export const ProfileSection = ({ title, icon: Icon, children, badge }: ProfileSectionProps) => (
  <section className="bg-background-elevated border-border overflow-hidden rounded-4xl border shadow-sm">
    <div className="bg-background-muted border-border flex items-center justify-between gap-2 border-b px-6 py-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={18} className="text-foreground" />}
        <h3 className="text-foreground font-bold">{title}</h3>
      </div>
      {badge && (
        <div className="text-foreground border-foreground/20 flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium">
          {badge}
        </div>
      )}
    </div>
    <div className="p-6">{children}</div>
  </section>
);
