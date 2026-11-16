'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import {
  ChevronRightIcon,
  ChevronUpIcon,
  CloseIcon,
  CreditCardIcon,
  InfoIcon,
  MapPinIcon,
  ShieldCheckIcon,
  TruckIcon,
  ZapIcon,
} from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';

import { createOrderAction, verifyPaymentAction } from '@/features/orders/services/orders.actions';
import { loadRazorpayScript } from '@/lib/load-razorpay';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';

import { useCheckoutPayment } from '../hooks/use-checkout-payment';
import { CheckoutProgress } from './checkout-progress';

export function PaymentStep() {
  const {
    paymentMethod,
    setPaymentMethod,
    isExpanded,
    setIsExpanded,
    showInfo,
    setShowInfo,
    shippingAddress,
    baseTotal,
    codServiceFee,
    totalAmount,
    cartItems,
  } = useCheckoutPayment();
  const router = useRouter();
  const [isPlacing, setIsPlacing] = React.useState(false);

  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);

  const handlePlaceOrder = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log('[PaymentStep] ---------------- ORDER PROCESS STARTED ----------------');
    console.log(
      '[PaymentStep] Step 1: User state:',
      user ? { id: user.id, phone: user.phone } : 'UNAUTHENTICATED',
    );
    console.log('[PaymentStep] Step 1: Cart Items:', cartItems);
    console.log('[PaymentStep] Step 1: Selected Payment Method:', paymentMethod);
    console.log(
      '[PaymentStep] Step 1: Base Total:',
      baseTotal,
      'COD Fee:',
      codServiceFee,
      'Payable:',
      totalAmount,
    );

    if (!user) {
      console.warn('[PaymentStep] Blocked: User not authenticated. Redirecting to login.');
      toast.error('Please sign in to complete your order.');
      router.push('/login?redirect=/checkout/payment');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      console.warn('[PaymentStep] Blocked: Cart is empty.');
      toast.error('Your cart is empty. Please add items before placing an order.');
      router.push('/checkout/cart');
      return;
    }

    if (!shippingAddress) {
      console.warn('[PaymentStep] Blocked: No delivery address found.');
      toast.error('Please add or confirm your delivery address before placing an order.');
      router.push('/checkout/review');
      return;
    }

    try {
      setIsPlacing(true);

      const shippingPayload = {
        id: shippingAddress.id,
        fullName: shippingAddress.recipientName.trim(),
        phoneNumber: shippingAddress.primaryPhone.replace(/\D/g, '').slice(-10),
        altPhoneNumber: shippingAddress.altPhone
          ? shippingAddress.altPhone.replace(/\D/g, '').slice(-10)
          : null,
        building: shippingAddress.building?.trim() || null,
        street: shippingAddress.area.trim(),
        city: shippingAddress.city.trim(),
        district: shippingAddress.district?.trim() || '',
        state: shippingAddress.state?.trim() || '',
        pincode: shippingAddress.pincode.replace(/\D/g, '').slice(0, 6),
        landmark: shippingAddress.landmark?.trim() || null,
      };

      // CASE A: Cash on Delivery (COD)
      if (paymentMethod === 'cod') {
        const res = await createOrderAction({
          paymentMethod: 'COD',
          addressId: shippingAddress.id,
          shippingAddress: shippingPayload,
        });
        console.log('[PaymentStep] COD Order successfully created:', res);
        await clearCart(true);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('checkout_shipping_address');
        }
        toast.success('Order placed successfully via Cash on Delivery!');
        router.push('/account/orders');
        return;
      }

      // CASE B: Pre-pay Online (Razorpay UPI / Cards)
      console.log('[PaymentStep] Step 2: Initiating Razorpay order on server...');
      const initRes = await createOrderAction({
        paymentMethod: 'RAZORPAY',
        addressId: shippingAddress.id,
        shippingAddress: shippingPayload,
      });
      console.log('[PaymentStep] Step 3: Razorpay session created:', initRes);

      const rzpData = initRes?.razorpay;
      const order = initRes?.order;

      if (!rzpData || !order) {
        throw new Error('Failed to initiate online payment session from server');
      }

      // Load official Razorpay Checkout SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error(
          'Unable to load payment gateway SDK. Please check your internet connection.',
        );
      }

      const keyId = rzpData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      // Graceful fallback for local development when keys are not yet configured in .env
      if (!keyId || rzpData.orderId.startsWith('order_mock_')) {
        console.warn(
          '[PaymentStep] Razorpay test keys not yet added. Running in mock simulation mode.',
        );
        toast.info('Razorpay Dev Mode: Approving test payment...');
        await verifyPaymentAction({
          orderId: order.id,
          razorpayOrderId: rzpData.orderId,
          razorpayPaymentId: `pay_mock_${Date.now()}`,
          razorpaySignature: 'mock_signature',
        });
        await clearCart(true);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('checkout_shipping_address');
        }
        toast.success('Test payment verified! Your order has been placed.');
        router.push('/account/orders');
        return;
      }

      // Standard Razorpay Modal Configuration
      const options = {
        key: keyId,
        amount: rzpData.amount,
        currency: rzpData.currency || 'INR',
        name: 'Fashion Friday',
        description: `Order #${order.orderNumber}`,
        order_id: rzpData.orderId,
        prefill: {
          name: user.name || '',
          contact: user.phone || '',
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: () => {
            setIsPlacing(false);
            toast.info('Payment was cancelled. You can retry whenever you are ready.');
          },
        },
        handler: async (response: any) => {
          console.log('[PaymentStep] Step 4: Razorpay payment response received:', response);
          try {
            setIsPlacing(true);
            // Cryptographic verification on backend
            await verifyPaymentAction({
              orderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            console.log('[PaymentStep] Step 5: Verified! Clearing cart and redirecting...');
            await clearCart(true);
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('checkout_shipping_address');
            }
            toast.success('Payment verified! Your order has been placed.');
            router.push('/account/orders');
          } catch (verifyErr: any) {
            console.error('[PaymentStep] Payment verification error:', verifyErr);
            toast.error(
              verifyErr.message || 'Payment verification failed. Please contact support.',
            );
          } finally {
            setIsPlacing(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        console.error('[PaymentStep] Payment failed:', resp.error);
        toast.error(resp.error?.description || 'Payment was unsuccessful. Please try again.');
        setIsPlacing(false);
      });

      rzp.open();
    } catch (err: any) {
      console.error('[PaymentStep] ERROR: Order placement failed:', err);
      toast.error(err.message || 'Failed to place order. Please try again.');
      setIsPlacing(false);
    } finally {
      console.log('[PaymentStep] ---------------- ORDER PROCESS FINISHED ----------------');
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen px-4 pt-[108px] pb-20 transition-colors duration-300 sm:pt-[116px] md:px-6 lg:pt-[170px] lg:pb-8">
      <CheckoutProgress currentStage={3} />

      <main className="mx-auto max-w-4xl pt-0 sm:pt-1">
        <div className="space-y-10">
          {/* Delivery Destination Card */}
          {shippingAddress && (
            <div className="border-border bg-background shadow-foreground/5 flex items-start justify-between rounded-3xl border p-5 shadow-sm transition-all">
              <div className="flex gap-4">
                <div className="bg-foreground text-background flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <MapPinIcon size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground-subtle text-[10px] font-black tracking-widest uppercase">
                      Delivering To
                    </span>
                    <span className="text-xs font-black uppercase text-foreground">
                      {shippingAddress.recipientName}
                    </span>
                  </div>
                  <p className="text-foreground-muted mt-1 text-xs font-semibold uppercase">
                    {shippingAddress.building ? `${shippingAddress.building}, ` : ''}
                    {shippingAddress.area}
                  </p>
                  <p className="text-foreground-muted text-xs font-semibold uppercase">
                    {shippingAddress.city}
                    {shippingAddress.district ? `, ${shippingAddress.district}` : ''}
                    {shippingAddress.state ? `, ${shippingAddress.state}` : ''} - {shippingAddress.pincode}
                  </p>
                  <p className="text-foreground-muted mt-1 text-[11px] font-semibold">
                    Phone: +91 {shippingAddress.primaryPhone}
                    {shippingAddress.altPhone ? ` | Alt: +91 ${shippingAddress.altPhone}` : ''}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push('/checkout/review')}
                className="border-border text-foreground hover:border-foreground cursor-pointer rounded-lg border px-3 py-1.5 text-[10px] font-black tracking-widest uppercase transition-all active:scale-95 shrink-0"
              >
                Change
              </button>
            </div>
          )}

          {/* Header Section */}
          <div className="flex items-center justify-between px-2">
            <h2 className="text-foreground-subtle text-[9px] font-black tracking-[0.3em] uppercase">
              Payment Selection
            </h2>
            <button
              onClick={() => {
                setShowInfo(true);
              }}
              className="hover:text-foreground-subtle flex items-center gap-2 text-[9px] font-black tracking-widest uppercase transition-colors"
            >
              Payment Policy <InfoIcon size={14} />
            </button>
          </div>

          {/* Payment Options Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* PRE-PAY CARD */}
            <button
              onClick={() => {
                setPaymentMethod('prepay');
              }}
              className={`group flex items-center justify-between rounded-3xl border p-6 transition-all duration-300 ${
                paymentMethod === 'prepay'
                  ? 'border-foreground bg-foreground text-background shadow-xl'
                  : 'border-border bg-background hover:bg-background-muted'
              }`}
            >
              <div className="flex items-center gap-4 text-left">
                <div
                  className={`rounded-xl p-3 ${
                    paymentMethod === 'prepay'
                      ? 'bg-background text-foreground'
                      : 'bg-background-muted'
                  }`}
                >
                  <CreditCardIcon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight uppercase italic">
                    UPI / Online Payment
                  </h3>
                  <p className="mt-0.5 text-[9px] font-bold tracking-widest uppercase opacity-60">
                    GPay, PhonePe, Paytm, QR, Cards
                  </p>
                </div>
              </div>
            </button>

            {/* COD CARD */}
            <button
              onClick={() => {
                setPaymentMethod('cod');
              }}
              className={`group flex items-center justify-between rounded-3xl border p-6 transition-all duration-300 ${
                paymentMethod === 'cod'
                  ? 'border-foreground bg-foreground text-background shadow-xl'
                  : 'border-border bg-background hover:bg-background-muted'
              }`}
            >
              <div className="flex items-center gap-4 text-left">
                <div
                  className={`rounded-xl p-3 ${
                    paymentMethod === 'cod'
                      ? 'bg-background text-foreground'
                      : 'bg-background-muted'
                  }`}
                >
                  <TruckIcon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight uppercase italic">
                    Cash on Delivery
                  </h3>
                  <p className="mt-0.5 text-[9px] font-bold tracking-widest uppercase opacity-60">
                    Pay at Doorstep (+₹200 Fee)
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Contextual Banners */}
          <AnimatePresence mode="wait">
            {paymentMethod === 'cod' ? (
              <motion.div
                key="cod"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative flex items-center gap-5 rounded-3xl border border-orange-500/20 bg-orange-500/5 p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                  <ShieldCheckIcon size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black tracking-widest text-orange-600 uppercase">
                    COD Policy Applied
                  </p>
                  <p className="text-[10px] leading-relaxed font-bold tracking-widest text-orange-800/60 uppercase">
                    An extra fee of{' '}
                    <span className="font-black text-orange-600">₹{codServiceFee}</span> is added
                    for logistics handling. Choose UPI/Online for free delivery.
                  </p>
                </div>
                <span className="text-background absolute -top-4 left-5 rounded-t-4xl bg-orange-500 px-8 text-xs font-semibold tracking-wider uppercase">
                  Info
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="prepay"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative flex items-center gap-5 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
                  <ZapIcon size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">
                    Prepay Benefit
                  </p>
                  <p className="text-[10px] leading-relaxed font-bold tracking-widest text-emerald-800/60 uppercase">
                    Enjoy{' '}
                    <span className="text-xs font-black text-emerald-600 italic underline underline-offset-2">
                      Free Shipping
                    </span>{' '}
                    and priority dispatch on all UPI & online orders.
                  </p>
                </div>
                <span className="text-background absolute -top-4 left-5 rounded-t-4xl bg-emerald-600 px-8 text-xs font-semibold tracking-wider uppercase">
                  Info
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* STICKY FOOTER */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center">
        <div className="border-border/40 bg-background/95 w-full overflow-hidden rounded-t-[3rem] border-t pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_20px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
          <div className="mx-auto max-w-lg px-6">
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-foreground-subtle space-y-3 p-4 text-[10px] font-bold tracking-widest uppercase"
                >
                  <div className="flex justify-between">
                    <span>Product Subtotal</span>
                    <span className="text-foreground font-black">₹{baseTotal}</span>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between text-orange-500">
                      <span>COD Service Fee</span>
                      <span>+₹{codServiceFee}</span>
                    </div>
                  )}
                  <div className="bg-border h-px w-full" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex w-full items-center justify-between gap-3 pt-2">
              <div
                className="flex cursor-pointer flex-col px-2"
                onClick={() => {
                  setIsExpanded(!isExpanded);
                }}
              >
                <p className="text-foreground-muted mb-0.5 flex items-center gap-1.5 text-[8.5px] font-black tracking-widest text-nowrap uppercase">
                  Final Payable{' '}
                  <span
                    className={`inline-block transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <ChevronUpIcon size={10} />
                  </span>
                </p>
                <p className="text-foreground text-2xl leading-tight font-black italic">
                  ₹{totalAmount}
                </p>
              </div>
              <button
                type="button"
                disabled={isPlacing}
                onClick={handlePlaceOrder}
                className="flex h-12 flex-1 -skew-x-[12deg] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border border-zinc-800 bg-black px-6 text-white shadow-lg transition-transform outline-none active:scale-95 disabled:opacity-50 dark:border-zinc-300 dark:bg-white dark:text-black"
              >
                <span className="flex skew-x-[12deg] items-center gap-2 text-xs font-black tracking-[0.2em] whitespace-nowrap uppercase">
                  {isPlacing
                    ? 'Processing...'
                    : paymentMethod === 'cod'
                      ? 'Place Order'
                      : 'Pay via UPI'}
                  {!isPlacing && <ChevronRightIcon size={16} />}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Modal Overlay */}
      <AnimatePresence>
        {showInfo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowInfo(false);
              }}
              className="bg-background/30 fixed inset-0 z-[60] backdrop-blur-md"
            />
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-background border-border fixed top-1/2 left-1/2 z-[70] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-[2.5rem] border p-8 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tighter uppercase italic">
                  Payments Info
                </h3>
                <button
                  onClick={() => {
                    setShowInfo(false);
                  }}
                  className="bg-background-muted rounded-full p-2"
                >
                  <CloseIcon size={16} />
                </button>
              </div>
              <div className="text-foreground-muted space-y-6 text-[9px] leading-loose font-bold tracking-widest uppercase">
                <p>
                  <span className="font-black text-emerald-500">UPI / Online:</span> Enjoy 100% Free
                  Shipping and priority processing. Pay securely via Google Pay, PhonePe, Paytm, or
                  UPI QR.
                </p>
                <p>
                  <span className="font-black text-orange-500">COD:</span> An extra ₹200 fee is
                  applied for courier cash-handling logistics.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
