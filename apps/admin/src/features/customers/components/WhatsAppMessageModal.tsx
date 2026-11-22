'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import { CheckIcon, CloseIcon, CopyIcon, ShoppingBagIcon, WhatsAppIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';

export interface WhatsAppProductContext {
  id?: string;
  name: string;
  price?: number;
  size?: string;
  color?: string;
  quantity?: number;
  image?: string;
  slug?: string | null;
  productId?: string;
}

export interface WhatsAppOrderContext {
  orderNumber: string;
  status: string;
  total: number;
  createdAt?: string;
  items?: WhatsAppProductContext[];
}

export interface WhatsAppMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: {
    id: string;
    name: string;
    phone: string;
    email?: string;
  };
  section: 'cart' | 'favorites' | 'orders';
  product?: WhatsAppProductContext;
  order?: WhatsAppOrderContext;
  availablePhoneNumbers?: { label: string; phone: string }[];
}

const STOREFRONT_URL =
  process.env.NEXT_PUBLIC_STOREFRONT_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://fashionfriday.in'
    : 'http://localhost:3000');

export function getProductUrl(slug?: string | null, productId?: string | null): string {
  if (slug) {
    return `${STOREFRONT_URL}/product/${slug}`;
  }
  if (productId) {
    return `${STOREFRONT_URL}/product/${productId}`;
  }
  return STOREFRONT_URL;
}

export function formatWhatsAppPhone(phone?: string | null): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

interface TemplateOption {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  getText: (ctx: {
    customerName: string;
    productName: string;
    priceStr: string;
    sizeStr: string;
    colorStr: string;
    productLink: string;
    orderNumber?: string;
    orderStatus?: string;
    orderTotalStr?: string;
  }) => string;
}

const CART_TEMPLATES: TemplateOption[] = [
  {
    id: 'cart_abandoned',
    emoji: '🛒',
    title: 'Cart Reminder',
    subtitle: 'Gentle follow-up on items left in cart',
    getText: ({ customerName, productName, sizeStr, colorStr, productLink }) =>
      `Hi ${customerName}! 👋\n\nWe noticed you left *${productName}*${sizeStr || colorStr ? ` (${[sizeStr, colorStr].filter(Boolean).join(', ')})` : ''} in your cart at Fashion Friday. 🛍️\n\nDon't miss out on your favorite style! You can complete your order directly here:\n🔗 ${productLink}\n\nNeed any help with sizing, payment, or placing your order? Reply here and our team will be happy to assist you!`,
  },
  {
    id: 'cart_discount',
    emoji: '⚡',
    title: 'Special Deal',
    subtitle: 'Exclusive offer to close the sale',
    getText: ({ customerName, productName, priceStr, productLink }) =>
      `Hello ${customerName}! ✨\n\nGreat news! We have an exclusive deal reserved just for you on *${productName}*! 🎉\n\n💰 Price: ₹${priceStr}\n👉 Complete your order here: ${productLink}\n\nLet us know if you'd like us to confirm and book this order directly for you.`,
  },
  {
    id: 'cart_low_stock',
    emoji: '⏳',
    title: 'Low Stock Alert',
    subtitle: 'Create urgency on scarce inventory',
    getText: ({ customerName, productName, sizeStr, productLink }) =>
      `Hi ${customerName}! ⏳\n\nQuick heads-up regarding *${productName}* in your cart: stock${sizeStr ? ` in size ${sizeStr}` : ''} is running very low!\n\nSecure yours before it goes out of stock:\n🔗 ${productLink}\n\nWould you like us to hold or reserve this piece for you? Reply to let us know!`,
  },
  {
    id: 'cart_support',
    emoji: '💬',
    title: 'Need Assistance',
    subtitle: 'Offer checkout & sizing support',
    getText: ({ customerName, productName, priceStr, productLink }) =>
      `Hi ${customerName}, greetings from Fashion Friday! 👋\n\nWe saw you were looking at *${productName}* (₹${priceStr}).\n\nWere you facing any difficulty during checkout, or do you have any questions about the product, or delivery?\nProduct details: ${productLink}\n\nWe're right here to help you!`,
  },
];

