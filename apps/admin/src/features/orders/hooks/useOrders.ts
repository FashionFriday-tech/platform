import { useMemo, useState } from 'react';

import { mockOrders } from '../services/mock-orders';
import { type Order } from '../types';

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedOrders = useMemo(() => {
    let result = mockOrders.filter((order: Order) => {
      // Filter by status
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }

      // Filter by payment type
      if (paymentTypeFilter !== 'all' && order.paymentType !== paymentTypeFilter) {
        return false;
      }

      // Filter by search (phone or name or order number)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesOrderNumber = order.orderNumber.toLowerCase().includes(query);
        const matchesCustomer =
          order.customer.name.toLowerCase().includes(query) ||
          order.customer.phone.toLowerCase().includes(query);

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
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'customer') {
        aValue = a.customer.name;
        bValue = b.customer.name;
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
  }, [searchQuery, statusFilter, dateFilter, paymentTypeFilter, sortField, sortDirection]);

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
  };
}
