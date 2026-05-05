import React from 'react';
import { motion } from 'motion/react';
import { SearchIcon, FilterIcon } from '@ff/ui';
import { CustomSelect } from '../../../components/ui/CustomSelect';

interface CustomersFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Blocked', value: 'blocked' },
];

export function CustomersFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: CustomersFilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-4 xl:flex-row xl:items-center xl:justify-between dark:border-white/5 dark:bg-[#111111]"
    >
      <div className="relative max-w-md flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <SearchIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
        </div>
        <input
          type="text"
          placeholder="Search customers by name, email or phone..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-11 text-sm text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60">
          <FilterIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Filters:</span>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="cursor-pointer appearance-none rounded-xl border border-black/10 bg-black/5 py-2 pr-8 pl-3 text-sm transition-all outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/30"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        
        <button className="flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95 dark:bg-white dark:text-black">
          Export
        </button>
      </div>
    </motion.div>
  );
}
