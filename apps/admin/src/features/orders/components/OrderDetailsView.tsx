'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ShoppingBagIcon } from '@ff/ui';
import { PhoneIcon, WhatsAppIcon } from '@ff/ui/icons';
import { motion } from 'motion/react';

import { canManageOrders, useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';
import { resolveItemColorAndQuality } from '@/lib/format-color';

import { CustomSelect, type SelectOption } from '../../../components/ui/CustomSelect';
import { type Order } from '../types';
import { COURIER_SERVICES, getTrackingUrl } from '../utils/courier';
import { EditOrderModal, type EditOrderTab } from './EditOrderModal';
import { OrderStatusBadge } from './OrderStatusBadge';
import { RefundTimelineModal } from './RefundTimelineModal';

interface StepConfig {
  key: string;
  label: string;
}

const REAL_STEPS: StepConfig[] = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'stock_check', label: 'Stock Check' },
  { key: 'stock_confirmed', label: 'Stock Confirmed' },
  { key: 'processing', label: 'Placed with Seller' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

const CANCELLED_STEPS: StepConfig[] = [
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'refunded', label: 'Refunded' },
];

function OrderStatusTracker({ status }: { status: string }) {
  const normalizedStatus = (status || '').toLowerCase().trim();
  const isCancelledFlow = ['cancelled', 'refunding', 'refunded'].includes(normalizedStatus);
  const steps = isCancelledFlow ? CANCELLED_STEPS : REAL_STEPS;
  const matchedIndex = steps.findIndex((s) => s.key === normalizedStatus);
  const currentStepIndex = matchedIndex >= 0 ? matchedIndex : 0;
  const progressPercent = steps.length > 1 ? (currentStepIndex / (steps.length - 1)) * 100 : 100;

  return (
    <div className="relative flex w-full flex-col overflow-x-auto pb-2 scrollbar-hide">
      <div className="relative flex min-w-[560px] sm:min-w-full items-center justify-between px-4 sm:px-6">
        {/* Connecting Line background */}
        <div className="absolute top-4 right-6 left-6 h-0.5 -translate-y-1/2 bg-zinc-200 dark:bg-zinc-800" />

        {/* Active Connecting Line */}
        <div
          className="absolute top-4 left-6 h-0.5 -translate-y-1/2 bg-emerald-500 transition-all duration-500"
          style={{
            width: `calc(${progressPercent}% - 3rem * ${(progressPercent / 100).toFixed(2)})`,
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${isCompleted
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                  : isActive
                    ? 'bg-black text-white ring-4 ring-black/10 dark:bg-white dark:text-black dark:ring-white/20'
                    : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600'
                  }`}
              >
                {isCompleted ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : isActive ? (
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white dark:bg-black" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                )}
              </div>
              <span
                className={`mt-2.5 text-center text-[11px] whitespace-nowrap transition-colors ${isActive
                  ? 'rounded-full bg-black/5 px-2.5 py-0.5 font-extrabold text-black dark:bg-white/10 dark:text-white'
                  : isCompleted
                    ? 'font-bold text-emerald-600 dark:text-emerald-400'
                    : 'font-medium text-zinc-400 dark:text-zinc-500'
                  }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface OrderDetailsViewProps {
  order: Order;
  onOrderUpdated?: (order: Order) => void;
}

export function OrderDetailsView({ order, onOrderUpdated }: OrderDetailsViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const canEdit = canManageOrders(user?.role);

  const [currentOrder, setCurrentOrder] = useState<Order>(order);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [editModalTab, setEditModalTab] = useState<EditOrderTab>('items');

  useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

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
  const normalizedStatus = (orderStatus || '').toLowerCase().trim();
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

  const handleOrderUpdated = (updated: Order) => {
    setCurrentOrder(updated);
    setOrderStatus(updated.status);
    setPendingStatus(updated.status);
    setCourierService(updated.tracking?.courierService || 'Delhivery');
    setTrackingId(updated.tracking?.trackingId || '');
    const updatedSeller =
      (updated as any).seller?.storeName ||
      (updated as any).seller?.name ||
      updated.items?.find((i: any) => i.seller)?.seller?.storeName ||
      updated.items?.find((i: any) => i.seller)?.seller?.name ||
      '';
    setAssignedSeller(updatedSeller);
    if (onOrderUpdated) {
      onOrderUpdated(updated);
    }
  };

  useEffect(() => {
    async function loadSellers() {
      try {
        const res: any = await api.get('/admin/sellers');
        const list: any[] = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        setRawSellers(list);

        if (list.length > 0) {
          // 1. Gather all product IDs, product seller IDs, and category IDs/names from order items
          const orderProductIds = new Set(
            (currentOrder.items || []).map((i: any) => i.productId).filter(Boolean),
          );
          const orderProductSellerIds = new Set(
            (currentOrder.items || [])
              .map((i: any) => i.productSellerId || i.sellerId || i.seller?.id)
              .filter(Boolean),
          );
          const orderCategoryIds = new Set(
            (currentOrder.items || []).map((i: any) => i.categoryId).filter(Boolean),
          );
          const orderCategoryNames = new Set(
            (currentOrder.items || [])
              .map((i: any) => i.categoryName?.toLowerCase())
              .filter(Boolean),
          );

          // 2. Classify into 3 tiers:
          // Top: Product Sellers
          // Middle: Category Sellers
          // Bottom: Other Sellers
          const productSellers: any[] = [];
          const categorySellers: any[] = [];
          const otherSellers: any[] = [];

          for (const seller of list) {
            const isProductSeller =
              orderProductSellerIds.has(seller.id) ||
              seller.products?.some((p: any) => orderProductIds.has(p.id));

            if (isProductSeller) {
              productSellers.push(seller);
              continue;
            }

            const isCategorySeller = seller.categories?.some(
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

          // Auto-select product seller if unassigned and exactly one product seller exists
          if (!initialSeller && productSellers.length > 0) {
            const defaultSeller = productSellers[0].storeName || productSellers[0].name;
            setAssignedSeller(defaultSeller);
            setTempSeller(defaultSeller);
          }
        }
      } catch (err) {
        console.error('Failed to load sellers in order details:', err);
      }
    }
    void loadSellers();
  }, [currentOrder, initialSeller]);

  const updateOrderOnBackend = async (patchData: {
    status?: string;
    courierPartner?: string;
    trackingNumber?: string;
    sellerId?: string;
  }) => {
    try {
      setIsUpdatingStatus(true);
      const upperStatus = patchData.status ? patchData.status.toUpperCase() : undefined;
      const updatedData: any = await api.patch(`/orders/${currentOrder.id}`, {
        ...(upperStatus ? { status: upperStatus } : {}),
        courierPartner: patchData.courierPartner,
        trackingNumber: patchData.trackingNumber,
        sellerId: patchData.sellerId,
      });

      if (patchData.status) {
        setOrderStatus(patchData.status.toLowerCase());
        setPendingStatus(patchData.status.toLowerCase());
      }
      if (patchData.courierPartner) {
        setCourierService(patchData.courierPartner);
      }
      if (patchData.trackingNumber !== undefined) {
        setTrackingId(patchData.trackingNumber);
      }

      if (updatedData) {
        handleOrderUpdated({
          ...currentOrder,
          ...updatedData,
          status: (updatedData.status || currentOrder.status).toLowerCase(),
        });
      }

      setIsUpdateModalOpen(false);
    } catch (err: any) {
      console.error('Failed to update order:', err);
      alert(err.message || 'Failed to update order on server');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSendTrackingToCustomer = () => {
    const rawPhone = currentOrder.customer?.phone || '';
    const cleanPhone = rawPhone.replace(/\D/g, '');
    const currentTrackUrl = getTrackingUrl(courierService, trackingId);
    const message = encodeURIComponent(
      `Hello ${currentOrder.customer?.name || 'Customer'}! 👋\n\nGreat news! Your Fashion Friday order *#${currentOrder.orderNumber}* has been shipped via *${courierService}*!\n\n📦 *Tracking Number:* ${trackingId || 'N/A'}\n🔗 *Live Tracking Link:* ${currentTrackUrl}\n\nThank you for shopping with us! ✨`,
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleContactClick = (mode: 'call' | 'whatsapp') => {
    if (currentOrder.customer.altPhone) {
      setContactMode(mode);
    } else {
      executeContact(mode, currentOrder.customer.phone);
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

  const trackingUrl = getTrackingUrl(courierService, trackingId);

  const handleSaveTracking = async () => {
    const matchedSeller = rawSellers.find(
      (s) => s.storeName === assignedSeller || s.name === assignedSeller || s.id === assignedSeller,
    );
    await updateOrderOnBackend({
      courierPartner: courierService,
      trackingNumber: trackingId,
      sellerId: matchedSeller?.id || null,
    });
    setIsTrackingSaved(true);
    setTimeout(() => {
      setIsTrackingSaved(false);
    }, 3000);
  };

  const handleConfirmStock = async () => {
    try {
      setIsUpdatingStatus(true);
      await api.post(`/orders/${currentOrder.id}/confirm-stock`, {});
      setOrderStatus('stock_confirmed');
      alert('Stock confirmed! Payment captured successfully on Razorpay.');
    } catch (err: any) {
      console.error('Failed to confirm stock:', err);
      alert(err.message || 'Failed to confirm stock and capture payment');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRejectStock = async () => {
    if (
      window.confirm(
        'Are you sure this product is OUT OF STOCK? Payment authorization will be released back to customer with ZERO gateway fees.',
      )
    ) {
      try {
        setIsUpdatingStatus(true);
        await api.post(`/orders/${currentOrder.id}/reject-stock`, { reason: 'Out of stock' });
        setOrderStatus('cancelled');
        alert('Order cancelled! Authorized funds released at ₹0 fee.');
      } catch (err: any) {
        console.error('Failed to reject stock:', err);
        alert(err.message || 'Failed to cancel order');
      } finally {
        setIsUpdatingStatus(false);
      }
    }
  };

  const getOrderSummaryText = () => {
    const itemsText = currentOrder.items
      .map((item) => {
        const { color: cName, quality: qName } = resolveItemColorAndQuality(item);
        const parts = [`Product Name: ${item.productName}`, `Size: ${item.size ?? 'N/A'}`];
        if (cName) parts.push(`Color: ${cName}`);
        if (qName) parts.push(`Quality: ${qName}`);
        parts.push(`Qty: ${item.quantity}`);
        return parts.join('\n');
      })
      .join('\n\n');

    const bld = currentOrder.shippingAddress.building
      ? `${currentOrder.shippingAddress.building}, `
      : '';
    const lmk = currentOrder.shippingAddress.landmark
      ? ` (Landmark: ${currentOrder.shippingAddress.landmark})`
      : '';

    return `📝 Order Details Form

Full Name : ${currentOrder.customer.name}
Address : ${bld}${currentOrder.shippingAddress.street}${lmk}
City : ${currentOrder.shippingAddress.city}
District : ${currentOrder.shippingAddress.district ?? 'N/A'}
State : ${currentOrder.shippingAddress.state}
Pincode: ${currentOrder.shippingAddress.pincode}
Mobile Number : ${currentOrder.customer.phone}
Alt Number : ${currentOrder.customer.altPhone ?? 'N/A'}

${itemsText}

Total: ₹${(Number(currentOrder.finalAmount ?? currentOrder.total) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${currentOrder.paymentType.toUpperCase()})
`;
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(getOrderSummaryText());
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const copyImageToClipboard = async (imageUrl: string) => {
    try {
      // The Clipboard API only accepts 'image/png'. We must convert the image (which might be jpeg/webp) to png via Canvas.
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

  const handleWhatsApp = async () => {
    const text = encodeURIComponent(getOrderSummaryText());

    // Automatically copy the first product's image to clipboard so the user can just hit Paste in WhatsApp
    if (currentOrder.items.length > 0 && currentOrder.items[0].productImage) {
      await copyImageToClipboard(currentOrder.items[0].productImage);
    }

    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleInquiryWhatsApp = async () => {
    if (currentOrder.items.length === 0) {
      return;
    }
    const item = currentOrder.items[0];
    const { color: cName, quality: qName } = resolveItemColorAndQuality(item);
    const textLines = [
      `*Product Name:* ${item.productName}`,
      `*Quantity:* ${item.quantity}`,
      `*Size:* ${item.size ?? 'N/A'}`,
    ];
    if (cName) textLines.push(`*Color:* ${cName}`);
    if (qName) textLines.push(`*Quality:* ${qName}`);
    textLines.push(`*Order ID:* ${currentOrder.orderNumber}`);

    const text = encodeURIComponent(textLines.join('\n\n'));

    if (item.productImage) {
      await copyImageToClipboard(item.productImage);
    }

    window.open(`https://api.whatsapp.com/send?phone=917558969093&text=${text}`, '_blank');
  };

  const courierOptions = COURIER_SERVICES.map((c) => ({ label: c, value: c }));

  return (
    <div className="scrollbar-hide mx-auto flex h-full w-full max-w-6xl flex-col gap-4 sm:gap-6 overflow-y-auto p-3 sm:p-6 md:p-8">
      {/* Top Section: Unified Order Command Card */}
      <div className="flex flex-col gap-5 sm:gap-6 rounded-2xl sm:rounded-3xl bg-white p-4 shadow-sm sm:p-8 dark:bg-[#141414]">
        {/* Header row: Order ID, Status Badge & Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-black dark:text-white">
              Order #{currentOrder.orderNumber}
            </h1>
            <OrderStatusBadge status={orderStatus as any} />
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setIsRefundModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold text-emerald-700 shadow-xs transition-all hover:bg-emerald-500/20 active:scale-95 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400"
              title="View live Razorpay refund timeline, settlement stages and Bank RRN"
            >
              <span>↺</span>
              <span className="whitespace-nowrap">Refund Timeline</span>
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={() => {
                  setEditModalTab('items');
                  setIsEditModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
              >
                <span>✏️</span>
                <span className="whitespace-nowrap">Edit Order</span>
              </button>
            )}
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete this order?')) {
                  try {
                    await api.delete(`/orders/${currentOrder.id}`);
                    router.push('/orders');
                  } catch (err) {
                    console.error('Failed to delete order', err);
                    alert('Failed to delete order');
                  }
                }
              }}
              className="rounded-xl bg-red-500/10 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold text-red-600 transition-all hover:bg-red-500/20 active:scale-95 dark:bg-red-500/15 dark:text-red-400"
            >
              Delete
            </button>
            <button
              onClick={() => {
                setIsUpdateModalOpen(true);
              }}
              className="rounded-xl bg-black px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-black/80 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/80"
            >
              Update Status
            </button>
          </div>
        </div>

        {/* Status Tracker Progress Bar */}
        <div className="w-full py-2">
          <OrderStatusTracker status={orderStatus} />
        </div>

        {/* Dynamic Action Sub-bar */}
        <div className="flex flex-col gap-4 rounded-2xl bg-zinc-50 p-3.5 sm:p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm dark:bg-zinc-800">
              {normalizedStatus === 'pending' && '🔍'}
              {normalizedStatus === 'confirmed' && '🛒'}
              {normalizedStatus === 'processing' && '⏳'}
              {normalizedStatus === 'shipped' && '🚚'}
              {normalizedStatus === 'delivered' && '🎉'}
              {['cancelled', 'refunding', 'refunded'].includes(normalizedStatus) && '❌'}
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                Next Recommended Step
              </div>
              <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {normalizedStatus === 'pending' && 'Check stock with seller'}
                {normalizedStatus === 'confirmed' && 'Stock confirmed — place order with seller'}
                {normalizedStatus === 'processing' && 'Placed with seller — awaiting tracking ID'}
                {normalizedStatus === 'shipped' &&
                  'Package shipped — share live tracking with customer'}
                {normalizedStatus === 'delivered' && 'Order completed & delivered 🎉'}
                {['cancelled', 'refunding', 'refunded'].includes(normalizedStatus) &&
                  'Order has been cancelled'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {(normalizedStatus === 'pending' || normalizedStatus === 'stock_check') && (
              <>
                <button
                  onClick={handleInquiryWhatsApp}
                  title="Send product image and details to seller WhatsApp to check stock availability"
                  className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95"
                >
                  📲 Inquire Stock (WhatsApp)
                </button>
                <button
                  disabled={isUpdatingStatus}
                  onClick={handleConfirmStock}
                  className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl bg-black px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-black/80 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
                >
                  ✅ Stock Available (Capture Payment)
                </button>
                <button
                  disabled={isUpdatingStatus}
                  onClick={handleRejectStock}
                  className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl bg-red-600/10 px-3.5 sm:px-4 py-2 text-xs font-bold text-red-600 transition-all hover:bg-red-600/20 active:scale-95 disabled:opacity-50 dark:bg-red-500/15 dark:text-red-400"
                >
                  ❌ Out of Stock (Void ₹0)
                </button>
              </>
            )}

            {(normalizedStatus === 'confirmed' || normalizedStatus === 'stock_confirmed') && (
              <>
                <button
                  onClick={handleWhatsApp}
                  title="Send complete order details and image to supplier via WhatsApp"
                  className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95"
                >
                  📲 Send Details to Seller
                </button>
                <button
                  disabled={isUpdatingStatus}
                  onClick={() => updateOrderOnBackend({ status: 'processing' })}
                  className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl bg-black px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-black/80 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
                >
                  🛒 Placed with Seller
                </button>
              </>
            )}

            {normalizedStatus === 'processing' && (
              <button
                onClick={() => {
                  setPendingStatus('shipped');
                  setIsUpdateModalOpen(true);
                }}
                className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
              >
                📦 Add Tracking ID & Ship
              </button>
            )}

            {normalizedStatus === 'shipped' && (
              <>
                <button
                  onClick={handleSendTrackingToCustomer}
                  title="Send WhatsApp message to customer with tracking ID and live tracking link"
                  className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95"
                >
                  💬 Send Tracking to Customer
                </button>
                {trackingUrl && (
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
                  >
                    🚚 Track Parcel
                  </a>
                )}
                <button
                  disabled={isUpdatingStatus}
                  onClick={() => updateOrderOnBackend({ status: 'delivered' })}
                  className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl bg-black px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-black/80 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
                >
                  🎉 Mark Delivered
                </button>
              </>
            )}

            {['cancelled', 'refunding', 'refunded'].includes(normalizedStatus) && (
              <button
                type="button"
                onClick={() => setIsRefundModalOpen(true)}
                className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95"
              >
                <span>↺</span>
                <span>View Refund Timeline & Bank RRN</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content Area (Items & Finance) */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Items Card */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-[#141414]">
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-black dark:text-white">Order Items</h2>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {currentOrder.items.length}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditModalTab('items');
                      setIsEditModalOpen(true);
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Edit Items
                  </button>
                )}
                <span className="text-xs font-semibold text-zinc-400">
                  #{currentOrder.orderNumber}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-4 sm:p-6 pt-0">
              {currentOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative flex flex-col gap-4 sm:gap-6 rounded-2xl bg-zinc-50/80 p-3.5 sm:p-4 transition-all hover:bg-zinc-100/80 sm:flex-row sm:items-start sm:pr-28 md:sm:pr-32 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/70"
                >
                  {/* Sticky Track Button on Right Side */}
                  <div className="absolute top-4 right-4 hidden sm:block">
                    {(() => {
                      if (normalizedStatus === 'shipped') {
                        return (
                          <a
                            href={trackingUrl ?? '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
                          >
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                            Track
                          </a>
                        );
                      }
                      const labels: Record<string, string> = {
                        pending: 'Order Placed',
                        confirmed: 'Confirmed',
                        processing: 'Placed with Seller',
                        delivered: 'Delivered',
                        cancelled: 'Cancelled',
                      };
                      return (
                        <button
                          disabled
                          className="flex cursor-not-allowed items-center justify-center gap-1.5 rounded-xl bg-black/5 px-3 py-1.5 text-xs font-bold text-zinc-400 dark:bg-white/5 dark:text-zinc-500"
                        >
                          {labels[normalizedStatus] ?? normalizedStatus}
                        </button>
                      );
                    })()}
                  </div>

                  <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl bg-black/5 shadow-sm sm:h-36 sm:w-36 md:h-40 md:w-40 dark:bg-white/5">
                    {item.productImage &&
                      !item.productImage.includes('photo-1523381210434-271e8be1f52b') ? (
                      <Image
                        width={500}
                        height={500}
                        src={item.productImage}
                        alt={item.productName}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBagIcon className="h-10 w-10 text-black/20 dark:text-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex w-full flex-col justify-between sm:min-h-36 md:sm:min-h-40">
                    <div>
                      <h3 className="text-base sm:text-xl font-bold text-black dark:text-white break-words">
                        {item.productName}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm font-semibold text-zinc-400 dark:text-zinc-500">
                        SKU: {item.sku ?? 'N/A'}
                      </p>
                      <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
                        {item.size && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">
                              Size:
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-black dark:text-white">
                              {item.size}
                            </span>
                          </div>
                        )}
                        {(() => {
                          const { color: cName, quality: qName } = resolveItemColorAndQuality(item);
                          return (
                            <>
                              {cName && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-bold text-zinc-400 uppercase">
                                    Color:
                                  </span>
                                  <span className="text-xs sm:text-sm font-bold text-black dark:text-white">
                                    {cName}
                                  </span>
                                </div>
                              )}
                              {qName && (
                                <div className="flex items-center gap-1.5 rounded-lg bg-black/5 px-2 py-0.5 dark:bg-white/10">
                                  <span className="text-[10px] font-bold text-zinc-400 uppercase">
                                    Quality:
                                  </span>
                                  <span className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                    {qName}
                                  </span>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 flex flex-col gap-3 pt-3 sm:pt-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-zinc-400 dark:text-zinc-500">
                          {item.quantity} × ₹
                          {(Number(item.price) || 0).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <span className="text-lg sm:text-xl md:text-2xl font-black text-black dark:text-white">
                          ₹
                          {((Number(item.price) || 0) * (item.quantity || 1)).toLocaleString(
                            'en-IN',
                            {
                              minimumFractionDigits: 2,
                            },
                          )}
                        </span>
                      </div>

                      {/* Mobile Track Button */}
                      <div className="sm:hidden">
                        {(() => {
                          if (normalizedStatus === 'shipped') {
                            return (
                              <a
                                href={trackingUrl ?? '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                                Track Package
                              </a>
                            );
                          }
                          const labels: Record<string, string> = {
                            pending: 'Order Placed',
                            confirmed: 'Confirmed',
                            processing: 'Placed with Seller',
                            delivered: 'Delivered',
                            cancelled: 'Cancelled',
                          };
                          return (
                            <button
                              disabled
                              className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-black/5 px-4 py-2.5 text-xs font-bold text-zinc-400 dark:bg-white/5 dark:text-zinc-500"
                            >
                              {labels[normalizedStatus] ?? normalizedStatus}
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary Card */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-[#141414]">
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="text-base font-bold text-black dark:text-white">Payment Summary</h2>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setEditModalTab('pricing');
                    setIsEditModalOpen(true);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Edit Pricing
                </button>
              )}
            </div>
            <div className="flex flex-col gap-3.5 px-6 pb-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal ({currentOrder.items.length} items)</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  ₹
                  {(Number(currentOrder.totalAmount ?? currentOrder.total) || 0).toLocaleString(
                    'en-IN',
                    { minimumFractionDigits: 2 },
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span
                  className={
                    Number(currentOrder.discountAmount) > 0
                      ? 'font-bold text-emerald-600 dark:text-emerald-400'
                      : ''
                  }
                >
                  {Number(currentOrder.discountAmount) > 0
                    ? `-₹${Number(currentOrder.discountAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                    : '₹0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fees</span>
                <span>
                  {Number(currentOrder.shippingFees) > 0
                    ? `₹${Number(currentOrder.shippingFees).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                    : 'Free (₹0.00)'}
                </span>
              </div>
              <div className="mt-2 flex justify-between border-t border-zinc-100 pt-4 text-base font-black text-black dark:border-zinc-800 dark:text-white">
                <span>Total Amount</span>
                <span>
                  ₹
                  {(Number(currentOrder.finalAmount ?? currentOrder.total) || 0).toLocaleString(
                    'en-IN',
                    { minimumFractionDigits: 2 },
                  )}
                </span>
              </div>
              {(currentOrder.paymentType === 'cod' || currentOrder.paymentMethod === 'COD') && (
                <>
                  <div className="flex justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span>Advance Paid (Razorpay)</span>
                    <span>
                      ₹
                      {(Number(currentOrder.advanceAmount) || 200).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-orange-600 dark:text-orange-400">
                    <span>Balance Due on Delivery</span>
                    <span>
                      ₹
                      {Math.max(
                        0,
                        (Number(currentOrder.finalAmount ?? currentOrder.total) || 0) -
                        (Number(currentOrder.advanceAmount) || 200),
                      ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-50 px-6 py-4 dark:bg-zinc-900/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                  Mode:
                </span>
                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase ${currentOrder.paymentType === 'cod' ? 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' : 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'}`}
                >
                  {currentOrder.paymentMethod ||
                    (currentOrder.paymentType === 'cod' ? 'Cash on Delivery' : 'Prepaid')}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {currentOrder.paymentStatus && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                      Status:
                    </span>
                    <span className="rounded-lg bg-zinc-200/80 px-2.5 py-1 text-xs font-bold text-zinc-700 uppercase dark:bg-zinc-800 dark:text-zinc-300">
                      {currentOrder.paymentStatus}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setIsRefundModalOpen(true)}
                  className="flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-500/20 active:scale-95 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400"
                  title="View live Razorpay refund timeline & Bank RRN"
                >
                  <span>↺</span>
                  <span>Refund Timeline</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Cards (Customer & Shipping) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 flex flex-col gap-6">
            {/* Customer & Address Card */}
            <div className="overflow-hidden rounded-3xl bg-white p-6 shadow-sm dark:bg-[#141414]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-black dark:text-white">Shipping Details</h2>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditModalTab('customer');
                      setIsEditModalOpen(true);
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Edit Details
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800/60">
                  <span className="text-xs font-medium text-zinc-400">Full Name</span>
                  <span className="font-bold text-black dark:text-white text-right">
                    {currentOrder.customer.name}
                  </span>
                </div>
                <div className="flex items-start justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800/60 gap-3">
                  <span className="text-xs font-medium text-zinc-400 shrink-0">Address</span>
                  <span className="text-right text-xs sm:text-sm font-semibold break-words max-w-[70%]">
                    {currentOrder.shippingAddress.building
                      ? `${currentOrder.shippingAddress.building}, `
                      : ''}
                    {currentOrder.shippingAddress.street}
                  </span>
                </div>
                {currentOrder.shippingAddress.landmark && (
                  <div className="flex items-start justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800/60 gap-3">
                    <span className="text-xs font-medium text-zinc-400 shrink-0">Landmark</span>
                    <span className="text-right text-xs font-semibold break-words max-w-[70%]">
                      {currentOrder.shippingAddress.landmark}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800/60">
                  <span className="text-xs font-medium text-zinc-400">City</span>
                  <span className="text-right">{currentOrder.shippingAddress.city}</span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800/60">
                  <span className="text-xs font-medium text-zinc-400">District</span>
                  <span className="text-right">{currentOrder.shippingAddress.district ?? 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800/60">
                  <span className="text-xs font-medium text-zinc-400">State</span>
                  <span className="text-right">{currentOrder.shippingAddress.state}</span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800/60">
                  <span className="text-xs font-medium text-zinc-400">Pincode</span>
                  <span className="text-right">{currentOrder.shippingAddress.pincode}</span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800/60">
                  <span className="text-xs font-medium text-zinc-400">Mobile Number</span>
                  <span className="text-right">{currentOrder.customer.phone}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-medium text-zinc-400">Alt Number</span>
                  <span className="text-right">{currentOrder.customer.altPhone ?? 'N/A'}</span>
                </div>

                <div className="mt-4 flex flex-col gap-3 pt-2">
                  <button
                    onClick={handleCopy}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-3 text-xs font-bold text-zinc-900 transition-all hover:bg-zinc-200 active:scale-95 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    {isCopied ? 'Copied!' : 'Copy Order Details'}
                  </button>

                  {contactMode === 'none' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          handleContactClick('whatsapp');
                        }}
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#20bd5a] active:scale-95"
                      >
                        <WhatsAppIcon className="h-5 w-5" />
                        Chat
                      </button>
                      <button
                        onClick={() => {
                          handleContactClick('call');
                        }}
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
                      >
                        <PhoneIcon className="h-5 w-5" />
                        Call
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900/60">
                      <div className="flex items-center justify-between px-1 pb-1">
                        <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                          {contactMode === 'call'
                            ? 'Call which number?'
                            : 'Chat with which number?'}
                        </span>
                        <button
                          onClick={() => {
                            setContactMode('none');
                          }}
                          className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-black/5 hover:text-black dark:hover:bg-white/5 dark:hover:text-white"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          executeContact(contactMode, currentOrder.customer.phone);
                        }}
                        className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm font-bold text-black transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                      >
                        <span>Primary</span>
                        <span>{currentOrder.customer.phone}</span>
                      </button>
                      {currentOrder.customer.altPhone && (
                        <button
                          onClick={() => {
                            executeContact(contactMode, currentOrder.customer.altPhone!);
                          }}
                          className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm font-bold text-black transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                        >
                          <span>Alternate</span>
                          <span>{currentOrder.customer.altPhone}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Meta / Tracking Info Box */}
            <div className="overflow-hidden rounded-3xl bg-white p-6 shadow-sm dark:bg-[#141414]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-black dark:text-white">Order Meta</h2>
                <div className="flex items-center gap-2">
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditModalTab('fulfillment');
                        setIsEditModalOpen(true);
                      }}
                      className="text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      Full Edit
                    </button>
                  )}
                  {!isEditingMeta ? (
                    <button
                      onClick={() => {
                        setIsEditingMeta(true);
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Quick Edit
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsEditingMeta(false);
                      }}
                      className="text-xs font-bold text-zinc-400 hover:text-black dark:hover:text-white"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800/60">
                  <span className="text-xs font-medium text-zinc-400">Order Date</span>
                  <span className="text-sm font-bold text-black dark:text-white">
                    {new Date(currentOrder.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
                {!isEditingMeta ? (
                  <>
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800/60">
                      <span className="text-xs font-medium text-zinc-400">Seller</span>
                      <span className="text-sm font-bold text-black dark:text-white">
                        {assignedSeller || 'Unassigned'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800/60">
                      <span className="text-xs font-medium text-zinc-400">Courier</span>
                      <span className="text-sm font-bold text-black dark:text-white">
                        {courierService ?? 'Not Assigned'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800/60">
                      <span className="text-xs font-medium text-zinc-400">Tracking ID</span>
                      <span className="text-sm font-bold text-black dark:text-white">
                        {trackingId ?? 'Not Assigned'}
                      </span>
                    </div>
                    {trackingId && (
                      <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-3 text-xs font-bold text-zinc-900 transition-all hover:bg-zinc-200 active:scale-95 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                      >
                        Track Package Live
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                        Seller
                      </label>
                      <CustomSelect
                        options={sellerOptions}
                        value={assignedSeller}
                        onChange={setAssignedSeller}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                        Courier Partner
                      </label>
                      <CustomSelect
                        options={courierOptions}
                        value={courierService}
                        onChange={setCourierService}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                        Tracking Number
                      </label>
                      <input
                        type="text"
                        value={trackingId}
                        onChange={(e) => {
                          setTrackingId(e.target.value);
                        }}
                        placeholder="Enter tracking ID"
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black placeholder-black/20 transition-all outline-none focus:border-black/30 dark:border-white/10 dark:bg-[#111] dark:text-white dark:placeholder-white/20 dark:focus:border-white/30"
                      />
                    </div>
                    <button
                      onClick={() => {
                        void handleSaveTracking();
                        setIsEditingMeta(false);
                      }}
                      className="mt-2 w-full rounded-xl bg-black px-4 py-3 text-sm font-bold text-white transition-all hover:bg-black/80 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/80"
                    >
                      {isTrackingSaved ? '✓ Saved' : 'Update Fulfillment'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      {isUpdateModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-sm">
            <div className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-xl dark:border-white/10 dark:bg-[#111]">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-black dark:text-white">
                  Update Order Status
                </h3>
                <button
                  onClick={() => {
                    setIsUpdateModalOpen(false);
                  }}
                  className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-2 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                    Status
                  </label>
                  <CustomSelect
                    options={[
                      { label: 'Order Placed (Pending)', value: 'pending' },
                      { label: 'Stock Check', value: 'stock_check' },
                      { label: 'Stock Confirmed', value: 'stock_confirmed' },
                      { label: 'Placed with Seller (Processing)', value: 'processing' },
                      { label: 'Shipped', value: 'shipped' },
                      { label: 'Delivered', value: 'delivered' },
                      { label: 'Cancelled', value: 'cancelled' },
                    ]}
                    value={pendingStatus}
                    onChange={setPendingStatus}
                  />
                </div>

                {(pendingStatus === 'confirmed' ||
                  pendingStatus === 'stock_confirmed' ||
                  pendingStatus === 'processing') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 flex flex-col gap-4 rounded-xl border border-black/5 bg-black/5 p-4 dark:border-white/5 dark:bg-white/5"
                    >
                      <div>
                        <label className="mb-2 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                          Assign Seller
                        </label>
                        <CustomSelect
                          options={sellerOptions}
                          value={tempSeller}
                          onChange={setTempSeller}
                        />
                      </div>
                    </motion.div>
                  )}

                {pendingStatus === 'shipped' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 flex flex-col gap-4 rounded-xl border border-black/5 bg-black/5 p-4 dark:border-white/5 dark:bg-white/5"
                  >
                    <div>
                      <label className="mb-2 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                        Courier Service
                      </label>
                      <CustomSelect
                        options={courierOptions}
                        value={tempCourier}
                        onChange={setTempCourier}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                        Tracking ID
                      </label>
                      <input
                        type="text"
                        value={tempTracking}
                        onChange={(e) => {
                          setTempTracking(e.target.value);
                        }}
                        placeholder="Enter Tracking ID"
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition-all outline-none focus:border-black/30 focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-[#111] dark:text-white dark:focus:border-white/30 dark:focus:ring-white/5"
                      />
                    </div>
                  </motion.div>
                )}

                <button
                  disabled={isUpdatingStatus}
                  onClick={async () => {
                    if (pendingStatus === 'shipped' && (!tempCourier || !tempTracking)) {
                      alert('Please enter both Courier Service and Tracking ID');
                      return;
                    }
                    if (pendingStatus === 'confirmed') {
                      setAssignedSeller(tempSeller);
                    }
                    const matchedSeller = rawSellers.find(
                      (s) =>
                        s.storeName === tempSeller || s.name === tempSeller || s.id === tempSeller,
                    );
                    await updateOrderOnBackend({
                      status: pendingStatus,
                      courierPartner: pendingStatus === 'shipped' ? tempCourier : courierService,
                      trackingNumber: pendingStatus === 'shipped' ? tempTracking : trackingId,
                      sellerId: matchedSeller?.id,
                    });
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-bold text-white transition-all hover:bg-black/80 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
                >
                  {isUpdatingStatus ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Full Order Edit Modal */}
      <EditOrderModal
        order={currentOrder}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onOrderUpdated={handleOrderUpdated}
        initialTab={editModalTab}
        rawSellers={rawSellers}
      />

      {/* Razorpay Refund Timeline Modal */}
      <RefundTimelineModal
        order={currentOrder}
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
      />
    </div>
  );
}
