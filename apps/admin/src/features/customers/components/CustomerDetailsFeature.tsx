'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  ChevronLeftIcon,
  CloseIcon,
  HeartIcon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  StarIcon,
  UserIcon,
  MapPinIcon,
} from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';

import { fetcher } from '@/lib/api-client';

const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const CopyIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m18 15-6-6-6 6"/>
  </svg>
);

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
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  addedAt: string;
  image: string;
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
  _count?: {
    wishlist: number;
    cart: number;
    addresses: number;
  };
}

export function CustomerDetailsFeature({ customerId }: CustomerDetailsFeatureProps) {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tab states
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'cart' | 'addresses' | 'payments'>('orders');
  const [isFetchingTab, setIsFetchingTab] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[] | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[] | null>(null);
  const [addresses, setAddresses] = useState<Address[] | null>(null);

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
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY' | 'STRIPE' | 'WALLET'>('COD');
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'SUCCESS' | 'FAILED'>('PENDING');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const fetchCustomerDetails = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const data = await fetcher<CustomerDetails>(`/admin/customers/${customerId}`);
      setCustomer(data);
    } catch (error) {
      console.error('Failed to load customer details:', error);
      toast.error('Failed to load customer profile details.');
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const fetchTabContent = async (tab: 'orders' | 'favorites' | 'cart' | 'addresses' | 'payments') => {
    setActiveTab(tab);
    if (tab === 'cart' && cartItems === null) {
      setIsFetchingTab(true);
      try {
        const data = await fetcher<CartItem[]>(`/admin/customers/${customerId}/cart`);
        setCartItems(data);
      } catch (error) {
        toast.error('Failed to load cart items');
      } finally {
        setIsFetchingTab(false);
      }
    } else if (tab === 'favorites' && wishlistItems === null) {
      setIsFetchingTab(true);
      try {
        const data = await fetcher<WishlistItem[]>(`/admin/customers/${customerId}/wishlist`);
        setWishlistItems(data);
      } catch (error) {
        toast.error('Failed to load wishlist items');
      } finally {
        setIsFetchingTab(false);
      }
    } else if (tab === 'addresses' && addresses === null) {
      setIsFetchingTab(true);
      try {
        const data = await fetcher<Address[]>(`/admin/customers/${customerId}/addresses`);
        setAddresses(data);
      } catch (error) {
        toast.error('Failed to load addresses');
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
      setCartItems((prev) => 
        prev?.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)) || prev
      );
    }

    // Debounce backend call
    if (cartUpdateTimeoutRef.current) clearTimeout(cartUpdateTimeoutRef.current);
    
    setUpdatingCartItem(itemId);
    cartUpdateTimeoutRef.current = setTimeout(async () => {
      try {
        await fetcher(`/admin/customers/${customerId}/cart/${itemId}`, {
          method: 'PATCH',
          body: JSON.stringify({ quantity: newQuantity }),
        });
        void fetchCustomerDetails(true);
      } catch (error) {
        toast.error('Failed to update cart quantity');
      } finally {
        setUpdatingCartItem(null);
      }
    }, 2000);
  };

  const handleConfirmRemoveItem = async () => {
    if (!itemToRemove) return;
    
    // Clear any pending updates for this item
    if (cartUpdateTimeoutRef.current) clearTimeout(cartUpdateTimeoutRef.current);
    
    // Optimistically update
    if (cartItems) {
      setCartItems((prev) => prev?.filter(i => i.id !== itemToRemove) || prev);
    }
    
    setUpdatingCartItem(itemToRemove);
    try {
      await fetcher(`/admin/customers/${customerId}/cart/${itemToRemove}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity: 0 }),
      });
      void fetchCustomerDetails(true);
      toast.success('Item removed from cart');
    } catch (error) {
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
    } catch (error) {
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
    } catch (error: unknown) {
      console.error('Failed to create order:', error);
      const msg = error instanceof Error ? error.message : 'Failed to create order';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateAddressForm = () => {
    const errors: Record<string, string> = {};
    if (!addrFullName.trim()) errors.fullName = 'Name is required';
    if (!addrPhone.trim()) errors.phone = 'Phone is required';
    if (!addrStreet.trim()) errors.street = 'Address is required';
    if (!addrCity.trim()) errors.city = 'City is required';
    if (!addrDistrict.trim()) errors.district = 'District is required';
    if (!addrState.trim()) errors.state = 'State is required';
    if (!addrPincode.trim() || !/^\d{6}$/.test(addrPincode)) errors.pincode = 'Valid 6-digit pin code required';
    setAddrErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddressForm()) return;
    
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
          isDefault: addrIsDefault
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

        <div className="px-8 pb-8">
          <div className="-mt-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-6">
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-3xl border-4 border-white bg-black dark:border-[#111111]">
                <Image
                  src={customer.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}&backgroundColor=000000&textColor=ffffff`}
                  alt={customer.name}
                  fill
                  className="object-cover dark:invert"
                />
              </div>

              <div className="flex flex-col pb-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">
                    {customer.name}
                  </h1>
                  <span className="flex h-6 items-center rounded-full bg-emerald-500/10 px-2.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider dark:bg-emerald-500/20 dark:text-emerald-400">
                    {customer.status}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm font-semibold text-black/60 dark:text-white/60">
                  <span className="flex items-center gap-1.5">
                    <MailIcon className="h-4 w-4" />
                    {customer.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <PhoneIcon className="h-4 w-4" />
                    {customer.phone || 'No phone number'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pb-2 md:flex-row md:items-center">
              <button
                onClick={() => {
                  setEditName(customer.name);
                  setEditPhone(customer.phone || '+91');
                  setEditErrors({});
                  setIsEditModalOpen(true);
                }}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-black/10 bg-transparent px-5 text-sm font-semibold text-black transition-colors hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="flex flex-col rounded-2xl bg-[#f8f9fa] p-5 dark:bg-[#1a1a1a]">
              <span className="text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                Total Orders
              </span>
              <span className="mt-2 text-3xl font-black text-black dark:text-white">
                {customer.ordersCount}
              </span>
            </div>
            <div className="flex flex-col rounded-2xl bg-[#f8f9fa] p-5 dark:bg-[#1a1a1a]">
              <span className="text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                Total Spent
              </span>
              <span className="mt-2 text-3xl font-black text-black dark:text-white">
                ₹{customer.totalSpent.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex flex-col rounded-2xl bg-[#f8f9fa] p-5 dark:bg-[#1a1a1a]">
              <span className="text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                Favorites
              </span>
              <span className="mt-2 text-3xl font-black text-black dark:text-white">
                {customer._count?.wishlist || 0}
              </span>
            </div>
            <div className="flex flex-col rounded-2xl bg-[#f8f9fa] p-5 dark:bg-[#1a1a1a]">
              <span className="text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                Cart Items
              </span>
              <span className="mt-2 text-3xl font-black text-black dark:text-white">
                {customer._count?.cart || 0}
              </span>
            </div>
            <div className="flex flex-col rounded-2xl bg-[#f8f9fa] p-5 dark:bg-[#1a1a1a]">
              <span className="text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                Addresses
              </span>
              <span className="mt-2 text-3xl font-black text-black dark:text-white">
                {customer._count?.addresses || 0}
              </span>
            </div>
          </div>
        </div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs and Content Section */}
      <div className="flex flex-col gap-6">
        <div className="sticky top-2 z-40 flex w-full items-center justify-between py-2">
          {/* Tabs & Toggle (Left) */}
          <div className="flex overflow-x-auto no-scrollbar">
            <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-black/5 bg-[#f8f9fa] p-1 dark:border-white/5 dark:bg-[#111111]">
              <button
                onClick={() => setIsProfileBoxOpen(!isProfileBoxOpen)}
                className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm transition-all hover:scale-105 active:scale-95 dark:bg-[#222]"
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
                        src={customer.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}&backgroundColor=000000&textColor=ffffff`}
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
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${activeTab === 'orders'
                ? 'bg-white text-black shadow-sm dark:bg-[#222] dark:text-white'
                : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
                }`}
            >
              <ShoppingBagIcon className="h-4 w-4" />
              Orders
            </button>
            <button
              onClick={() => fetchTabContent('favorites')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${activeTab === 'favorites'
                ? 'bg-white text-black shadow-sm dark:bg-[#222] dark:text-white'
                : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
                }`}
            >
              <HeartIcon className="h-4 w-4" />
              Favorites
            </button>
            <button
              onClick={() => fetchTabContent('cart')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${activeTab === 'cart'
                ? 'bg-white text-black shadow-sm dark:bg-[#222] dark:text-white'
                : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
                }`}
            >
              <ShoppingCartIcon className="h-4 w-4" />
              Cart
            </button>
            <button
              onClick={() => fetchTabContent('addresses')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${activeTab === 'addresses'
                ? 'bg-white text-black shadow-sm dark:bg-[#222] dark:text-white'
                : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
                }`}
            >
              <MapPinIcon className="h-4 w-4" />
              Addresses
            </button>
            <button
              onClick={() => fetchTabContent('payments')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${activeTab === 'payments'
                ? 'bg-white text-black shadow-sm dark:bg-[#222] dark:text-white'
                : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
                }`}
            >
              <CreditCardIcon className="h-4 w-4" />
              Payments
            </button>
          </div>
          </div>
          
          {/* Action Buttons (Right) */}
          <div className="flex flex-1 justify-end">
            {activeTab === 'orders' && (
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold whitespace-nowrap text-white transition-all hover:scale-105 hover:bg-black/80 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/80"
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
              className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold whitespace-nowrap text-white transition-all hover:scale-105 hover:bg-black/80 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/80"
            >
              <PlusIcon className="h-4 w-4" />
              Add Address
            </button>
          )}

          {activeTab === 'cart' && cartItems && cartItems.length > 0 && (
            <button
              onClick={() => handleCartCheckout()}
              disabled={isCheckingOut}
              className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold whitespace-nowrap text-white transition-all hover:scale-105 hover:bg-black/80 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {customer.orders.flatMap(o => o.items.map(i => ({ order: o, item: i }))).length > 0 ? (
                customer.orders.flatMap(o => o.items.map(i => ({ order: o, item: i }))).map(({ order, item }) => (
                  <div
                    key={item.id}
                    className="group flex flex-col gap-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#111111]"
                  >
                    <div className="flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-black/40 dark:text-white/40">
                          {order.orderNumber}
                        </span>
                        <span className="text-sm font-semibold text-black/60 dark:text-white/60">
                          Ordered on {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`flex h-7 items-center rounded-full px-3 text-xs font-bold uppercase tracking-wider ${order.status === 'delivered'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : order.status === 'cancelled'
                            ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-black/5 dark:border-white/5">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-black/5 dark:bg-white/5">
                            <ShoppingBagIcon className="h-6 w-6 text-black/20 dark:text-white/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span className="font-bold text-black dark:text-white">{item.name}</span>
                        <span className="mt-1 text-xs text-black/50 dark:text-white/50">
                          Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                        </span>
                        <span className="mt-2 text-lg font-bold text-black dark:text-white">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
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
          )}

          {activeTab === 'favorites' && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {wishlistItems && wishlistItems.length > 0 ? (
                wishlistItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-3xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-[#111111]">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-black/5 dark:border-white/5">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-black/5 dark:bg-white/5">
                          <ShoppingBagIcon className="h-6 w-6 text-black/20 dark:text-white/20" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-black dark:text-white">{item.name}</span>
                      <span className="mt-1 text-sm font-semibold text-black/60 dark:text-white/60">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      <span className="mt-2 text-xs text-black/40 dark:text-white/40">
                        Added on {new Date(item.addedAt).toLocaleDateString()}
                      </span>
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
                  <div key={item.id} className="flex items-center gap-4 rounded-3xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-[#111111]">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-black/5 dark:border-white/5">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-black/5 dark:bg-white/5">
                          <ShoppingBagIcon className="h-6 w-6 text-black/20 dark:text-white/20" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div className="flex flex-col">
                        <span className="font-bold text-black dark:text-white">{item.name}</span>
                        <span className="mt-1 text-xs text-black/60 dark:text-white/60">
                          Size: {item.size} • Color: {item.color}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-black dark:text-white">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        
                        <div className="flex items-center gap-2 rounded-full border border-black/10 bg-black/5 p-1 dark:border-white/10 dark:bg-white/5">
                          <button
                            onClick={() => handleUpdateCartQuantity(item.id, item.quantity - 1)}
                            disabled={updatingCartItem === item.id}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black shadow-sm transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 dark:bg-[#222] dark:text-white"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-black dark:text-white">
                            {updatingCartItem === item.id ? '...' : item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateCartQuantity(item.id, item.quantity + 1)}
                            disabled={updatingCartItem === item.id}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white shadow-sm transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black"
                          >
                            +
                          </button>
                        </div>
                      </div>
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
                  <div key={address.id} className="relative flex flex-col gap-3 rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#111111]">
                    <button 
                      onClick={() => {
                         const streetWithLandmark = address.street + (address.landmark ? ` (near ${address.landmark})` : '');
                         const fullAddress = [address.building, streetWithLandmark, address.city, address.district, address.state, address.pincode].filter(Boolean).join(', ');
                         const text = `Name : ${address.fullName}
Address : ${fullAddress}
City : ${address.city}
District : ${address.district}
State : ${address.state}
Pincode : ${address.pincode}
${address.landmark ? `Landmark : ${address.landmark}\n` : ''}Mobile Number : ${address.phoneNumber}
${address.altPhoneNumber ? `Alt Number : ${address.altPhoneNumber}` : ''}`.trim();
                         navigator.clipboard.writeText(text);
                         toast.success('Address copied to clipboard!');
                      }}
                      className="absolute top-6 right-6 p-2 rounded-xl bg-black/5 hover:bg-black/10 transition-colors dark:bg-white/5 dark:hover:bg-white/10"
                      title="Copy Address"
                    >
                      <CopyIcon className="h-4 w-4 text-black/60 dark:text-white/60" />
                    </button>
                    
                    <div className="flex items-center gap-2 border-b border-black/5 pb-3 dark:border-white/5">
                      <span className="rounded-md bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white dark:bg-white dark:text-black">
                        {address.label || 'Home'}
                      </span>
                      {address.isDefault && (
                        <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-col gap-2 text-sm text-black/80 dark:text-white/80">
                      <div className="flex items-start gap-2"><span className="w-28 shrink-0 font-semibold text-black/50 dark:text-white/50">Name :</span><span className="font-medium text-black dark:text-white">{address.fullName}</span></div>
                      <div className="flex items-start gap-2">
                        <span className="w-28 shrink-0 font-semibold text-black/50 dark:text-white/50">Address :</span>
                        <span className="leading-relaxed text-black dark:text-white">
                          {[address.building, address.street + (address.landmark ? ` (near ${address.landmark})` : ''), address.city, address.district, address.state, address.pincode].filter(Boolean).join(', ')}
                        </span>
                      </div>
                      <div className="flex items-start gap-2"><span className="w-28 shrink-0 font-semibold text-black/50 dark:text-white/50">City :</span><span>{address.city}</span></div>
                      <div className="flex items-start gap-2"><span className="w-28 shrink-0 font-semibold text-black/50 dark:text-white/50">District :</span><span>{address.district}</span></div>
                      <div className="flex items-start gap-2"><span className="w-28 shrink-0 font-semibold text-black/50 dark:text-white/50">State :</span><span>{address.state}</span></div>
                      <div className="flex items-start gap-2"><span className="w-28 shrink-0 font-semibold text-black/50 dark:text-white/50">Pincode :</span><span>{address.pincode}</span></div>
                      {address.landmark && (
                        <div className="flex items-start gap-2"><span className="w-28 shrink-0 font-semibold text-black/50 dark:text-white/50">Landmark :</span><span>{address.landmark}</span></div>
                      )}
                      <div className="flex items-start gap-2"><span className="w-28 shrink-0 font-semibold text-black/50 dark:text-white/50">Mobile Number :</span><span>{address.phoneNumber}</span></div>
                      {address.altPhoneNumber && (
                        <div className="flex items-start gap-2"><span className="w-28 shrink-0 font-semibold text-black/50 dark:text-white/50">Alt Number :</span><span>{address.altPhoneNumber}</span></div>
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
                        className={`flex h-6 items-center rounded-full px-2.5 text-[10px] font-bold uppercase tracking-wider ${order.paymentStatus === 'SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
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
        </div>
      </div>

      {/* Premium Create Order Modal */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-[#111111]/80"
              onClick={() => {
                if (!isSubmitting) setIsOrderModalOpen(false);
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-2xl dark:border-white/5 dark:bg-[#1a1a1a]"
            >
              <div className="flex items-center justify-between border-b border-black/5 p-6 dark:border-white/5">
                <h2 className="text-xl font-bold text-black dark:text-white">Create New Order</h2>
                <button
                  onClick={() => {
                    if (!isSubmitting) setIsOrderModalOpen(false);
                  }}
                  className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <CloseIcon className="h-5 w-5 text-black/60 dark:text-white/60" />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="p-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
                        placeholder="e.g., Premium Cotton T-Shirt"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
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
                        <select
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                          className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm text-black outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white"
                        >
                          <option value="">Select Size</option>
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                        </select>
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
                          onChange={(e) => setColor(e.target.value)}
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
                          min="0"
                          value={price || ''}
                          onChange={(e) => setPrice(Number(e.target.value))}
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
                          min="1"
                          value={quantity || ''}
                          onChange={(e) => setQuantity(Number(e.target.value))}
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
                          Payment Method
                        </label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
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
                          onChange={(e) => setPaymentStatus(e.target.value as any)}
                          className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm text-black outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="SUCCESS">Success</option>
                          <option value="FAILED">Failed</option>
                        </select>
                      </div>
                    </div>
                  </div>

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
                        onChange={(e) => setAddressLine(e.target.value)}
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
                        onChange={(e) => setCity(e.target.value)}
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
                          onChange={(e) => setState(e.target.value)}
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
                          onChange={(e) => setPinCode(e.target.value)}
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
                      onClick={() => setIsOrderModalOpen(false)}
                      className="rounded-xl border border-black/5 bg-transparent px-4 py-2.5 text-sm font-semibold text-black/70 hover:bg-black/5 disabled:opacity-50 dark:border-white/5 dark:text-white/70 dark:hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
                    >
                      {isSubmitting ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white dark:border-black/20 dark:border-t-black" />
                      ) : (
                        'Create Order'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-[#111111]/80"
              onClick={() => setIsEditModalOpen(false)}
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
                  onClick={() => setIsEditModalOpen(false)}
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
                    onChange={(e) => setEditName(e.target.value)}
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
                    onChange={(e) => setEditPhone(e.target.value)}
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
                    onClick={() => setIsEditModalOpen(false)}
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
              onClick={() => setItemToRemove(null)}
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
                  onClick={() => setItemToRemove(null)}
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
                if (!isSubmittingAddress) setIsAddressModalOpen(false);
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
                    if (!isSubmittingAddress) setIsAddressModalOpen(false);
                  }}
                  className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <CloseIcon className="h-5 w-5 text-black/60 dark:text-white/60" />
                </button>
              </div>

              <form onSubmit={handleCreateAddress} className="max-h-[80vh] overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">Full Name</label>
                    <input
                      type="text"
                      value={addrFullName}
                      onChange={(e) => setAddrFullName(e.target.value)}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a]"
                    />
                    {addrErrors.fullName && <span className="text-xs text-red-500">{addrErrors.fullName}</span>}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">Phone Number</label>
                    <input
                      type="text"
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a]"
                    />
                    {addrErrors.phone && <span className="text-xs text-red-500">{addrErrors.phone}</span>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">Full Address (House No, Building, Street, Area)</label>
                    <textarea
                      rows={2}
                      value={addrStreet}
                      onChange={(e) => setAddrStreet(e.target.value)}
                      placeholder="e.g. Flat 4B, Taj Apartments, Chungam"
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a]"
                    />
                    {addrErrors.street && <span className="text-xs text-red-500">{addrErrors.street}</span>}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">City</label>
                    <input
                      type="text"
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a]"
                    />
                    {addrErrors.city && <span className="text-xs text-red-500">{addrErrors.city}</span>}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">District</label>
                    <input
                      type="text"
                      value={addrDistrict}
                      onChange={(e) => setAddrDistrict(e.target.value)}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a]"
                    />
                    {addrErrors.district && <span className="text-xs text-red-500">{addrErrors.district}</span>}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">State</label>
                    <input
                      type="text"
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a]"
                    />
                    {addrErrors.state && <span className="text-xs text-red-500">{addrErrors.state}</span>}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">Pincode</label>
                    <input
                      type="text"
                      value={addrPincode}
                      onChange={(e) => setAddrPincode(e.target.value)}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a]"
                    />
                    {addrErrors.pincode && <span className="text-xs text-red-500">{addrErrors.pincode}</span>}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={addrLandmark}
                      onChange={(e) => setAddrLandmark(e.target.value)}
                      className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-black/60 dark:text-white/60">Alt Number (Optional)</label>
                    <input
                      type="text"
                      value={addrAltPhone}
                      onChange={(e) => setAddrAltPhone(e.target.value)}
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
                      onChange={(e) => setAddrIsDefault(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label htmlFor="isDefault" className="text-sm font-medium text-black/80 dark:text-white/80">
                      Set as default
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={isSubmittingAddress}
                      onClick={() => setIsAddressModalOpen(false)}
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
