import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { api } from '@/lib/api-client';

import { type SelectOption } from '../../../components/ui/CustomSelect';
import { type Order } from '../types';

export function useOrderDetails(order: Order) {
  const [trackingId, setTrackingId] = useState(order.tracking?.trackingId ?? '');
  const initialSeller =
    (order as any).seller?.storeName ||
    (order as any).seller?.name ||
    order.items?.find((i: any) => i.seller)?.seller?.storeName ||
    order.items?.find((i: any) => i.seller)?.seller?.name ||
    '';
  const [courierService, setCourierService] = useState<string>(
    order.tracking?.courierService ?? 'Delhivery',
  );
  const [assignedSeller, setAssignedSeller] = useState(initialSeller);
  const [orderStatus, setOrderStatus] = useState<string>(order.status);
  const [isTrackingSaved, setIsTrackingSaved] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [contactMode, setContactMode] = useState<'none' | 'call' | 'whatsapp'>('none');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string>(order.status);
  const [tempCourier, setTempCourier] = useState<string>(
    order.tracking?.courierService ?? 'Delhivery',
  );
  const [tempTracking, setTempTracking] = useState(order.tracking?.trackingId ?? '');
  const [tempSeller, setTempSeller] = useState(initialSeller);
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [rawSellers, setRawSellers] = useState<any[]>([]);
  const [sellerOptions, setSellerOptions] = useState<SelectOption[]>([
    { label: 'Unassigned', value: '' },
  ]);
  const router = useRouter();

  useEffect(() => {
    async function loadSellers() {
      try {
        const res: any = await api.get('/admin/sellers');
        const list: any[] = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
        setRawSellers(list);

        if (list.length > 0) {
          const orderProductIds = new Set(
            (order.items || []).map((i: any) => i.productId).filter(Boolean),
          );
          const orderProductSellerIds = new Set(
            (order.items || [])
              .map((i: any) => i.productSellerId || i.sellerId || i.seller?.id)
              .filter(Boolean),
          );
          const orderCategoryIds = new Set(
            (order.items || []).map((i: any) => i.categoryId).filter(Boolean),
          );
          const orderCategoryNames = new Set(
            (order.items || [])
              .map((i: any) => i.categoryName?.toLowerCase())
              .filter(Boolean),
          );

          const productSellers: any[] = [];
          const categorySellers: any[] = [];
          const otherSellers: any[] = [];

          for (const seller of list) {
            const isProductSeller =
              orderProductSellerIds.has(seller.id) ||
              (seller.products && seller.products.some((p: any) => orderProductIds.has(p.id)));

            if (isProductSeller) {
              productSellers.push(seller);
              continue;
            }

            const isCategorySeller =
              seller.categories &&
              seller.categories.some(
                (c: any) =>
                  orderCategoryIds.has(c.id) ||
                  (c.name && orderCategoryNames.has(c.name.toLowerCase())),
              );

            if (isCategorySeller) {
              categorySellers.push(seller);
              continue;
            }

            otherSellers.push(seller);
          }

          const formatOption = (s: any, group: string, badge?: string): SelectOption => ({
            label: s.storeName ? `${s.storeName} (${s.name})` : s.name,
            value: s.storeName || s.name,
            group,
            badge,
          });

          const options: SelectOption[] = [
            { label: 'Unassigned', value: '' },
            ...productSellers.map((s) => formatOption(s, 'Product Sellers', 'Product Seller')),
            ...categorySellers.map((s) => formatOption(s, 'Category Sellers', 'Category Seller')),
            ...otherSellers.map((s) => formatOption(s, 'Other Sellers')),
          ];

          setSellerOptions(options);

          if (!initialSeller && productSellers.length > 0) {
            const defaultSeller = productSellers[0].storeName || productSellers[0].name;
            setAssignedSeller(defaultSeller);
            setTempSeller(defaultSeller);
          }
        }
      } catch (err) {
        console.error('Failed to load sellers:', err);
      }
    }
    void loadSellers();
  }, [order]);

  const handleDeleteOrder = async () => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }
    try {
      await api.delete(`/orders/${order.id}`);
      router.push('/orders'); // Redirect to orders list
    } catch (err) {
      console.error('Failed to delete order:', err);
      alert('Failed to delete order');
    }
  };

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

  const handleSaveTracking = async () => {
    const matchedSeller = rawSellers.find(
      (s) => s.storeName === assignedSeller || s.name === assignedSeller || s.id === assignedSeller,
    );
    try {
      await api.patch(`/orders/${order.id}`, {
        courierPartner: courierService,
        trackingNumber: trackingId,
        sellerId: matchedSeller?.id || null,
      });
    } catch (e) {
      console.error(e);
    }
    setIsTrackingSaved(true);
    setTimeout(() => {
      setIsTrackingSaved(false);
    }, 3000);
  };

  const getOrderSummaryText = () => {
    const itemsText = order.items
      .map(
        (item) =>
          `Product Name: ${item.productName}\nSize: ${item.size ?? 'N/A'}\nColor: ${item.color ?? 'N/A'}\nQty: ${item.quantity}`,
      )
      .join('\n\n');

    return `📝 Order Details Form

Full Name : ${order.customer.name}
Address : ${order.shippingAddress.street}
City : ${order.shippingAddress.city}
District : ${order.shippingAddress.district ?? 'N/A'}
State : ${order.shippingAddress.state}
Pincode: ${order.shippingAddress.pincode}
Mobile Number : ${order.customer.phone}
Alt Number : ${order.customer.altPhone ?? 'N/A'}

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
    void navigator.clipboard.writeText(getOrderSummaryText());
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
      `*Product Name:* ${item.productName}\n\n*Quantity:* ${item.quantity}\n\n*Size:* ${item.size ?? 'N/A'}\n*Color:* ${item.color ?? 'N/A'} \n\n*Order ID:* ${order.orderNumber}`,
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
    sellerOptions,
    isEditingMeta,
    setIsEditingMeta,
    handleContactClick,
    executeContact,
    handleSaveTracking,
    handleCopy,
    handleWhatsApp,
    handleInquiryWhatsApp,
    handleDeleteOrder,
  };
}