const FAVORITES_TEMPLATES: TemplateOption[] = [
  {
    id: 'fav_in_stock',
    emoji: '💖',
    title: 'Wishlist In-Stock',
    subtitle: 'Remind that favorite item is available',
    getText: ({ customerName, productName, priceStr, productLink }) =>
      `Hi ${customerName}! 💖\n\nWe noticed you saved *${productName}* to your favorites on Fashion Friday!\n\nIt is currently available in stock at *₹${priceStr}*. Treat yourself today! ✨\n🔗 View product: ${productLink}\n\nNeed any help picking the right size or fit? Just reply here and we'll assist you!`,
  },
  {
    id: 'fav_deal',
    emoji: '🌟',
    title: 'Special Wishlist Deal',
    subtitle: 'Offer an exclusive promotion',
    getText: ({ customerName, productName, priceStr, productLink }) =>
      `Hello ${customerName}! 🌟\n\nSpecial offer alert! We have an exclusive deal on your favorite item: *${productName}*!\n\nGrab it now at ₹${priceStr}:\n🔗 ${productLink}\n\nReply to this message if you want us to place the order for you directly!`,
  },
  {
    id: 'fav_urgency',
    emoji: '🔥',
    title: 'Selling Fast',
    subtitle: 'Urgency on wishlist piece',
    getText: ({ customerName, productName, productLink }) =>
      `Hi ${customerName}! 🔥\n\nThe *${productName}* from your favorites list is in high demand and selling out quickly!\n\nDon't miss your chance to get it:\n🔗 ${productLink}\n\nWould you like us to help you place the order before it runs out?`,
  },
  {
    id: 'fav_inquiry',
    emoji: '✨',
    title: 'Product Inquiry',
    subtitle: 'Answer product or fabric questions',
    getText: ({ customerName, productName, productLink }) =>
      `Hi ${customerName}, this is the Fashion Friday team! ✨\n\nWe saw you added *${productName}* to your favorites. Can we answer any questions about the fabric, sizing, or delivery time to your location?\n\nProduct link: ${productLink}\nFeel free to chat with us anytime!`,
  },
];

const ORDERS_TEMPLATES: TemplateOption[] = [
  {
    id: 'order_confirmed',
    emoji: '🎉',
    title: 'Order Confirmation',
    subtitle: 'Confirm details and product link',
    getText: ({ customerName, productName, orderNumber, orderStatus, orderTotalStr, productLink }) =>
      `Hi ${customerName}! 🎉\n\nThank you for shopping with Fashion Friday! We're pleased to confirm your order *#${orderNumber || ''}* for *${productName}*.\n\n💰 Total Amount: ₹${orderTotalStr}\n📦 Status: *${orderStatus?.toUpperCase()}*\n🔗 Product Details: ${productLink}\n\nWe're preparing your order with love. If you have any questions, feel free to reply right here!`,
  },
  {
    id: 'order_update',
    emoji: '🚚',
    title: 'Shipping Update',
    subtitle: 'Keep customer informed of progress',
    getText: ({ customerName, productName, orderNumber, orderStatus, orderTotalStr, productLink }) =>
      `Hello ${customerName}! 🚚\n\nHere is an update on your Fashion Friday order *#${orderNumber || ''}*:\nStatus: *${orderStatus?.toUpperCase()}*\nItem: *${productName}*\nTotal Amount: ₹${orderTotalStr}\n\nView your product here:\n🔗 ${productLink}\n\nWe will keep you notified as your order moves forward!`,
  },
  {
    id: 'order_feedback',
    emoji: '⭐',
    title: 'Experience & Review',
    subtitle: 'Ask for fit and quality feedback',
    getText: ({ customerName, productName, orderNumber, productLink }) =>
      `Hi ${customerName}! 🌟\n\nWe hope you received and loved your *${productName}* from order *#${orderNumber || ''}*!\n\nProduct link: ${productLink}\n\nHow was the quality, fit, and your shopping experience with us? Your feedback means the world to our team! ❤️`,
  },
  {
    id: 'order_repeat',
    emoji: '✨',
    title: 'Related Styles',
    subtitle: 'Recommend new arrivals & styles',
    getText: ({ customerName, productName, orderNumber, productLink }) =>
      `Hi ${customerName}! ✨\n\nHope you're enjoying your *${productName}* from order *#${orderNumber || ''}*!\n\nCheck out our latest arrivals and matching styles handpicked for you:\n🔗 ${productLink}\n\nLet us know if you're looking for any specific style or occasion wear!`,
  },
];

