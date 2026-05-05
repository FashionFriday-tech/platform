import React from 'react';
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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-md flex-1">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
        <input
          type="text"
          placeholder="Search customers by name, email or phone..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white/50 py-2.5 pl-10 pr-4 text-sm text-black placeholder:text-black/40 focus:border-black/20 focus:outline-none focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-black/50 dark:text-white dark:placeholder:text-white/40 dark:focus:border-white/20 dark:focus:ring-white/5"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60">
          <FilterIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Filters:</span>
        </div>

        <CustomSelect
          options={statusOptions}
          value={statusFilter}
          onChange={onStatusChange}
          placeholder="Status"
        />
      </div>
    </div>
  );
}
