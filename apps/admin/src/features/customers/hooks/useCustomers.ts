import { useMemo, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { fetcher } from '@/lib/api-client';
import { type Customer, type SortDirection, type SortField } from '../types';

export function useCustomers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ordersFilter, setOrdersFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('joinDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [customersData, setCustomersData] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    fetchCustomers();
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
    } catch (error: any) {
      console.error('Failed to register customer:', error);
      toast.error(error.message || 'Failed to register customer.');
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
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'joinDate' || sortField === 'lastOrderDate') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
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
