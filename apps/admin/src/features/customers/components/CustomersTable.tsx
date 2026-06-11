import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ChevronDownIcon, ChevronUpIcon, UserIcon } from '@ff/ui';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { type Customer, type SortDirection, type SortField } from '../types';

interface CustomersTableProps {
  customers: Customer[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onToggleStatus: (customerId: string) => void;
}

function SortButton({
  label,
  field,
  sortField,
  sortDirection,
  onSort,
}: {
  label: string;
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}) {
  const isActive = sortField === field;

  return (
    <div
      onClick={() => {
        onSort(field);
      }}
      className="group flex cursor-pointer items-center gap-1.5 font-semibold tracking-wider transition-colors select-none"
    >
      <span
        className={`text-xs uppercase transition-colors ${
          isActive
            ? 'font-black text-white dark:text-black'
            : 'text-white/60 hover:text-white dark:text-black/60 dark:hover:text-black'
        }`}
      >
        {label}
      </span>
      {isActive ? (
        <div className="flex h-4 w-4 items-center justify-center rounded bg-white text-black shadow-xs dark:bg-black dark:text-white">
          {sortDirection === 'asc' ? (
            <ChevronUpIcon className="h-3 w-3" />
          ) : (
            <ChevronDownIcon className="h-3 w-3" />
          )}
        </div>
      ) : (
        <ChevronDownIcon className="h-3 w-3 text-white/30 opacity-0 group-hover:opacity-100 dark:text-black/30" />
      )}
    </div>
  );
}

export function CustomersTable({
  customers,
  sortField,
  sortDirection,
  onSort,
  onToggleStatus,
}: CustomersTableProps) {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const getStatusBadge = (status: 'active' | 'blocked') => {
    if (status === 'active') {
      return (
        <span className="inline-flex min-w-[75px] items-center justify-center rounded-lg border border-green-200/80 bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 dark:border-green-500/25 dark:bg-green-500/15 dark:text-green-400">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex min-w-[75px] items-center justify-center rounded-lg border border-red-200/80 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 dark:border-red-500/25 dark:bg-red-500/15 dark:text-red-400">
        Blocked
      </span>
    );
  };

  if (customers.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-black/10 bg-white p-8 text-center shadow-xs dark:border-white/10 dark:bg-[#141417]">
        <p className="text-black/50 dark:text-white/50">No customers found.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-slate-50/50 p-2.5 shadow-xs dark:border-white/10 dark:bg-black/20">
      <div className="scrollbar-hide flex-1 overflow-x-auto overflow-y-auto">
        <div className="flex min-w-[1050px] flex-col gap-2.5 pb-2">
          {/* Header Tab - Fixed / Sticky on Top (Black in Light Mode) */}
          <div className="sticky top-0 z-20 pb-0.5">
            <div className="grid grid-cols-[minmax(220px,2fr)_minmax(180px,1.5fr)_minmax(130px,1fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(80px,0.8fr)_minmax(100px,0.9fr)_minmax(80px,0.7fr)] items-center rounded-xl border border-black/10 bg-black px-6 py-3.5 text-white shadow-md backdrop-blur-md dark:border-white/10 dark:bg-white dark:text-black dark:shadow-sm">
              <SortButton
                label="Customer"
                field="name"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Email
              </div>
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Phone
              </div>
              <SortButton
                label="Joined Date"
                field="joinDate"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <SortButton
                label="Total Spent"
                field="totalSpent"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <SortButton
                label="Orders"
                field="ordersCount"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Status
              </div>
              <div className="text-right text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Actions
              </div>
            </div>
          </div>

          {/* Row Tabs (White in Light Mode) */}
          {customers.map((customer, index) => (
            <div
              key={customer.id}
              onClick={() => {
                router.push(`/customers/${customer.id}`);
              }}
              className="group relative grid cursor-pointer grid-cols-[minmax(220px,2fr)_minmax(180px,1.5fr)_minmax(130px,1fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(80px,0.8fr)_minmax(100px,0.9fr)_minmax(80px,0.7fr)] items-center rounded-xl border border-black/5 bg-white px-6 py-3.5 text-black shadow-xs transition-all duration-200 hover:border-black/15 hover:shadow-md active:scale-[0.995] dark:border-white/10 dark:bg-[#141417] dark:text-white dark:shadow-sm dark:hover:border-white/20"
            >
              {/* Customer Name & Avatar */}
              <div className="flex min-w-0 items-center gap-3 pr-4">
                <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-black text-white dark:border-white/10 dark:bg-black dark:text-white">
                  {customer.avatar ? (
                    <Image
                      width={40}
                      height={40}
                      src={
                        customer.avatar.includes('dicebear.com') &&
                        !customer.avatar.includes('backgroundColor=')
                          ? `${customer.avatar}&backgroundColor=000000&textColor=ffffff`
                          : customer.avatar
                      }
                      alt={customer.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <span className="block truncate font-bold text-black transition-colors group-hover:underline dark:text-white">
                    {customer.name}
                  </span>
                  <span className="truncate text-xs font-medium text-black/50 dark:text-white/50">
                    {customer.id}
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="truncate pr-4 text-xs font-medium text-black/70 dark:text-white/70">
                {customer.email}
              </div>

              {/* Phone */}
              <div className="truncate text-xs font-medium text-black/80 dark:text-white/80">
                {customer.phone}
              </div>

              {/* Joined Date */}
              <div className="text-xs font-medium whitespace-nowrap text-black/70 dark:text-white/70">
                {new Date(customer.joinDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>

              {/* Total Spent */}
              <div className="font-bold text-black dark:text-white">
                ₹{customer.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>

              {/* Orders */}
              <div className="text-sm font-semibold text-black dark:text-white">
                {customer.ordersCount}
              </div>

              {/* Status */}
              <div>{getStatusBadge(customer.status)}</div>

              {/* Actions Dropdown */}
              <div
                className="relative text-right"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(openDropdown === customer.id ? null : customer.id);
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-black/40 transition-colors hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </button>

                {openDropdown === customer.id && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => {
                        setOpenDropdown(null);
                      }}
                    />
                    <div
                      className={twMerge(
                        'absolute right-0 z-50 w-44 rounded-xl border border-black/10 bg-white p-1 shadow-xl dark:border-white/10 dark:bg-[#1a1a1a]',
                        index >= customers.length - 2 ? 'bottom-9' : 'top-9',
                      )}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStatus(customer.id);
                          setOpenDropdown(null);
                        }}
                        className={twMerge(
                          clsx(
                            'w-full rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors',
                            customer.status === 'active'
                              ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10'
                              : 'text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-500/10',
                          ),
                        )}
                      >
                        {customer.status === 'active' ? 'Block User' : 'Unblock User'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/customers/${customer.id}`);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-black transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/5"
                      >
                        View Details
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
