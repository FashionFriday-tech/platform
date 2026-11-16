'use client';

import { useEffect, useMemo, useState } from 'react';
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
  const codServiceFee = 200;
  const totalAmount = useMemo(() => {
    const finalVal = paymentMethod === 'cod' ? baseTotal + codServiceFee : baseTotal;
    console.log('[useCheckoutPayment] Calculated pricing:', {
      itemCount: cartItems.length,
      baseTotal,
      paymentMethod,
      codServiceFee: paymentMethod === 'cod' ? codServiceFee : 0,
      totalAmount: finalVal,
    });
    return finalVal;
  }, [paymentMethod, baseTotal, cartItems.length]);

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
    codServiceFee,
    totalAmount,
    cartItems,
  };
}