export function WhatsAppMessageModal({
  isOpen,
  onClose,
  customer,
  section,
  product: initialProduct,
  order,
  availablePhoneNumbers = [],
}: WhatsAppMessageModalProps) {
  // If order has multiple items, allow picking which item to reference or 'all'
  const [selectedOrderItemIndex, setSelectedOrderItemIndex] = useState<number | 'all'>(0);

  // Active product depending on context and selected order item
  const activeProduct = useMemo<WhatsAppProductContext | undefined>(() => {
    if (section === 'orders' && order?.items && order.items.length > 0) {
      if (selectedOrderItemIndex === 'all') {
        // Return synthetic product summarizing all items
        const allNames = order.items.map((i) => i.name).join(', ');
        return {
          name: allNames,
          price: order.total,
          image: order.items[0]?.image,
          slug: order.items[0]?.slug,
          productId: order.items[0]?.productId,
        };
      }
      return order.items[selectedOrderItemIndex] || initialProduct;
    }
    return initialProduct;
  }, [section, order, selectedOrderItemIndex, initialProduct]);

  // Recipient phone number
  const [phone, setPhone] = useState(customer.phone || '');
  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const [isCopiedMessage, setIsCopiedMessage] = useState(false);

  // Templates list for the current section
  const templates = useMemo(() => {
    switch (section) {
      case 'cart':
        return CART_TEMPLATES;
      case 'favorites':
        return FAVORITES_TEMPLATES;
      case 'orders':
        return ORDERS_TEMPLATES;
    }
  }, [section]);

  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || '');
  const [customMessage, setCustomMessage] = useState('');
  const [hasCustomEdits, setHasCustomEdits] = useState(false);

  // Recalculate default template text
  const computeTemplateText = (tplId: string) => {
    const tpl = templates.find((t) => t.id === tplId) || templates[0];
    if (!tpl) return '';

    const customerName = customer.name?.trim() || 'there';
    const productName = activeProduct?.name?.trim() || 'your selected item';
    const priceVal = activeProduct?.price ?? order?.total ?? 0;
    const priceStr = Number(priceVal).toLocaleString('en-IN');
    const sizeStr = activeProduct?.size && activeProduct.size !== 'Standard' ? activeProduct.size : '';
    const colorStr = activeProduct?.color && activeProduct.color !== 'Standard' ? activeProduct.color : '';
    const productLink = getProductUrl(activeProduct?.slug, activeProduct?.productId);
    const orderNumber = order?.orderNumber;
    const orderStatus = order?.status;
    const orderTotalStr = order ? Number(order.total).toLocaleString('en-IN') : priceStr;

    return tpl.getText({
      customerName,
      productName,
      priceStr,
      sizeStr,
      colorStr,
      productLink,
      orderNumber,
      orderStatus,
      orderTotalStr,
    });
  };

  // Sync initial phone and template message on open or template switch
  useEffect(() => {
    if (isOpen) {
      setPhone(customer.phone || '');
      setSelectedTemplateId(templates[0]?.id || '');
      setSelectedOrderItemIndex(0);
      setHasCustomEdits(false);
      setCustomMessage(computeTemplateText(templates[0]?.id || ''));
    }
  }, [isOpen, customer, section]);

  // When activeProduct or template changes (and user hasn't made manual custom edits), update customMessage
  useEffect(() => {
    if (!hasCustomEdits) {
      setCustomMessage(computeTemplateText(selectedTemplateId));
    }
  }, [activeProduct, selectedTemplateId, hasCustomEdits]);

  const handleSelectTemplate = (tplId: string) => {
    setSelectedTemplateId(tplId);
    setHasCustomEdits(false);
    setCustomMessage(computeTemplateText(tplId));
  };

  const handleResetToTemplate = () => {
    setHasCustomEdits(false);
    setCustomMessage(computeTemplateText(selectedTemplateId));
    toast.info('Message reset to template default');
  };

  const handleCopyLink = async () => {
    const url = getProductUrl(activeProduct?.slug, activeProduct?.productId);
    try {
      await navigator.clipboard.writeText(url);
      setIsCopiedLink(true);
      toast.success('Product link copied to clipboard!');
      setTimeout(() => setIsCopiedLink(false), 2000);
    } catch {
      toast.error('Failed to copy product link');
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(customMessage);
      setIsCopiedMessage(true);
      toast.success('Message text copied to clipboard!');
      setTimeout(() => setIsCopiedMessage(false), 2000);
    } catch {
      toast.error('Failed to copy message');
    }
  };

  const handleSendWhatsApp = () => {
    const fullPhone = formatWhatsAppPhone(phone);
    if (!fullPhone) {
      toast.error('Please enter a valid recipient phone number');
      return;
    }
    if (!customMessage.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    const waUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(customMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    toast.success('Opening WhatsApp...');
    onClose();
  };

  if (!isOpen) return null;

  const productLink = getProductUrl(activeProduct?.slug, activeProduct?.productId);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 flex h-[92vh] max-h-[820px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl sm:rounded-3xl dark:border-white/10 dark:bg-[#121212]"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-black/5 bg-[#fafafa] px-5 py-4 sm:px-6 dark:border-white/5 dark:bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <WhatsAppIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-black sm:text-lg dark:text-white">
                  Send WhatsApp Message
                </h3>
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold tracking-wider text-black/70 uppercase dark:bg-white/10 dark:text-white/70">
                  {section === 'cart' ? 'Cart' : section === 'favorites' ? 'Wishlist' : 'Order'}
                </span>
              </div>
              <p className="text-xs text-black/50 dark:text-white/50">
                To: <span className="font-semibold text-black dark:text-white">{customer.name}</span>
                {customer.phone && ` • ${customer.phone}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-black/50 hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {/* Product & Context Summary Card */}
          <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-3.5 sm:p-4 dark:border-white/5 dark:bg-white/[0.02]">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-black/5 bg-black/5 dark:border-white/5 dark:bg-white/5">
                {activeProduct?.image ? (
                  <Image
                    src={activeProduct.image}
                    alt={activeProduct.name || 'Product'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-black/30 dark:text-white/30">
                    <ShoppingBagIcon className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4
                      className="line-clamp-1 text-sm font-bold text-black dark:text-white"
                      title={activeProduct?.name}
                    >
                      {activeProduct?.name}
                    </h4>
                    {activeProduct?.price !== undefined && (
                      <span className="text-xs font-extrabold text-black dark:text-white">
                        ₹{Number(activeProduct.price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  {/* Copy product link button */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-black/10 bg-white px-2 py-1 text-[11px] font-semibold text-black/80 shadow-2xs hover:bg-black/5 active:scale-95 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white/80 dark:hover:bg-white/5"
                    title="Copy product link"
                  >
                    {isCopiedLink ? (
                      <>
                        <CheckIcon className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-3 w-3" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Attributes: Size, Color, Qty, Order info */}
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px]">
                  {activeProduct?.size && activeProduct.size !== 'Standard' && (
                    <span className="rounded-md bg-black/5 px-1.5 py-0.5 font-medium text-black/70 dark:bg-white/10 dark:text-white/70">
                      Size: {activeProduct.size}
                    </span>
                  )}
                  {activeProduct?.color && activeProduct.color !== 'Standard' && (
                    <span className="rounded-md bg-black/5 px-1.5 py-0.5 font-medium text-black/70 dark:bg-white/10 dark:text-white/70">
                      Color: {activeProduct.color}
                    </span>
                  )}
                  {activeProduct?.quantity && activeProduct.quantity > 1 && (
                    <span className="rounded-md bg-black/5 px-1.5 py-0.5 font-medium text-black/70 dark:bg-white/10 dark:text-white/70">
                      Qty: {activeProduct.quantity}
                    </span>
                  )}
                  {order && (
                    <>
                      <span className="rounded-md bg-black/10 px-1.5 py-0.5 font-bold text-black dark:bg-white/20 dark:text-white">
                        Order #{order.orderNumber}
                      </span>
                      <span className="rounded-md bg-blue-500/10 px-1.5 py-0.5 font-bold uppercase text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                        {order.status}
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-1 line-clamp-1 text-[11px] text-black/40 dark:text-white/40">
                  {productLink}
                </div>
              </div>
            </div>

            {/* If order has multiple items, allow switching which item to reference */}
            {section === 'orders' && order?.items && order.items.length > 1 && (
              <div className="mt-3 border-t border-black/5 pt-2.5 dark:border-white/5">
                <span className="text-[11px] font-semibold text-black/60 dark:text-white/60">
                  Select item to reference:
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {order.items.map((it, idx) => (
                    <button
                      key={it.id || idx}
                      type="button"
                      onClick={() => {
                        setSelectedOrderItemIndex(idx);
                        setHasCustomEdits(false);
                      }}
                      className={`rounded-lg px-2 py-1 text-[11px] font-medium transition-all ${selectedOrderItemIndex === idx
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'bg-black/5 text-black/70 hover:bg-black/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/15'
                        }`}
                    >
                      {idx + 1}. {it.name.slice(0, 18)}...
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOrderItemIndex('all');
                      setHasCustomEdits(false);
                    }}
                    className={`rounded-lg px-2 py-1 text-[11px] font-medium transition-all ${selectedOrderItemIndex === 'all'
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'bg-black/5 text-black/70 hover:bg-black/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/15'
                      }`}
                  >
                    All {order.items.length} Items
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recipient Phone Selector / Editor */}
          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70">
              Recipient WhatsApp Number
            </label>
            <div className="mt-1.5 flex flex-col gap-1.5 sm:flex-row sm:items-center">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="flex-1 rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs font-medium text-black outline-none focus:border-black dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:focus:border-white"
              />
            </div>
            {/* Quick phone pill selection */}
            {availablePhoneNumbers.length > 0 && (
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-black/40 dark:text-white/40">Quick select:</span>
                {availablePhoneNumbers.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhone(p.phone)}
                    className={`rounded-md px-2 py-0.5 text-[10px] font-semibold transition-all ${formatWhatsAppPhone(phone) === formatWhatsAppPhone(p.phone)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-black/5 text-black/70 hover:bg-black/10 dark:bg-white/10 dark:text-white/70'
                      }`}
                  >
                    {p.label}: {p.phone}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message Templates Selection */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-black/70 dark:text-white/70">
                Choose Default Message Template
              </label>
              {hasCustomEdits && (
                <button
                  type="button"
                  onClick={handleResetToTemplate}
                  className="text-[11px] font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Reset to default template
                </button>
              )}
            </div>

            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {templates.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all ${isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs dark:border-emerald-500 dark:bg-emerald-950/20'
                        : 'border-black/5 bg-black/[0.02] hover:border-black/20 hover:bg-black/[0.04] dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/20'
                      }`}
                  >
                    <span className="text-base">{tpl.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${isSelected
                              ? 'text-emerald-950 dark:text-emerald-300'
                              : 'text-black dark:text-white'
                            }`}
                        >
                          {tpl.title}
                        </span>
                        {isSelected && (
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        )}
                      </div>
                      <p className="line-clamp-1 text-[10px] text-black/50 dark:text-white/50">
                        {tpl.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Editor */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-black/70 dark:text-white/70">
                Message Preview & Editor
              </label>
              <span className="text-[10px] text-black/40 dark:text-white/40">
                {customMessage.length} characters
              </span>
            </div>
            <textarea
              rows={6}
              value={customMessage}
              onChange={(e) => {
                setCustomMessage(e.target.value);
                setHasCustomEdits(true);
              }}
              className="mt-1.5 w-full resize-y rounded-xl border border-black/10 bg-white p-3 font-sans text-xs text-black outline-none focus:border-black dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:focus:border-white"
              placeholder="Type your WhatsApp message..."
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-black/5 bg-[#fafafa] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-white/5 dark:bg-[#161616]">
          <button
            type="button"
            onClick={handleCopyMessage}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs font-semibold text-black transition-all hover:bg-black/5 active:scale-95 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-white/5"
          >
            {isCopiedMessage ? (
              <>
                <CheckIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied Message</span>
              </>
            ) : (
              <>
                <CopyIcon className="h-3.5 w-3.5" />
                <span>Copy Message</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl px-4 py-2.5 text-xs font-semibold text-black/60 hover:text-black sm:flex-initial dark:text-white/60 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-700 active:scale-95 sm:flex-initial dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>Send on WhatsApp</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
