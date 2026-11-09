import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { api } from '@/lib/api-client';

export type SortField =
  | 'orderNumber'
  | 'customer'
  | 'createdAt'
  | 'total'
  | 'status'
  | 'paymentType';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'table' | 'grid';

function parseOrderFilters(params: URLSearchParams | { get: (k: string) => string | null }) {
  const search = params.get('search') ?? '';
  const status = params.get('status') ?? 'all';
  const payment = params.get('payment') ?? 'all';
  const date = params.get('date') ?? '';
  const view: ViewMode = params.get('view') === 'grid' ? 'grid' : 'table';
  const sort = (params.get('sortField') as SortField) ?? 'createdAt';
  const direction = (params.get('sortDir') as SortDirection) ?? 'desc';

  return {
    search,
    status,
    payment,
    date,
    view,
    sort,
    direction,
  };
}

export function useOrders() {
  const searchParams = useSearchParams();
  const [initialFilters] = useState(() => parseOrderFilters(searchParams));

  const [searchQuery, setSearchQuery] = useState(initialFilters.search);
  const [statusFilter, setStatusFilter] = useState(initialFilters.status);
  const [dateFilter, setDateFilter] = useState(initialFilters.date);
  const [paymentTypeFilter, setPaymentTypeFilter] = useState(initialFilters.payment);
  const [viewMode, setViewMode] = useState<ViewMode>(initialFilters.view);
  const [sortField, setSortField] = useState<SortField>(initialFilters.sort);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialFilters.direction);

  const isUpdatingFromUrl = useRef(false);

  // Sync state changes to URL query parameters
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (statusFilter && statusFilter !== 'all') {
      params.set('status', statusFilter);
    }
    if (paymentTypeFilter && paymentTypeFilter !== 'all') {
      params.set('payment', paymentTypeFilter);
    }
    if (dateFilter) {
      params.set('date', dateFilter);
    }
    if (viewMode !== 'table') {
      params.set('view', viewMode);
    }
    if (sortField !== 'createdAt') {
      params.set('sortField', sortField);
    }
    if (sortDirection !== 'desc') {
      params.set('sortDir', sortDirection);
    }

    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [
    searchQuery,
    statusFilter,
    paymentTypeFilter,
    dateFilter,
    viewMode,
    sortField,
    sortDirection,
  ]);

  // Handle browser Back / Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') {
        return;
      }
      isUpdatingFromUrl.current = true;
      const parsed = parseOrderFilters(new URLSearchParams(window.location.search));
      setSearchQuery(parsed.search);
      setStatusFilter(parsed.status);
      setPaymentTypeFilter(parsed.payment);
      setDateFilter(parsed.date);
      setViewMode(parsed.view);
      setSortField(parsed.sort);
      setSortDirection(parsed.direction);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Sync when searchParams changes via Next router
  useEffect(() => {
    const parsed = parseOrderFilters(searchParams);
    if (
      parsed.search !== searchQuery ||
      parsed.status !== statusFilter ||
      parsed.payment !== paymentTypeFilter ||
      parsed.date !== dateFilter ||
      parsed.view !== viewMode ||
      parsed.sort !== sortField ||
      parsed.direction !== sortDirection
    ) {
      isUpdatingFromUrl.current = true;
      setSearchQuery(parsed.search);
      setStatusFilter(parsed.status);
      setPaymentTypeFilter(parsed.payment);
      setDateFilter(parsed.date);
      setViewMode(parsed.view);
      setSortField(parsed.sort);
      setSortDirection(parsed.direction);
    }
  }, [searchParams]);

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.get<any[]>('/orders/admin', { cache: 'no-store' });
      // map data to match admin shape
      const mapped = (data || []).map((o: any) => ({
        ...o,
        status: o.status?.toLowerCase() || 'pending',
        customer: { id: o.userId, name: o.user?.name || 'Unknown', phone: o.user?.phone || '' },
        total: Number(o.finalAmount || o.totalAmount || 0),
        paymentType: o.paymentMethod?.toLowerCase() === 'cod' ? 'cod' : 'prepaid',
        items:
          o.items?.map((item: any) => ({
            ...item,
            productName: item.name,
            productImage:
              item.image && !item.image.includes('photo-1523381210434-271e8be1f52b')
                ? item.image
                : item.product?.mainImage || '',
            price: Number(item.price || 0),
          })) || [],
      }));
      setOrders(mapped);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch admin orders', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedOrders = useMemo(() => {
    let result = orders.filter((order: any) => {
      // Filter by status
      if (statusFilter !== 'all' && order.status?.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      // Filter by payment type
      if (
        paymentTypeFilter !== 'all' &&
        order.paymentType?.toLowerCase() !== paymentTypeFilter.toLowerCase()
      ) {
        return false;
      }

      // Filter by search (phone or name or order number)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesOrderNumber = order.orderNumber?.toLowerCase().includes(query);
        const matchesCustomer =
          order.customer?.name?.toLowerCase().includes(query) ||
          order.customer?.phone?.toLowerCase().includes(query);

        if (!matchesOrderNumber && !matchesCustomer) {
          return false;
        }
      }

      // Filter by date
      if (dateFilter) {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
        if (orderDate !== dateFilter) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    result = result.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortField === 'customer') {
        aValue = a.customer?.name || '';
        bValue = b.customer?.name || '';
      } else {
        const valA = a[sortField];
        const valB = b[sortField];
        aValue = typeof valA === 'number' ? valA : (valA ?? '');
        bValue = typeof valB === 'number' ? valB : (valB ?? '');
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [searchQuery, statusFilter, dateFilter, paymentTypeFilter, sortField, sortDirection, orders]);

  return {
    orders: filteredAndSortedOrders,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    paymentTypeFilter,
    setPaymentTypeFilter,
    viewMode,
    setViewMode,
    sortField,
    sortDirection,
    handleSort,
    setSortField,
    setSortDirection,
    loading,
    refreshOrders: fetchOrders,
    allOrders: orders,
  };
}
