'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { CheckIcon, CloseIcon, PlusIcon, SearchIcon, ShoppingBagIcon } from '@ff/ui';
import { motion } from 'motion/react';
import { toast } from 'sonner';

import { fetchProducts } from '@/features/products/services/api';
import { type Product } from '@/features/products/types';
import { fetcher } from '@/lib/api-client';

export interface CustomerAddress {
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

export interface CreatedOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
  }[];
}

interface CreateCustomerOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  onOrderCreated: (order: CreatedOrder) => void;
}

type Step = 'product' | 'configure' | 'address' | 'payment';

const STANDARD_SIZES = ['Free Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

function getProductFirstImage(p?: Product | null): string {
  if (!p) {
    return '';
  }
  const raw = p as any;
  return (
    (typeof p.imageUrl === 'string' && p.imageUrl.trim()) ||
    (Array.isArray(p.images) && typeof p.images[0] === 'string' && p.images[0].trim()) ||
    (typeof raw.mainImage === 'string' && raw.mainImage.trim()) ||
    (typeof raw.media?.mainImage === 'string' && raw.media.mainImage.trim()) ||
    (Array.isArray(raw.media?.liveImages) &&
      typeof raw.media.liveImages[0] === 'string' &&
      raw.media.liveImages[0].trim()) ||
    ''
  );
}

export function CreateCustomerOrderModal({
  isOpen,
  onClose,
  customerId,
  customerName,
  customerPhone,
  onOrderCreated,
}: CreateCustomerOrderModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('product');

  // Step 1: Product Search & Selection
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Step 2: Item Configuration
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Step 3: Address Selection & Creation
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  // Add Address Form State
  const [newAddrFullName, setNewAddrFullName] = useState(customerName || '');
  const [newAddrPhone, setNewAddrPhone] = useState(customerPhone || '');
  const [newAddrLabel, setNewAddrLabel] = useState('Home');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrBuilding, setNewAddrBuilding] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrDistrict, setNewAddrDistrict] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrPincode, setNewAddrPincode] = useState('');
  const [newAddrLandmark, setNewAddrLandmark] = useState('');
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  // Step 4: Payment Details
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY' | 'STRIPE' | 'WALLET'>(
    'COD',
  );
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'SUCCESS' | 'FAILED'>('PENDING');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const loadInitialProducts = async () => {
    setIsSearching(true);
    try {
      const items = await fetchProducts();
      setProducts(items.slice(0, 12));
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const loadCustomerAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const data = await fetcher<CustomerAddress[]>(`/admin/customers/${customerId}/addresses`);
      setAddresses(data || []);
      // If customer has default address, auto-select it
      const defaultAddr = data?.find((a) => a.isDefault) || data?.[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        setShowAddAddressForm(false);
      } else {
        // No address saved yet, show add address form directly
        setShowAddAddressForm(true);
      }
    } catch (err) {
      console.error('Failed loading addresses:', err);
      setShowAddAddressForm(true);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  // Reset or load initial data when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('product');
      setSelectedProduct(null);
      setSelectedSize('');
      setSelectedColor('');
      setQuantity(1);
      setSelectedAddressId(null);
      setShowAddAddressForm(false);
      setNewAddrFullName(customerName || '');
      setNewAddrPhone(customerPhone || '');
      void loadInitialProducts();
      void loadCustomerAddresses();
    }
  }, [isOpen, customerName, customerPhone]);

  const handleSearchProducts = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await fetchProducts(searchQuery);
      setProducts(results);
    } catch (err) {
      console.error('Failed searching products:', err);
      toast.error('Failed to search products');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    // Auto-select first available size or default
    const availableSizes =
      product.variants && product.variants.length > 0 ? product.variants : STANDARD_SIZES;
    setSelectedSize(availableSizes[0] || 'M');
    setSelectedColor(product.quality || 'Standard');
    setQuantity(1);
    setCurrentStep('configure');
  };

  const validateAddressForm = () => {
    const errors: Record<string, string> = {};
    if (!newAddrFullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!newAddrPhone.trim()) {
      errors.phone = 'Phone number is required';
    }
    if (!newAddrStreet.trim()) {
      errors.street = 'Street / Address is required';
    }
    if (!newAddrCity.trim()) {
      errors.city = 'City is required';
    }
    if (!newAddrState.trim()) {
      errors.state = 'State is required';
    }
    if (!newAddrPincode.trim() || !/^\d{6}$/.test(newAddrPincode.trim())) {
      errors.pincode = 'Valid 6-digit pin code is required';
    }
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddressForm()) {
      return;
    }

    setIsSavingAddress(true);
    try {
      const saved = await fetcher<CustomerAddress>(`/admin/customers/${customerId}/addresses`, {
        method: 'POST',
        body: JSON.stringify({
          fullName: newAddrFullName.trim(),
          phoneNumber: newAddrPhone.trim(),
          label: newAddrLabel,
          building: newAddrBuilding.trim() || null,
          street: newAddrStreet.trim(),
          city: newAddrCity.trim(),
          district: newAddrDistrict.trim() || newAddrCity.trim(),
          state: newAddrState.trim(),
          pincode: newAddrPincode.trim(),
          landmark: newAddrLandmark.trim() || null,
          isDefault: addresses.length === 0,
        }),
      });

      toast.success('Address saved successfully');
      setAddresses((prev) => [saved, ...prev]);
      setSelectedAddressId(saved.id);
      setShowAddAddressForm(false);
      setAddressErrors({});
    } catch (err: unknown) {
      console.error('Failed saving address:', err);
      toast.error('Failed to save address');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      toast.error('Please select or add a delivery address');
      return;
    }
    setCurrentStep('payment');
  };

  const handleFinalSubmitOrder = async () => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      setCurrentStep('product');
      return;
    }
    if (!selectedAddress) {
      toast.error('Please select an address');
      setCurrentStep('address');
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const addressLine = [
        selectedAddress.building,
        selectedAddress.street,
        selectedAddress.landmark,
      ]
        .filter(Boolean)
        .join(', ');

      const chosenImage = getProductFirstImage(selectedProduct);

      const newOrder = await fetcher<CreatedOrder>(`/admin/customers/${customerId}/orders`, {
        method: 'POST',
        body: JSON.stringify({
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          image: chosenImage,
          size: selectedSize || 'Free Size',
          color: selectedColor || 'Standard',
          price: selectedProduct.sellingPrice,
          quantity,
          paymentMethod,
          paymentStatus,
          addressLine: addressLine || selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pinCode: selectedAddress.pincode,
        }),
      });

      // Ensure returned items have the proper image assigned
      const enrichedOrder = {
        ...newOrder,
        items: newOrder.items?.map((item) => ({
          ...item,
          image:
            item.image && !item.image.includes('photo-1523381210434-271e8be1f52b')
              ? item.image
              : chosenImage,
        })) || [
          {
            id: `item-${Date.now()}`,
            name: selectedProduct.name,
            price: selectedProduct.sellingPrice,
            quantity,
            size: selectedSize || 'Free Size',
            color: selectedColor || 'Standard',
            image: chosenImage,
          },
        ],
      };

      toast.success(`Order #${enrichedOrder.orderNumber || 'created'} successfully!`);
      onOrderCreated(enrichedOrder);
      onClose();
    } catch (err: unknown) {
      console.error('Failed to create order:', err);
      const msg = err instanceof Error ? err.message : 'Failed to create order';
      toast.error(msg);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const unitPrice = selectedProduct?.sellingPrice ?? 0;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:pl-[280px]">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          if (!isSubmittingOrder) {
            onClose();
          }
        }}
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 flex h-[90vh] max-h-[820px] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-[#121212]"
      >
        {/* Header with Step Tracker */}
        <div className="shrink-0 border-b border-black/5 bg-[#fafafa] px-6 py-5 dark:border-white/5 dark:bg-[#161616]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-black dark:text-white">
                Create Order for Customer
              </h2>
              <p className="text-xs text-black/50 dark:text-white/50">
                Customer:{' '}
                <span className="font-semibold text-black dark:text-white">{customerName}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!isSubmittingOrder) {
                  onClose();
                }
              }}
              className="rounded-full p-2 text-black/40 transition-colors hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Stepper Wizard Bar */}
          <div className="mt-4 grid grid-cols-4 gap-2 text-xs font-semibold">
            {[
              { id: 'product', label: '1. Select Product' },
              { id: 'configure', label: '2. Size & Quantity' },
              { id: 'address', label: '3. Delivery Address' },
              { id: 'payment', label: '4. Payment & Review' },
            ].map((step, idx) => {
              const stepIndex = ['product', 'configure', 'address', 'payment'].indexOf(currentStep);
              const isPassed = stepIndex > idx;
              const isCurrent = currentStep === step.id;

              return (
                <div
                  key={step.id}
                  className={`flex items-center justify-center rounded-xl px-2 py-2 text-center transition-all ${
                    isCurrent
                      ? 'bg-black text-white shadow-xs dark:bg-white dark:text-black'
                      : isPassed
                        ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : 'bg-black/5 text-black/40 dark:bg-white/5 dark:text-white/40'
                  }`}
                >
                  <span className="truncate">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="scrollbar-hide flex-1 overflow-y-auto p-6">
          {/* STEP 1: Search & Pick Product */}
          {currentStep === 'product' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-black dark:text-white">
                  Find Product to Order
                </h3>
                <p className="text-xs text-black/50 dark:text-white/50">
                  Search by product name, slug, or exact product ID.
                </p>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearchProducts} className="flex gap-2.5">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <SearchIcon className="h-4 w-4 text-black/40 dark:text-white/40" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by product name or ID (e.g. Cotton Shirt, prod-123)..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                    }}
                    className="block w-full rounded-xl border border-black/10 bg-[#f8f9fa] py-2.5 pr-4 pl-10 text-sm text-black transition-all outline-none focus:border-black/30 focus:bg-white dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:focus:border-white/30"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-black/85 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  {isSearching ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white dark:border-black/20 dark:border-t-black" />
                  ) : (
                    <>
                      <SearchIcon className="h-4 w-4" />
                      <span>Search</span>
                    </>
                  )}
                </button>
              </form>

              {/* Product Cards Grid */}
              {isSearching ? (
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-48 animate-pulse rounded-2xl border border-black/5 bg-black/5 dark:border-white/5 dark:bg-white/5"
                    />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div>
                  <div className="mb-2 text-xs font-semibold text-black/40 uppercase dark:text-white/40">
                    {hasSearched
                      ? `Search Results (${products.length})`
                      : 'Popular & Recent Products'}
                  </div>
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3">
                    {products.map((product) => {
                      const img = getProductFirstImage(product);
                      const isSelected = selectedProduct?.id === product.id;

                      return (
                        <div
                          key={product.id}
                          onClick={() => {
                            handleSelectProduct(product);
                          }}
                          className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border p-3 transition-colors ${
                            isSelected
                              ? 'border-black bg-black/5 dark:border-white dark:bg-white/10'
                              : 'border-black/10 bg-white hover:border-black/30 dark:border-white/10 dark:bg-[#1a1a1a] dark:hover:border-white/30'
                          }`}
                        >
                          {/* Product Image */}
                          <div className="relative mb-3 h-36 w-full overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
                            {img ? (
                              <Image
                                src={img}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 33vw"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-black/30 dark:text-white/30">
                                <ShoppingBagIcon className="h-8 w-8" />
                              </div>
                            )}

                            {/* ID badge */}
                            <span className="absolute top-2 left-2 rounded-md bg-black/75 px-1.5 py-0.5 font-mono text-[10px] text-white backdrop-blur-md">
                              ID: {product.sku || product.id.slice(0, 8)}
                            </span>
                          </div>

                          {/* Info */}
                          <h4 className="line-clamp-1 text-sm font-bold text-black dark:text-white">
                            {product.name}
                          </h4>

                          <div className="mt-1 flex items-center justify-between text-xs">
                            <span className="font-extrabold text-black dark:text-white">
                              ₹{product.sellingPrice?.toLocaleString('en-IN') || 0}
                            </span>
                            {product.originalPrice > product.sellingPrice && (
                              <span className="text-[11px] text-black/40 line-through dark:text-white/40">
                                ₹{product.originalPrice?.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          {/* Available Sizes preview */}
                          {product.variants && product.variants.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {product.variants.slice(0, 4).map((s) => (
                                <span
                                  key={s}
                                  className="rounded-md bg-black/5 px-1.5 py-0.5 text-[9px] font-semibold text-black/60 dark:bg-white/10 dark:text-white/70"
                                >
                                  {s}
                                </span>
                              ))}
                              {product.variants.length > 4 && (
                                <span className="text-[9px] text-black/40 dark:text-white/40">
                                  +{product.variants.length - 4}
                                </span>
                              )}
                            </div>
                          )}

                          <button
                            type="button"
                            className="mt-3 w-full rounded-xl bg-black/5 py-1.5 text-center text-xs font-bold text-black transition-colors group-hover:bg-black group-hover:text-white dark:bg-white/10 dark:text-white dark:group-hover:bg-white dark:group-hover:text-black"
                          >
                            Select Product
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 p-6 text-center text-black/50 dark:border-white/10 dark:text-white/50">
                  <ShoppingBagIcon className="mb-2 h-10 w-10 opacity-30" />
                  <p className="text-sm font-semibold">
                    No products found matching &quot;{searchQuery}&quot;
                  </p>
                  <p className="text-xs">Try searching by partial name or check the product ID.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Configure Size & Quantity */}
          {currentStep === 'configure' && selectedProduct && (
            <div className="mx-auto max-w-2xl space-y-6">
              {/* Product Header Card */}
              <div className="flex items-center gap-4 rounded-2xl border border-black/10 bg-[#f8f9fa] p-4 dark:border-white/10 dark:bg-[#1a1a1a]">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
                  {getProductFirstImage(selectedProduct) ? (
                    <Image
                      src={getProductFirstImage(selectedProduct)}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShoppingBagIcon className="h-6 w-6 text-black/30 dark:text-white/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-mono text-[10px] text-black/50 dark:text-white/50">
                    ID: {selectedProduct.sku || selectedProduct.id}
                  </span>
                  <h3 className="text-base font-bold text-black dark:text-white">
                    {selectedProduct.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-base font-extrabold text-black dark:text-white">
                      ₹{selectedProduct.sellingPrice?.toLocaleString('en-IN')}
                    </span>
                    {selectedProduct.category && (
                      <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-semibold text-black/60 dark:bg-white/10 dark:text-white/70">
                        {selectedProduct.category}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep('product');
                  }}
                  className="rounded-xl border border-black/10 px-3 py-1.5 text-xs font-semibold text-black/60 hover:bg-black/5 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/10"
                >
                  Change Product
                </button>
              </div>

              {/* Size Selection */}
              <div>
                <label className="mb-2 block text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {(selectedProduct.variants && selectedProduct.variants.length > 0
                    ? selectedProduct.variants
                    : STANDARD_SIZES
                  ).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSelectedSize(s);
                      }}
                      className={`min-w-[48px] rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                        selectedSize === s
                          ? 'bg-black text-white shadow-md dark:bg-white dark:text-black'
                          : 'border border-black/10 bg-[#f8f9fa] text-black hover:border-black/30 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:hover:border-white/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Picker */}
              <div>
                <label className="mb-2 block text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-black/10 bg-[#f8f9fa] dark:border-white/10 dark:bg-[#1a1a1a]">
                    <button
                      type="button"
                      onClick={() => {
                        setQuantity(Math.max(1, quantity - 1));
                      }}
                      className="px-4 py-2 text-base font-bold text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1));
                      }}
                      className="w-16 bg-transparent text-center text-sm font-bold text-black outline-none dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setQuantity(quantity + 1);
                      }}
                      className="px-4 py-2 text-base font-bold text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-black/50 dark:text-white/50">
                    Subtotal:{' '}
                    <strong className="text-black dark:text-white">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t border-black/5 pt-5 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep('product');
                  }}
                  className="rounded-xl border border-black/10 px-4 py-2.5 text-xs font-semibold text-black/70 hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
                >
                  ← Back to Products
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep('address');
                  }}
                  className="rounded-xl bg-black px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-black/85 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  Continue to Delivery Address →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Delivery Address Selection & Form */}
          {currentStep === 'address' && (
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-black dark:text-white">
                    Delivery Address
                  </h3>
                  <p className="text-xs text-black/50 dark:text-white/50">
                    Select a saved address for this customer or create a new one.
                  </p>
                </div>
                {!showAddAddressForm && addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddAddressForm(true);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-black/5 px-3 py-1.5 text-xs font-bold text-black hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {isLoadingAddresses ? (
                <div className="py-8 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
                </div>
              ) : showAddAddressForm ? (
                /* Add New Address Form */
                <form
                  onSubmit={handleSaveNewAddress}
                  className="rounded-2xl border border-black/10 bg-[#f8f9fa] p-5 dark:border-white/10 dark:bg-[#1a1a1a]"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                      New Address Details
                    </h4>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddAddressForm(false);
                        }}
                        className="text-xs font-semibold text-black/60 hover:underline dark:text-white/60"
                      >
                        Cancel & Pick Existing
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-black/70 dark:text-white/70">
                        Recipient Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={newAddrFullName}
                        onChange={(e) => {
                          setNewAddrFullName(e.target.value);
                        }}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-black outline-none focus:border-black/30 dark:border-white/10 dark:bg-[#111] dark:text-white"
                      />
                      {addressErrors.fullName && (
                        <p className="mt-1 text-[11px] text-red-500">{addressErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-black/70 dark:text-white/70">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        placeholder="10-digit mobile number"
                        value={newAddrPhone}
                        onChange={(e) => {
                          setNewAddrPhone(e.target.value);
                        }}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-black outline-none focus:border-black/30 dark:border-white/10 dark:bg-[#111] dark:text-white"
                      />
                      {addressErrors.phone && (
                        <p className="mt-1 text-[11px] text-red-500">{addressErrors.phone}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold text-black/70 dark:text-white/70">
                        Flat / Building / House No.
                      </label>
                      <input
                        type="text"
                        placeholder="Apartment 4B, Sunrise Heights..."
                        value={newAddrBuilding}
                        onChange={(e) => {
                          setNewAddrBuilding(e.target.value);
                        }}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-black outline-none focus:border-black/30 dark:border-white/10 dark:bg-[#111] dark:text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold text-black/70 dark:text-white/70">
                        Street / Area / Locality *
                      </label>
                      <input
                        type="text"
                        placeholder="MG Road, Indiranagar..."
                        value={newAddrStreet}
                        onChange={(e) => {
                          setNewAddrStreet(e.target.value);
                        }}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-black outline-none focus:border-black/30 dark:border-white/10 dark:bg-[#111] dark:text-white"
                      />
                      {addressErrors.street && (
                        <p className="mt-1 text-[11px] text-red-500">{addressErrors.street}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-black/70 dark:text-white/70">
                        City *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bangalore"
                        value={newAddrCity}
                        onChange={(e) => {
                          setNewAddrCity(e.target.value);
                        }}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-black outline-none focus:border-black/30 dark:border-white/10 dark:bg-[#111] dark:text-white"
                      />
                      {addressErrors.city && (
                        <p className="mt-1 text-[11px] text-red-500">{addressErrors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-black/70 dark:text-white/70">
                        State *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Karnataka"
                        value={newAddrState}
                        onChange={(e) => {
                          setNewAddrState(e.target.value);
                        }}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-black outline-none focus:border-black/30 dark:border-white/10 dark:bg-[#111] dark:text-white"
                      />
                      {addressErrors.state && (
                        <p className="mt-1 text-[11px] text-red-500">{addressErrors.state}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-black/70 dark:text-white/70">
                        Pin Code *
                      </label>
                      <input
                        type="text"
                        placeholder="6-digit pin code"
                        maxLength={6}
                        value={newAddrPincode}
                        onChange={(e) => {
                          setNewAddrPincode(e.target.value);
                        }}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-black outline-none focus:border-black/30 dark:border-white/10 dark:bg-[#111] dark:text-white"
                      />
                      {addressErrors.pincode && (
                        <p className="mt-1 text-[11px] text-red-500">{addressErrors.pincode}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-black/70 dark:text-white/70">
                        Address Label
                      </label>
                      <select
                        value={newAddrLabel}
                        onChange={(e) => {
                          setNewAddrLabel(e.target.value);
                        }}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-black outline-none focus:border-black/30 dark:border-white/10 dark:bg-[#111] dark:text-white"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end gap-2.5">
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddAddressForm(false);
                        }}
                        className="rounded-xl border border-black/10 px-4 py-2 text-xs font-semibold text-black/70 hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSavingAddress}
                      className="rounded-xl bg-black px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-black/85 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90"
                    >
                      {isSavingAddress ? 'Saving...' : 'Save & Select Address'}
                    </button>
                  </div>
                </form>
              ) : (
                /* Select Saved Address Grid */
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    const fullAddr = [
                      addr.building,
                      addr.street,
                      addr.city,
                      addr.state,
                      addr.pincode,
                    ]
                      .filter(Boolean)
                      .join(', ');

                    return (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddressId(addr.id);
                        }}
                        className={`group relative flex cursor-pointer flex-col justify-between rounded-2xl border p-4 transition-all ${
                          isSelected
                            ? 'border-black bg-black/5 shadow-md dark:border-white dark:bg-white/10'
                            : 'border-black/10 bg-white hover:border-black/20 dark:border-white/10 dark:bg-[#1a1a1a] dark:hover:border-white/20'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="rounded-md bg-black/5 px-2 py-0.5 text-[10px] font-bold text-black/70 dark:bg-white/10 dark:text-white/70">
                              {addr.label || 'Address'}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                Default
                              </span>
                            )}
                          </div>

                          <h4 className="mt-2 text-xs font-bold text-black dark:text-white">
                            {addr.fullName}
                          </h4>
                          <p className="mt-0.5 text-[11px] text-black/60 dark:text-white/60">
                            {addr.phoneNumber}
                          </p>
                          <p className="mt-2 line-clamp-2 text-xs text-black/70 dark:text-white/70">
                            {fullAddr}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                          <div
                            className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all ${
                              isSelected
                                ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                                : 'border-black/30 dark:border-white/30'
                            }`}
                          >
                            {isSelected && <CheckIcon className="h-3 w-3" />}
                          </div>
                          <span className="text-xs font-semibold text-black/80 dark:text-white/80">
                            {isSelected ? 'Deliver to this address' : 'Select'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between border-t border-black/5 pt-5 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep('configure');
                  }}
                  className="rounded-xl border border-black/10 px-4 py-2.5 text-xs font-semibold text-black/70 hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
                >
                  ← Back to Item Details
                </button>
                <button
                  type="button"
                  disabled={!selectedAddressId}
                  onClick={handleProceedToPayment}
                  className="rounded-xl bg-black px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-black/85 disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment Details & Confirmation */}
          {currentStep === 'payment' && selectedProduct && selectedAddress && (
            <div className="mx-auto max-w-2xl space-y-6">
              <div>
                <h3 className="text-base font-bold text-black dark:text-white">
                  Review & Payment Details
                </h3>
                <p className="text-xs text-black/50 dark:text-white/50">
                  Select payment configuration and review the order summary before creating.
                </p>
              </div>

              {/* Order Summary Card */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Item Details */}
                <div className="rounded-2xl border border-black/10 bg-[#f8f9fa] p-4 dark:border-white/10 dark:bg-[#1a1a1a]">
                  <h4 className="mb-3 text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                    Product Summary
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
                      {getProductFirstImage(selectedProduct) ? (
                        <Image
                          src={getProductFirstImage(selectedProduct)}
                          alt={selectedProduct.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBagIcon className="h-6 w-6 text-black/30 dark:text-white/30" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-black dark:text-white">
                        {selectedProduct.name}
                      </h5>
                      <p className="mt-0.5 text-[11px] text-black/60 dark:text-white/60">
                        Size: <strong className="text-black dark:text-white">{selectedSize}</strong>{' '}
                        | Qty: <strong className="text-black dark:text-white">{quantity}</strong>
                      </p>
                      <p className="mt-1 text-xs font-extrabold text-black dark:text-white">
                        ₹{unitPrice.toLocaleString('en-IN')} × {quantity} = ₹
                        {totalPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Address Details */}
                <div className="rounded-2xl border border-black/10 bg-[#f8f9fa] p-4 dark:border-white/10 dark:bg-[#1a1a1a]">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                      Deliver To
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep('address');
                      }}
                      className="text-[11px] font-semibold text-black/60 hover:underline dark:text-white/60"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-xs font-bold text-black dark:text-white">
                    {selectedAddress.fullName}
                  </p>
                  <p className="text-[11px] text-black/60 dark:text-white/60">
                    {selectedAddress.phoneNumber}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-black/70 dark:text-white/70">
                    {[
                      selectedAddress.building,
                      selectedAddress.street,
                      selectedAddress.city,
                      selectedAddress.state,
                      selectedAddress.pincode,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>

              {/* Payment Settings */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'COD', label: 'Cash on Delivery (COD)' },
                      { id: 'RAZORPAY', label: 'Razorpay / Prepaid' },
                      { id: 'STRIPE', label: 'Stripe' },
                      { id: 'WALLET', label: 'Customer Wallet' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(m.id as any);
                          if (m.id === 'COD') {
                            setPaymentStatus('PENDING');
                          } else {
                            setPaymentStatus('SUCCESS');
                          }
                        }}
                        className={`rounded-xl border p-2.5 text-left text-xs font-bold transition-all ${
                          paymentMethod === m.id
                            ? 'border-black bg-black text-white shadow-xs dark:border-white dark:bg-white dark:text-black'
                            : 'border-black/10 bg-[#f8f9fa] text-black/80 hover:border-black/25 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white/80 dark:hover:border-white/25'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
                    Payment Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'PENDING', label: 'Pending / Unpaid' },
                      { id: 'SUCCESS', label: 'Paid / Success' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setPaymentStatus(s.id as any);
                        }}
                        className={`rounded-xl border p-2.5 text-left text-xs font-bold transition-all ${
                          paymentStatus === s.id
                            ? 'border-black bg-black text-white shadow-xs dark:border-white dark:bg-white dark:text-black'
                            : 'border-black/10 bg-[#f8f9fa] text-black/80 hover:border-black/25 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white/80 dark:hover:border-white/25'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total Summary & Submission */}
              <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-[#f8f9fa] p-5 dark:border-white/10 dark:bg-[#1a1a1a]">
                <div>
                  <span className="text-xs text-black/50 dark:text-white/50">Total Amount Due</span>
                  <div className="text-2xl font-black text-black dark:text-white">
                    ₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    disabled={isSubmittingOrder}
                    onClick={() => {
                      setCurrentStep('address');
                    }}
                    className="rounded-xl border border-black/10 px-4 py-2.5 text-xs font-semibold text-black/70 hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={isSubmittingOrder}
                    onClick={handleFinalSubmitOrder}
                    className="flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-black/85 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90"
                  >
                    {isSubmittingOrder ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white dark:border-black/20 dark:border-t-black" />
                    ) : (
                      'Confirm & Create Order'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
