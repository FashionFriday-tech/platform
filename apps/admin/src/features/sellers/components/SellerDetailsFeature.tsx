'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  ChevronLeftIcon,
  EditIcon,
  GlobeIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PackageIcon,
  PhoneIcon,
  PlusIcon,
  ShoppingBagIcon,
  StoreIcon,
  TrashIcon,
  WhatsAppIcon,
} from '@ff/ui';
import { toast } from 'sonner';

import { api } from '@/lib/api-client';

import { useSellerDetails } from '../hooks/useSellerDetails';
import {
  type Seller,
  type SellerCategory,
  type SellerStatus,
} from '../types';
import { AddSellerModal } from './AddSellerModal';
import { SellerOrdersList } from './SellerOrdersList';

interface SellerDetailsFeatureProps {
  sellerId: string;
}

export function SellerDetailsFeature({ sellerId }: SellerDetailsFeatureProps) {
  const router = useRouter();

  const [seller, setSeller] = useState<Seller | null>(null);
  const [categories, setCategories] = useState<SellerCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');

  const { orders, products, isLoadingOrders, isLoadingProducts } = useSellerDetails(sellerId);

  const fetchSeller = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Seller>(`/admin/sellers/${sellerId}`);
      if (data) {
        setSeller(data);
      }
    } catch (err) {
      console.error('Failed to load seller details:', err);
      toast.error('Failed to load seller profile details');
    } finally {
      setIsLoading(false);
    }
  }, [sellerId]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.get<SellerCategory[]>('/admin/categories');
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  useEffect(() => {
    void fetchSeller();
    void fetchCategories();
  }, [fetchSeller, fetchCategories]);

  const handleToggleStatus = async (newStatus: SellerStatus) => {
    if (!seller) return;
    try {
      const updated = await api.patch<Seller>(`/admin/sellers/${seller.id}`, { status: newStatus });
      setSeller(updated);
      toast.success(`Seller status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update seller status');
    }
  };

  const handleDeleteSeller = async () => {
    if (!seller) return;
    if (
      !window.confirm(
        `Are you sure you want to delete seller "${seller.storeName}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete(`/admin/sellers/${seller.id}`);
      toast.success(`Seller "${seller.storeName}" deleted successfully`);
      router.push('/sellers');
    } catch (err) {
      console.error('Failed to delete seller:', err);
      toast.error('Failed to delete seller. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

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
      const targetId = id ?? seller?.id;
      if (!targetId) return;
      const updated = await api.patch<Seller>(`/admin/sellers/${targetId}`, payload);
      setSeller(updated);
      setIsEditModalOpen(false);
      toast.success('Seller details updated successfully');
    } catch (err) {
      console.error('Failed to save seller:', err);
      toast.error('Failed to save seller details');
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-black/50 dark:text-white/50">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
          <span>Loading seller details...</span>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-black/10 p-12 text-center dark:border-white/10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5">
          <StoreIcon className="h-6 w-6 text-black/40 dark:text-white/40" />
        </div>
        <h3 className="text-lg font-bold text-black dark:text-white">Seller Not Found</h3>
        <p className="text-sm text-black/50 dark:text-white/50">
          The seller you are looking for does not exist or has been deleted.
        </p>
        <button
          onClick={() => {
            router.push('/sellers');
          }}
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to Sellers
        </button>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.sellerSubtotal || 0), 0);
  const totalItemsSold = orders.reduce((sum, o) => sum + (o.totalItemsCount || 0), 0);
  const complaintsCount = seller.complaintsCount ?? seller._count?.complaints ?? 0;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            router.push('/sellers');
          }}
          className="group flex items-center gap-2 text-xs font-bold text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
        >
          <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Sellers
        </button>
      </div>

      {/* Header Profile Section */}
      <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white shadow-xs dark:border-white/5 dark:bg-[#111111]">
        {/* Cover Gradient Background */}
        <div className="h-32 w-full bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-indigo-500/15 dark:from-emerald-500/10 dark:via-teal-500/5 dark:to-indigo-500/10" />

        <div className="px-8 pb-8">
          <div className="-mt-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {/* Store Avatar & Basic Info */}
            <div className="flex items-end gap-6">
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-black shadow-md dark:border-[#111111] dark:bg-white">
                <span className="text-3xl font-black text-white dark:text-black">
                  {seller.storeName.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex flex-col pb-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-black tracking-tight text-black dark:text-white md:text-3xl">
                    {seller.storeName}
                  </h1>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                      seller.status === 'ACTIVE'
                        ? 'border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : seller.status === 'INACTIVE'
                          ? 'border-zinc-300 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                          : 'border-amber-500/20 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                    }`}
                  >
                    {seller.status}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-black/60 dark:text-white/60">
                  Contact Person:{' '}
                  <span className="font-bold text-black dark:text-white">{seller.name}</span>
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-semibold text-black/60 dark:text-white/60">
                  <span className="flex items-center gap-1.5">
                    <PhoneIcon className="h-3.5 w-3.5 text-black/40 dark:text-white/40" />
                    {seller.phone}
                  </span>
                  {seller.email && (
                    <span className="flex items-center gap-1.5">
                      <MailIcon className="h-3.5 w-3.5 text-black/40 dark:text-white/40" />
                      {seller.email}
                    </span>
                  )}
                  {seller.address && (
                    <span className="flex items-center gap-1.5 truncate max-w-sm" title={seller.address}>
                      <MapPinIcon className="h-3.5 w-3.5 text-black/40 dark:text-white/40" />
                      {seller.address}
                    </span>
                  )}
                  {seller.website && (
                    <a
                      href={
                        seller.website.startsWith('http://') || seller.website.startsWith('https://')
                          ? seller.website
                          : `https://${seller.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-blue-600 transition-colors hover:underline dark:text-blue-400"
                      title={seller.website}
                    >
                      <GlobeIcon className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[200px]">
                        {seller.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                      </span>
                    </a>
                  )}
                  {seller.instagram && (
                    <a
                      href={
                        seller.instagram.startsWith('http://') || seller.instagram.startsWith('https://')
                          ? seller.instagram
                          : `https://instagram.com/${seller.instagram.replace(/^@/, '')}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-pink-600 transition-colors hover:underline dark:text-pink-400"
                      title={seller.instagram}
                    >
                      <InstagramIcon className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[200px]">
                        {seller.instagram.startsWith('@')
                          ? seller.instagram
                          : `@${seller.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '')}`}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons Under Detail Page */}
            <div className="flex flex-wrap items-center gap-2 pb-1">
              {/* Call */}
              <a
                href={`tel:${seller.phone}`}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-black/10 bg-white px-3.5 text-xs font-bold text-black shadow-xs transition-colors hover:bg-black/5 active:scale-95 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-white/5"
                title={`Call ${seller.phone}`}
              >
                <PhoneIcon className="h-3.5 w-3.5 text-black/60 dark:text-white/60" />
                Call
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${
                  seller.phone.replace(/\D/g, '').length === 10
                    ? '91' + seller.phone.replace(/\D/g, '')
                    : seller.phone.replace(/\D/g, '')
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 text-xs font-bold text-emerald-600 shadow-xs transition-colors hover:bg-emerald-500/20 active:scale-95 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30"
                title="Open WhatsApp Chat"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                WhatsApp
              </a>

              {/* Email */}
              {seller.email ? (
                <a
                  href={`mailto:${seller.email}`}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3.5 text-xs font-bold text-blue-600 shadow-xs transition-colors hover:bg-blue-500/20 active:scale-95 dark:border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30"
                  title={`Email ${seller.email}`}
                >
                  <MailIcon className="h-3.5 w-3.5" />
                  Email
                </a>
              ) : null}

              {/* Instagram */}
              {seller.instagram ? (
                <a
                  href={
                    seller.instagram.startsWith('http://') || seller.instagram.startsWith('https://')
                      ? seller.instagram
                      : `https://instagram.com/${seller.instagram.replace(/^@/, '')}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-pink-500/20 bg-pink-500/10 px-3.5 text-xs font-bold text-pink-600 shadow-xs transition-colors hover:bg-pink-500/20 active:scale-95 dark:border-pink-500/30 dark:bg-pink-500/20 dark:text-pink-400 dark:hover:bg-pink-500/30"
                  title={`Instagram: ${seller.instagram}`}
                >
                  <InstagramIcon className="h-3.5 w-3.5" />
                  Instagram
                </a>
              ) : (
                <button
                  onClick={() => {
                    setIsEditModalOpen(true);
                  }}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-pink-500/20 bg-pink-500/5 px-3.5 text-xs font-bold text-pink-600/80 shadow-xs transition-colors hover:bg-pink-500/10 active:scale-95 dark:border-pink-500/20 dark:bg-pink-500/10 dark:text-pink-400"
                  title="Add Instagram Link"
                >
                  <InstagramIcon className="h-3.5 w-3.5" />
                  Instagram
                </button>
              )}

              {/* Edit Seller */}
              <button
                onClick={() => {
                  setIsEditModalOpen(true);
                }}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-3.5 text-xs font-bold text-black shadow-xs transition-colors hover:bg-black/5 active:scale-95 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-white/5"
              >
                <EditIcon className="h-3.5 w-3.5" />
                Edit Seller
              </button>

              {/* Delete Seller */}
              <button
                onClick={handleDeleteSeller}
                disabled={isDeleting}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/60 px-3.5 text-xs font-bold text-rose-600 shadow-xs transition-colors hover:bg-rose-100 active:scale-95 disabled:opacity-50 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-5">
            <div className="flex flex-col rounded-2xl border border-black/5 bg-[#f8f9fa] p-4.5 dark:border-white/5 dark:bg-[#1a1a1a]">
              <span className="text-[11px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                Total Products
              </span>
              <span className="mt-1.5 text-2xl font-black text-black dark:text-white">
                {products.length}
              </span>
            </div>

            <div className="flex flex-col rounded-2xl border border-black/5 bg-[#f8f9fa] p-4.5 dark:border-white/5 dark:bg-[#1a1a1a]">
              <span className="text-[11px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                Total Orders
              </span>
              <span className="mt-1.5 text-2xl font-black text-black dark:text-white">
                {orders.length}
              </span>
            </div>

            <div className="flex flex-col rounded-2xl border border-black/5 bg-[#f8f9fa] p-4.5 dark:border-white/5 dark:bg-[#1a1a1a]">
              <span className="text-[11px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                Complaints
              </span>
              <span
                className={`mt-1.5 text-2xl font-black ${
                  complaintsCount > 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-black dark:text-white'
                }`}
              >
                {complaintsCount}
              </span>
            </div>

            <div className="flex flex-col rounded-2xl border border-black/5 bg-[#f8f9fa] p-4.5 dark:border-white/5 dark:bg-[#1a1a1a]">
              <span className="text-[11px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                Items Sold
              </span>
              <span className="mt-1.5 text-2xl font-black text-black dark:text-white">
                {totalItemsSold}
              </span>
            </div>

            <div className="flex flex-col rounded-2xl border border-black/5 bg-[#f8f9fa] p-4.5 dark:border-white/5 dark:bg-[#1a1a1a]">
              <span className="text-[11px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                Total Revenue
              </span>
              <span className="mt-1.5 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories & Overview Card (Prominently placed under Detail Page) */}
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xs dark:border-white/5 dark:bg-[#111111]">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-bold text-black dark:text-white">
              Assigned Categories ({seller.categories?.length ?? 0})
            </h2>
            <p className="mt-0.5 text-xs text-black/50 dark:text-white/50">
              Categories this seller is authorized to list products under
            </p>
          </div>

          <button
            onClick={() => {
              setIsEditModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-black/5 px-3 py-1.5 text-xs font-bold text-black transition-colors hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            Manage Categories
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {seller.categories && seller.categories.length > 0 ? (
            seller.categories.map((cat) => (
              <span
                key={cat.id}
                className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-black shadow-xs dark:border-white/10 dark:bg-[#1c1c1c] dark:text-white"
              >
                <span>{cat.name}</span>
                {cat.gender && (
                  <span className="rounded bg-black/5 px-1.5 py-0.5 text-[10px] font-bold text-black/60 uppercase dark:bg-white/10 dark:text-white/60">
                    {cat.gender}
                  </span>
                )}
              </span>
            ))
          ) : (
            <div className="flex w-full items-center justify-between rounded-2xl border border-dashed border-black/10 p-4 text-xs text-black/40 dark:border-white/10 dark:text-white/40">
              <span>No categories currently assigned to this seller.</span>
              <button
                onClick={() => {
                  setIsEditModalOpen(true);
                }}
                className="font-bold text-black hover:underline dark:text-white"
              >
                Assign Categories
              </button>
            </div>
          )}
        </div>

        {/* Quick Status Control Bar */}
        <div className="mt-6 flex flex-col justify-between gap-3 border-t border-black/5 pt-4 sm:flex-row sm:items-center dark:border-white/5">
          <div className="text-xs font-bold text-black/60 dark:text-white/60">
            Current Status:{' '}
            <span className="font-extrabold text-black dark:text-white">{seller.status}</span>
          </div>

          <div className="flex items-center gap-2">
            {(['ACTIVE', 'INACTIVE', 'SUSPENDED'] as SellerStatus[]).map((st) => (
              <button
                key={st}
                onClick={() => {
                  void handleToggleStatus(st);
                }}
                className={`rounded-xl border px-3 py-1 text-xs font-bold uppercase transition-all ${
                  seller.status === st
                    ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                    : 'border-black/10 bg-white text-black/60 hover:bg-black/5 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white/60 dark:hover:bg-white/5'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-black/5 pb-2 dark:border-white/5">
        {[
          { id: 'overview', label: 'Overview', icon: StoreIcon },
          { id: 'products', label: `Products (${products.length})`, icon: PackageIcon },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBagIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as 'overview' | 'products' | 'orders');
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-black text-white shadow-xs dark:bg-white dark:text-black'
                : 'bg-black/5 text-black/60 hover:bg-black/10 hover:text-black dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white'
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Body Content */}
      <div className="pt-2">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xs dark:border-white/5 dark:bg-[#111111]">
              <h3 className="mb-4 text-sm font-bold text-black dark:text-white">Store Information</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-black/5 dark:border-white/5">
                  <span className="font-medium text-black/50 dark:text-white/50">Store Name</span>
                  <span className="font-bold text-black dark:text-white">{seller.storeName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-black/5 dark:border-white/5">
                  <span className="font-medium text-black/50 dark:text-white/50">Contact Person</span>
                  <span className="font-bold text-black dark:text-white">{seller.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-black/5 dark:border-white/5">
                  <span className="font-medium text-black/50 dark:text-white/50">Registered Phone</span>
                  <span className="font-bold text-black dark:text-white">{seller.phone}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-black/5 dark:border-white/5">
                  <span className="font-medium text-black/50 dark:text-white/50">Registered Email</span>
                  <span className="font-bold text-black dark:text-white">
                    {seller.email ?? 'Not provided'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-black/5 dark:border-white/5">
                  <span className="font-medium text-black/50 dark:text-white/50">Website</span>
                  {seller.website ? (
                    <a
                      href={
                        seller.website.startsWith('http://') || seller.website.startsWith('https://')
                          ? seller.website
                          : `https://${seller.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {seller.website}
                    </a>
                  ) : (
                    <span className="text-black/40 italic dark:text-white/40">Not provided</span>
                  )}
                </div>
                <div className="flex justify-between py-1.5 border-b border-black/5 dark:border-white/5">
                  <span className="font-medium text-black/50 dark:text-white/50">Instagram</span>
                  {seller.instagram ? (
                    <a
                      href={
                        seller.instagram.startsWith('http://') || seller.instagram.startsWith('https://')
                          ? seller.instagram
                          : `https://instagram.com/${seller.instagram.replace(/^@/, '')}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-pink-600 hover:underline dark:text-pink-400"
                    >
                      {seller.instagram}
                    </a>
                  ) : (
                    <span className="text-black/40 italic dark:text-white/40">Not provided</span>
                  )}
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="font-medium text-black/50 dark:text-white/50">Created Date</span>
                  <span className="font-bold text-black dark:text-white">
                    {seller.createdAt
                      ? new Date(seller.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xs dark:border-white/5 dark:bg-[#111111]">
              <h3 className="mb-4 text-sm font-bold text-black dark:text-white">
                Store / Pickup Address
              </h3>
              {seller.address ? (
                <div className="flex items-start gap-3 rounded-2xl bg-[#f8f9fa] p-4 text-xs font-semibold text-black dark:bg-[#1a1a1a] dark:text-white">
                  <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-black/50 dark:text-white/50" />
                  <p className="leading-relaxed">{seller.address}</p>
                </div>
              ) : (
                <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 text-xs text-black/40 dark:border-white/10 dark:text-white/40">
                  <MapPinIcon className="mb-2 h-6 w-6 opacity-30" />
                  <span>No physical address provided.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            {isLoadingProducts ? (
              <div className="flex h-60 items-center justify-center text-sm text-black/50 dark:text-white/50">
                <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
                Loading seller products...
              </div>
            ) : products.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-black/5 bg-white p-8 text-center shadow-xs dark:border-white/5 dark:bg-[#111111]">
                <PackageIcon className="mb-3 h-10 w-10 text-black/20 dark:text-white/20" />
                <h4 className="text-sm font-bold text-black dark:text-white">No products linked</h4>
                <p className="mt-1 max-w-sm text-xs text-black/50 dark:text-white/50">
                  No products are currently assigned to this seller. You can select this seller when
                  adding or editing products.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3">
                {products.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      router.push(`/products/${p.slug || p.id}`);
                    }}
                    className="group flex cursor-pointer items-center gap-3.5 rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs transition-all hover:border-black/15 hover:shadow-md dark:border-white/10 dark:bg-[#141417] dark:hover:border-white/20"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-black/5 bg-black/5 dark:border-white/5 dark:bg-white/5">
                      {p.mainImage ? (
                        <img
                          src={p.mainImage}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-black/30 dark:text-white/30">
                          FF
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-black group-hover:underline dark:text-white">
                        {p.name}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-black/60 dark:text-white/60">
                        ₹{Number(p.sellingPrice).toLocaleString('en-IN')} &middot; Stock:{' '}
                        {p.totalStock}
                      </p>
                      {p.category?.name && (
                        <span className="mt-1 inline-block text-[10px] text-black/40 dark:text-white/40">
                          {p.category.name}
                        </span>
                      )}
                    </div>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        p.status === 'PUBLISHED'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xs dark:border-white/5 dark:bg-[#111111]">
            <SellerOrdersList
              orders={orders}
              isLoading={isLoadingOrders}
              sellerStoreName={seller.storeName}
            />
          </div>
        )}
      </div>

      {/* Edit Seller Modal */}
      <AddSellerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
        onSave={handleSaveSeller}
        sellerToEdit={seller}
        categories={categories}
      />
    </div>
  );
}
