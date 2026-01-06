// app/profile/page.tsx
import { Header } from "@/components/layout/Header";
import ProfileHero from "@/components/sections/profile/ProfileHero";
import QuickLinksGrid from "@/components/sections/profile/QuickLinksGrid";

export default function ProfileOverviewPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-50/50 font-sans px-2 sm:px-10">
      <Header />
      <main className="flex-1 w-full h-full overflow-y-auto hide-scrollbar">
        <div className="sm:py-24">
          <ProfileHero />
          <QuickLinksGrid />

          <div className="mt-8 p-8 bg-white rounded-4xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
            <p className="text-zinc-500">No recent orders placed yet.</p>
          </div>
          <div className="h-20" />
        </div>
      </main>
    </div>
  );
}
