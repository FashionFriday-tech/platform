import { useState, useMemo } from 'react';
import { Customer, SortField, SortDirection } from '../types';
import { mockCustomers } from '../data/mock-customers';

export function useCustomers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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
          c.phone.includes(query)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter);
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

  return {
    customers: filteredAndSortedCustomers,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortField,
    sortDirection,
    handleSort,
    toggleCustomerStatus
  };
}
