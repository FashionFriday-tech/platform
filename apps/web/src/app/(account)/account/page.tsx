"use client";

import { ProfileHero, QuickLinksGrid } from "@/features/profile";
import { HistoryIcon, StarIcon, HeartIcon, ShieldCheckIcon } from "@ff/ui";

export default function ProfileOverviewPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="mx-auto max-w-8xl px-2 sm:px-10 sm:py-16">
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
          <div className="rounded-[2.5rem] bg-background-muted/30 border border-border p-6 md:p-12">
            <header className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground-subtle mb-1">
                  Timeline
                </h2>
                <p className="text-3xl font-black uppercase tracking-tighter">
                  Recent Activity
                </p>
              </div>
              <button className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground hover:text-brand transition-colors">
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
                isLast
              />
            </div>

            {/* CTA for Mobile */}
            <button className="w-full mt-8 sm:hidden text-xs font-bold uppercase tracking-widest text-foreground-subtle border border-border py-4 rounded-full active:bg-background-muted">
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
  isLast?: boolean;
}

function ActivityItem({ icon, title, desc, time, isLast }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-6 py-6">
      {/* Icon Circle */}
      <div className="shrink-0 w-10 h-10 rounded-2xl bg-background border border-border flex items-center justify-center text-foreground shadow-sm">
        {icon}
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h3 className="text-sm font-bold uppercase tracking-tight text-foreground">
            {title}
          </h3>
          <span className="text-[10px] font-medium uppercase tracking-widest text-foreground-subtle shrink-0">
            {time}
          </span>
        </div>
        <p className="mt-1 text-xs text-foreground-muted leading-relaxed max-w-lg">
          {desc}
        </p>
      </div>
    </div>
  );
}
