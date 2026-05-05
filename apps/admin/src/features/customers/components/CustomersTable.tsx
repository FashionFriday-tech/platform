import React, { useState } from 'react';
import { Customer, SortField, SortDirection } from '../types';
import { ChevronDownIcon, ChevronUpIcon } from '@ff/ui';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

interface CustomersTableProps {
  customers: Customer[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onToggleStatus: (customerId: string) => void;
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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="ml-1 inline h-4 w-4" />
    ) : (
      <ChevronDownIcon className="ml-1 inline h-4 w-4" />
    );
  };

  const getStatusBadge = (status: 'active' | 'blocked') => {
    if (status === 'active') {
      return (
        <span className="inline-flex justify-center min-w-[80px] items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex justify-center min-w-[80px] items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/20 ring-inset dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20">
        Blocked
      </span>
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white dark:border-white/5 dark:bg-[#111111]">
      <div className="flex-1 overflow-auto scrollbar-hide">
        <table className="w-full text-left text-sm text-black dark:text-white relative">
          <thead className="sticky top-0 z-30 border-b border-black/5 bg-[#f8f9fa] text-xs font-medium text-black/60 uppercase dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/60">
            <tr>
              <th
                className="sticky left-0 z-20 min-w-[250px] bg-white px-6 py-4 dark:bg-[#111111] cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5 whitespace-nowrap"
                onClick={() => onSort('name')}
              >
                Customer <SortIcon field="name" />
              </th>
              <th className="px-6 py-4 whitespace-nowrap">Email</th>
              <th className="px-6 py-4 whitespace-nowrap">Phone</th>
              <th
                className="cursor-pointer px-6 py-4 transition-colors hover:bg-black/5 dark:hover:bg-white/5 whitespace-nowrap"
                onClick={() => onSort('joinDate')}
              >
                Joined Date <SortIcon field="joinDate" />
              </th>
              <th
                className="cursor-pointer px-6 py-4 transition-colors hover:bg-black/5 dark:hover:bg-white/5 whitespace-nowrap"
                onClick={() => onSort('totalSpent')}
              >
                Total Spent <SortIcon field="totalSpent" />
              </th>
              <th
                className="cursor-pointer px-6 py-4 transition-colors hover:bg-black/5 dark:hover:bg-white/5 whitespace-nowrap"
                onClick={() => onSort('ordersCount')}
              >
                Orders <SortIcon field="ordersCount" />
              </th>
              <th className="px-6 py-4 whitespace-nowrap">Status</th>
              <th className="sticky right-0 z-20 bg-white px-6 py-4 text-right dark:bg-[#111111] whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {customers.map((customer, index) => (
              <tr
                key={customer.id}
                onClick={() => router.push(`/customers/${customer.id}`)}
                className={twMerge("group cursor-pointer relative transition-colors", openDropdown === customer.id ? "z-20 bg-gray-50 dark:bg-white/5" : "")}
              >
                <td className="sticky left-0 z-10 min-w-[250px] bg-white px-6 py-4 dark:bg-[#111111] whitespace-nowrap group-hover:bg-gray-50 dark:group-hover:bg-[#1a1a1a]">
                  <div className="flex items-center gap-3">
                    <img src={customer.avatar} alt={customer.name} className="h-10 w-10 rounded-full object-cover border border-black/10 dark:border-white/10" />
                    <div className="flex flex-col">
                      <span className="font-medium">{customer.name}</span>
                      <span className="text-xs text-black/50 dark:text-white/50">{customer.id}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black/60 dark:text-white/60 group-hover:bg-black/[0.02] dark:group-hover:bg-white/[0.02]">{customer.email}</td>
                <td className="px-6 py-4 whitespace-nowrap group-hover:bg-black/[0.02] dark:group-hover:bg-white/[0.02]">{customer.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-black/60 dark:text-white/60 group-hover:bg-black/[0.02] dark:group-hover:bg-white/[0.02]">
                  {new Date(customer.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="px-6 py-4 font-semibold whitespace-nowrap group-hover:bg-black/[0.02] dark:group-hover:bg-white/[0.02]">
                  ₹{customer.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap group-hover:bg-black/[0.02] dark:group-hover:bg-white/[0.02]">{customer.ordersCount}</td>
                <td className="px-6 py-4 whitespace-nowrap group-hover:bg-black/[0.02] dark:group-hover:bg-white/[0.02]">
                  {getStatusBadge(customer.status)}
                </td>
                <td className={twMerge("sticky right-0 bg-white px-6 py-4 text-right dark:bg-[#111111] whitespace-nowrap group-hover:bg-gray-50 dark:group-hover:bg-[#1a1a1a]", openDropdown === customer.id ? "z-30" : "z-10")}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === customer.id ? null : customer.id);
                    }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-black/40 transition-colors hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="12" cy="5" r="1"></circle>
                      <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                  </button>
                  
                  {openDropdown === customer.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                      <div className={twMerge(
                        "absolute right-6 z-20 w-48 rounded-xl border border-black/10 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-[#1a1a1a]",
                        index >= customers.length - 2 ? "bottom-10" : "top-10"
                      )}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleStatus(customer.id);
                            setOpenDropdown(null);
                          }}
                          className={twMerge(
                            clsx(
                              "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                              customer.status === 'active' 
                                ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                : "text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-500/10"
                            )
                          )}
                        >
                          {customer.status === 'active' ? 'Block User' : 'Unblock User'}
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/customers/${customer.id}`);
                          }}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-black transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/5"
                        >
                          View Details
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
