'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { createAddressAction, fetchUserAddressesAction } from '@/features/addresses';
import { useCart } from '@/features/cart';
import { useAuthStore } from '@/store/auth-store';

import { type AddressDetails } from '../types';

export function useCheckoutReview() {
  const [address, setAddress] = useState<AddressDetails | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!user;
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const { cartItems, totals, isMounted } = useCart();

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  useEffect(() => {
    async function loadDefaultAddress() {
      try {
        const savedAddresses = await fetchUserAddressesAction();
        if (savedAddresses.length > 0) {
          const defaultOrFirst = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
          setAddress({
            pincode: defaultOrFirst.pincode,
            city: defaultOrFirst.city,
            area: defaultOrFirst.addressLine2,
            landmark: defaultOrFirst.landmark || '',
            building: defaultOrFirst.addressLine1,
            recipientName: defaultOrFirst.name,
            primaryPhone: defaultOrFirst.phone,
            altPhone: defaultOrFirst.altPhone || '',
          });
        }
      } catch (err) {
        console.error('Failed to load user address in checkout:', err);
      }
    }
    void loadDefaultAddress();
  }, [user]);

  const pricing = {
    subtotal: totals.subtotal,
    discount: totals.discount,
    total: totals.total,
    itemCount: totals.itemCount,
  };

  const router = useRouter();

  const handleSaveAddress = useCallback(
    async (data: AddressDetails) => {
      setAddress(data);
      setShowAddressForm(false);

      if (isAuthenticated) {
        try {
          await createAddressAction({
            name: data.recipientName,
            phone: data.primaryPhone,
            altPhone: data.altPhone || undefined,
            pincode: data.pincode,
            addressLine1: data.building,
            addressLine2: data.area,
            landmark: data.landmark || undefined,
            city: data.city,
            district: 'Malappuram',
            state: 'Kerala',
            type: 'Home',
            isDefault: true,
          });
        } catch (err) {
          console.error('Failed to persist checkout address:', err);
        }
      }
    },
    [isAuthenticated],
  );

  const handleContinue = useCallback(() => {
    if (!address) {
      setShowAddressForm(true);
    } else if (!isLoggedIn) {
      setShowOTPModal(true);
    } else {
      router.push('/checkout/payment');
    }
  }, [address, isLoggedIn, router]);

  return {
    address,
    setAddress,
    handleSaveAddress,
    showAddressForm,
    setShowAddressForm,
    isExpanded,
    setIsExpanded,
    isLoggedIn,
    setIsLoggedIn,
    showOTPModal,
    setShowOTPModal,
    pricing,
    cartItems,
    isMounted,
    handleContinue,
  };
}
