'use client';

import { HeartIcon, HistoryIcon, ShieldCheckIcon, StarIcon } from '@ff/ui';

import { ProfileHero, QuickLinksGrid } from '@/features/profile';

export default function ProfileOverviewPage() {
  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
      <main className="max-w-8xl mx-auto px-2 sm:px-10 sm:py-16">
        {/* 1. Hero Section */}
        <section>
          <ProfileHero />
        </section>

        {/* 2. Grid Navigation */}
        <section>
          <QuickLinksGrid />
        </section>

        {/* 3. Recent Activities Section */}
        <section className="mt-12">
          <div className="bg-background-muted/30 border-border rounded-[2.5rem] border p-6 md:p-12">
            <header className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="text-foreground-subtle mb-1 text-[10px] font-bold uppercase tracking-[0.3em]">
                  Timeline
                </h2>
                <p className="text-3xl font-black uppercase tracking-tighter">Recent Activity</p>
              </div>
              <button className="text-foreground hover:text-brand hidden items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors sm:flex">
                <HistoryIcon size={14} />
                Full History
              </button>
            </header>

            {/* Activity List */}
            <div className="flex flex-col">
              <ActivityItem
                icon={<StarIcon size={16} className="text-brand" />}
                title="Earned 500 Loyalty Points"
                desc="Bonus points for completing your style profile."
                time="2 hours ago"
              />
              <ActivityItem
                icon={<HeartIcon size={16} />}
                title="Added to Favorites"
                desc="Oversized Wool Blazer added to your wishlist."
                time="Yesterday"
              />
              <ActivityItem
                icon={<ShieldCheckIcon size={16} />}
                title="Security Update"
                desc="Two-factor authentication successfully enabled."
                time="Jan 08, 2026"
                _isLast
              />
            </div>

            {/* CTA for Mobile */}
            <button className="text-foreground-subtle border-border active:bg-background-muted mt-8 w-full rounded-full border py-4 text-xs font-bold uppercase tracking-widest sm:hidden">
              View Full History
            </button>
          </div>
        </section>

        <div className="h-20" />
      </main>
    </div>
  );
}

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  time: string;
  _isLast?: boolean;
}

function ActivityItem({ icon, title, desc, time, _isLast }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-6 py-6">
      {/* Icon Circle */}
      <div className="bg-background border-border text-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border shadow-sm">
        {icon}
      </div>

      {/* Text Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
          <h3 className="text-foreground text-sm font-bold uppercase tracking-tight">{title}</h3>
          <span className="text-foreground-subtle shrink-0 text-[10px] font-medium uppercase tracking-widest">
            {time}
          </span>
        </div>
        <p className="text-foreground-muted mt-1 max-w-lg text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
