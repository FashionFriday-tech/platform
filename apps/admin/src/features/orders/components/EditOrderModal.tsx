'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

import { CloseIcon, LoaderIcon, ShoppingBagIcon } from '@ff/ui';

import { api } from '@/lib/api-client';
import { getSecureRandomId } from '@/lib/security/random';

import { type Order } from '../types';
import { COURIER_SERVICES } from '../utils/courier';

export type EditOrderTab = 'items' | 'customer' | 'pricing' | 'fulfillment';

interface EditOrderModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated: (updatedOrder: Order) => void;
  initialTab?: EditOrderTab;
  rawSellers?: any[];
}

interface EditableItem {
  id?: string;
  productId?: string;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  sellerId?: string | null;
}

const COMMON_SIZES = ['Free Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Custom'];
const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Pending (Order Placed)' },
  { value: 'STOCK_CHECK', label: 'Stock Check' },
  { value: 'STOCK_CONFIRMED', label: 'Stock Confirmed' },
  { value: 'PROCESSING', label: 'Placed with Seller' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const PAYMENT_METHODS = [
  { value: 'COD', label: 'Cash on Delivery (COD)' },
  { value: 'RAZORPAY', label: 'Razorpay / UPI' },
  { value: 'STRIPE', label: 'Stripe' },
  { value: 'WALLET', label: 'Wallet' },
];

const PAYMENT_STATUSES = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'AUTHORIZED', label: 'Authorized (Hold)' },
  { value: 'CAPTURE_PENDING', label: 'Capture Pending' },
  { value: 'CAPTURED', label: 'Captured / Paid' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'VOID_PENDING', label: 'Void Pending' },
  { value: 'VOIDED', label: 'Voided' },
  { value: 'REFUND_PENDING', label: 'Refund Pending' },
  { value: 'PARTIALLY_REFUNDED', label: 'Partially Refunded' },
  { value: 'REFUNDED', label: 'Refunded' },
];

