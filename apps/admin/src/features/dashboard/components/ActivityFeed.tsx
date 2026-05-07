import React from 'react';
import { ShoppingBagIcon, TagIcon, PackageIcon } from '@ff/ui';

interface Activity {
  id: string;
  type: 'order' | 'campaign' | 'product';
  title: string;
  time: string;
  user: {
    name: string;
    avatar: string;
  };
}

const MOCK_ACTIVITY: Activity[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order #4829 was fulfilled and shipped',
    time: '2 minutes ago',
    user: { name: 'Jimmy Sullivan', avatar: 'https://i.pravatar.cc/150?u=jimmy' },
  },
  {
    id: '2',
    type: 'campaign',
    title: 'Summer Sale banner was activated',
    time: '1 hour ago',
    user: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  },
  {
    id: '3',
    type: 'product',
    title: 'Restocked "Classic White Sneaker" (Qty: 200)',
    time: '3 hours ago',
    user: { name: 'Marcus Johnson', avatar: 'https://i.pravatar.cc/150?u=marcus' },
  },
  {
    id: '4',
    type: 'order',
    title: 'Order #4828 was placed (₹4,500)',
    time: '5 hours ago',
    user: { name: 'System', avatar: 'https://i.pravatar.cc/150?u=sys' },
  },
];

export function ActivityFeed() {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-white/50 bg-white/90 p-8 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#111111]/90">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-black dark:text-white">Activity Feed</h2>
          <p className="mt-1 text-sm font-medium text-black/70 dark:text-white/70">Live operational updates</p>
        </div>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">View All</button>
      </div>
      
      <div className="relative mt-4 flex flex-col gap-8 before:absolute before:left-[19px] before:top-4 before:h-[calc(100%-32px)] before:w-[2px] before:bg-black/10 dark:before:bg-white/10">
        {MOCK_ACTIVITY.map((activity) => (
          <div key={activity.id} className="relative z-10 flex gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-md ring-4 ring-white dark:bg-[#1a1a1a] dark:ring-[#111]">
              {activity.type === 'order' && <ShoppingBagIcon className="h-4 w-4 text-orange-500" />}
              {activity.type === 'campaign' && <TagIcon className="h-4 w-4 text-purple-500" />}
              {activity.type === 'product' && <PackageIcon className="h-4 w-4 text-blue-500" />}
            </div>
            
            <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-[#1a1a1a]">
              <p className="text-sm font-semibold text-black dark:text-white">{activity.title}</p>
              <div className="flex items-center gap-2">
                <img src={activity.user.avatar} alt={activity.user.name} className="h-5 w-5 rounded-full object-cover" />
                <p className="text-xs font-medium text-black/60 dark:text-white/60">{activity.user.name} • {activity.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
