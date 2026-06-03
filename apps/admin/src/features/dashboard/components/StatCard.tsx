import React from 'react';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  iconColorClass: string;
  iconBgClass: string;
  href?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColorClass,
  iconBgClass,
  href,
  trend,
}: StatCardProps) {
  const content = (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-white/50 bg-white/90 p-6 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-[#111111]/90 ${
        href ? 'cursor-pointer hover:bg-white dark:hover:bg-[#1a1a1a]' : ''
      }`}
    >
      {/* Decorative gradient orb behind the icon */}
      <div
        className={`absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-100 ${iconBgClass.replace('bg-', 'bg-')}`}
      />

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBgClass} ${iconColorClass}`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-black/60 dark:text-white/60">{title}</h4>
            <div className="text-2xl font-black text-black dark:text-white">{value}</div>
          </div>
        </div>

        {(subtitle || trend) && (
          <div className="flex items-center justify-between border-t border-black/5 pt-3 dark:border-white/5">
            {subtitle && (
              <span className="text-xs font-medium text-black/50 dark:text-white/50">
                {subtitle}
              </span>
            )}
            {trend && (
              <span
                className={`text-xs font-bold ${
                  trend === 'up'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : trend === 'down'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-black/60 dark:text-white/60'
                }`}
              >
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
