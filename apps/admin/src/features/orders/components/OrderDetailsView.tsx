'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Order } from '../types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { COURIER_SERVICES, getTrackingUrl } from '../utils/courier';
import { CustomSelect } from '../../../components/ui/CustomSelect';
import { WhatsAppIcon, PhoneIcon } from '@ff/ui/icons';
import Image from 'next/image';

function OrderStatusTracker({ status }: { status: string }) {
  const isCancelledFlow = ['cancelled', 'refunding', 'refunded'].includes(status);
  const steps = isCancelledFlow 
    ? ['cancelled', 'refunding', 'refunded']
    : ['pending', 'inquiry', 'confirmed', 'shipped', 'delivered'];
  
  const currentStepIndex = steps.indexOf(status) >= 0 ? steps.indexOf(status) : 0;

  return (
    <div className="relative mt-2 flex w-full justify-between sm:mt-0">
      {/* Connecting Line background */}
      <div className="absolute left-0 top-3 h-0.5 w-full -translate-y-1/2 bg-black/10 dark:bg-white/10"></div>
      
      {/* Active Connecting Line */}
      <div 
        className="absolute left-0 top-3 h-0.5 -translate-y-1/2 bg-black transition-all duration-500 dark:bg-white"
        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
      ></div>

      {steps.map((step, idx) => {
        const isCompleted = idx <= currentStepIndex;
        const isActive = idx === currentStepIndex;
        return (
          <div key={step} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-500 ${isCompleted ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-200 dark:bg-gray-900/80'}`}>
               {isCompleted ? (
                 <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                 </svg>
               ) : (
                 <span className="h-1.5 w-1.5 rounded-full bg-black/20 dark:bg-white/20"></span>
               )}
            </div>
            <span className={`absolute top-8 text-center text-[10px] font-semibold capitalize transition-colors ${isActive ? 'text-black font-bold dark:text-white' : isCompleted ? 'text-black/70 dark:text-white/70' : 'text-black/40 dark:text-white/40'}`}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface OrderDetailsViewProps {
  order: Order;
}

export function OrderDetailsView({ order }: OrderDetailsViewProps) {
  const [trackingId, setTrackingId] = useState(order.tracking?.trackingId || '');
  const [courierService, setCourierService] = useState<string>(
    order.tracking?.courierService || 'Delhivery',
  );
  const [assignedSeller, setAssignedSeller] = useState('Seller A');
  const [orderStatus, setOrderStatus] = useState<string>(order.status);
  const [isTrackingSaved, setIsTrackingSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [contactMode, setContactMode] = useState<'none' | 'call' | 'whatsapp'>('none');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string>(order.status);
  const [tempCourier, setTempCourier] = useState<string>(order.tracking?.courierService || 'Delhivery');
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

  const trackingUrl = getTrackingUrl(courierService, trackingId);

  const handleSaveTracking = () => {
    setIsTrackingSaved(true);
    setTimeout(() => setIsTrackingSaved(false), 3000);
  };

  const getOrderSummaryText = () => {
    const itemsText = order.items
      .map(
        (item) => `Product Name: ${item.productName}\nSize: ${item.size || 'N/A'}\nColor: ${item.color || 'N/A'}\nQty: ${item.quantity}`
      )
      .join('\n\n');

    return `📝 Order Details Form

Full Name : ${order.customer.name}
Address : ${order.shippingAddress.street}
City : ${order.shippingAddress.city}
District : ${order.shippingAddress.district || 'N/A'}
State : ${order.shippingAddress.state}
Pincode: ${order.shippingAddress.pincode}
Mobile Number : ${order.customer.phone}
Alt Number : ${order.customer.altPhone || 'N/A'}

${itemsText}

Total: ₹${order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${order.paymentType.toUpperCase()})
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getOrderSummaryText());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
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
    if (order.items.length > 0 && order.items[0].productImage) {
      await copyImageToClipboard(order.items[0].productImage);
    }

    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleInquiryWhatsApp = async () => {
    if (order.items.length === 0) return;
    const item = order.items[0];
    const text = encodeURIComponent(`*Product Name:* ${item.productName}\n\n*Quantity:* ${item.quantity}\n\n*Size:* ${item.size || 'N/A'}\n*Color:* ${item.color || 'N/A'} \n\n*Order ID:* ${order.orderNumber}`);
    
    if (item.productImage) {
      await copyImageToClipboard(item.productImage);
    }

    window.open(`https://api.whatsapp.com/send?phone=917558969093&text=${text}`, '_blank');
  };

  const courierOptions = COURIER_SERVICES.map(c => ({ label: c, value: c }));

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6 overflow-y-auto p-4 scrollbar-hide md:p-8">
      
      {/* Top Section Tracker Box */}
      <div className="flex flex-col gap-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111] md:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        
        {/* Middle: Status Bar Tracker */}
        <div className="flex-1 w-full lg:max-w-xl lg:px-4">
           <OrderStatusTracker status={orderStatus} />
        </div>

        {/* Right side: Actions */}
        <div className="flex shrink-0">
          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 transition-all hover:bg-black/80 active:scale-95 dark:bg-white dark:text-black dark:shadow-white/20 dark:hover:bg-white/80 sm:w-auto"
          >
            Update
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Main Content Area (Items & Finance) */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          
          {/* Items Card */}
          <div className="rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#111]">
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-4 dark:border-white/5">
              <h2 className="text-base font-bold text-black dark:text-white">Order Items</h2>
              <span className="text-sm font-bold text-black/50 dark:text-white/50">#{order.orderNumber}</span>
            </div>
            
            <div className="flex flex-col p-6 gap-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="group relative flex flex-col gap-6 rounded-2xl border border-black/5 bg-black/[0.02] p-4 transition-all hover:bg-black/[0.04] dark:border-white/5 dark:bg-white/[0.02] dark:hover:bg-white/[0.04] sm:flex-row sm:items-start sm:pr-32">
                  
                  {/* Sticky Track Button on Right Side */}
                  <div className="absolute right-4 top-4 hidden sm:block">
                    {(() => {
                      if (orderStatus === 'shipped') {
                        return (
                          <a 
                            href={trackingUrl || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
                          >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            Track
                          </a>
                        );
                      }
                      const labels: Record<string, string> = {
                        pending: 'Pending',
                        processing: 'Processing',
                        delivered: 'Delivered',
                        cancelled: 'Cancelled'
                      };
                      return (
                        <button 
                          disabled
                          className="flex cursor-not-allowed items-center justify-center gap-1.5 rounded-lg bg-black/5 px-4 py-2 text-xs font-bold text-black/40 dark:bg-white/5 dark:text-white/40"
                        >
                          {labels[orderStatus] || orderStatus}
                        </button>
                      );
                    })()}
                  </div>

                  <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl shadow-sm sm:h-40 sm:w-40">
                    <Image width={500} height={500} src={item.productImage} alt={item.productName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex w-full flex-col justify-between sm:h-40">
                    <div>
                      <h3 className="text-xl font-bold text-black dark:text-white sm:text-2xl">{item.productName}</h3>
                      <p className="mt-1 text-sm font-semibold text-black/40 dark:text-white/40">SKU: {item.sku || 'N/A'}</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {item.size && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase text-black/50 dark:text-white/50">Size:</span>
                            <span className="text-sm font-bold text-black dark:text-white">{item.size}</span>
                          </div>
                        )}
                        {item.color && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase text-black/50 dark:text-white/50">Color:</span>
                            <span className="text-sm font-bold text-black dark:text-white">{item.color}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-4 pt-4 sm:mt-0 dark:border-white/5">
                       <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-black/50 dark:text-white/50">{item.quantity} × ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                         <span className="text-xl font-black text-black dark:text-white sm:text-2xl">₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                       </div>
                       
                       {/* Mobile Track Button */}
                       <div className="sm:hidden">
                         {(() => {
                            if (orderStatus === 'shipped') {
                              return (
                                <a 
                                  href={trackingUrl || '#'}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                  Track Package
                                </a>
                              );
                            }
                            const labels: Record<string, string> = {
                              pending: 'Pending',
                              processing: 'Processing',
                              delivered: 'Delivered',
                              cancelled: 'Cancelled'
                            };
                            return (
                              <button 
                                disabled
                                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-black/5 px-4 py-3 text-sm font-bold text-black/40 dark:bg-white/5 dark:text-white/40"
                              >
                                {labels[orderStatus] || orderStatus}
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
          <div className="rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#111]">
            <div className="border-b border-black/5 px-6 py-4 dark:border-white/5">
              <h2 className="text-base font-bold text-black dark:text-white">Payment Summary</h2>
            </div>
            <div className="flex flex-col gap-3 p-6 text-sm font-medium text-black/70 dark:text-white/70">
              <div className="flex justify-between">
                <span>Subtotal ({order.items.length} items)</span>
                <span>₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹0.00</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-black/5 pt-4 text-lg font-black text-black dark:border-white/5 dark:text-white">
                <span>Total</span>
                <span>₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="rounded-b-2xl bg-black/5 px-6 py-4 dark:bg-white/5">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-black/50 dark:text-white/50">Mode</span>
                  <span className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase ${order.paymentType === 'cod' ? 'bg-orange-500/20 text-orange-700 dark:bg-orange-500/30 dark:text-orange-300' : 'bg-blue-500/20 text-blue-700 dark:bg-blue-500/30 dark:text-blue-300'}`}>
                    {order.paymentType === 'cod' ? 'Cash on Delivery' : 'Prepaid'}
                  </span>
               </div>
            </div>
          </div>

        </div>

        {/* Sidebar Cards (Customer & Shipping) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 flex flex-col gap-6">
            
          {/* Customer & Address Card - HIGHLIGHTED */}
          <div className="rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#111]">
            <div className="border-b border-black/10 px-6 py-4 dark:border-white/10">
              <h2 className="text-base font-bold text-black dark:text-white">Shipping Details</h2>
            </div>
            
            <div className="flex flex-col gap-3 p-6 text-sm font-semibold text-black dark:text-white">
              <div className="grid grid-cols-[130px_1fr] items-center gap-2 border-b border-black/5 pb-3 dark:border-white/5">
                <span className="text-black/50 dark:text-white/50">Full Name :</span>
                <span>{order.customer.name}</span>
              </div>
              <div className="grid grid-cols-[130px_1fr] items-center gap-2 border-b border-black/5 pb-3 dark:border-white/5">
                <span className="text-black/50 dark:text-white/50">Address :</span>
                <span>{order.shippingAddress.street}</span>
              </div>
              <div className="grid grid-cols-[130px_1fr] items-center gap-2 border-b border-black/5 pb-3 dark:border-white/5">
                <span className="text-black/50 dark:text-white/50">City :</span>
                <span>{order.shippingAddress.city}</span>
              </div>
              <div className="grid grid-cols-[130px_1fr] items-center gap-2 border-b border-black/5 pb-3 dark:border-white/5">
                <span className="text-black/50 dark:text-white/50">District :</span>
                <span>{order.shippingAddress.district || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-[130px_1fr] items-center gap-2 border-b border-black/5 pb-3 dark:border-white/5">
                <span className="text-black/50 dark:text-white/50">State :</span>
                <span>{order.shippingAddress.state}</span>
              </div>
              <div className="grid grid-cols-[130px_1fr] items-center gap-2 border-b border-black/5 pb-3 dark:border-white/5">
                <span className="text-black/50 dark:text-white/50">Pincode:</span>
                <span>{order.shippingAddress.pincode}</span>
              </div>
              <div className="grid grid-cols-[130px_1fr] items-center gap-2 border-b border-black/5 pb-3 dark:border-white/5">
                <span className="text-black/50 dark:text-white/50">Mobile Number :</span>
                <span>{order.customer.phone}</span>
              </div>
              <div className="grid grid-cols-[130px_1fr] items-center gap-2">
                <span className="text-black/50 dark:text-white/50">Alt Number :</span>
                <span>{order.customer.altPhone || 'N/A'}</span>
              </div>
              
              <div className="mt-4 flex flex-col gap-3 border-t border-black/10 pt-6 dark:border-white/10">
                <button
                  onClick={handleCopy}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-black shadow-sm transition-all hover:bg-black/5 active:scale-95 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-white/5"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {isCopied ? 'Copied!' : 'Copy Order Details'}
                </button>
                
                {contactMode === 'none' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleContactClick('whatsapp')}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#20bd5a] active:scale-95"
                    >
                      <WhatsAppIcon className="h-5 w-5" />
                      Chat
                    </button>
                    <button
                      onClick={() => handleContactClick('call')}
                      className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
                    >
                      <PhoneIcon className="h-5 w-5" />
                      Call
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 rounded-xl border border-black/10 p-3 shadow-sm dark:border-white/10">
                    <div className="flex items-center justify-between px-1 pb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-black/50 dark:text-white/50">
                        {contactMode === 'call' ? 'Call which number?' : 'Chat with which number?'}
                      </span>
                      <button onClick={() => setContactMode('none')} className="rounded-md p-1 text-black/50 transition-colors hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <button
                      onClick={() => executeContact(contactMode, order.customer.phone)}
                      className="flex items-center justify-between rounded-lg bg-black/5 px-3 py-2 text-sm font-bold text-black transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                    >
                      <span>Primary</span>
                      <span>{order.customer.phone}</span>
                    </button>
                    {order.customer.altPhone && (
                      <button
                        onClick={() => executeContact(contactMode, order.customer.altPhone!)}
                        className="flex items-center justify-between rounded-lg bg-black/5 px-3 py-2 text-sm font-bold text-black transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                      >
                        <span>Alternate</span>
                        <span>{order.customer.altPhone}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Meta / Tracking Info Box */}
          <div className="rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#111]">
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-4 dark:border-white/5">
              <h2 className="text-base font-bold text-black dark:text-white">Order Meta</h2>
              {!isEditingMeta ? (
                <button
                  onClick={() => setIsEditingMeta(true)}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingMeta(false)}
                  className="text-sm font-bold text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
                >
                  Cancel
                </button>
              )}
            </div>
            
            <div className="flex flex-col gap-4 p-6">
              <div className="flex justify-between items-center border-b border-black/5 pb-3 dark:border-white/5">
                <span className="text-sm text-black/50 dark:text-white/50">Order Date</span>
                <span className="text-sm font-bold text-black dark:text-white">
                  {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              {!isEditingMeta ? (
                <>
                  <div className="flex justify-between items-center border-b border-black/5 pb-3 dark:border-white/5">
                    <span className="text-sm text-black/50 dark:text-white/50">Seller</span>
                    <span className="text-sm font-bold text-black dark:text-white">{assignedSeller}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-black/5 pb-3 dark:border-white/5">
                    <span className="text-sm text-black/50 dark:text-white/50">Courier</span>
                    <span className="text-sm font-bold text-black dark:text-white">{courierService || 'Not Assigned'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-black/5 pb-3 dark:border-white/5">
                    <span className="text-sm text-black/50 dark:text-white/50">Tracking ID</span>
                    <span className="text-sm font-bold text-black dark:text-white">{trackingId || 'Not Assigned'}</span>
                  </div>
                  {trackingId && (
                    <a
                      href={trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-black/5 px-4 py-3 text-sm font-bold text-black transition-all hover:bg-black/10 active:scale-95 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                    >
                      Track Package Live
                    </a>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-black/50 dark:text-white/50">Seller</label>
                    <CustomSelect
                      options={[
                        { label: 'Seller A', value: 'Seller A' },
                        { label: 'Seller B', value: 'Seller B' },
                        { label: 'Seller C', value: 'Seller C' },
                      ]}
                      value={assignedSeller}
                      onChange={setAssignedSeller}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-black/50 dark:text-white/50">Courier Partner</label>
                    <CustomSelect
                      options={courierOptions}
                      value={courierService}
                      onChange={setCourierService}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-black/50 dark:text-white/50">Tracking Number</label>
                    <input
                      type="text"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      placeholder="Enter tracking ID"
                      className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black placeholder-black/20 outline-none transition-all focus:border-black/30 dark:border-white/10 dark:bg-[#111] dark:text-white dark:placeholder-white/20 dark:focus:border-white/30"
                    />
                  </div>
                  <button
                    onClick={() => {
                      handleSaveTracking();
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
      {isUpdateModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-[#111] border border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-black dark:text-white">Update Order Status</h3>
              <button onClick={() => setIsUpdateModalOpen(false)} className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/50 dark:text-white/50">Status</label>
                <CustomSelect
                  options={[
                    { label: 'Pending', value: 'pending' },
                    { label: 'Inquiry', value: 'inquiry' },
                    { label: 'Confirmed', value: 'confirmed' },
                    { label: 'Shipped', value: 'shipped' },
                    { label: 'Delivered', value: 'delivered' },
                    { label: 'Cancelled', value: 'cancelled' },
                    { label: 'Refunding', value: 'refunding' },
                    { label: 'Refunded', value: 'refunded' },
                  ]}
                  value={pendingStatus}
                  onChange={setPendingStatus}
                />
              </div>

              {pendingStatus === 'confirmed' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col gap-4 p-4 mt-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/50 dark:text-white/50">Assign Seller</label>
                    <CustomSelect
                      options={[
                        { label: 'Seller A', value: 'Seller A' },
                        { label: 'Seller B', value: 'Seller B' },
                        { label: 'Seller C', value: 'Seller C' },
                      ]}
                      value={tempSeller}
                      onChange={setTempSeller}
                    />
                  </div>
                </motion.div>
              )}

              {pendingStatus === 'shipped' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col gap-4 p-4 mt-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/50 dark:text-white/50">Courier Service</label>
                    <CustomSelect
                      options={courierOptions}
                      value={tempCourier}
                      onChange={setTempCourier}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/50 dark:text-white/50">Tracking ID</label>
                    <input
                      type="text"
                      value={tempTracking}
                      onChange={(e) => setTempTracking(e.target.value)}
                      placeholder="Enter Tracking ID"
                      className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black outline-none transition-all focus:border-black/30 focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-[#111] dark:text-white dark:focus:border-white/30 dark:focus:ring-white/5"
                    />
                  </div>
                </motion.div>
              )}

              <button
                onClick={() => {
                  if (pendingStatus === 'shipped' && (!tempCourier || !tempTracking)) {
                     alert('Please enter both Courier Service and Tracking ID');
                     return;
                  }
                  if (pendingStatus === 'inquiry') {
                    handleInquiryWhatsApp();
                  }
                  if (pendingStatus === 'shipped') {
                    setCourierService(tempCourier);
                    setTrackingId(tempTracking);
                  }
                  if (pendingStatus === 'confirmed') {
                    setAssignedSeller(tempSeller);
                  }
                  setOrderStatus(pendingStatus);
                  setIsUpdateModalOpen(false);
                }}
                className="mt-4 w-full rounded-xl bg-black px-4 py-3 text-sm font-bold text-white transition-all hover:bg-black/80 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
