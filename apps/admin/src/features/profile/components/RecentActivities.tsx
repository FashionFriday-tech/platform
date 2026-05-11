import React from 'react';

const ACTIVITIES = [
  {
    title: 'Updated profile picture',
    time: 'Just now',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    ),
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Approved Order #4829',
    time: '2 hours ago',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    ),
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    title: 'Changed notification preferences',
    time: 'Yesterday',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    ),
    color: 'text-zinc-500',
    bg: 'bg-zinc-500/10',
  },
  {
    title: 'Updated Fall Collection',
    time: '2 days ago',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
      />
    ),
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    title: 'Reviewed analytics dashboard',
    time: '3 days ago',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    ),
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
  },
  {
    title: 'Logged in',
    time: '1 week ago',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
      />
    ),
    color: 'text-zinc-500',
    bg: 'bg-zinc-500/10',
  },
];

export function RecentActivities() {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/40 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/20">
      <h3 className="mb-6 flex shrink-0 items-center gap-3 text-xs font-bold tracking-widest text-black/40 uppercase dark:text-white/40">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        My Recent Activities
      </h3>

      <div className="scrollbar-hide relative flex flex-1 flex-col gap-8 overflow-y-auto pr-4 before:absolute before:top-2 before:left-[19px] before:h-[calc(100%-16px)] before:w-[2px] before:bg-gradient-to-b before:from-indigo-500/30 before:via-purple-500/20 before:to-transparent">
        {ACTIVITIES.map((activity, i) => (
          <div
            key={i}
            className="group/item relative z-10 flex shrink-0 gap-6 transition-all duration-300 hover:translate-x-1"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm ring-4 ring-white transition-colors duration-300 dark:ring-[#1a1a1a] ${activity.bg} ${activity.color}`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {activity.icon}
              </svg>
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <p className="text-sm font-semibold text-black transition-colors duration-300 group-hover/item:text-indigo-600 dark:text-white dark:group-hover/item:text-indigo-400">
                {activity.title}
              </p>
              <p className="mt-0.5 text-xs font-medium text-black/50 dark:text-white/50">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
