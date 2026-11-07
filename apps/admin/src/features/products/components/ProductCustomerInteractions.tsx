'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import {
  BellIcon,
  EyeIcon,
  HeartIcon,
  MailIcon,
  PhoneIcon,
  RefreshCcwIcon,
  SearchIcon,
  ShoppingBagIcon,
  WhatsAppIcon,
} from '@ff/ui';

import {
  type CustomerInteractionItem,
  fetchProductInteractionsList,
  fetchProductInteractionsSummary,
  type ProductInteractionType,
  type ProductInteractionsSummary,
} from '../services/api';

interface Props {
  productId: string;
  productName?: string;
  activeTab?: ProductInteractionType;
  onTabChange?: (tab: ProductInteractionType) => void;
  onSummaryLoaded?: (summary: ProductInteractionsSummary) => void;
}

const TABS: {
  id: ProductInteractionType;
  label: string;
  icon: (active: boolean) => React.ReactNode;
  countKey: keyof ProductInteractionsSummary;
  badgeColor: string;
}[] = [
  {
    id: 'wishlist',
    label: 'Liked (Wishlist)',
    icon: (active) => (
      <HeartIcon
        className={`h-3.5 w-3.5 ${active ? 'fill-rose-500 text-rose-500' : 'text-current'}`}
      />
    ),
    countKey: 'wishlistCount',
    badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  },
  {
    id: 'cart',
    label: 'In Cart',
    icon: () => <ShoppingBagIcon className="h-3.5 w-3.5" />,
    countKey: 'cartCount',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    id: 'notifications',
    label: 'Notify Me (Restock)',
    icon: () => <BellIcon className="h-3.5 w-3.5" />,
    countKey: 'notificationsCount',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    id: 'clicks',
    label: 'Views & Clicks',
    icon: () => <EyeIcon className="h-3.5 w-3.5" />,
    countKey: 'clicksCount',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
];

export function ProductCustomerInteractions({
  productId,
  productName,
  activeTab: controlledTab,
  onTabChange,
  onSummaryLoaded,
}: Props) {
  const [internalTab, setInternalTab] = useState<ProductInteractionType>('wishlist');
  const activeTab = controlledTab ?? internalTab;

  const setActiveTab = (tab: ProductInteractionType) => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  const [summary, setSummary] = useState<ProductInteractionsSummary>({
    wishlistCount: 0,
    cartCount: 0,
    notificationsCount: 0,
    clicksCount: 0,
  });
  const [items, setItems] = useState<CustomerInteractionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Load summary counts
  const loadSummary = async () => {
    if (!productId) return;
    try {
      const data = await fetchProductInteractionsSummary(productId);
      setSummary(data);
      onSummaryLoaded?.(data);
    } catch (err) {
      console.error('Failed to load interactions summary:', err);
    }
  };

  // Load active tab list
  const loadList = async () => {
    if (!productId) return;
    setIsLoading(true);
    try {
      const res = await fetchProductInteractionsList(
        productId,
        activeTab,
        page,
        10,
        debouncedSearch,
      );
      setItems(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load interactions list:', err);
      setItems([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSummary();
  }, [productId]);

  useEffect(() => {
    void loadList();
  }, [productId, activeTab, page, debouncedSearch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([loadSummary(), loadList()]);
    setIsRefreshing(false);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diff / (60 * 1000));
      if (mins < 1) return 'just now';
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      return `${days}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-all sm:p-8 dark:border-white/5 dark:bg-[#0c0c0c]">
      {/* Top Section: Header & Quick Stats */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-black tracking-tight text-black uppercase sm:text-lg dark:text-white">
              Customer Engagement & Activity
            </h2>
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Real-time
            </span>
          </div>
          <p className="mt-1 text-xs text-black/50 dark:text-white/50">
            Track logged-in shoppers who wishlisted, carted, asked for restock alerts, or clicked{' '}
            <strong className="text-black dark:text-white">{productName || 'this product'}</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="flex cursor-pointer items-center gap-1.5 self-start rounded-full border border-black/10 bg-black/5 px-3.5 py-1.5 text-xs font-bold text-black transition-all hover:bg-black hover:text-white active:scale-95 disabled:opacity-50 sm:self-auto dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white dark:hover:text-black"
          title="Refresh engagement data"
        >
          <RefreshCcwIcon className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Sync</span>
        </button>
      </div>

      {/* Tabs Navigation (Separated Tables) */}
      <div className="scrollbar-hide mb-6 flex items-center gap-2 overflow-x-auto border-b border-black/5 pb-3 dark:border-white/5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = summary[tab.countKey] || 0;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
              className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-black text-white shadow-md dark:bg-white dark:text-black'
                  : 'border border-black/5 bg-black/[0.02] text-black/60 hover:border-black/20 hover:text-black dark:border-white/5 dark:bg-white/[0.02] dark:text-white/60 dark:hover:border-white/20 dark:hover:text-white'
              }`}
            >
              <span>{tab.icon(isActive)}</span>
              <span>{tab.label}</span>
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                  isActive
                    ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                    : tab.badgeColor
                }`}
              >
                {count.toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Filter Bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-black/40 dark:text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer name, email, or phone..."
            className="w-full rounded-xl border border-black/10 bg-black/[0.02] py-2 pr-3 pl-8 text-xs font-medium text-black placeholder-black/40 transition-colors outline-none focus:border-black dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:placeholder-white/40 dark:focus:border-white"
          />
        </div>

        <div className="text-[11px] font-semibold text-black/40 dark:text-white/40">
          Showing {items.length > 0 ? (page - 1) * 10 + 1 : 0} - {Math.min(page * 10, total)} of{' '}
          {total.toLocaleString()} customer{total === 1 ? '' : 's'}
        </div>
      </div>

      {/* Table Container */}
      <div className="scrollbar-hide overflow-x-auto rounded-2xl border border-black/5 bg-black/[0.01] dark:border-white/5 dark:bg-white/[0.01]">
        <table className="w-full min-w-[700px] text-left text-xs">
          <thead>
            <tr className="border-b border-black/5 bg-black/[0.03] text-[10px] font-extrabold tracking-wider text-black/50 uppercase dark:border-white/5 dark:bg-white/[0.03] dark:text-white/50">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Direct Contact</th>
              <th className="px-4 py-3">
                {activeTab === 'cart'
                  ? 'Cart Details'
                  : activeTab === 'clicks'
                    ? 'Activity & Views'
                    : 'Interaction Date'}
              </th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
                  <div className="mt-2 text-xs font-medium text-black/50 dark:text-white/50">
                    Loading customers...
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-14 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-black/5 text-black/40 dark:bg-white/5 dark:text-white/40">
                    {activeTab === 'wishlist' && <HeartIcon className="h-6 w-6" />}
                    {activeTab === 'cart' && <ShoppingBagIcon className="h-6 w-6" />}
                    {activeTab === 'notifications' && <BellIcon className="h-6 w-6" />}
                    {activeTab === 'clicks' && <EyeIcon className="h-6 w-6" />}
                  </div>
                  <h4 className="text-sm font-bold text-black dark:text-white">
                    No customers found
                  </h4>
                  <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                    {debouncedSearch
                      ? `No results match "${debouncedSearch}".`
                      : activeTab === 'wishlist'
                        ? 'No customers have added this product to their wishlist yet.'
                        : activeTab === 'cart'
                          ? 'No customers currently have this product in their cart.'
                          : activeTab === 'notifications'
                            ? 'No customers have requested a restock notification for this product yet.'
                            : 'No logged-in customers have clicked or viewed this product yet.'}
                  </p>
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const user = item.user;
                const cleanPhone = (user.phone || '').replace(/[^0-9]/g, '');
                const normalizedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                const waUrl = normalizedPhone ? `https://wa.me/${normalizedPhone}` : null;
                const telUrl = user.phone ? `tel:${user.phone}` : null;
                const mailUrl = user.email ? `mailto:${user.email}` : null;

                const initials = user.name
                  ? user.name
                      .split(' ')
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'CU';

                return (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                  >
                    {/* Customer Identity */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-xs font-black text-white dark:bg-white dark:text-black">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/customers/${user.id}`}
                            className="block truncate font-bold text-black hover:underline dark:text-white"
                          >
                            {user.name || 'Anonymous Customer'}
                          </Link>
                          <div className="truncate text-[11px] text-black/50 dark:text-white/50">
                            {user.email || user.phone || 'No direct email'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Direct Contact Buttons */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {waUrl ? (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-7 items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 text-[11px] font-bold text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white active:scale-95 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white"
                            title={`Chat with ${user.name} on WhatsApp`}
                          >
                            <WhatsAppIcon className="h-3 w-3 shrink-0" />
                            <span>WhatsApp</span>
                          </a>
                        ) : null}

                        {telUrl ? (
                          <a
                            href={telUrl}
                            className="flex h-7 items-center gap-1 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2 text-[11px] font-bold text-blue-600 transition-all hover:bg-blue-500 hover:text-white active:scale-95 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white"
                            title={`Call ${user.phone}`}
                          >
                            <PhoneIcon className="h-3 w-3 shrink-0" />
                            <span>Call</span>
                          </a>
                        ) : null}

                        {mailUrl ? (
                          <a
                            href={mailUrl}
                            className="flex h-7 items-center gap-1 rounded-lg border border-purple-500/20 bg-purple-500/10 px-2 text-[11px] font-bold text-purple-600 transition-all hover:bg-purple-500 hover:text-white active:scale-95 dark:text-purple-400 dark:hover:bg-purple-500 dark:hover:text-white"
                            title={`Email ${user.email}`}
                          >
                            <MailIcon className="h-3 w-3 shrink-0" />
                          </a>
                        ) : null}
                      </div>
                    </td>

                    {/* Interaction Details */}
                    <td className="px-4 py-3">
                      {activeTab === 'cart' ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-black dark:text-white">
                              Size: {item.details?.size || 'Standard'}
                            </span>
                            <span className="text-black/30 dark:text-white/30">•</span>
                            <span className="font-semibold text-black/70 dark:text-white/70">
                              Qty: {item.details?.quantity || 1}
                            </span>
                          </div>
                          <div className="text-[10px] text-black/40 dark:text-white/40">
                            Updated {formatTimeAgo(item.timestamp)}
                          </div>
                        </div>
                      ) : activeTab === 'clicks' ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                              {item.details?.clickCount || 1} view
                              {(item.details?.clickCount || 1) === 1 ? '' : 's'}
                            </span>
                            <span className="text-[11px] font-semibold text-black/70 dark:text-white/70">
                              Active {formatTimeAgo(item.timestamp)}
                            </span>
                          </div>
                          {item.details?.firstClickedAt && (
                            <div className="text-[10px] text-black/40 dark:text-white/40">
                              First clicked {formatDate(item.details.firstClickedAt)}
                            </div>
                          )}
                        </div>
                      ) : activeTab === 'notifications' ? (
                        <div>
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                            Restock alert requested
                          </span>
                          <div className="mt-0.5 text-[10px] text-black/40 dark:text-white/40">
                            {formatDate(item.timestamp)} ({formatTimeAgo(item.timestamp)})
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                            Wishlisted
                          </span>
                          <div className="mt-0.5 text-[10px] text-black/40 dark:text-white/40">
                            {formatDate(item.timestamp)} ({formatTimeAgo(item.timestamp)})
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          user.accountStatus === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {user.accountStatus || 'ACTIVE'}
                      </span>
                    </td>

                    {/* Profile Link */}
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/customers/${user.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-black/10 bg-white px-2.5 py-1 text-[11px] font-bold text-black shadow-xs transition-all hover:bg-black hover:text-white dark:border-white/10 dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
                      >
                        <span>View</span>
                        <span>&rarr;</span>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4 text-xs dark:border-white/5">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isLoading}
            className="cursor-pointer rounded-xl border border-black/10 bg-white px-3 py-1.5 font-bold text-black transition-all hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-40 dark:border-white/10 dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
          >
            &larr; Previous
          </button>

          <span className="font-semibold text-black/60 dark:text-white/60">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isLoading}
            className="cursor-pointer rounded-xl border border-black/10 bg-white px-3 py-1.5 font-bold text-black transition-all hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-40 dark:border-white/10 dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
