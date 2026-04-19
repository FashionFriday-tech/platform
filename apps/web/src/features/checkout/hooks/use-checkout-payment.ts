'use client';

import { useMemo, useState } from 'react';

export function useCheckoutPayment() {
  const [paymentMethod, setPaymentMethod] = useState<'prepay' | 'cod'>('prepay');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Pricing Logic
  const baseTotal = 3798;
  const codServiceFee = 200;
  const totalAmount = useMemo(() => {
    return paymentMethod === 'cod' ? baseTotal + codServiceFee : baseTotal;
  }, [paymentMethod]);

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
  };
}
