import { useEffect, useMemo, useState } from 'react';

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

export function useOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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
