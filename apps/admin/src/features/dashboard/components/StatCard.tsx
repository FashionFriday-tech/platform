import React from 'react';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  iconColorClass?: string;
  iconBgClass?: string;
  href?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ title, value, subtitle, icon: Icon, href, trend }: StatCardProps) {
  const content = (
    <div className="group relative flex h-full min-w-[240px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black via-[#0d0d10] to-[#1c1c24] px-5 py-4 text-white shadow-lg md:min-w-0 md:shrink dark:border-black/10 dark:bg-white dark:from-white dark:via-[#fafafa] dark:to-[#f0f0f0] dark:text-black dark:shadow-sm">
      {/* Subtle Ambient Glow & Watermark Icon */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Icon className="absolute -right-2 -bottom-2 h-20 w-20 text-white/[0.04] dark:text-black/[0.04]" />
        <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/[0.03] blur-xl dark:bg-black/[0.02]" />
      </div>

      {/* Top Row: Title & Mini Icon Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <dt className="text-xs font-bold tracking-wider text-white/70 uppercase dark:text-black/60">
          {title}
        </dt>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-md dark:bg-black/5 dark:text-black">
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Bottom Row: Metric & Subtitle with Trend */}
      <div className="relative z-10 mt-3 flex items-baseline justify-between gap-2">
        <dd className="text-2xl font-black tracking-tight text-white md:text-3xl dark:text-black">
          {value}
        </dd>
        {subtitle && (
          <div className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                trend === 'up' ? 'bg-emerald-400' : trend === 'down' ? 'bg-rose-400' : 'bg-blue-400'
              }`}
            />
            <span className="text-[10px] font-bold tracking-wider text-white/40 uppercase dark:text-black/40">
              {subtitle}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full min-w-[240px] shrink-0 md:min-w-0 md:shrink">
        {content}
      </Link>
    );
  }

  return content;
}
