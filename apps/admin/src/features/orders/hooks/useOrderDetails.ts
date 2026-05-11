// eslint-disable-next-line unicorn/filename-case
import { useState } from 'react';

import { type Order } from '../types';

export function useOrderDetails(order: Order) {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const [trackingId, setTrackingId] = useState(order.tracking?.trackingId || '');
  const [courierService, setCourierService] = useState<string>(
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    order.tracking?.courierService || 'Delhivery',
  );
  const [assignedSeller, setAssignedSeller] = useState('Seller A');
  const [orderStatus, setOrderStatus] = useState<string>(order.status);
  const [isTrackingSaved, setIsTrackingSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [contactMode, setContactMode] = useState<'none' | 'call' | 'whatsapp'>('none');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string>(order.status);
  const [tempCourier, setTempCourier] = useState<string>(
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    order.tracking?.courierService || 'Delhivery',
  );
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const [tempTracking, setTempTracking] = useState(order.tracking?.trackingId || '');
  const [tempSeller, setTempSeller] = useState('Seller A');
  const [isEditingMeta, setIsEditingMeta] = useState(false);

  const handleContactClick = (mode: 'call' | 'whatsapp') => {
    if (order.customer.altPhone) {
      setContactMode(mode);
    } else {
      executeContact(mode, order.customer.phone);
    }
  };

  const executeContact = (mode: 'call' | 'whatsapp', phone: string) => {
    const cleanPhone = phone.replace(/[\s+]/g, '');
    const waPhone = phone.replace(/\D/g, '');
    if (mode === 'call') {
      window.open(`tel:${cleanPhone}`, '_self');
    } else {
      window.open(`https://wa.me/${waPhone}`, '_blank');
    }
    setContactMode('none');
  };

  const handleSaveTracking = () => {
    setIsTrackingSaved(true);
    setTimeout(() => {
      setIsTrackingSaved(false);
    }, 3000);
  };

  const getOrderSummaryText = () => {
    const itemsText = order.items
      .map(
        (item) =>
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          `Product Name: ${item.productName}\nSize: ${item.size || 'N/A'}\nColor: ${item.color || 'N/A'}\nQty: ${item.quantity}`,
      )
      .join('\n\n');

    return `📝 Order Details Form

Full Name : ${order.customer.name}
Address : ${order.shippingAddress.street}
City : ${order.shippingAddress.city}
// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
District : ${order.shippingAddress.district || 'N/A'}
State : ${order.shippingAddress.state}
Pincode: ${order.shippingAddress.pincode}
Mobile Number : ${order.customer.phone}
// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
Alt Number : ${order.customer.altPhone || 'N/A'}

${itemsText}

Total: ₹${order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${order.paymentType.toUpperCase()})
`;
  };

  const copyImageToClipboard = async (imageUrl: string) => {
    try {
      const img = new globalThis.Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            // eslint-disable-next-line no-console
            console.log('Image copied to clipboard successfully!');
          } catch (clipboardErr) {
            console.error('Clipboard write failed:', clipboardErr);
          }
        }
      }, 'image/png');
    } catch (err) {
      console.error('Failed to process image for clipboard:', err);
    }
  };

  const handleCopy = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    navigator.clipboard.writeText(getOrderSummaryText());
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleWhatsApp = async () => {
    const text = encodeURIComponent(getOrderSummaryText());
    if (order.items.length > 0 && order.items[0].productImage) {
      await copyImageToClipboard(order.items[0].productImage);
    }
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleInquiryWhatsApp = async () => {
    if (order.items.length === 0) {
      return;
    }
    const item = order.items[0];
    const text = encodeURIComponent(
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      `*Product Name:* ${item.productName}\n\n*Quantity:* ${item.quantity}\n\n*Size:* ${item.size || 'N/A'}\n*Color:* ${item.color || 'N/A'} \n\n*Order ID:* ${order.orderNumber}`,
    );

    if (item.productImage) {
      await copyImageToClipboard(item.productImage);
    }
    window.open(`https://api.whatsapp.com/send?phone=917558969093&text=${text}`, '_blank');
  };

  return {
    trackingId,
    setTrackingId,
    courierService,
    setCourierService,
    assignedSeller,
    setAssignedSeller,
    orderStatus,
    setOrderStatus,
    isTrackingSaved,
    isCopied,
    contactMode,
    setContactMode,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    pendingStatus,
    setPendingStatus,
    tempCourier,
    setTempCourier,
    tempTracking,
    setTempTracking,
    tempSeller,
    setTempSeller,
    isEditingMeta,
    setIsEditingMeta,
    handleContactClick,
    executeContact,
    handleSaveTracking,
    handleCopy,
    handleWhatsApp,
    handleInquiryWhatsApp,
  };
}
