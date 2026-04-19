'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import { type AddressDetails } from '../types';

export function useCheckoutReview() {
  const [address, setAddress] = useState<AddressDetails | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const pricing = { subtotal: 4048, discount: 250, total: 3798 };
  const router = useRouter();

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
    showAddressForm,
    setShowAddressForm,
    isExpanded,
    setIsExpanded,
    isLoggedIn,
    setIsLoggedIn,
    showOTPModal,
    setShowOTPModal,
    pricing,
    handleContinue,
  };
}
