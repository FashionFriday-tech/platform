'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { api } from '@/lib/api-client';

import {
  type Seller,
  type SellerCategory,
  type SellerStatsData,
  type SellerStatus,
} from '../types';

function parseSellerFilters(params: URLSearchParams | { get: (k: string) => string | null }) {
  const search = params.get('search') ?? '';
  const statusRaw = params.get('status') ?? 'ALL';
  const statusFilter = (
    ['ALL', 'ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(statusRaw) ? statusRaw : 'ALL'
  ) as 'ALL' | SellerStatus;
  const categoryFilter = params.get('category') ?? 'ALL';

  return { search, statusFilter, categoryFilter };
}

export function useSellers() {
  const searchParams = useSearchParams();
  const [initialFilters] = useState(() => parseSellerFilters(searchParams));

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [stats, setStats] = useState<SellerStatsData>({
    totalSellers: 0,
    activeSellers: 0,
    totalProducts: 0,
    totalOrderItems: 0,
  });
  const [categories, setCategories] = useState<SellerCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialFilters.search);
  const [statusFilter, setStatusFilter] = useState<'ALL' | SellerStatus>(
    initialFilters.statusFilter,
  );
  const [categoryFilter, setCategoryFilter] = useState<string>(initialFilters.categoryFilter);

  const isUpdatingFromUrl = useRef(false);

  // Sync state to URL search params
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
    if (statusFilter !== 'ALL') {
      params.set('status', statusFilter);
    }
    if (categoryFilter !== 'ALL') {
      params.set('category', categoryFilter);
    }

    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [searchQuery, statusFilter, categoryFilter]);

  // Handle browser Back / Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') {
        return;
      }
      isUpdatingFromUrl.current = true;
      const parsed = parseSellerFilters(new URLSearchParams(window.location.search));
      setSearchQuery(parsed.search);
      setStatusFilter(parsed.statusFilter);
      setCategoryFilter(parsed.categoryFilter);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Sync when searchParams changes via Next router
  useEffect(() => {
    const parsed = parseSellerFilters(searchParams);
    if (
      parsed.search !== searchQuery ||
      parsed.statusFilter !== statusFilter ||
      parsed.categoryFilter !== categoryFilter
    ) {
      isUpdatingFromUrl.current = true;
      setSearchQuery(parsed.search);
      setStatusFilter(parsed.statusFilter);
      setCategoryFilter(parsed.categoryFilter);
    }
  }, [searchParams]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [detailsDefaultTab, setDetailsDefaultTab] = useState<'overview' | 'products' | 'orders'>(
    'overview',
  );
  const [sellerToEdit, setSellerToEdit] = useState<Seller | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSellers = useCallback(async () => {
    try {
      setIsLoading(true);
      const [sellersData, statsData] = await Promise.all([
        api.get<Seller[]>('/admin/sellers'),
        api.get<SellerStatsData>('/admin/sellers/stats'),
      ]);

      setSellers(Array.isArray(sellersData) ? sellersData : []);
      if (statsData) {
        setStats(statsData);
      }
    } catch (err) {
      console.error('Failed to fetch sellers:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.get<SellerCategory[]>('/admin/categories');
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  useEffect(() => {
    void fetchSellers();
    void fetchCategories();
  }, [fetchSellers, fetchCategories]);

  const filteredSellers = useMemo(() => {
    return sellers.filter((seller) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = seller.name.toLowerCase().includes(q);
        const matchStore = seller.storeName.toLowerCase().includes(q);
        const matchPhone = seller.phone.includes(q);
        const matchEmail = seller.email?.toLowerCase().includes(q) ?? false;
        if (!matchName && !matchStore && !matchPhone && !matchEmail) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'ALL' && seller.status !== statusFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'ALL') {
        const hasCat = seller.categories?.some(
          (c) => c.id === categoryFilter || c.slug === categoryFilter,
        );
        if (!hasCat) {
          return false;
        }
      }

      return true;
    });
  }, [sellers, searchQuery, statusFilter, categoryFilter]);

  const handleSaveSeller = async (
    payload: {
      name: string;
      storeName: string;
      email?: string | null;
      phone: string;
      address?: string | null;
      website?: string | null;
      instagram?: string | null;
      status: SellerStatus;
      categoryIds: string[];
    },
    isEdit: boolean,
    id?: string,
  ) => {
    try {
      if (isEdit && id) {
        const updated = await api.patch<Seller>(`/admin/sellers/${id}`, payload);
        setSellers((prev) => prev.map((s) => (s.id === id ? updated : s)));
        if (selectedSeller?.id === id) {
          setSelectedSeller(updated);
        }
      } else {
        const created = await api.post<Seller>('/admin/sellers', payload);
        setSellers((prev) => [created, ...prev]);
        setStats((prev: SellerStatsData) => ({
          ...prev,
          totalSellers: prev.totalSellers + 1,
          activeSellers: payload.status === 'ACTIVE' ? prev.activeSellers + 1 : prev.activeSellers,
        }));
      }
      setIsAddModalOpen(false);
      setSellerToEdit(null);
    } catch (err) {
      console.error('Save seller error:', err);
      throw err;
    }
  };

  const handleDeleteSeller = async (id: string) => {
    try {
      await api.delete(`/admin/sellers/${id}`);
      setSellers((prev) => prev.filter((s) => s.id !== id));
      if (selectedSeller?.id === id) {
        setSelectedSeller(null);
      }
      setStats((prev: SellerStatsData) => ({
        ...prev,
        totalSellers: Math.max(0, prev.totalSellers - 1),
      }));
    } catch (err) {
      console.error('Delete seller error:', err);
      throw err;
    }
  };

  const handleToggleStatus = async (id: string, newStatus: SellerStatus) => {
    try {
      const updated = await api.patch<Seller>(`/admin/sellers/${id}`, { status: newStatus });
      setSellers((prev) => prev.map((s) => (s.id === id ? updated : s)));
      if (selectedSeller?.id === id) {
        setSelectedSeller(updated);
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const openSellerOrders = (seller: Seller) => {
    setSelectedSeller(seller);
    setDetailsDefaultTab('orders');
  };

  return {
    sellers,
    stats,
    categories,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    isAddModalOpen,
    setIsAddModalOpen,
    selectedSeller,
    setSelectedSeller,
    detailsDefaultTab,
    setDetailsDefaultTab,
    sellerToEdit,
    setSellerToEdit,
    isLoading,
    filteredSellers,
    handleSaveSeller,
    handleDeleteSeller,
    handleToggleStatus,
    openSellerOrders,
    refreshSellers: fetchSellers,
  };
}
