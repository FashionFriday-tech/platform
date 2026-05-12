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
  const CardWrapper = href ? Link : 'div';
  const wrapperProps = href ? { href } : {};

  return (
    <CardWrapper
      {...(wrapperProps as any)}
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
          <p className="text-sm font-bold tracking-wider text-black/70 uppercase dark:text-white/70">
            {title}
          </p>
        </div>

        <div>
          <p className="text-4xl font-black text-black dark:text-white">{value}</p>
          <p
            className={`mt-2 text-sm font-medium ${
              trend === 'up'
                ? 'text-green-600 dark:text-green-400'
                : trend === 'down'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-black/60 dark:text-white/60'
            }`}
          >
            {subtitle}{' '}
            {href && (
              <span className="ml-1 opacity-0 transition-opacity group-hover:opacity-100">→</span>
            )}
          </p>
        </div>
      </div>
    </CardWrapper>
  );
}
