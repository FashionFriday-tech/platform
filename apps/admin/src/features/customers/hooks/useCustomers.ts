import { useState, useMemo } from 'react';
import { Customer, SortField, SortDirection } from '../types';
import { mockCustomers } from '../services/mock-customers';

export function useCustomers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ordersFilter, setOrdersFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('joinDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [customersData, setCustomersData] = useState<Customer[]>(mockCustomers);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleCustomerStatus = (customerId: string) => {
    setCustomersData((prev) => 
      prev.map((c) => 
        c.id === customerId 
          ? { ...c, status: c.status === 'active' ? 'blocked' : 'active' } 
          : c
      )
    );
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
          c.id.toLowerCase().includes(query)
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
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'joinDate' || sortField === 'lastOrderDate') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [customersData, searchQuery, statusFilter, sortField, sortDirection]);

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Orders', 'Total Spent', 'Join Date'];
    const rows = filteredAndSortedCustomers.map(c => [
      `"${c.id}"`,
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      `"${c.status}"`,
      `"${c.ordersCount}"`,
      `"${c.totalSpent}"`,
      `"${new Date(c.joinDate).toLocaleDateString()}"`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

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
    handleSort,
    toggleCustomerStatus,
    handleExport,
  };
}
