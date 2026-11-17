'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { toast } from 'sonner';

import { api } from '@/lib/api-client';

import type {
  PaymentDetailResponse,
  PaymentItem,
  PaymentSortDir,
  PaymentSortField,
  PaymentStatsResponse,
  RiskFilterType,
} from '../types';

export function usePayments() {
  const searchParams = useSearchParams();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') ?? '');
  const [statusFilter, setStatusFilter] = useState(() => searchParams.get('status') ?? 'ALL');
  const [methodFilter, setMethodFilter] = useState(() => searchParams.get('method') ?? 'ALL');
  const [dateRange, setDateRange] = useState(() => searchParams.get('dateRange') ?? 'all');
  const [riskFilter, setRiskFilter] = useState<RiskFilterType>(
    () => (searchParams.get('risk') as RiskFilterType) ?? 'ALL',
  );
  const [sortField, setSortField] = useState<PaymentSortField>(
    () => (searchParams.get('sortField') as PaymentSortField) ?? 'createdAt',
  );
  const [sortDir, setSortDir] = useState<PaymentSortDir>(
    () => (searchParams.get('sortDir') as PaymentSortDir) ?? 'desc',
  );
  const [currentPage, setCurrentPage] = useState(() => Number(searchParams.get('page')) || 1);
  const [itemsPerPage, setItemsPerPage] = useState(() => Number(searchParams.get('limit')) || 20);

  // Data state
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [stats, setStats] = useState<PaymentStatsResponse | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number | null>(null);

  // Selection & Detail drawer
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState<PaymentDetailResponse | null>(
    null,
  );
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const isUpdatingFromUrl = useRef(false);

  // Sync state changes to browser URL query parameters
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (statusFilter !== 'ALL') params.set('status', statusFilter);
    if (methodFilter !== 'ALL') params.set('method', methodFilter);
    if (dateRange !== 'all') params.set('dateRange', dateRange);
    if (riskFilter !== 'ALL') params.set('risk', riskFilter);
    if (sortField !== 'createdAt') params.set('sortField', sortField);
    if (sortDir !== 'desc') params.set('sortDir', sortDir);
    if (currentPage > 1) params.set('page', String(currentPage));
    if (itemsPerPage !== 20) params.set('limit', String(itemsPerPage));

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
    methodFilter,
    dateRange,
    riskFilter,
    sortField,
    sortDir,
    currentPage,
    itemsPerPage,
  ]);

  // Handle browser popstate
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      isUpdatingFromUrl.current = true;
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get('search') ?? '');
      setStatusFilter(params.get('status') ?? 'ALL');
      setMethodFilter(params.get('method') ?? 'ALL');
      setDateRange(params.get('dateRange') ?? 'all');
      setRiskFilter((params.get('risk') as RiskFilterType) ?? 'ALL');
      setSortField((params.get('sortField') as PaymentSortField) ?? 'createdAt');
      setSortDir((params.get('sortDir') as PaymentSortDir) ?? 'desc');
      setCurrentPage(Number(params.get('page')) || 1);
      setItemsPerPage(Number(params.get('limit')) || 20);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Compute date boundaries based on dateRange preset
  const getDateBounds = useCallback(() => {
    const now = new Date();
    if (dateRange === 'today') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return { startDate: start.toISOString(), endDate: now.toISOString() };
    }
    if (dateRange === 'yesterday') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
      return { startDate: start.toISOString(), endDate: end.toISOString() };
    }
    if (dateRange === '7d') {
      const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return { startDate: start.toISOString(), endDate: now.toISOString() };
    }
    if (dateRange === '30d') {
      const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return { startDate: start.toISOString(), endDate: now.toISOString() };
    }
    return { startDate: undefined, endDate: undefined };
  }, [dateRange]);

  // Fetch payments list
  const fetchPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      const { startDate, endDate } = getDateBounds();
      const params: Record<string, string | number | undefined> = {
        page: currentPage,
        limit: itemsPerPage,
        sortField,
        sortDir,
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (methodFilter !== 'ALL') params.method = methodFilter;
      if (riskFilter !== 'ALL') params.riskFilter = riskFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get<{
        items: PaymentItem[];
        pagination: { page: number; limit: number; totalCount: number; totalPages: number };
      }>('/payments/admin', {
        cache: 'no-store',
        params,
      });

      if (res && Array.isArray(res.items)) {
        setPayments(res.items);
        setTotalCount(res.pagination.totalCount);
        setTotalPages(res.pagination.totalPages);
      }
      setLastRefreshedAt(new Date());
    } catch (err: unknown) {
      console.error('Failed to fetch payments:', err);
      toast.error('Failed to load payment transactions');
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    itemsPerPage,
    sortField,
    sortDir,
    searchQuery,
    statusFilter,
    methodFilter,
    riskFilter,
    getDateBounds,
  ]);

  // Fetch stats summary
  const fetchStats = useCallback(async () => {
    try {
      setIsStatsLoading(true);
      const { startDate, endDate } = getDateBounds();
      const params: Record<string, string | undefined> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get<PaymentStatsResponse>('/payments/stats', {
        cache: 'no-store',
        params,
      });

      if (res && res.summary) {
        setStats(res);
      }
    } catch (err: unknown) {
      console.error('Failed to fetch payment stats:', err);
    } finally {
      setIsStatsLoading(false);
    }
  }, [getDateBounds]);

  // Initial & Dependency-triggered fetch
  useEffect(() => {
    void fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefreshInterval) return;
    const interval = setInterval(() => {
      void fetchPayments();
      void fetchStats();
    }, autoRefreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefreshInterval, fetchPayments, fetchStats]);

  // Fetch details for slide-over drawer
  const fetchPaymentDetails = useCallback(async (id: string) => {
    try {
      setIsDetailLoading(true);
      setSelectedPaymentId(id);
      const res = await api.get<PaymentDetailResponse>(`/payments/${id}`, {
        cache: 'no-store',
      });
      setSelectedPaymentDetail(res);
    } catch (err: unknown) {
      console.error('Failed to fetch payment details:', err);
      toast.error('Could not fetch payment forensics from gateway');
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  // Action: Live Sync with Gateway
  const handleSyncGateway = async (id: string) => {
    try {
      setActionLoadingId(id);
      toast.loading('Contacting Razorpay Gateway for live reconciliation...', { id: 'sync-gw' });
      const res = await api.post<{
        success: boolean;
        synced: boolean;
        previousStatus?: string;
        currentStatus?: string;
        message?: string;
      }>(`/payments/${id}/sync`, {});

      if (res.synced) {
        const prev = res.previousStatus ?? 'UNKNOWN';
        const curr = res.currentStatus ?? 'UNKNOWN';
        toast.success(`Gateway status updated: ${prev} ➔ ${curr}`, { id: 'sync-gw' });
      } else {
        toast.info(res.message || 'Payment is already up to date with gateway', { id: 'sync-gw' });
      }

      await Promise.all([fetchPayments(), fetchStats()]);
      if (selectedPaymentId === id) {
        await fetchPaymentDetails(id);
      }
    } catch (err: any) {
      console.error('Failed to sync gateway:', err);
      toast.error(err.message || 'Gateway sync failed', { id: 'sync-gw' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Capture Authorized Payment
  const handleCapture = async (id: string) => {
    try {
      setActionLoadingId(id);
      toast.loading('Capturing authorized payment on gateway...', { id: 'capture-action' });
      await api.post(`/payments/${id}/capture`, {});
      toast.success('Payment captured successfully! Funds settled.', { id: 'capture-action' });
      await Promise.all([fetchPayments(), fetchStats()]);
      if (selectedPaymentId === id) {
        await fetchPaymentDetails(id);
      }
    } catch (err: any) {
      console.error('Failed to capture payment:', err);
      toast.error(err.message || 'Failed to capture payment', { id: 'capture-action' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Void Authorized Payment (Zero Fee)
  const handleVoid = async (id: string, reason = 'Admin cancelled before capture') => {
    try {
      setActionLoadingId(id);
      toast.loading('Voiding authorization at ₹0 fee on gateway...', { id: 'void-action' });
      await api.post(`/payments/${id}/void`, { reason });
      toast.success('Authorization voided! Funds released to customer at zero fee.', {
        id: 'void-action',
      });
      await Promise.all([fetchPayments(), fetchStats()]);
      if (selectedPaymentId === id) {
        await fetchPaymentDetails(id);
      }
    } catch (err: any) {
      console.error('Failed to void payment:', err);
      toast.error(err.message || 'Failed to void payment', { id: 'void-action' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Issue Refund
  const handleRefund = async (id: string, amount?: number, reason?: string) => {
    try {
      setActionLoadingId(id);
      toast.loading('Issuing refund through Razorpay...', { id: 'refund-action' });
      await api.post(`/payments/${id}/refund`, { amount, reason });
      toast.success(
        amount ? `Partial refund of ₹${amount} initiated!` : 'Full refund issued successfully!',
        { id: 'refund-action' },
      );
      await Promise.all([fetchPayments(), fetchStats()]);
      if (selectedPaymentId === id) {
        await fetchPaymentDetails(id);
      }
    } catch (err: any) {
      console.error('Failed to refund payment:', err);
      toast.error(err.message || 'Failed to issue refund', { id: 'refund-action' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Export CSV
  const exportLedgerToCsv = () => {
    if (payments.length === 0) {
      toast.error('No transactions available to export');
      return;
    }

    const headers = [
      'Order Number',
      'Transaction ID',
      'Gateway Order ID',
      'Created At',
      'Customer Name',
      'Customer Phone',
      'Payment Method',
      'Payment Status',
      'Order Status',
      'Gross Amount (INR)',
      'Advance Amount (INR)',
      'Refunded Amount (INR)',
      'Net Settled (INR)',
      'Signature Verified',
    ];

    const rows = payments.map((p) => {
      const net = Math.max(0, p.amount - p.refundedAmount);
      return [
        `"${p.orderNumber}"`,
        `"${p.razorpayPaymentId || 'N/A'}"`,
        `"${p.razorpayOrderId || 'N/A'}"`,
        `"${new Date(p.createdAt).toISOString()}"`,
        `"${(p.customer.name || '').replace(/"/g, '""')}"`,
        `"${p.customer.phone || ''}"`,
        `"${p.paymentMethod}"`,
        `"${p.paymentStatus}"`,
        `"${p.orderStatus}"`,
        p.amount,
        p.advanceAmount,
        p.refundedAmount,
        net,
        p.razorpaySignatureVerified ? 'YES' : 'NO',
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `fashion-friday-payments-ledger-${new Date().toISOString().split('T')[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Payments ledger exported to CSV successfully');
  };

  return {
    // State
    payments,
    stats,
    isLoading,
    isStatsLoading,
    totalPages,
    totalCount,
    currentPage,
    itemsPerPage,
    lastRefreshedAt,
    autoRefreshInterval,
    selectedPaymentId,
    selectedPaymentDetail,
    isDetailLoading,
    actionLoadingId,

    // Filters
    searchQuery,
    statusFilter,
    methodFilter,
    dateRange,
    riskFilter,
    sortField,
    sortDir,

    // Setters
    setSearchQuery,
    setStatusFilter,
    setMethodFilter,
    setDateRange,
    setRiskFilter,
    setSortField,
    setSortDir,
    setCurrentPage,
    setItemsPerPage,
    setAutoRefreshInterval,
    setSelectedPaymentId,
    setSelectedPaymentDetail,

    // Actions
    fetchPayments,
    fetchStats,
    fetchPaymentDetails,
    handleSyncGateway,
    handleCapture,
    handleVoid,
    handleRefund,
    exportLedgerToCsv,
  };
}
