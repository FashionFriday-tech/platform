'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  AlertCircleIcon,
  CheckCircleIcon,
  CheckIcon,
  CloseIcon,
  ExternalLinkIcon,
  HeartIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UserIcon,
  WhatsAppIcon,
} from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';

import { fetcher } from '@/lib/api-client';
import { formatColorLabel, resolveItemColorAndQuality } from '@/lib/format-color';

import { CreateCustomerOrderModal } from './CreateCustomerOrderModal';
import {
  getProductUrl,
  WhatsAppMessageModal,
  type WhatsAppOrderContext,
  type WhatsAppProductContext,
} from './WhatsAppMessageModal';

const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const CopyIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
);

function getWhatsAppUrl(phone?: string | null): string | null {
  if (!phone) {
    return null;
  }
  const digits = phone.replace(/\D/g, '');
  if (!digits) {
    return null;
  }
  const fullPhone = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${fullPhone}`;
}

function getTelUrl(phone?: string | null): string | null {
  if (!phone) {
    return null;
  }
  const clean = phone.replace(/[^\d+]/g, '');
  return clean ? `tel:${clean}` : null;
}

function getMailtoUrl(email?: string | null): string | null {
  if (!email?.includes('@')) {
    return null;
  }
  return `mailto:${email.trim()}`;
}

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
  slug?: string | null;
  productId?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  slug?: string | null;
  productId?: string;
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  addedAt: string;
  image: string;
  slug?: string | null;
  productId?: string;
}

interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  altPhoneNumber?: string | null;
  label: string;
  building?: string | null;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  landmark?: string | null;
  isDefault: boolean;
}

interface CustomerSearchLog {
  id: string;
  query: string;
  userId: string | null;
  hasResults?: boolean;
  resultsCount?: number;
  createdAt: string;
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
  searchesCount?: number;
  _count?: {
    wishlist: number;
    cart: number;
    addresses: number;
    searches?: number;
  };
}

export function CustomerDetailsFeature({ customerId }: CustomerDetailsFeatureProps) {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tab states
  const [activeTab, setActiveTab] = useState<
    'orders' | 'favorites' | 'cart' | 'addresses' | 'payments' | 'searches'
  >('orders');
  const [isFetchingTab, setIsFetchingTab] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[] | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[] | null>(null);
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [customerSearches, setCustomerSearches] = useState<CustomerSearchLog[] | null>(null);

  // Edit Profile form states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('+91');
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Order creation modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isProfileBoxOpen, setIsProfileBoxOpen] = useState(true);
  const [updatingCartItem, setUpdatingCartItem] = useState<string | null>(null);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const cartUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Address creation form states
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addrFullName, setAddrFullName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrAltPhone, setAddrAltPhone] = useState('');
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrDistrict, setAddrDistrict] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);
  const [addrErrors, setAddrErrors] = useState<Record<string, string>>({});
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  // Copy Link feedback & WhatsApp Template Modal state
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [whatsAppModalData, setWhatsAppModalData] = useState<{
    isOpen: boolean;
    section: 'cart' | 'favorites' | 'orders';
    product?: WhatsAppProductContext;
    order?: WhatsAppOrderContext;
  }>({
    isOpen: false,
    section: 'cart',
  });

  const availablePhones = React.useMemo(() => {
    const list: { label: string; phone: string }[] = [];
    if (customer?.phone) {
      list.push({ label: 'Profile', phone: customer.phone });
    }
    if (addresses) {
      addresses.forEach((addr) => {
        if (addr.phoneNumber && !list.some((p) => p.phone === addr.phoneNumber)) {
          list.push({
            label: `${addr.label || 'Address'} (${addr.city})`,
            phone: addr.phoneNumber,
          });
        }
        if (addr.altPhoneNumber && !list.some((p) => p.phone === addr.altPhoneNumber)) {
          list.push({
            label: `${addr.label || 'Address'} Alt (${addr.city})`,
            phone: addr.altPhoneNumber,
          });
        }
      });
    }
    return list;
  }, [customer, addresses]);

  const handleCopyProductLink = async (
    item: { id: string; name: string; slug?: string | null; productId?: string },
    e?: React.MouseEvent,
  ) => {
    if (e) {
      e.stopPropagation();
    }
    const url = getProductUrl(item.slug, item.productId);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedItemId(item.id);
      toast.success(`Copied product link: ${item.name}`);
      setTimeout(() => {
        setCopiedItemId((curr) => (curr === item.id ? null : curr));
      }, 2000);
    } catch {
      toast.error('Failed to copy product link');
    }
  };

  const fetchCustomerDetails = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      const data = await fetcher<CustomerDetails>(`/admin/customers/${customerId}`);
      setCustomer(data);
    } catch (error) {
      console.error('Failed to load customer details:', error);
      toast.error('Failed to load customer profile details.');
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  };

  const fetchTabContent = async (
    tab: 'orders' | 'favorites' | 'cart' | 'addresses' | 'payments' | 'searches',
  ) => {
    setActiveTab(tab);
    if (tab === 'cart' && cartItems === null) {
      setIsFetchingTab(true);
      try {
        const data = await fetcher<CartItem[]>(`/admin/customers/${customerId}/cart`);
        setCartItems(data);
      } catch {
        toast.error('Failed to load cart items');
      } finally {
        setIsFetchingTab(false);
      }
    } else if (tab === 'favorites' && wishlistItems === null) {
      setIsFetchingTab(true);
      try {
        const data = await fetcher<WishlistItem[]>(`/admin/customers/${customerId}/wishlist`);
        setWishlistItems(data);
      } catch {
        toast.error('Failed to load wishlist items');
      } finally {
        setIsFetchingTab(false);
      }
    } else if (tab === 'addresses' && addresses === null) {
      setIsFetchingTab(true);
      try {
        const data = await fetcher<Address[]>(`/admin/customers/${customerId}/addresses`);
        setAddresses(data);
      } catch {
        toast.error('Failed to load addresses');
      } finally {
        setIsFetchingTab(false);
      }
    } else if (tab === 'searches' && customerSearches === null) {
      setIsFetchingTab(true);
      try {
        const data = await fetcher<CustomerSearchLog[]>(`/admin/customers/${customerId}/searches`);
        setCustomerSearches(data);
      } catch {
        toast.error('Failed to load customer search history');
      } finally {
        setIsFetchingTab(false);
      }
    }
  };

  const handleUpdateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      setItemToRemove(itemId);
      return;
    }

    // Optimistically update UI
    if (cartItems) {
      setCartItems(
        (prev) =>
          prev?.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)) ||
          prev,
      );
    }

    // Debounce backend call
    if (cartUpdateTimeoutRef.current) {
      clearTimeout(cartUpdateTimeoutRef.current);
    }

    setUpdatingCartItem(itemId);
    cartUpdateTimeoutRef.current = setTimeout(async () => {
      try {
        await fetcher(`/admin/customers/${customerId}/cart/${itemId}`, {
          method: 'PATCH',
          body: JSON.stringify({ quantity: newQuantity }),
        });
        void fetchCustomerDetails(true);
      } catch {
        toast.error('Failed to update cart quantity');
      } finally {
        setUpdatingCartItem(null);
      }
    }, 2000);
  };

  const handleConfirmRemoveItem = async () => {
    if (!itemToRemove) {
      return;
    }

    // Clear any pending updates for this item
    if (cartUpdateTimeoutRef.current) {
      clearTimeout(cartUpdateTimeoutRef.current);
    }

    // Optimistically update
    if (cartItems) {
      setCartItems((prev) => prev?.filter((i) => i.id !== itemToRemove) || prev);
    }

    setUpdatingCartItem(itemToRemove);
    try {
      await fetcher(`/admin/customers/${customerId}/cart/${itemToRemove}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity: 0 }),
      });
      void fetchCustomerDetails(true);
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    } finally {
      setUpdatingCartItem(null);
      setItemToRemove(null);
    }
  };

  const handleCartCheckout = async () => {
    setIsCheckingOut(true);
    try {
      await fetcher(`/admin/customers/${customerId}/checkout-cart`, {
        method: 'POST',
      });
      toast.success('Order created successfully from cart!');
      // Reset everything and go back to orders tab
      setCartItems(null);
      void fetchCustomerDetails(true);
      void fetchTabContent('orders');
    } catch {
      toast.error('Failed to create order from cart');
    } finally {
      setIsCheckingOut(false);
    }
  };

  useEffect(() => {
    void fetchCustomerDetails();
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
    } catch (error: unknown) {
      console.error('Failed to update customer:', error);
      const msg = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(msg);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const validateAddressForm = () => {
    const errors: Record<string, string> = {};
    if (!addrFullName.trim()) {
      errors.fullName = 'Name is required';
    }
    if (!addrPhone.trim()) {
      errors.phone = 'Phone is required';
    }
    if (!addrStreet.trim()) {
      errors.street = 'Address is required';
    }
    if (!addrCity.trim()) {
      errors.city = 'City is required';
    }
    if (!addrDistrict.trim()) {
      errors.district = 'District is required';
    }
    if (!addrState.trim()) {
      errors.state = 'State is required';
    }
    if (!addrPincode.trim() || !/^\d{6}$/.test(addrPincode)) {
      errors.pincode = 'Valid 6-digit pin code required';
    }
    setAddrErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddressForm()) {
      return;
    }

    setIsSubmittingAddress(true);
    try {
      await fetcher(`/admin/customers/${customerId}/addresses`, {
        method: 'POST',
        body: JSON.stringify({
          fullName: addrFullName,
          phoneNumber: addrPhone,
          altPhoneNumber: addrAltPhone,
          label: addrLabel,
          street: addrStreet,
          city: addrCity,
          district: addrDistrict,
          state: addrState,
          pincode: addrPincode,
          landmark: addrLandmark,
          isDefault: addrIsDefault,
        }),
      });

      toast.success('Address added successfully!');
      setIsAddressModalOpen(false);
      void fetchTabContent('addresses');

      // Reset form
      setAddrFullName('');
      setAddrPhone('');
      setAddrAltPhone('');
      setAddrLabel('Home');
      setAddrStreet('');
      setAddrCity('');
      setAddrDistrict('');
      setAddrState('');
      setAddrPincode('');
      setAddrLandmark('');
      setAddrIsDefault(false);
      setAddrErrors({});
    } catch (error: unknown) {
      console.error('Failed to add address:', error);
      toast.error('Failed to add address');
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/10 border-t-black dark:border-white/10 dark:border-t-white" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center gap-4 text-black/50 dark:text-white/50">
        <UserIcon className="h-12 w-12 opacity-50" />
        <p className="font-semibold">Customer not found</p>
        <button
          onClick={() => {
            router.push('/customers');
          }}
          className="text-sm text-black underline hover:no-underline dark:text-white"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  const waUrl = getWhatsAppUrl(customer.phone);
  const telUrl = getTelUrl(customer.phone);
  const mailUrl = getMailtoUrl(customer.email);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-3">
      {/* Header Profile Section */}
      <AnimatePresence initial={false}>
        {isProfileBoxOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative overflow-hidden rounded-3xl border border-black/5 bg-white dark:border-white/5 dark:bg-[#111111]"
          >
            {/* Cover Background */}
            <div className="h-32 w-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-emerald-500/5 dark:via-teal-500/5 dark:to-cyan-500/5" />

            <div className="px-4 pb-6 sm:px-8 sm:pb-8">
              <div className="-mt-12 flex flex-col gap-5 sm:-mt-16 sm:gap-6 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:gap-6 sm:text-left">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-black sm:h-32 sm:w-32 sm:rounded-3xl dark:border-[#111111]">
                    <Image
                      src={
                        customer.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}&backgroundColor=000000&textColor=ffffff`
                      }
                      alt={customer.name}
                      fill
                      className="object-cover dark:invert"
                    />
                  </div>

                  <div className="flex flex-col pb-1 sm:pb-2">
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start sm:gap-3">
                      <h1 className="text-2xl font-extrabold tracking-tight text-black sm:text-3xl dark:text-white">
                        {customer.name}
                      </h1>
                      <span className="flex h-6 items-center rounded-full bg-emerald-500/10 px-2.5 text-[10px] font-bold tracking-wider text-emerald-600 uppercase dark:bg-emerald-500/20 dark:text-emerald-400">
                        {customer.status}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-black/60 sm:justify-start sm:gap-4 sm:text-sm dark:text-white/60">
                      {mailUrl ? (
                        <a
                          href={mailUrl}
                          className="flex items-center gap-1.5 transition-colors hover:text-purple-600 dark:hover:text-purple-400"
                          title="Click to send email"
                        >
                          <MailIcon className="h-4 w-4 shrink-0" />
                          <span className="break-all">{customer.email}</span>
                        </a>
                      ) : (
                        <span className="flex items-center gap-1.5 opacity-60">
                          <MailIcon className="h-4 w-4 shrink-0" />
                          <span>{customer.email || 'No email'}</span>
                        </span>
                      )}

                      {telUrl ? (
                        <a
                          href={telUrl}
                          className="flex items-center gap-1.5 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                          title="Click to call"
                        >
                          <PhoneIcon className="h-4 w-4 shrink-0" />
                          <span>{customer.phone}</span>
                        </a>
                      ) : (
                        <span className="flex items-center gap-1.5 opacity-60">
                          <PhoneIcon className="h-4 w-4 shrink-0" />
                          <span>{customer.phone || 'No phone number'}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pb-2 sm:gap-2.5 md:justify-end">
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 text-xs font-semibold text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white active:scale-95 sm:h-10 sm:gap-2 sm:px-4 sm:text-sm dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white"
                      title={`Chat with ${customer.name} on WhatsApp`}
                    >
                      <WhatsAppIcon className="h-4 w-4 shrink-0" />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  {telUrl && (
                    <a
                      href={telUrl}
                      className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3.5 text-xs font-semibold text-blue-600 transition-all hover:bg-blue-500 hover:text-white active:scale-95 sm:h-10 sm:gap-2 sm:px-4 sm:text-sm dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white"
                      title={`Call ${customer.phone}`}
                    >
                      <PhoneIcon className="h-4 w-4 shrink-0" />
                      <span>Call</span>
                    </a>
                  )}

                  {mailUrl && (
                    <a
                      href={mailUrl}
                      className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-purple-500/20 bg-purple-500/10 px-3.5 text-xs font-semibold text-purple-600 transition-all hover:bg-purple-500 hover:text-white active:scale-95 sm:h-10 sm:gap-2 sm:px-4 sm:text-sm dark:bg-purple-500/20 dark:text-purple-400 dark:hover:bg-purple-500 dark:hover:text-white"
                      title={`Email ${customer.email}`}
                    >
                      <MailIcon className="h-4 w-4 shrink-0" />
                      <span>Email</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      setEditName(customer.name);
                      setEditPhone(customer.phone || '+91');
                      setEditErrors({});
                      setIsEditModalOpen(true);
                    }}
                    className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-black/10 bg-transparent px-3.5 text-xs font-semibold text-black transition-colors hover:bg-black/5 active:scale-95 sm:h-10 sm:gap-2 sm:px-4 sm:text-sm dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              <div className="scrollbar-hide mt-6 flex gap-3 overflow-x-auto pb-1 sm:mt-8 sm:gap-4 md:grid md:grid-cols-6 md:overflow-visible md:pb-0">
                <div
                  onClick={() => fetchTabContent('orders')}
                  className="flex min-w-[140px] shrink-0 cursor-pointer flex-col rounded-2xl bg-[#f8f9fa] p-4 transition-transform hover:scale-[1.02] sm:min-w-[170px] sm:p-5 md:min-w-0 md:shrink dark:bg-[#1a1a1a]"
                >
                  <span className="text-[11px] font-bold tracking-wider text-black/40 uppercase sm:text-xs dark:text-white/40">
                    Total Orders
                  </span>
                  <span className="mt-1.5 text-2xl font-black text-black sm:mt-2 sm:text-3xl dark:text-white">
                    {customer.ordersCount}
                  </span>
                </div>
                <div className="flex min-w-[140px] shrink-0 flex-col rounded-2xl bg-[#f8f9fa] p-4 sm:min-w-[170px] sm:p-5 md:min-w-0 md:shrink dark:bg-[#1a1a1a]">
                  <span className="text-[11px] font-bold tracking-wider text-black/40 uppercase sm:text-xs dark:text-white/40">
                    Total Spent
                  </span>
                  <span className="mt-1.5 text-2xl font-black text-black sm:mt-2 sm:text-3xl dark:text-white">
                    ₹{customer.totalSpent.toLocaleString('en-IN')}
                  </span>
                </div>
                <div
                  onClick={() => fetchTabContent('favorites')}
                  className="flex min-w-[140px] shrink-0 cursor-pointer flex-col rounded-2xl bg-[#f8f9fa] p-4 transition-transform hover:scale-[1.02] sm:min-w-[170px] sm:p-5 md:min-w-0 md:shrink dark:bg-[#1a1a1a]"
                >
                  <span className="text-[11px] font-bold tracking-wider text-black/40 uppercase sm:text-xs dark:text-white/40">
                    Favorites
                  </span>
                  <span className="mt-1.5 text-2xl font-black text-black sm:mt-2 sm:text-3xl dark:text-white">
                    {customer._count?.wishlist || 0}
                  </span>
                </div>
                <div
                  onClick={() => fetchTabContent('cart')}
                  className="flex min-w-[140px] shrink-0 cursor-pointer flex-col rounded-2xl bg-[#f8f9fa] p-4 transition-transform hover:scale-[1.02] sm:min-w-[170px] sm:p-5 md:min-w-0 md:shrink dark:bg-[#1a1a1a]"
                >
                  <span className="text-[11px] font-bold tracking-wider text-black/40 uppercase sm:text-xs dark:text-white/40">
                    Cart Items
                  </span>
                  <span className="mt-1.5 text-2xl font-black text-black sm:mt-2 sm:text-3xl dark:text-white">
                    {customer._count?.cart || 0}
                  </span>
                </div>
                <div
                  onClick={() => fetchTabContent('addresses')}
                  className="flex min-w-[140px] shrink-0 cursor-pointer flex-col rounded-2xl bg-[#f8f9fa] p-4 transition-transform hover:scale-[1.02] sm:min-w-[170px] sm:p-5 md:min-w-0 md:shrink dark:bg-[#1a1a1a]"
                >
                  <span className="text-[11px] font-bold tracking-wider text-black/40 uppercase sm:text-xs dark:text-white/40">
                    Addresses
                  </span>
                  <span className="mt-1.5 text-2xl font-black text-black sm:mt-2 sm:text-3xl dark:text-white">
                    {customer._count?.addresses || 0}
                  </span>
                </div>
                <div
                  onClick={() => fetchTabContent('searches')}
                  className="flex min-w-[140px] shrink-0 cursor-pointer flex-col rounded-2xl bg-[#f8f9fa] p-4 transition-transform hover:scale-[1.02] sm:min-w-[170px] sm:p-5 md:min-w-0 md:shrink dark:bg-[#1a1a1a]"
                >
                  <span className="text-[11px] font-bold tracking-wider text-black/40 uppercase sm:text-xs dark:text-white/40">
                    Searches
                  </span>
                  <span className="mt-1.5 text-2xl font-black text-black sm:mt-2 sm:text-3xl dark:text-white">
                    {customer.searchesCount ?? customer._count?.searches ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs and Content Section */}
      <div className="flex flex-col gap-6">
        <div className="sticky top-0 z-40 flex flex-col justify-between gap-3 bg-[#f9fafb]/80 py-2 backdrop-blur-md sm:top-2 sm:flex-row sm:items-center sm:bg-transparent sm:backdrop-blur-none dark:bg-black/80 dark:sm:bg-transparent">
          {/* Tabs & Toggle (Left) */}
          <div className="scrollbar-hide flex overflow-x-auto pb-1 sm:pb-0">
            <div className="flex shrink-0 items-center gap-1.5 rounded-2xl border border-black/5 bg-[#f8f9fa] p-1 sm:gap-2 dark:border-white/5 dark:bg-[#111111]">
              <button
                onClick={() => {
                  setIsProfileBoxOpen(!isProfileBoxOpen);
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm transition-all hover:scale-105 active:scale-95 sm:h-9 sm:w-9 dark:bg-[#222]"
                title={isProfileBoxOpen ? 'Collapse Profile' : 'Expand Profile'}
              >
                <AnimatePresence mode="wait">
                  {isProfileBoxOpen ? (
                    <motion.div
                      key="up-arrow"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                    >
                      <ChevronUpIcon className="h-4 w-4 text-black/70 dark:text-white/70" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="avatar"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="h-full w-full"
                    >
                      <Image
                        src={
                          customer.avatar ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}&backgroundColor=000000&textColor=ffffff`
                        }
                        alt={customer.name}
                        width={36}
                        height={36}
                        className="h-full w-full object-cover dark:invert"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <div className="h-5 w-[1px] bg-black/10 dark:bg-white/10" />

              <button
                onClick={() => fetchTabContent('orders')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all sm:gap-2 sm:px-4 sm:py-2 sm:text-sm ${
                  activeTab === 'orders'
                    ? 'bg-white text-black shadow-sm dark:bg-[#222] dark:text-white'
                    : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
                }`}
              >
                <ShoppingBagIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Orders
              </button>
              <button
                onClick={() => fetchTabContent('favorites')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all sm:gap-2 sm:px-4 sm:py-2 sm:text-sm ${
                  activeTab === 'favorites'
                    ? 'bg-white text-black shadow-sm dark:bg-[#222] dark:text-white'
                    : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
                }`}
              >
                <HeartIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Favorites
              </button>
              <button
                onClick={() => fetchTabContent('cart')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all sm:gap-2 sm:px-4 sm:py-2 sm:text-sm ${
                  activeTab === 'cart'
                    ? 'bg-white text-black shadow-sm dark:bg-[#222] dark:text-white'
                    : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
                }`}
              >
                <ShoppingCartIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Cart
              </button>
              <button
                onClick={() => fetchTabContent('addresses')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all sm:gap-2 sm:px-4 sm:py-2 sm:text-sm ${
                  activeTab === 'addresses'
                    ? 'bg-white text-black shadow-sm dark:bg-[#222] dark:text-white'
                    : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
                }`}
              >
                <MapPinIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Addresses
              </button>
              <button
                onClick={() => fetchTabContent('payments')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all sm:gap-2 sm:px-4 sm:py-2 sm:text-sm ${
                  activeTab === 'payments'
                    ? 'bg-white text-black shadow-sm dark:bg-[#222] dark:text-white'
                    : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
                }`}
              >
                <CreditCardIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Payments
              </button>
              <button
                onClick={() => fetchTabContent('searches')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all sm:gap-2 sm:px-4 sm:py-2 sm:text-sm ${
                  activeTab === 'searches'
                    ? 'bg-white text-black shadow-sm dark:bg-[#222] dark:text-white'
                    : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
                }`}
              >
                <SearchIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Searches
                {typeof (customer.searchesCount ?? customer._count?.searches) === 'number' && (
                  <span className="ml-0.5 rounded-full bg-black/10 px-1.5 py-0.5 text-[10px] font-bold text-black/70 dark:bg-white/15 dark:text-white/80">
                    {customer.searchesCount ?? customer._count?.searches}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons (Right) */}
          <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
            {!isProfileBoxOpen && (
              <div className="mr-1 hidden items-center gap-1.5 sm:flex">
                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white active:scale-95 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white"
                    title={`WhatsApp ${customer.name}`}
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                  </a>
                )}
                {telUrl && (
                  <a
                    href={telUrl}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-600 transition-all hover:bg-blue-500 hover:text-white active:scale-95 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white"
                    title={`Call ${customer.phone}`}
                  >
                    <PhoneIcon className="h-4 w-4" />
                  </a>
                )}
                {mailUrl && (
                  <a
                    href={mailUrl}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-600 transition-all hover:bg-purple-500 hover:text-white active:scale-95 dark:bg-purple-500/20 dark:text-purple-400 dark:hover:bg-purple-500 dark:hover:text-white"
                    title={`Email ${customer.email}`}
                  >
                    <MailIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
            {activeTab === 'orders' && (
              <button
                onClick={() => {
                  setIsOrderModalOpen(true);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-semibold whitespace-nowrap text-white transition-all hover:scale-105 hover:bg-black/80 active:scale-95 sm:flex-initial sm:text-sm dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                <PlusIcon className="h-4 w-4" />
                Create Order
              </button>
            )}

            {activeTab === 'addresses' && (
              <button
                onClick={() => {
                  setAddrFullName(customer.name || '');
                  setAddrPhone(customer.phone || '');
                  setAddrAltPhone('');
                  setAddrStreet('');
                  setAddrCity('');
                  setAddrDistrict('');
                  setAddrState('');
                  setAddrPincode('');
                  setAddrLandmark('');
                  setIsAddressModalOpen(true);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-semibold whitespace-nowrap text-white transition-all hover:scale-105 hover:bg-black/80 active:scale-95 sm:flex-initial sm:text-sm dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                <PlusIcon className="h-4 w-4" />
                Add Address
              </button>
            )}

            {activeTab === 'cart' && cartItems && cartItems.length > 0 && (
              <button
                onClick={() => handleCartCheckout()}
                disabled={isCheckingOut}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-semibold whitespace-nowrap text-white transition-all hover:scale-105 hover:bg-black/80 active:scale-95 disabled:opacity-50 sm:flex-initial sm:text-sm dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                {isCheckingOut ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white dark:border-black/20 dark:border-t-black" />
                ) : (
                  <ShoppingBagIcon className="h-4 w-4" />
                )}
                Checkout
              </button>
            )}
          </div>
        </div>

        <div className="relative min-h-[300px]">
          {isFetchingTab && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/50 backdrop-blur-sm dark:bg-[#111111]/50">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/10 border-t-black dark:border-white/10 dark:border-t-white" />
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {customer.orders.length > 0 ? (
                customer.orders.map((order) => {
                  const firstItem = order.items?.[0];
                  const totalQty =
                    order.items?.reduce((acc, it) => acc + (it.quantity || 1), 0) || 1;
                  const itemImage =
                    firstItem?.image &&
                    !firstItem.image.includes('photo-1523381210434-271e8be1f52b')
                      ? firstItem.image
                      : null;

                  return (
                    <div
                      key={order.id}
                      onClick={() => {
                        router.push(`/orders/${order.id}`);
                      }}
                      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/10 bg-white p-3 shadow-xs transition-all hover:border-black/30 hover:shadow-md dark:border-white/10 dark:bg-[#1a1a1a] dark:hover:border-white/30"
                    >
                      {/* Product Image Area */}
                      <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
                        {itemImage ? (
                          <Image
                            src={itemImage}
                            alt={firstItem?.name || order.orderNumber}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-black/30 dark:text-white/30">
                            <ShoppingBagIcon className="h-8 w-8 opacity-30" />
                          </div>
                        )}

                        {/* Order ID badge */}
                        <span className="absolute top-2 left-2 rounded-md bg-black/80 px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-sm backdrop-blur-md">
                          ID: {order.orderNumber}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`absolute top-2 right-2 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase shadow-sm backdrop-blur-md ${
                            order.status?.toLowerCase() === 'delivered'
                              ? 'bg-emerald-500 text-white'
                              : order.status?.toLowerCase() === 'cancelled'
                                ? 'bg-red-500 text-white'
                                : order.status?.toLowerCase() === 'shipped' ||
                                    order.status?.toLowerCase() === 'confirmed'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-amber-400 text-amber-950'
                          }`}
                        >
                          {order.status}
                        </span>

                        {/* Order Date badge */}
                        <span className="absolute bottom-2 left-2 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-black/75 shadow-sm backdrop-blur-md dark:bg-black/85 dark:text-white/75">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Info Header */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h4
                            className="line-clamp-1 text-sm font-bold text-black transition-colors group-hover:text-black/80 dark:text-white dark:group-hover:text-white/80"
                            title={firstItem?.name || `Order ${order.orderNumber}`}
                          >
                            {firstItem?.name || `Order ${order.orderNumber}`}
                          </h4>

                          {/* Price & Payment Method */}
                          <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-base font-extrabold text-black dark:text-white">
                              ₹
                              {Number(order.total || 0).toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                            <span className="rounded-md bg-black/5 px-2 py-0.5 text-[10px] font-semibold text-black/60 uppercase dark:bg-white/10 dark:text-white/70">
                              {order.paymentMethod || 'Prepaid'}
                            </span>
                          </div>

                          {/* Available Sizes / Variants / Items Preview */}
                          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                            {firstItem?.size && (
                              <span className="rounded-md bg-black/5 px-1.5 py-0.5 text-[9px] font-semibold text-black/60 dark:bg-white/10 dark:text-white/70">
                                Size: {firstItem.size}
                              </span>
                            )}
                            {(() => {
                              const { color: cName, quality: qName } =
                                resolveItemColorAndQuality(firstItem);
                              return (
                                <>
                                  {cName && (
                                    <span className="rounded-md bg-black/5 px-1.5 py-0.5 text-[9px] font-semibold text-black/60 dark:bg-white/10 dark:text-white/70">
                                      Color: {cName}
                                    </span>
                                  )}
                                  {qName && (
                                    <span className="rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-400">
                                      {qName}
                                    </span>
                                  )}
                                </>
                              );
                            })()}
                            <span className="rounded-md bg-black/5 px-1.5 py-0.5 text-[9px] font-semibold text-black/60 dark:bg-white/10 dark:text-white/70">
                              Qty: {totalQty}
                            </span>
                            {order.items && order.items.length > 1 && (
                              <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400">
                                +{order.items.length - 1} more items
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Copy Link & WhatsApp Actions */}
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (firstItem) {
                                void handleCopyProductLink(
                                  {
                                    id: `order-${order.id}-${firstItem.id}`,
                                    name: firstItem.name,
                                    slug: firstItem.slug,
                                    productId: firstItem.productId,
                                  },
                                  e,
                                );
                              }
                            }}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-black/10 bg-black/5 px-2.5 py-1.5 text-xs font-semibold text-black transition-all hover:bg-black/10 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                            title="Copy storefront product link"
                          >
                            {copiedItemId === `order-${order.id}-${firstItem?.id}` ? (
                              <>
                                <CheckIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-emerald-600 dark:text-emerald-400">
                                  Copied
                                </span>
                              </>
                            ) : (
                              <>
                                <CopyIcon className="h-3.5 w-3.5" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setWhatsAppModalData({
                                isOpen: true,
                                section: 'orders',
                                order: {
                                  orderNumber: order.orderNumber,
                                  status: order.status,
                                  total: order.total,
                                  createdAt: order.createdAt,
                                  items: order.items?.map((it) => ({
                                    id: it.id,
                                    name: it.name,
                                    price: it.price,
                                    quantity: it.quantity,
                                    size: it.size,
                                    color: it.color,
                                    image: it.image,
                                    slug: it.slug,
                                    productId: it.productId,
                                  })),
                                },
                                product: firstItem
                                  ? {
                                      id: firstItem.id,
                                      name: firstItem.name,
                                      price: firstItem.price,
                                      quantity: firstItem.quantity,
                                      size: firstItem.size,
                                      color: firstItem.color,
                                      image: itemImage || firstItem.image,
                                      slug: firstItem.slug,
                                      productId: firstItem.productId,
                                    }
                                  : undefined,
                              });
                            }}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                            title="Send WhatsApp message regarding this order"
                          >
                            <WhatsAppIcon className="h-3.5 w-3.5" />
                            <span>WhatsApp</span>
                          </button>
                        </div>

                        {/* Action Button styled like Create Order product card */}
                        <button
                          type="button"
                          className="mt-2 w-full rounded-xl bg-black/5 py-2 text-center text-xs font-bold text-black transition-colors group-hover:bg-black group-hover:text-white dark:bg-white/10 dark:text-white dark:group-hover:bg-white dark:group-hover:text-black"
                        >
                          View Order Details →
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-1 flex flex-col items-center justify-center rounded-[32px] border border-dashed border-black/10 p-12 text-center sm:col-span-2 lg:col-span-3 dark:border-white/10">
                  <ShoppingBagIcon className="mb-4 h-8 w-8 text-black/20 dark:text-white/20" />
                  <p className="font-semibold text-black/50 dark:text-white/50">
                    No orders placed yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOrderModalOpen(true);
                    }}
                    className="mt-4 flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-black/80 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/80"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Create Order
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {wishlistItems && wishlistItems.length > 0 ? (
                wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between gap-3 rounded-3xl border border-black/5 bg-white p-4 shadow-sm transition-all hover:border-black/20 hover:shadow-md dark:border-white/5 dark:bg-[#111111] dark:hover:border-white/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-black/5 bg-black/5 dark:border-white/5 dark:bg-white/5">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBagIcon className="h-6 w-6 text-black/20 dark:text-white/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col overflow-hidden">
                        <span
                          className="line-clamp-1 font-bold text-black dark:text-white"
                          title={item.name}
                        >
                          {item.name}
                        </span>
                        <span className="mt-1 text-sm font-semibold text-black/80 dark:text-white/80">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                        <span className="mt-1.5 text-xs text-black/40 dark:text-white/40">
                          Added on {new Date(item.addedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Copy Link & WhatsApp Actions */}
                    <div className="flex items-center gap-2 border-t border-black/5 pt-2.5 dark:border-white/5">
                      <button
                        type="button"
                        onClick={(e) => void handleCopyProductLink(item, e)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-black/10 bg-black/5 px-3 py-1.5 text-xs font-semibold text-black transition-all hover:bg-black/10 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                        title="Copy storefront product link"
                      >
                        {copiedItemId === item.id ? (
                          <>
                            <CheckIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <CopyIcon className="h-3.5 w-3.5" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setWhatsAppModalData({
                            isOpen: true,
                            section: 'favorites',
                            product: item,
                          });
                        }}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                        title="Send WhatsApp message regarding this favorite item"
                      >
                        <WhatsAppIcon className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center rounded-[32px] border border-dashed border-black/10 p-12 text-center dark:border-white/10">
                  <HeartIcon className="mb-4 h-8 w-8 text-black/20 dark:text-white/20" />
                  <p className="font-semibold text-black/50 dark:text-white/50">
                    No items in favorites.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cart' && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between gap-3 rounded-3xl border border-black/5 bg-white p-4 shadow-sm transition-all hover:border-black/20 hover:shadow-md dark:border-white/5 dark:bg-[#111111] dark:hover:border-white/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-black/5 bg-black/5 dark:border-white/5 dark:bg-white/5">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBagIcon className="h-6 w-6 text-black/20 dark:text-white/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between py-1">
                        <div className="flex flex-col">
                          <span
                            className="line-clamp-1 font-bold text-black dark:text-white"
                            title={item.name}
                          >
                            {item.name}
                          </span>
                          <span className="mt-1 text-xs text-black/60 dark:text-white/60">
                            Size: {item.size} • Color: {formatColorLabel(item.color) || item.color}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm font-semibold text-black dark:text-white">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>

                          <div className="flex items-center gap-2 rounded-full border border-black/10 bg-black/5 p-1 dark:border-white/10 dark:bg-white/5">
                            <button
                              onClick={() => {
                                handleUpdateCartQuantity(item.id, item.quantity - 1);
                              }}
                              disabled={updatingCartItem === item.id}
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black shadow-sm transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 dark:bg-[#222] dark:text-white"
                            >
                              -
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-black dark:text-white">
                              {updatingCartItem === item.id ? '...' : item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                handleUpdateCartQuantity(item.id, item.quantity + 1);
                              }}
                              disabled={updatingCartItem === item.id}
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white shadow-sm transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Copy Link & WhatsApp Actions */}
                    <div className="flex items-center gap-2 border-t border-black/5 pt-2.5 dark:border-white/5">
                      <button
                        type="button"
                        onClick={(e) => void handleCopyProductLink(item, e)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-black/10 bg-black/5 px-3 py-1.5 text-xs font-semibold text-black transition-all hover:bg-black/10 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                        title="Copy storefront product link"
                      >
                        {copiedItemId === item.id ? (
                          <>
                            <CheckIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <CopyIcon className="h-3.5 w-3.5" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setWhatsAppModalData({
                            isOpen: true,
                            section: 'cart',
                            product: item,
                          });
                        }}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                        title="Send WhatsApp message regarding this cart item"
                      >
                        <WhatsAppIcon className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center rounded-[32px] border border-dashed border-black/10 p-12 text-center dark:border-white/10">
                  <ShoppingCartIcon className="mb-4 h-8 w-8 text-black/20 dark:text-white/20" />
                  <p className="font-semibold text-black/50 dark:text-white/50">
                    No items in cart.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {addresses && addresses.length > 0 ? (
                addresses.map((address) => (
                  <div
                    key={address.id}
                    className="relative flex flex-col gap-3 rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#111111]"
                  >
                    <button
                      onClick={() => {
                        const streetWithLandmark =
                          address.street + (address.landmark ? ` (near ${address.landmark})` : '');
                        const fullAddress = [
                          address.building,
                          streetWithLandmark,
                          address.city,
                          address.district,
                          address.state,
                          address.pincode,
                        ]
                          .filter(Boolean)
                          .join(', ');
                        const text = `Name : ${address.fullName}
Address : ${fullAddress}
City : ${address.city}
District : ${address.district}
State : ${address.state}
Pincode : ${address.pincode}
${address.landmark ? `Landmark : ${address.landmark}\n` : ''}Mobile Number : ${address.phoneNumber}
${address.altPhoneNumber ? `Alt Number : ${address.altPhoneNumber}` : ''}`.trim();
                        void navigator.clipboard.writeText(text);
                        toast.success('Address copied to clipboard!');
                      }}
                      className="absolute top-6 right-6 rounded-xl bg-black/5 p-2 transition-colors hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
                      title="Copy Address"
                    >
                      <CopyIcon className="h-4 w-4 text-black/60 dark:text-white/60" />
                    </button>

                    <div className="flex items-center gap-2 border-b border-black/5 pb-3 dark:border-white/5">
                      <span className="rounded-md bg-black px-2 py-1 text-[10px] font-bold tracking-wider text-white uppercase dark:bg-white dark:text-black">
                        {address.label || 'Home'}
                      </span>
                      {address.isDefault && (
                        <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] font-bold tracking-wider text-emerald-600 uppercase dark:bg-emerald-500/20 dark:text-emerald-400">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-col gap-2 text-xs text-black/80 sm:text-sm dark:text-white/80">
                      <div className="flex items-start gap-2">
                        <span className="w-20 shrink-0 font-semibold text-black/50 sm:w-28 dark:text-white/50">
                          Name :
                        </span>
                        <span className="font-medium text-black dark:text-white">
                          {address.fullName}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-20 shrink-0 font-semibold text-black/50 sm:w-28 dark:text-white/50">
                          Address :
                        </span>
                        <span className="leading-relaxed break-words text-black dark:text-white">
                          {[
                            address.building,
                            address.street +
                              (address.landmark ? ` (near ${address.landmark})` : ''),
                            address.city,
                            address.district,
                            address.state,
                            address.pincode,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-20 shrink-0 font-semibold text-black/50 sm:w-28 dark:text-white/50">
                          City :
                        </span>
                        <span>{address.city}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-20 shrink-0 font-semibold text-black/50 sm:w-28 dark:text-white/50">
                          District :
                        </span>
                        <span>{address.district}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-20 shrink-0 font-semibold text-black/50 sm:w-28 dark:text-white/50">
                          State :
                        </span>
                        <span>{address.state}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-20 shrink-0 font-semibold text-black/50 sm:w-28 dark:text-white/50">
                          Pincode :
                        </span>
                        <span>{address.pincode}</span>
                      </div>
                      {address.landmark && (
                        <div className="flex items-start gap-2">
                          <span className="w-20 shrink-0 font-semibold text-black/50 sm:w-28 dark:text-white/50">
                            Landmark :
                          </span>
                          <span>{address.landmark}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="w-20 shrink-0 font-semibold text-black/50 sm:w-28 dark:text-white/50">
                          Mobile :
                        </span>
                        <span className="font-medium text-black dark:text-white">
                          {address.phoneNumber}
                        </span>
                        {address.phoneNumber && (
                          <div className="ml-2 flex items-center gap-1.5">
                            {getWhatsAppUrl(address.phoneNumber) && (
                              <a
                                href={getWhatsAppUrl(address.phoneNumber)!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 transition-colors hover:bg-emerald-500 hover:text-white dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white"
                                title="WhatsApp this address"
                              >
                                <WhatsAppIcon className="h-3 w-3" />
                              </a>
                            )}
                            {getTelUrl(address.phoneNumber) && (
                              <a
                                href={getTelUrl(address.phoneNumber)!}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 transition-colors hover:bg-blue-500 hover:text-white dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white"
                                title="Call this address"
                              >
                                <PhoneIcon className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      {address.altPhoneNumber && (
                        <div className="flex items-center gap-2">
                          <span className="w-20 shrink-0 font-semibold text-black/50 sm:w-28 dark:text-white/50">
                            Alt Number :
                          </span>
                          <span className="font-medium text-black dark:text-white">
                            {address.altPhoneNumber}
                          </span>
                          <div className="ml-2 flex items-center gap-1.5">
                            {getWhatsAppUrl(address.altPhoneNumber) && (
                              <a
                                href={getWhatsAppUrl(address.altPhoneNumber)!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 transition-colors hover:bg-emerald-500 hover:text-white dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white"
                                title="WhatsApp alt number"
                              >
                                <WhatsAppIcon className="h-3 w-3" />
                              </a>
                            )}
                            {getTelUrl(address.altPhoneNumber) && (
                              <a
                                href={getTelUrl(address.altPhoneNumber)!}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 transition-colors hover:bg-blue-500 hover:text-white dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white"
                                title="Call alt number"
                              >
                                <PhoneIcon className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 flex flex-col items-center justify-center rounded-[32px] border border-dashed border-black/10 p-12 text-center dark:border-white/10">
                  <MapPinIcon className="mb-4 h-8 w-8 text-black/20 dark:text-white/20" />
                  <p className="font-semibold text-black/50 dark:text-white/50">
                    No addresses saved yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {customer.orders.length > 0 ? (
                customer.orders.map((order) => (
                  <div
                    key={order.id}
                    className="group flex items-center justify-between rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#111111]"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-black/40 dark:text-white/40">
                        {order.orderNumber}
                      </span>
                      <span className="text-sm font-semibold text-black/60 dark:text-white/60">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-[#f8f9fa] px-2 py-1 text-xs font-bold text-black/60 uppercase dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white/60">
                          <CreditCardIcon className="h-3 w-3" />
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xl font-bold text-black dark:text-white">
                        ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span
                        className={`flex h-6 items-center rounded-full px-2.5 text-[10px] font-bold tracking-wider uppercase ${
                          order.paymentStatus === 'CAPTURED' || order.paymentStatus === 'SUCCESS'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : order.paymentStatus === 'AUTHORIZED'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : order.paymentStatus === 'FAILED'
                                ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center rounded-[32px] border border-dashed border-black/10 p-12 text-center dark:border-white/10">
                  <CreditCardIcon className="mb-4 h-8 w-8 text-black/20 dark:text-white/20" />
                  <p className="font-semibold text-black/50 dark:text-white/50">
                    No payment history found.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'searches' && (
            <div className="flex flex-col gap-6">
              {/* Customer Interest KPI Cards */}
              {customerSearches && customerSearches.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-4 rounded-3xl border border-black/5 bg-white p-5 shadow-xs dark:border-white/5 dark:bg-[#111111]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
                      <SearchIcon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-black/50 dark:text-white/50">
                        Total Inquiries
                      </span>
                      <span className="text-2xl font-black text-black dark:text-white">
                        {customerSearches.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-3xl border border-black/5 bg-white p-5 shadow-xs dark:border-white/5 dark:bg-[#111111]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                      <CheckCircleIcon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-black/50 dark:text-white/50">
                        Found Catalog Items
                      </span>
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {
                          customerSearches.filter(
                            (s) => s.hasResults !== false && (s.resultsCount ?? 1) > 0,
                          ).length
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-3xl border border-black/5 bg-white p-5 shadow-xs dark:border-white/5 dark:bg-[#111111]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                      <AlertCircleIcon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-black/50 dark:text-white/50">
                        Zero Results (Unmet Demand)
                      </span>
                      <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
                        {
                          customerSearches.filter(
                            (s) => s.hasResults === false || s.resultsCount === 0,
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Search Logs List / Table */}
              {isFetchingTab ? (
                <div className="flex h-64 items-center justify-center rounded-[32px] border border-black/5 bg-white p-12 shadow-xs dark:border-white/5 dark:bg-[#111111]">
                  <div className="flex flex-col items-center gap-3 text-black/40 dark:text-white/40">
                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-black/10 border-t-black dark:border-white/10 dark:border-t-white" />
                    <span className="text-sm font-medium">Loading search history...</span>
                  </div>
                </div>
              ) : customerSearches && customerSearches.length > 0 ? (
                <div className="flex flex-col overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-xs dark:border-white/5 dark:bg-[#111111]">
                  {/* Table Header */}
                  <div className="grid grid-cols-[minmax(180px,2fr)_minmax(140px,1.2fr)_minmax(140px,1.2fr)_minmax(180px,1.2fr)] items-center border-b border-black/5 bg-black/[0.02] px-6 py-4 text-xs font-bold tracking-wider text-black/60 uppercase dark:border-white/5 dark:bg-white/[0.02] dark:text-white/60">
                    <div>Search Query</div>
                    <div>Availability / Results</div>
                    <div>Searched On</div>
                    <div className="text-right">Outreach &amp; Action</div>
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-black/5 dark:divide-white/5">
                    {customerSearches.map((log) => {
                      const hasResults = log.hasResults !== false && (log.resultsCount ?? 1) > 0;
                      const storefrontUrl =
                        process.env.NEXT_PUBLIC_STOREFRONT_URL || 'https://fashionfriday.in';
                      const storeSearchUrl = `${storefrontUrl}/products?q=${encodeURIComponent(log.query)}`;

                      // WhatsApp contextual reach-out link
                      const digits = customer.phone ? customer.phone.replace(/\D/g, '') : '';
                      const fullPhone = digits.length === 10 ? `91${digits}` : digits;
                      const waQueryText = encodeURIComponent(
                        `Hi ${customer.name}, we noticed you were looking for "${log.query}" on Fashion Friday! Are you looking for a specific size or style? We would love to help you find the best options in stock.`,
                      );
                      const waLink = fullPhone
                        ? `https://wa.me/${fullPhone}?text=${waQueryText}`
                        : null;

                      return (
                        <div
                          key={log.id}
                          className="group grid grid-cols-[minmax(180px,2fr)_minmax(140px,1.2fr)_minmax(140px,1.2fr)_minmax(180px,1.2fr)] items-center px-6 py-4.5 transition-colors hover:bg-black/[0.015] dark:hover:bg-white/[0.015]"
                        >
                          {/* Search Query */}
                          <div className="flex items-center gap-3 pr-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
                              <SearchIcon className="h-4 w-4" />
                            </div>
                            <div className="flex min-w-0 flex-col">
                              <span className="truncate text-sm font-bold text-black dark:text-white">
                                {log.query}
                              </span>
                              <span className="text-[11px] text-black/40 dark:text-white/40">
                                Product inquiry
                              </span>
                            </div>
                          </div>

                          {/* Results Status */}
                          <div className="flex items-center">
                            {hasResults ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400">
                                <CheckCircleIcon className="h-3.5 w-3.5 shrink-0" />
                                <span>{log.resultsCount ?? '1+'} products found</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-400">
                                <AlertCircleIcon className="h-3.5 w-3.5 shrink-0" />
                                <span>0 results (out of stock)</span>
                              </span>
                            )}
                          </div>

                          {/* Date & Time */}
                          <div className="flex items-center text-xs font-medium text-black/60 dark:text-white/60">
                            {new Date(log.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={storeSearchUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-xl border border-black/10 bg-black/5 px-3 py-1.5 text-xs font-semibold text-black transition-all hover:bg-black hover:text-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white dark:hover:text-black"
                              title="View search on storefront"
                            >
                              <span>View Store</span>
                              <ExternalLinkIcon className="h-3.5 w-3.5" />
                            </a>

                            {waLink && (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white"
                                title="Contact customer on WhatsApp regarding this search"
                              >
                                <WhatsAppIcon className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">WhatsApp</span>
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-black/10 p-12 text-center dark:border-white/10">
                  <SearchIcon className="mb-4 h-8 w-8 text-black/20 dark:text-white/20" />
                  <p className="font-semibold text-black/70 dark:text-white/70">
                    No search history found
                  </p>
                  <p className="mt-1 max-w-md text-xs text-black/40 dark:text-white/40">
                    When this customer searches for sneakers, apparel, or accessories on the
                    storefront while logged in, their queries and product interests will appear here
                    automatically.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Premium Create Order Modal */}
      <CreateCustomerOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
        }}
        customerId={customerId}
        customerName={customer?.name ?? ''}
        customerPhone={customer?.phone}
        onOrderCreated={(newOrder) => {
          setCustomer((prev) => {
            if (!prev) {
              return null;
            }
            const updatedOrders = [newOrder, ...prev.orders];
            const newTotalSpent = prev.totalSpent + (newOrder.total ?? 0);
            return {
              ...prev,
              ordersCount: updatedOrders.length,
              totalSpent: newTotalSpent,
              orders: updatedOrders,
            };
          });
          void fetchCustomerDetails(true);
        }}
      />

      {/* WhatsApp Message Template Modal */}
      {customer && (
        <WhatsAppMessageModal
          isOpen={whatsAppModalData.isOpen}
          onClose={() => setWhatsAppModalData((prev) => ({ ...prev, isOpen: false }))}
          customer={customer}
          section={whatsAppModalData.section}
          product={whatsAppModalData.product}
          order={whatsAppModalData.order}
          availablePhoneNumbers={availablePhones}
        />
      )}

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-[#111111]/80"
              onClick={() => {
                setIsEditModalOpen(false);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-2xl dark:border-white/5 dark:bg-[#1a1a1a]"
            >
              <div className="flex items-center justify-between border-b border-black/5 p-6 dark:border-white/5">
                <h2 className="text-xl font-bold text-black dark:text-white">Edit Profile</h2>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                  }}
                  className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <CloseIcon className="h-5 w-5 text-black/60 dark:text-white/60" />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-black/60 dark:text-white/60">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => {
                      setEditName(e.target.value);
                    }}
                    className="rounded-2xl border border-black/10 bg-black/5 px-4 py-3 text-black transition-colors focus:border-black/20 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/20 dark:focus:bg-[#111]"
                    placeholder="John Doe"
                  />
                  {editErrors.name && (
                    <span className="text-xs font-semibold text-red-500">{editErrors.name}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-black/60 dark:text-white/60">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => {
                      setEditPhone(e.target.value);
                    }}
                    className="rounded-2xl border border-black/10 bg-black/5 px-4 py-3 text-black transition-colors focus:border-black/20 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/20 dark:focus:bg-[#111]"
                    placeholder="+919999999999"
                  />
                  {editErrors.phone && (
                    <span className="text-xs font-semibold text-red-500">{editErrors.phone}</span>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                    }}
                    className="flex-1 rounded-xl bg-black/5 py-3 font-bold text-black transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="flex-1 rounded-xl bg-black py-3 font-bold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 dark:bg-white dark:text-black"
                  >
                    {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Remove Item Modal */}
      <AnimatePresence>
        {itemToRemove && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-[#111111]/80"
              onClick={() => {
                setItemToRemove(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-sm overflow-hidden rounded-[32px] border border-black/5 bg-white p-6 shadow-2xl dark:border-white/5 dark:bg-[#1a1a1a]"
            >
              <h2 className="text-xl font-bold text-black dark:text-white">Remove Item?</h2>
              <p className="mt-2 text-sm text-black/60 dark:text-white/60">
                Are you sure you want to remove this item from the cart?
              </p>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setItemToRemove(null);
                  }}
                  className="flex-1 rounded-xl bg-black/5 py-3 font-bold text-black transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRemoveItem}
                  className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-[#111111]/80"
              onClick={() => {
                if (!isSubmittingAddress) {
                  setIsAddressModalOpen(false);
                }
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-2xl dark:border-white/5 dark:bg-[#1a1a1a]"
            >
              <div className="flex items-center justify-between border-b border-black/5 p-6 dark:border-white/5">
                <h2 className="text-xl font-bold text-black dark:text-white">Add New Address</h2>
                <button
                  onClick={() => {
                    if (!isSubmittingAddress) {
                      setIsAddressModalOpen(false);
                    }
                  }}
                  className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <CloseIcon className="h-5 w-5 text-black/60 dark:text-white/60" />
                </button>
              </div>

              <form onSubmit={handleCreateAddress} className="max-h-[80vh] overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={addrFullName}
                      onChange={(e) => {
                        setAddrFullName(e.target.value);
                      }}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a]"
                    />
                    {addrErrors.fullName && (
                      <span className="text-xs text-red-500">{addrErrors.fullName}</span>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={addrPhone}
                      onChange={(e) => {
                        setAddrPhone(e.target.value);
                      }}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a]"
                    />
                    {addrErrors.phone && (
                      <span className="text-xs text-red-500">{addrErrors.phone}</span>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                      Full Address (House No, Building, Street, Area)
                    </label>
                    <textarea
                      rows={2}
                      value={addrStreet}
                      onChange={(e) => {
                        setAddrStreet(e.target.value);
                      }}
                      placeholder="e.g. Flat 4B, Taj Apartments, Chungam"
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a]"
                    />
                    {addrErrors.street && (
                      <span className="text-xs text-red-500">{addrErrors.street}</span>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                      City
                    </label>
                    <input
                      type="text"
                      value={addrCity}
                      onChange={(e) => {
                        setAddrCity(e.target.value);
                      }}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a]"
                    />
                    {addrErrors.city && (
                      <span className="text-xs text-red-500">{addrErrors.city}</span>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                      District
                    </label>
                    <input
                      type="text"
                      value={addrDistrict}
                      onChange={(e) => {
                        setAddrDistrict(e.target.value);
                      }}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a]"
                    />
                    {addrErrors.district && (
                      <span className="text-xs text-red-500">{addrErrors.district}</span>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                      State
                    </label>
                    <input
                      type="text"
                      value={addrState}
                      onChange={(e) => {
                        setAddrState(e.target.value);
                      }}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a]"
                    />
                    {addrErrors.state && (
                      <span className="text-xs text-red-500">{addrErrors.state}</span>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={addrPincode}
                      onChange={(e) => {
                        setAddrPincode(e.target.value);
                      }}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a]"
                    />
                    {addrErrors.pincode && (
                      <span className="text-xs text-red-500">{addrErrors.pincode}</span>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={addrLandmark}
                      onChange={(e) => {
                        setAddrLandmark(e.target.value);
                      }}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">
                      Alt Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={addrAltPhone}
                      onChange={(e) => {
                        setAddrAltPhone(e.target.value);
                      }}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a]"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-6 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={addrIsDefault}
                      onChange={(e) => {
                        setAddrIsDefault(e.target.checked);
                      }}
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label
                      htmlFor="isDefault"
                      className="text-sm font-medium text-black/80 dark:text-white/80"
                    >
                      Set as default
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={isSubmittingAddress}
                      onClick={() => {
                        setIsAddressModalOpen(false);
                      }}
                      className="rounded-xl border border-black/5 bg-transparent px-4 py-2.5 text-sm font-semibold text-black/70 hover:bg-black/5 disabled:opacity-50 dark:border-white/5 dark:text-white/70 dark:hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingAddress}
                      className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
                    >
                      {isSubmittingAddress ? 'Adding...' : 'Add Address'}
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
