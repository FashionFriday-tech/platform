'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { fetchUserAddressesAction } from '@/features/addresses/services/addresses.actions';
import { useCart } from '@/features/cart';
import { useAuthStore } from '@/store/auth-store';

import { type AddressDetails } from '../types';

export function useCheckoutPayment() {
  const [paymentMethod, setPaymentMethod] = useState<'prepay' | 'cod'>('prepay');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<AddressDetails | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('checkout_shipping_address');
        if (stored) {
          return JSON.parse(stored) as AddressDetails;
        }
      } catch {
        // ignore
      }
    }
    return null;
  });
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const { totals, cartItems } = useCart();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    async function resolveAddress() {
      if (shippingAddress?.id || shippingAddress?.pincode) {
        return;
      }
      if (!user) {
        return;
      }

      setIsLoadingAddress(true);
      try {
        const targetId = searchParams?.get('addressId');
        const addresses = await fetchUserAddressesAction();
        if (addresses.length > 0) {
          const matched = targetId
            ? addresses.find((a) => a.id === targetId) ||
              addresses.find((a) => a.isDefault) ||
              addresses[0]
            : addresses.find((a) => a.isDefault) || addresses[0];

          if (matched) {
            const resolved: AddressDetails = {
              id: matched.id,
              pincode: matched.pincode,
              city: matched.city,
              area: matched.addressLine2,
              district: matched.district || '',
              state: matched.state || '',
              landmark: matched.landmark || '',
              building: matched.addressLine1 || '',
              recipientName: matched.name,
              primaryPhone: matched.phone,
              altPhone: matched.altPhone || '',
            };
            setShippingAddress(resolved);
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('checkout_shipping_address', JSON.stringify(resolved));
            }
          }
        }
      } catch (err) {
        console.error('Failed to resolve checkout address on payment step:', err);
      } finally {
        setIsLoadingAddress(false);
      }
    }

    void resolveAddress();
  }, [user, searchParams, shippingAddress]);

  // Dynamic pricing based on active cart
  const baseTotal = totals.total > 0 ? totals.total : totals.subtotal;
  const codAdvanceAmount = 200;
  // For COD, the amount to collect online right now is ₹200 (or baseTotal if under ₹200 for testing)
  const codPayableNow = Math.min(codAdvanceAmount, baseTotal > 0 ? baseTotal : codAdvanceAmount);
  const payableAmount = paymentMethod === 'cod' ? codPayableNow : baseTotal;
  const balanceDue = paymentMethod === 'cod' ? Math.max(0, baseTotal - codPayableNow) : 0;
  const totalAmount = baseTotal;

  useEffect(() => {
    console.log('[useCheckoutPayment] Calculated pricing:', {
      itemCount: cartItems.length,
      baseTotal,
      paymentMethod,
      payableAmount,
      balanceDue,
      totalAmount,
    });
  }, [cartItems.length, baseTotal, paymentMethod, payableAmount, balanceDue, totalAmount]);

  return {
    paymentMethod,
    setPaymentMethod,
    isExpanded,
    setIsExpanded,
    showInfo,
    setShowInfo,
    shippingAddress,
    setShippingAddress,
    isLoadingAddress,
    baseTotal,
    codServiceFee: 0,
    codAdvanceAmount,
    codPayableNow,
    payableAmount,
    balanceDue,
    totalAmount,
    cartItems,
  };
}
