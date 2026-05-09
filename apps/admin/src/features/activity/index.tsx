'use client';

import { SearchIcon } from '@ff/ui';
import { FILTER_OPTIONS } from './types';
import { useActivityLog } from './hooks/useActivityLog';
import { ActivityTimeline } from './components/ActivityTimeline';
import { CustomSelect } from '../../components/ui/CustomSelect';

export function ActivityLogView() {
  const {
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    filteredActivities,
  } = useActivityLog();

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

      <ActivityTimeline activities={filteredActivities} />
    </div>
  );
}