export function EditOrderModal({
  order,
  isOpen,
  onClose,
  onOrderUpdated,
  initialTab = 'items',
  rawSellers = [],
}: EditOrderModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<EditOrderTab>(initialTab);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sellers
  const [sellersList, setSellersList] = useState<any[]>(rawSellers);

  // Form States - Customer & Address
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAltPhone, setCustomerAltPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Form States - Items
  const [items, setItems] = useState<EditableItem[]>([]);

  // Product Search State for adding items
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchingProduct, setIsSearchingProduct] = useState(false);

  // Form States - Pricing
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [shippingFees, setShippingFees] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('COD');
  const [paymentStatus, setPaymentStatus] = useState<string>('PENDING');

  // Form States - Fulfillment & Status
  const [orderStatus, setOrderStatus] = useState<string>('PENDING');
  const [courierPartner, setCourierPartner] = useState<string>('Delhivery');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [bulkSellerId, setBulkSellerId] = useState<string>('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setErrorMessage(null);

      // Populate Customer & Address
      const addr = order.shippingAddress || ({} as any);
      setCustomerName(order.customer?.name || addr.fullName || '');
      setCustomerPhone(order.customer?.phone || addr.phoneNumber || '');
      setCustomerAltPhone(order.customer?.altPhone || addr.altPhoneNumber || '');
      setCustomerEmail(order.customer?.email || '');

      setStreet(addr.street || '');
      setBuilding(addr.building || '');
      setLandmark(addr.landmark || '');
      setCity(addr.city || '');
      setDistrict(addr.district || '');
      setState(addr.state || '');
      setPincode(addr.pincode || '');

      // Populate Items
      const mappedItems: EditableItem[] = (order.items || []).map((i) => ({
        id: i.id,
        productId: i.productId,
        name: i.productName || (i as any).name || 'Fashion Product',
        image: i.productImage || (i as any).image || '',
        size: i.size || 'Free Size',
        color: i.color || 'Standard',
        price: Number(i.price ?? 0),
        quantity: Number(i.quantity ?? 1),
        sellerId: i.sellerId || (i as any).seller?.id || null,
      }));
      setItems(mappedItems);

      // Populate Pricing
      setDiscountAmount(Number(order.discountAmount ?? 0));
      setShippingFees(Number(order.shippingFees ?? (order.paymentType === 'cod' ? 200 : 0)));
      setPaymentMethod((order.paymentMethod || 'COD').toUpperCase());
      setPaymentStatus((order.paymentStatus || 'PENDING').toUpperCase());

      // Populate Fulfillment
      setOrderStatus((order.status || 'PENDING').toUpperCase());
      setCourierPartner(order.tracking?.courierService || 'Delhivery');
      setTrackingNumber(order.tracking?.trackingId || '');

      const existingSeller =
        (order as any).seller?.id ||
        order.items?.find((it: any) => it.sellerId || it.seller?.id)?.sellerId ||
        order.items?.find((it: any) => it.seller)?.seller?.id ||
        '';
      setBulkSellerId(existingSeller);
    }
  }, [isOpen, order, initialTab]);

  // Fetch sellers if list was empty
  useEffect(() => {
    if (sellersList.length === 0 && isOpen) {
      void (async () => {
        try {
          const res: any = await api.get('/admin/sellers');
          const list: any[] = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
          setSellersList(list);
        } catch (e) {
          console.warn('Failed to fetch sellers in EditOrderModal', e);
        }
      })();
    }
  }, [isOpen, sellersList.length]);

  // Calculate live subtotal & final amount
  const calculatedSubtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0,
    );
  }, [items]);

  const calculatedFinalAmount = useMemo(() => {
    const sub = calculatedSubtotal;
    const disc = Number(discountAmount) || 0;
    const ship = Number(shippingFees) || 0;
    return Math.max(0, sub - disc + ship);
  }, [calculatedSubtotal, discountAmount, shippingFees]);

  // Search catalog products
  useEffect(() => {
    if (!productSearchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setIsSearchingProduct(true);
        const res: any = await api.get(
          `/admin/products?search=${encodeURIComponent(productSearchQuery.trim())}&limit=6`,
        );
        const list = res?.products || res?.items || (Array.isArray(res) ? res : []);
        setSearchResults(list);
      } catch (e) {
        console.warn('Product search failed', e);
      } finally {
        setIsSearchingProduct(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [productSearchQuery]);

  const handleAddProduct = (prod: any) => {
    const newItem: EditableItem = {
      productId: prod.id,
      name: prod.name || 'New Item',
      image: prod.mainImage || prod.promoImage || prod.liveImages?.[0] || '',
      size: prod.sizes?.[0] || 'Free Size',
      color: prod.colors?.[0] || 'Standard',
      price: Number(prod.sellingPrice ?? prod.price ?? 0),
      quantity: 1,
      sellerId: prod.sellerId || null,
    };
    setItems((prev) => [...prev, newItem]);
    setProductSearchQuery('');
    setSearchResults([]);
  };

  const handleAddCustomItem = () => {
    const newItem: EditableItem = {
      productId: `prod-manual-${Date.now()}`,
      name: 'Custom Product',
      image: '',
      size: 'Free Size',
      color: 'Standard',
      price: 0,
      quantity: 1,
      sellerId: bulkSellerId || null,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleUpdateItem = (index: number, updates: Partial<EditableItem>) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      alert('An order must have at least one product item.');
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApplyBulkSeller = (sellerId: string) => {
    setBulkSellerId(sellerId);
    if (!sellerId) return;
    setItems((prev) => prev.map((item) => ({ ...item, sellerId })));
  };

  const handleSave = async () => {
    setErrorMessage(null);

    // Validation
    if (items.length === 0) {
      setErrorMessage('The order must contain at least one item.');
      setActiveTab('items');
      return;
    }

    for (let i = 0; i < items.length; i++) {
      if (!items[i].name?.trim()) {
        setErrorMessage(`Item #${i + 1} must have a product name.`);
        setActiveTab('items');
        return;
      }
      if ((items[i].price ?? 0) < 0) {
        setErrorMessage(`Item #${i + 1} price cannot be negative.`);
        setActiveTab('items');
        return;
      }
      if ((items[i].quantity ?? 1) < 1) {
        setErrorMessage(`Item #${i + 1} quantity must be at least 1.`);
        setActiveTab('items');
        return;
      }
    }

    if (!customerPhone.replace(/\D/g, '')) {
      setErrorMessage('Customer phone number is required.');
      setActiveTab('customer');
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        status: orderStatus,
        paymentStatus,
        paymentMethod,
        totalAmount: calculatedSubtotal,
        discountAmount: Number(discountAmount) || 0,
        shippingFees: Number(shippingFees) || 0,
        finalAmount: calculatedFinalAmount,
        trackingNumber: trackingNumber.trim() || null,
        courierPartner: courierPartner.trim() || null,
        sellerId: bulkSellerId || null,
        customer: {
          name: customerName.trim(),
          phone: customerPhone.replace(/\D/g, '').slice(-10),
          email: customerEmail.trim() || undefined,
          altPhone: customerAltPhone ? customerAltPhone.replace(/\D/g, '').slice(-10) : null,
        },
        shippingAddress: {
          fullName: customerName.trim(),
          phoneNumber: customerPhone.replace(/\D/g, '').slice(-10),
          altPhoneNumber: customerAltPhone ? customerAltPhone.replace(/\D/g, '').slice(-10) : null,
          street: street.trim(),
          building: building.trim() || null,
          landmark: landmark.trim() || null,
          city: city.trim(),
          district: district.trim() || null,
          state: state.trim(),
          pincode: pincode.trim(),
        },
        items: items.map((it) => ({
          id: it.id,
          productId: it.productId,
          name: it.name.trim(),
          image: it.image || '',
          size: it.size || 'Free Size',
          color: it.color || 'Standard',
          price: Number(it.price) || 0,
          quantity: Number(it.quantity) || 1,
          sellerId: it.sellerId || null,
        })),
      };

      const updatedData: any = await api.patch(`/orders/${order.id}`, payload);

      // Build updated mapped order object
      const address =
        typeof updatedData?.shippingAddress === 'string'
          ? JSON.parse(updatedData.shippingAddress)
          : updatedData?.shippingAddress || payload.shippingAddress;

      const mappedUpdated: Order = {
        ...order,
        ...updatedData,
        status: (updatedData?.status || payload.status).toLowerCase(),
        customer: {
          id: updatedData?.userId || order.customer.id,
          name: address?.fullName || payload.customer.name || 'Customer',
          phone: address?.phoneNumber || payload.customer.phone || '',
          altPhone: address?.altPhoneNumber || payload.customer.altPhone,
          email: payload.customer.email,
        },
        shippingAddress: {
          fullName: address?.fullName || payload.customer.name,
          phoneNumber: address?.phoneNumber || payload.customer.phone,
          altPhoneNumber: address?.altPhoneNumber || payload.customer.altPhone,
          street: address?.street || payload.shippingAddress.street,
          building: address?.building || payload.shippingAddress.building,
          landmark: address?.landmark || payload.shippingAddress.landmark,
          city: address?.city || payload.shippingAddress.city,
          district: address?.district || payload.shippingAddress.district,
          state: address?.state || payload.shippingAddress.state,
          pincode: address?.pincode || payload.shippingAddress.pincode,
        },
        totalAmount: calculatedSubtotal,
        discountAmount: Number(discountAmount) || 0,
        shippingFees: Number(shippingFees) || 0,
        finalAmount: calculatedFinalAmount,
        total: calculatedFinalAmount,
        paymentMethod: payload.paymentMethod,
        paymentStatus: payload.paymentStatus.toLowerCase() as any,
        paymentType: payload.paymentMethod.toLowerCase() === 'cod' ? 'cod' : 'prepaid',
        tracking: {
          trackingId: payload.trackingNumber || '',
          courierService: payload.courierPartner || 'Delhivery',
        },
        items: (updatedData?.items || payload.items).map((item: any) => ({
          id: item.id || getSecureRandomId(8),
          productId: item.productId,
          sellerId: item.sellerId,
          seller: item.seller || sellersList.find((s) => s.id === item.sellerId) || null,
          productName: item.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: Number(item.price ?? 0),
          sku:
            item.sku ||
            `SKU-${String(item.productId || 'GEN')
              .slice(-6)
              .toUpperCase()}`,
          productImage: item.image || item.product?.mainImage || '',
        })),
      };

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('ff_order_mutation_ts', Date.now().toString());
          window.dispatchEvent(
            new CustomEvent('ff-orders-updated', { detail: { orderId: order.id, type: 'update' } }),
          );
        } catch {
          // ignore
        }
      }

      onOrderUpdated(mappedUpdated);
      onClose();
    } catch (err: any) {
      console.error('Failed to update order:', err);
      setErrorMessage(err.message || 'Failed to save order updates. Please check details.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !mounted) {
    return null;
  }

  const tabs: { key: EditOrderTab; label: string; icon: string }[] = [
    { key: 'items', label: 'Items & Products', icon: '📦' },
    { key: 'customer', label: 'Customer & Address', icon: '👤' },
    { key: 'pricing', label: 'Payment & Pricing', icon: '💳' },
    { key: 'fulfillment', label: 'Status & Fulfillment', icon: '🚚' },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-4">
      <div className="flex h-full max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#141414]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 p-4 sm:p-6 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-xs font-bold text-white dark:bg-white dark:text-black">
                ✏️
              </span>
              <h2 className="text-lg font-bold text-black sm:text-xl dark:text-white">
                Edit Order #{order.orderNumber}
              </h2>
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Complete order modification: change items, customer details, address, pricing, payment
              and fulfillment
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-100 bg-zinc-50 px-4 sm:px-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="scrollbar-hide flex gap-2 overflow-x-auto py-2.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-black text-white shadow-sm dark:bg-white dark:text-black'
                      : 'text-zinc-600 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.key === 'items' && (
                    <span
                      className={`py-0.2 ml-1 rounded-full px-1.5 text-[10px] font-black ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                          : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {items.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            <span>⚠️ {errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab Content Body */}
        <div className="scrollbar-hide flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: ITEMS */}
          {activeTab === 'items' && (
            <div className="flex flex-col gap-6">
              {/* Add Product Search & Custom Item bar */}
              <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-black dark:text-white">
                      Add Products to Order
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Search catalog to add existing products, or add a custom custom product line
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomItem}
                    className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-dashed border-zinc-300 bg-white px-3.5 py-2 text-xs font-bold text-zinc-800 shadow-sm transition-all hover:bg-zinc-100 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                  >
                    <span>➕ Add Custom Item</span>
                  </button>
                </div>

                {/* Catalog Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    placeholder="🔍 Search catalog products by name..."
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black placeholder-zinc-400 outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                  />
                  {isSearchingProduct && (
                    <div className="absolute top-2.5 right-3">
                      <LoaderIcon className="h-4 w-4 animate-spin text-zinc-400" />
                    </div>
                  )}

                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full z-20 mt-1.5 max-h-60 w-full overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                      {searchResults.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => handleAddProduct(prod)}
                          className="flex cursor-pointer items-center justify-between gap-3 rounded-xl p-2.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                              {prod.mainImage ? (
                                <Image
                                  src={prod.mainImage}
                                  alt={prod.name}
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <ShoppingBagIcon className="h-full w-full p-2 text-zinc-400" />
                              )}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-black dark:text-white">
                                {prod.name}
                              </div>
                              <div className="text-[11px] text-zinc-400">
                                Price: ₹{prod.sellingPrice ?? prod.price ?? 0}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="rounded-lg bg-black px-2.5 py-1 text-[11px] font-bold text-white dark:bg-white dark:text-black"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-black dark:text-white">
                    Order Items ({items.length})
                  </h3>
                  <span className="text-xs font-semibold text-zinc-500">
                    Subtotal: ₹
                    {calculatedSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {items.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 transition-all hover:border-zinc-200 dark:border-zinc-800/80 dark:bg-zinc-900/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/10 text-xs font-bold text-zinc-700 dark:bg-white/10 dark:text-zinc-300">
                          {idx + 1}
                        </span>
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={56}
                              height={56}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ShoppingBagIcon className="h-6 w-6 text-zinc-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
                            Product #{idx + 1}
                          </div>
                          <div className="text-sm font-bold text-black dark:text-white">
                            {item.name}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        disabled={items.length <= 1}
                        title="Remove item from order"
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-30 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Editable Item Fields Grid */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
                      <div className="lg:col-span-2">
                        <label className="mb-1 block text-[11px] font-bold text-zinc-400">
                          Product Name
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdateItem(idx, { name: e.target.value })}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-bold text-zinc-400">
                          Size
                        </label>
                        <input
                          type="text"
                          list={`size-options-${idx}`}
                          value={item.size}
                          onChange={(e) => handleUpdateItem(idx, { size: e.target.value })}
                          placeholder="Size (e.g. L)"
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                        />
                        <datalist id={`size-options-${idx}`}>
                          {COMMON_SIZES.map((s) => (
                            <option key={s} value={s} />
                          ))}
                        </datalist>
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-bold text-zinc-400">
                          Color
                        </label>
                        <input
                          type="text"
                          value={item.color}
                          onChange={(e) => handleUpdateItem(idx, { color: e.target.value })}
                          placeholder="Color"
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-bold text-zinc-400">
                          Qty
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateItem(idx, {
                              quantity: Math.max(1, parseInt(e.target.value) || 1),
                            })
                          }
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-bold text-zinc-400">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={item.price}
                          onChange={(e) =>
                            handleUpdateItem(idx, {
                              price: Math.max(0, parseFloat(e.target.value) || 0),
                            })
                          }
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[11px] font-bold text-zinc-400">
                          Assigned Seller
                        </label>
                        <select
                          value={item.sellerId || ''}
                          onChange={(e) =>
                            handleUpdateItem(idx, { sellerId: e.target.value || null })
                          }
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                        >
                          <option value="">Unassigned</option>
                          {sellersList.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.storeName ? `${s.storeName} (${s.name})` : s.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-bold text-zinc-400">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={item.image}
                          onChange={(e) => handleUpdateItem(idx, { image: e.target.value })}
                          placeholder="https://..."
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                      Line Total: ₹
                      {((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString(
                        'en-IN',
                        { minimumFractionDigits: 2 },
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOMER & ADDRESS */}
          {activeTab === 'customer' && (
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/30">
                <h3 className="mb-3 text-sm font-bold text-black dark:text-white">
                  Customer Contact Details
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-zinc-500">
                      Customer Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-zinc-500">
                      Primary Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-zinc-500">
                      Alternate Phone Number
                    </label>
                    <input
                      type="tel"
                      value={customerAltPhone}
                      onChange={(e) => setCustomerAltPhone(e.target.value)}
                      placeholder="Optional alternate number"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-zinc-500">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="customer@example.com"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/30">
                <h3 className="mb-3 text-sm font-bold text-black dark:text-white">
                  Delivery / Shipping Address
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-bold text-zinc-500">
                      Street / Area / Colony *
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Flat, Road, Area..."
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-zinc-500">
                      Building / Flat Number
                    </label>
                    <input
                      type="text"
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                      placeholder="House / Apartment no."
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-zinc-500">Landmark</label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="Near temple, school, etc."
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-zinc-500">
                      City / Town *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-zinc-500">District</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="District"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-zinc-500">State *</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Maharashtra"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-zinc-500">Pincode *</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="6-digit pincode"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENT & PRICING */}
          {activeTab === 'pricing' && (
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/30">
                <h3 className="mb-3 text-sm font-bold text-black dark:text-white">
                  Payment Configuration
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-zinc-500">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                    >
                      {PAYMENT_METHODS.map((pm) => (
                        <option key={pm.value} value={pm.value}>
                          {pm.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-zinc-500">
                      Payment Status
                    </label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                    >
                      {PAYMENT_STATUSES.map((ps) => (
                        <option key={ps.value} value={ps.value}>
                          {ps.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/30">
                <h3 className="mb-3 text-sm font-bold text-black dark:text-white">
                  Pricing Breakdown & Charges
                </h3>
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
                    <div>
                      <span className="text-xs font-semibold text-zinc-500">
                        Subtotal ({items.length} items)
                      </span>
                      <p className="text-[10px] text-zinc-400">Sum of item prices × quantities</p>
                    </div>
                    <span className="text-sm font-bold text-black dark:text-white">
                      ₹{calculatedSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-zinc-500">
                        Discount Amount (₹)
                      </label>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={discountAmount}
                        onChange={(e) =>
                          setDiscountAmount(Math.max(0, parseFloat(e.target.value) || 0))
                        }
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-zinc-500">
                        Shipping Fees (₹)
                      </label>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={shippingFees}
                        onChange={(e) =>
                          setShippingFees(Math.max(0, parseFloat(e.target.value) || 0))
                        }
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800">
                    <div>
                      <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
                        Final Order Total
                      </span>
                      <p className="text-[10px] text-zinc-400">Total payable by customer</p>
                    </div>
                    <span className="text-2xl font-black text-black dark:text-white">
                      ₹{calculatedFinalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STATUS & FULFILLMENT */}
          {activeTab === 'fulfillment' && (
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/30">
                <h3 className="mb-3 text-sm font-bold text-black dark:text-white">
                  Order Status Lifecycle
                </h3>
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-500">
                    Current Order Status
                  </label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                  >
                    {ORDER_STATUSES.map((st) => (
                      <option key={st.value} value={st.value}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/30">
                <h3 className="mb-3 text-sm font-bold text-black dark:text-white">
                  Courier & Live Tracking
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-zinc-500">
                      Courier Partner
                    </label>
                    <select
                      value={courierPartner}
                      onChange={(e) => setCourierPartner(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                    >
                      {COURIER_SERVICES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-zinc-500">
                      Tracking Number / AWB
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. 128938129381"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/30">
                <h3 className="mb-1 text-sm font-bold text-black dark:text-white">
                  Bulk Assign Seller to All Items
                </h3>
                <p className="mb-3 text-xs text-zinc-500">
                  Apply a chosen seller across every item in this order
                </p>
                <div>
                  <select
                    value={bulkSellerId}
                    onChange={(e) => handleApplyBulkSeller(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-black outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                  >
                    <option value="">Choose seller to apply to all items...</option>
                    {sellersList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.storeName ? `${s.storeName} (${s.name})` : s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-zinc-100 bg-zinc-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500">
            <span>Items: {items.length}</span>
            <span>•</span>
            <span>
              Total: ₹{calculatedFinalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-bold text-zinc-700 shadow-sm transition-all hover:bg-zinc-100 active:scale-95 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-black/80 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
            >
              {isSaving ? (
                <>
                  <LoaderIcon className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Save All Changes</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
