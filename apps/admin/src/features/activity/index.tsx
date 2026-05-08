'use client';

import React, { useState } from 'react';
import { ShoppingBagIcon, TagIcon, PackageIcon, UsersIcon, SearchIcon } from '@ff/ui';
import { MOCK_ACTIVITY_LOG, ActivityType, Activity } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { CustomSelect } from '../../components/ui/CustomSelect';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Activities' },
  { value: 'order', label: 'Orders' },
  { value: 'product', label: 'Products' },
  { value: 'campaign', label: 'Campaigns' },
  { value: 'team', label: 'Team' },
];

export function ActivityLogView() {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = MOCK_ACTIVITY_LOG.filter((activity) => {
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          activity.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getIconForType = (type: ActivityType) => {
    switch (type) {
      case 'order': return <ShoppingBagIcon className="h-4 w-4 text-orange-500" />;
      case 'campaign': return <TagIcon className="h-4 w-4 text-purple-500" />;
      case 'product': return <PackageIcon className="h-4 w-4 text-blue-500" />;
      case 'team': return <UsersIcon className="h-4 w-4 text-green-500" />;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black dark:text-white">Activity Log</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-64 rounded-xl border border-black/10 bg-white/50 pl-10 pr-4 text-sm text-black placeholder:text-black/40 focus:border-black/30 focus:outline-none focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-black/50 dark:text-white dark:placeholder:text-white/40 dark:focus:border-white/30 dark:focus:ring-white/5"
            />
          </div>
          <div className="w-48">
            <CustomSelect
              value={filterType}
              onChange={setFilterType}
              options={FILTER_OPTIONS}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-3xl border border-white/50 bg-white/90 p-8 shadow-xl backdrop-blur-2xl scrollbar-hide dark:border-white/10 dark:bg-[#111111]/90">
        <div className="relative flex flex-col gap-8 before:absolute before:left-[19px] before:top-4 before:h-[calc(100%-32px)] before:w-[2px] before:bg-black/10 dark:before:bg-white/10">
          <AnimatePresence mode="popLayout">
            {filteredActivities.map((activity) => (
              <motion.div
                key={activity.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
                className="relative z-10 flex gap-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-md ring-4 ring-white dark:bg-[#1a1a1a] dark:ring-[#111]">
                  {getIconForType(activity.type)}
                </div>
                
                <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-[#1a1a1a]">
                  <p className="text-sm font-semibold text-black dark:text-white">{activity.title}</p>
                  {activity.description && (
                    <p className="text-sm text-black/60 dark:text-white/60">{activity.description}</p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <img src={activity.user.avatar} alt={activity.user.name} className="h-5 w-5 rounded-full object-cover" />
                    <p className="text-xs font-medium text-black/60 dark:text-white/60">{activity.user.name} • {activity.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredActivities.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                <SearchIcon className="h-8 w-8 text-black/20 dark:text-white/20" />
              </div>
              <p className="text-lg font-semibold text-black dark:text-white">No activities found</p>
              <p className="mt-1 text-sm text-black/60 dark:text-white/60">Try adjusting your filters or search query.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
