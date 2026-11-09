import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { toast } from 'sonner';

import { fetcher } from '@/lib/api-client';

import { type Customer, type SortDirection, type SortField } from '../types';

function parseCustomerFilters(params: URLSearchParams | { get: (k: string) => string | null }) {
  const search = params.get('search') ?? '';
  const status = params.get('status') ?? 'all';
  const orders = params.get('orders') ?? 'all';
  const sort = (params.get('sortField') as SortField) ?? 'joinDate';
  const direction = (params.get('sortDir') as SortDirection) ?? 'desc';

  return {
    search,
    status,
    orders,
    sort,
    direction,
  };
}

export function useCustomers() {
  const searchParams = useSearchParams();
  const initial = useRef<ReturnType<typeof parseCustomerFilters> | null>(null);
  if (!initial.current) {
    initial.current = parseCustomerFilters(searchParams);
  }

  const [searchQuery, setSearchQuery] = useState(initial.current.search);
  const [statusFilter, setStatusFilter] = useState(initial.current.status);
  const [ordersFilter, setOrdersFilter] = useState(initial.current.orders);
  const [sortField, setSortField] = useState<SortField>(initial.current.sort);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initial.current.direction);
  const [customersData, setCustomersData] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isUpdatingFromUrl = useRef(false);

  // Sync state to URL search params
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
    if (ordersFilter && ordersFilter !== 'all') params.set('orders', ordersFilter);
    if (sortField !== 'joinDate') params.set('sortField', sortField);
    if (sortDirection !== 'desc') params.set('sortDir', sortDirection);

    const queryString = params.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [searchQuery, statusFilter, ordersFilter, sortField, sortDirection]);

  // Handle browser Back / Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      isUpdatingFromUrl.current = true;
      const parsed = parseCustomerFilters(new URLSearchParams(window.location.search));
      setSearchQuery(parsed.search);
      setStatusFilter(parsed.status);
      setOrdersFilter(parsed.orders);
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
    const parsed = parseCustomerFilters(searchParams);
    if (
      parsed.search !== searchQuery ||
      parsed.status !== statusFilter ||
      parsed.orders !== ordersFilter ||
      parsed.sort !== sortField ||
      parsed.direction !== sortDirection
    ) {
      isUpdatingFromUrl.current = true;
      setSearchQuery(parsed.search);
      setStatusFilter(parsed.status);
      setOrdersFilter(parsed.orders);
      setSortField(parsed.sort);
      setSortDirection(parsed.direction);
    }
  }, [searchParams]);

  // Fetch customers list
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await fetcher<Customer[]>('/admin/customers');
      setCustomersData(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      toast.error('Failed to load customers from backend API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchCustomers();
  }, []);

  const addCustomer = async (customer: { name: string; phone: string }) => {
    try {
      const newCustomer = await fetcher<Customer>('/admin/customers', {
        method: 'POST',
        body: JSON.stringify(customer),
      });
      setCustomersData((prev) => [newCustomer, ...prev]);
      toast.success('Customer registered successfully!');
      return true;
    } catch (error: unknown) {
      console.error('Failed to register customer:', error);
      const msg = error instanceof Error ? error.message : 'Failed to register customer.';
      toast.error(msg);
      return false;
    }
  };

  const toggleCustomerStatus = async (customerId: string) => {
    try {
      const updated = await fetcher<{ id: string; status: 'active' | 'blocked' }>(
        `/admin/customers/${customerId}/status`,
        {
          method: 'PATCH',
        },
      );
      setCustomersData((prev) =>
        prev.map((c) => (c.id === customerId ? { ...c, status: updated.status } : c)),
      );
      toast.success(`Customer status set to ${updated.status}.`);
    } catch (error) {
      console.error('Failed to toggle customer status:', error);
      toast.error('Failed to update customer status.');
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedCustomers = useMemo(() => {
    let result = [...customersData];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.phone.includes(query) ||
          c.id.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (ordersFilter !== 'all') {
      if (ordersFilter === 'with-orders') {
        result = result.filter((c) => c.ordersCount > 0);
      } else if (ordersFilter === 'no-orders') {
        result = result.filter((c) => c.ordersCount === 0);
      }
    }

    result.sort((a, b) => {
      let aVal: string | number = a[sortField] ?? '';
      let bVal: string | number = b[sortField] ?? '';

      if (sortField === 'joinDate' || sortField === 'lastOrderDate') {
        aVal = new Date(String(aVal)).getTime();
        bVal = new Date(String(bVal)).getTime();
      }

      if (aVal < bVal) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [customersData, searchQuery, statusFilter, ordersFilter, sortField, sortDirection]);

  const handleExport = () => {
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Status',
      'Orders',
      'Total Spent',
      'Join Date',
    ];
    const rows = filteredAndSortedCustomers.map((c) => [
      `"${c.id}"`,
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      `"${c.status}"`,
      `"${c.ordersCount}"`,
      `"${c.totalSpent}"`,
      `"${new Date(c.joinDate).toLocaleDateString()}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'customers_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    customers: filteredAndSortedCustomers,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    ordersFilter,
    setOrdersFilter,
    sortField,
    sortDirection,
    isLoading,
    handleSort,
    addCustomer,
    toggleCustomerStatus,
    handleExport,
  };
}
