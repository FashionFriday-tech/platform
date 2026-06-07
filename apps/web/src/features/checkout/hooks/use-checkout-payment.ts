'use client';

import { useMemo, useState } from 'react';
import { useCart } from '@/features/cart';

export function useCheckoutPayment() {
  const [paymentMethod, setPaymentMethod] = useState<'prepay' | 'cod'>('prepay');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const { totals, cartItems } = useCart();

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
    baseTotal,
    codServiceFee,
    totalAmount,
    cartItems,
  };
}
