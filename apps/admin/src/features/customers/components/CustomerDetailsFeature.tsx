'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  ChevronLeftIcon,
  CloseIcon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  ShoppingBagIcon,
  StarIcon,
  UserIcon,
} from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';

import { fetcher } from '@/lib/api-client';

interface CustomerDetailsFeatureProps {
  customerId: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface CustomerDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: string;
  ordersCount: number;
  totalSpent: number;
  joinDate: string;
  orders: Order[];
}

export function CustomerDetailsFeature({ customerId }: CustomerDetailsFeatureProps) {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Profile form states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('+91');
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Order creation form states
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY' | 'STRIPE' | 'WALLET'>(
    'COD',
  );
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'SUCCESS' | 'FAILED'>('PENDING');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCustomerDetails = async () => {
    try {
      setIsLoading(true);
      const data = await fetcher<CustomerDetails>(`/admin/customers/${customerId}`);
      setCustomer(data);
    } catch (error) {
      console.error('Failed to load customer details:', error);
      toast.error('Failed to load customer profile details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
  }, [customerId]);

  const validateEditForm = () => {
    const errors: Record<string, string> = {};
    if (!editName.trim() || editName.trim().length < 4) {
      errors.name = 'Name must be at least 4 characters long';
    }
    if (!editPhone.trim() || !/^\+91[6-9]\d{9}$/.test(editPhone)) {
      errors.phone = 'Phone must start with +91 followed by a 10-digit Indian number';
    }
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEditForm()) {
      return;
    }
    setIsUpdatingProfile(true);
    try {
      const updated = await fetcher<CustomerDetails>(`/admin/customers/${customerId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
        }),
      });

      setCustomer((prev) => {
        if (!prev) {
          return null;
        }
        return {
          ...prev,
          name: updated.name,
          phone: updated.phone,
          email: updated.email,
        };
      });

      toast.success('Customer profile updated successfully!');
      setIsEditModalOpen(false);
      setEditErrors({});
    } catch (error: any) {
      console.error('Failed to update customer:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const validateOrderForm = () => {
    const errors: Record<string, string> = {};
    if (!productName.trim() || productName.trim().length < 3) {
      errors.productName = 'Product name must be at least 3 characters';
    }
    if (!size.trim()) {
      errors.size = 'Size is required';
    }
    if (!color.trim()) {
      errors.color = 'Color is required';
    }
    if (price <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    if (quantity <= 0) {
      errors.quantity = 'Quantity must be at least 1';
    }
    if (!addressLine.trim()) {
      errors.addressLine = 'Address line is required';
    }
    if (!city.trim()) {
      errors.city = 'City is required';
    }
    if (!state.trim()) {
      errors.state = 'State is required';
    }
    if (!pinCode.trim() || !/^\d{6}$/.test(pinCode)) {
      errors.pinCode = 'Pin code must be exactly 6 digits';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOrderForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const newOrder = await fetcher<Order>(`/admin/customers/${customerId}/orders`, {
        method: 'POST',
        body: JSON.stringify({
          productName,
          size,
          color,
          price,
          quantity,
          paymentMethod,
          paymentStatus,
          addressLine,
          city,
          state,
          pinCode,
        }),
      });

      // Update local state to immediately show the new order
      setCustomer((prev) => {
        if (!prev) {
          return null;
        }
        const updatedOrders = [newOrder, ...prev.orders];
        const newTotalSpent = prev.totalSpent + price * quantity;
        return {
          ...prev,
          ordersCount: updatedOrders.length,
          totalSpent: newTotalSpent,
          orders: updatedOrders,
        };
      });

      toast.success('Order created successfully!');
      setIsOrderModalOpen(false);
      // Reset form fields
      setProductName('');
      setSize('');
      setColor('');
      setPrice(0);
      setQuantity(1);
      setPaymentMethod('COD');
      setPaymentStatus('PENDING');
      setAddressLine('');
      setCity('');
      setState('');
      setPinCode('');
      setFormErrors({});
    } catch (error: any) {
      console.error('Failed to create order:', error);
      toast.error(error.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/10 border-t-black dark:border-white/10 dark:border-t-white" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 rounded-3xl border border-black/5 bg-white/50 backdrop-blur-xl dark:border-white/5 dark:bg-[#111111]/80">
        <h2 className="text-2xl font-black text-black dark:text-white">Customer Not Found</h2>
        <p className="text-black/60 dark:text-white/60">
          The customer you are looking for does not exist.
        </p>
        <button
          onClick={() => {
            router.push('/customers');
          }}
          className="mt-4 rounded-xl bg-black px-6 py-3 font-semibold text-white transition-transform hover:scale-105 dark:bg-white dark:text-black"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col rounded-[32px] border border-black/5 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#111111]">
        {/* Top Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <Image
              width={200}
              height={200}
              src={customer.avatar}
              alt={customer.name}
              className="h-24 w-24 rounded-2xl object-cover shadow-sm"
            />
            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-black dark:text-white">{customer.name}</h1>
                <span className="text-sm text-black/50 dark:text-white/50">
                  <span
                    className={`capitalize ${customer.status === 'active' ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {customer.status}
                  </span>{' '}
                  • Joined{' '}
                  {new Date(customer.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="mt-2 flex flex-col gap-3 text-sm text-black/60 sm:flex-row sm:gap-6 dark:text-white/60">
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-black/40 dark:text-white/40" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MailIcon className="h-4 w-4 text-black/40 dark:text-white/40" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-black/40 dark:text-white/40">ID:</span>
                  <span>{customer.id}</span>
                </div>
              </div>
            </div>
          </div>{' '}
          <div className="mt-4 flex gap-3 md:mt-0">
            <button
              onClick={() => {
                setEditName(customer.name);
                setEditPhone(customer.phone);
                setIsEditModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl border border-black/5 bg-transparent px-4 py-2 text-sm font-semibold whitespace-nowrap text-black/70 transition-all hover:scale-105 hover:bg-black/5 active:scale-95 dark:border-white/5 dark:text-white/70 dark:hover:bg-white/5"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-black/5 dark:bg-white/5" />

        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-black/50 dark:text-white/50">
              Total Orders
            </span>
            <div className="flex flex-col gap-3">
              <span className="text-3xl font-bold text-black dark:text-white">
                {customer.ordersCount}
              </span>
              <div className="h-1 w-full rounded-full bg-pink-300 dark:bg-pink-500" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-black/50 dark:text-white/50">
              Total Spent
            </span>
            <div className="flex flex-col gap-3">
              <span className="text-3xl font-bold text-black dark:text-white">
                ₹{customer.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <div className="h-1 w-full rounded-full bg-teal-300 dark:bg-teal-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <ShoppingBagIcon className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold">Orders History</h2>
          </div>
          <button
            onClick={() => {
              setIsOrderModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white transition-all hover:scale-105 hover:bg-emerald-700 active:scale-95"
          >
            <PlusIcon className="h-4 w-4" />
            Create Order
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {customer.orders.length > 0 ? (
            customer.orders.map((order) => (
              <div
                key={order.id}
                className="group flex flex-col gap-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#111111]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-black/40 dark:text-white/40">
                      {order.orderNumber}
                    </span>
                    <span className="text-lg font-bold text-black dark:text-white">
                      ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <span
                    className={`rounded-xl px-4 py-2 text-xs font-bold tracking-wider uppercase ${
                      order.status === 'delivered'
                        ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                        : order.status === 'pending' || order.status === 'confirmed'
                          ? 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400'
                          : 'bg-black/5 text-black/60 dark:bg-white/5 dark:text-white/60'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="border-t border-black/5 pt-4 dark:border-white/5">
                  <span className="text-xs font-semibold tracking-wider text-black/40 uppercase dark:text-white/40">
                    Items
                  </span>
                  <div className="mt-2 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-black/5 dark:border-white/5">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <span className="text-sm font-semibold text-black dark:text-white">
                            {item.name}
                          </span>
                          <span className="text-xs text-black/50 dark:text-white/50">
                            Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-black dark:text-white">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-black/5 pt-4 text-xs text-black/50 dark:border-white/5 dark:text-white/50">
                  <span>Ordered on</span>
                  <span>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center rounded-[32px] border border-dashed border-black/10 p-12 text-center dark:border-white/10">
              <ShoppingBagIcon className="mb-4 h-8 w-8 text-black/20 dark:text-white/20" />
              <p className="font-semibold text-black/50 dark:text-white/50">
                No orders placed yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Premium Edit Customer Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isUpdatingProfile) {
                  setIsEditModalOpen(false);
                }
              }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl dark:border-white/5 dark:bg-[#111111]"
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />

              <div className="flex items-center justify-between border-b border-black/5 p-6 dark:border-white/5">
                <h3 className="text-xl font-bold text-black dark:text-white">
                  Edit Customer Profile
                </h3>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                  }}
                  className="rounded-lg p-1.5 text-black/50 hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/5"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wider text-black/60 uppercase dark:text-white/60">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <UserIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., John Doe"
                      value={editName}
                      onChange={(e) => {
                        setEditName(e.target.value);
                      }}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-11 text-sm text-black placeholder-black/30 outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white"
                    />
                  </div>
                  {editErrors.name && (
                    <span className="mt-1 block text-xs font-medium text-red-500">
                      {editErrors.name}
                    </span>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wider text-black/60 uppercase dark:text-white/60">
                    WhatsApp Number
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <PhoneIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., +919876543210"
                      value={editPhone}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (!value.startsWith('+91')) {
                          if (value.startsWith('+9') || value.startsWith('+') || value === '') {
                            value = '+91';
                          } else {
                            value = '+91' + value.replace(/^\+?9?1?/, '');
                          }
                        }
                        setEditPhone(value);
                      }}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-11 text-sm text-black placeholder-black/30 outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white"
                    />
                  </div>
                  {editErrors.phone && (
                    <span className="mt-1 block text-xs font-medium text-red-500">
                      {editErrors.phone}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-black/5 pt-4 dark:border-white/5">
                  <button
                    type="button"
                    disabled={isUpdatingProfile}
                    onClick={() => {
                      setIsEditModalOpen(false);
                    }}
                    className="rounded-xl border border-black/5 bg-transparent px-4 py-2.5 text-sm font-semibold text-black/70 hover:bg-black/5 disabled:opacity-50 dark:border-white/5 dark:text-white/70 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {isUpdatingProfile ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Create Order Modal */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSubmitting) {
                  setIsOrderModalOpen(false);
                }
              }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl dark:border-white/5 dark:bg-[#111111]"
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />

              <div className="flex items-center justify-between border-b border-black/5 p-6 dark:border-white/5">
                <h3 className="text-xl font-bold text-black dark:text-white">
                  Create Order for {customer.name}
                </h3>
                <button
                  onClick={() => {
                    setIsOrderModalOpen(false);
                  }}
                  className="rounded-lg p-1.5 text-black/50 hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/5"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="max-h-[70vh] overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Left Column: Product Details */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                      Product Details
                    </h4>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                        Product Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Oversized Graphic Tee"
                        value={productName}
                        onChange={(e) => {
                          setProductName(e.target.value);
                        }}
                        className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm text-black outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white"
                      />
                      {formErrors.productName && (
                        <span className="mt-1 text-xs text-red-500">{formErrors.productName}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                          Size
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., L"
                          value={size}
                          onChange={(e) => {
                            setSize(e.target.value);
                          }}
                          className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm text-black outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white"
                        />
                        {formErrors.size && (
                          <span className="mt-1 text-xs text-red-500">{formErrors.size}</span>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                          Color
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Black"
                          value={color}
                          onChange={(e) => {
                            setColor(e.target.value);
                          }}
                          className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm text-black outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white"
                        />
                        {formErrors.color && (
                          <span className="mt-1 text-xs text-red-500">{formErrors.color}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={price || ''}
                          onChange={(e) => {
                            setPrice(Number(e.target.value));
                          }}
                          className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm text-black outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white"
                        />
                        {formErrors.price && (
                          <span className="mt-1 text-xs text-red-500">{formErrors.price}</span>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                          Quantity
                        </label>
                        <input
                          type="number"
                          placeholder="1"
                          value={quantity || ''}
                          onChange={(e) => {
                            setQuantity(Number(e.target.value));
                          }}
                          className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm text-black outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white"
                        />
                        {formErrors.quantity && (
                          <span className="mt-1 text-xs text-red-500">{formErrors.quantity}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                          Method
                        </label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => {
                            setPaymentMethod(e.target.value as any);
                          }}
                          className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm text-black outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white"
                        >
                          <option value="COD">Cash on Delivery</option>
                          <option value="RAZORPAY">Razorpay</option>
                          <option value="STRIPE">Stripe</option>
                          <option value="WALLET">Wallet</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                          Payment Status
                        </label>
                        <select
                          value={paymentStatus}
                          onChange={(e) => {
                            setPaymentStatus(e.target.value as any);
                          }}
                          className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm text-black outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="SUCCESS">Success</option>
                          <option value="FAILED">Failed</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Shipping Info */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                      Shipping Address
                    </h4>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                        Address Line
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Flat, House no., Building, Street, Area..."
                        value={addressLine}
                        onChange={(e) => {
                          setAddressLine(e.target.value);
                        }}
                        className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm text-black outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white"
                      />
                      {formErrors.addressLine && (
                        <span className="mt-1 text-xs text-red-500">{formErrors.addressLine}</span>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Mumbai"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                        }}
                        className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm text-black outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white"
                      />
                      {formErrors.city && (
                        <span className="mt-1 text-xs text-red-500">{formErrors.city}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                          State
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Maharashtra"
                          value={state}
                          onChange={(e) => {
                            setState(e.target.value);
                          }}
                          className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm text-black outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white"
                        />
                        {formErrors.state && (
                          <span className="mt-1 text-xs text-red-500">{formErrors.state}</span>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                          Pin Code
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 400001"
                          value={pinCode}
                          onChange={(e) => {
                            setPinCode(e.target.value);
                          }}
                          className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm text-black outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white"
                        />
                        {formErrors.pinCode && (
                          <span className="mt-1 text-xs text-red-500">{formErrors.pinCode}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-6 dark:border-white/5">
                  <div className="flex flex-col">
                    <span className="text-xs text-black/50 dark:text-white/50">Total Amount</span>
                    <span className="text-xl font-extrabold text-black dark:text-white">
                      ₹{(price * quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => {
                        setIsOrderModalOpen(false);
                      }}
                      className="rounded-xl border border-black/5 bg-transparent px-4 py-2.5 text-sm font-semibold text-black/70 hover:bg-black/5 disabled:opacity-50 dark:border-white/5 dark:text-white/70 dark:hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
