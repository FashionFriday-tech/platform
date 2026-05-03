import { 
  HomeIcon, ActivityIcon, ShoppingBagIcon, PackageIcon, CategoryIcon, 
  StarBadgeIcon, LayersIcon, UsersIcon, StarIcon, ZapIcon, TagIcon, 
  SettingsIcon, ShieldCheckIcon, LifeBuoyIcon 
} from "@ff/ui";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 glass-panel ml-4 my-4 mr-2 flex flex-col hidden md:flex rounded-2xl overflow-hidden relative z-10 border-black/5 dark:border-white/5 sticky top-4 h-[calc(100vh-2rem)]">
      <div className="p-6 pb-2 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-lg shadow-lg">
          F
        </div>
        <h1 className="text-xl font-bold tracking-tight">FashionFriday</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
        {/* Overview Section */}
        <div>
          <p className="px-3 text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wider mb-2">Overview</p>
          <div className="space-y-1">
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
              <HomeIcon className="w-5 h-5 opacity-70" />
              <span className="font-medium text-sm">Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
              <ActivityIcon className="w-5 h-5 opacity-70" />
              <span className="font-medium text-sm">Analytics</span>
            </a>
          </div>
        </div>

        {/* E-Commerce Section */}
        <div>
          <p className="px-3 text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wider mb-2">E-Commerce</p>
          <div className="space-y-1">
            <a href="#" className="flex items-center justify-between px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
              <div className="flex items-center space-x-3">
                <ShoppingBagIcon className="w-5 h-5 opacity-70" />
                <span className="font-medium text-sm">Orders</span>
              </div>
              <span className="bg-black/10 dark:bg-white/10 text-black dark:text-white text-xs py-0.5 px-2 rounded-full font-medium">16</span>
            </a>
            <Link href="/products" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black transition-all">
              <PackageIcon className="w-5 h-5" />
              <span className="font-medium text-sm">Products</span>
            </Link>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
              <CategoryIcon className="w-5 h-5 opacity-70" />
              <span className="font-medium text-sm">Categories</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
              <StarBadgeIcon className="w-5 h-5 opacity-70" />
              <span className="font-medium text-sm">Brands</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
              <LayersIcon className="w-5 h-5 opacity-70" />
              <span className="font-medium text-sm">Collections</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
              <UsersIcon className="w-5 h-5 opacity-70" />
              <span className="font-medium text-sm">Customers</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
              <StarIcon className="w-5 h-5 opacity-70" />
              <span className="font-medium text-sm">Reviews</span>
            </a>
          </div>
        </div>

        {/* Marketing Section */}
        <div>
          <p className="px-3 text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wider mb-2">Marketing</p>
          <div className="space-y-1">
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
              <ZapIcon className="w-5 h-5 opacity-70" />
              <span className="font-medium text-sm">Campaigns</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
              <TagIcon className="w-5 h-5 opacity-70" />
              <span className="font-medium text-sm">Discounts</span>
            </a>
          </div>
        </div>

        {/* Settings Section */}
        <div>
          <p className="px-3 text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wider mb-2">System</p>
          <div className="space-y-1">
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
              <SettingsIcon className="w-5 h-5 opacity-70" />
              <span className="font-medium text-sm">Settings</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
              <ShieldCheckIcon className="w-5 h-5 opacity-70" />
              <span className="font-medium text-sm">Security</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all">
              <LifeBuoyIcon className="w-5 h-5 opacity-70" />
              <span className="font-medium text-sm">Get Help</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </aside>
  );
}
