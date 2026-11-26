'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  AlertCircleIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CloseIcon,
  CreditCardIcon,
  InfoIcon,
  LockIcon,
  MapPinIcon,
  PackageIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
  TruckIcon,
  VerifiedIcon,
  ZapIcon,
} from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';

import {
  cancelPendingOrderAction,
  createOrderAction,
  verifyPaymentAction,
} from '@/features/orders/services/orders.actions';
import { api } from '@/lib/api-client';
import { loadRazorpayScript } from '@/lib/load-razorpay';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';

import { useCheckoutPayment } from '../hooks/use-checkout-payment';
import { CheckoutProgress } from './checkout-progress';
import { CheckoutWhatsAppHelp } from './checkout-whatsapp-help';

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
    payableAmount,
    balanceDue,
    totalAmount,
    isCodEligible,
    cartItems,
    isBuyNowMode,
    buyNowItem,
  } = useCheckoutPayment();
  const router = useRouter();
  const [isPlacing, setIsPlacing] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState<string | null>(null);

  const clearCart = useCartStore((state) => state.clearCart);
  const removeItemByProduct = useCartStore((state) => state.removeItemByProduct);
  const setBuyNowItem = useCartStore((state) => state.setBuyNowItem);
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
      'Payable Now:',
      payableAmount,
      'Balance Due:',
      balanceDue,
      'Total Order:',
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
      setPaymentError(null);
      setIsPlacing(true);

      const recipientName = (
        shippingAddress.recipientName ||
        (shippingAddress as any).fullName ||
        user.name ||
        'Valued Customer'
      ).trim();
      const rawPhone =
        shippingAddress.primaryPhone || (shippingAddress as any).phoneNumber || user.phone || '';
      const primaryPhone = rawPhone.replace(/\D/g, '').slice(-10);
      const rawAlt = shippingAddress.altPhone || (shippingAddress as any).altPhoneNumber || '';
      const altPhone = rawAlt ? String(rawAlt).replace(/\D/g, '').slice(-10) : null;
      const street = (
        shippingAddress.area ||
        (shippingAddress as any).street ||
        shippingAddress.building ||
        'Address'
      ).trim();
      const city = (shippingAddress.city || '').trim();
      const pincode = (shippingAddress.pincode || '').replace(/\D/g, '').slice(0, 6);

      const shippingPayload = {
        id: shippingAddress.id,
        fullName: recipientName,
        phoneNumber: primaryPhone,
        altPhoneNumber: altPhone,
        building: shippingAddress.building?.trim() || null,
        street,
        city,
        district: shippingAddress.district?.trim() || '',
        state: shippingAddress.state?.trim() || '',
        pincode,
        landmark: shippingAddress.landmark?.trim() || null,
      };

      // Initiate order on server (Both COD and PREPAY initiate via Razorpay)
      // COD collects ₹200 advance deposit online; Prepay collects 100% online
      console.log(
        `[PaymentStep] Step 2: Initiating ${paymentMethod.toUpperCase()} order on server...`,
      );
      const isCod = paymentMethod === 'cod';
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

      const orderPayload = {
        paymentMethod: isCod ? ('COD' as const) : ('RAZORPAY' as const),
        addressId: shippingAddress.id,
        shippingAddress: shippingPayload,
        items:
          isBuyNowMode && buyNowItem
            ? [
                {
                  productId: buyNowItem.productId,
                  size: buyNowItem.size,
                  color: buyNowItem.color,
                  quantity: buyNowItem.quantity || 1,
                },
              ]
            : undefined,
      };

      let initRes: any;
      try {
        initRes = await createOrderAction({
          ...orderPayload,
          token: localToken || undefined,
        });
      } catch (actionErr: any) {
        console.warn(
          '[PaymentStep] Server action createOrderAction failed, attempting client fallback:',
          actionErr,
        );
      }

      // If Server Action was rejected or unauthorized, attempt resilient client-side api.post with auto-refresh
      if (!initRes?.success) {
        console.log('[PaymentStep] Attempting order creation via client api.post fallback...');
        try {
          const clientResult = await api.post<any>('/orders', orderPayload);
          initRes = {
            success: true,
            ...clientResult,
          };
        } catch (clientErr: any) {
          console.error('[PaymentStep] Both createOrderAction and api.post failed:', clientErr);
          const errorMsg =
            clientErr?.message || initRes?.error || 'Failed to initiate payment session';
          if (
            errorMsg.toLowerCase().includes('unauthorized') ||
            errorMsg.includes('401') ||
            errorMsg.toLowerCase().includes('authentication required')
          ) {
            toast.error('Your session has expired. Please sign in to complete your order.');
            router.push('/login?redirect=/checkout/payment');
            return;
          }
          throw new Error(errorMsg);
        }
      }

      console.log('[PaymentStep] Step 3: Server session created:', initRes);

      if (!initRes?.success || initRes.error) {
        throw new Error(initRes?.error || 'Failed to initiate payment session from server');
      }

      const rzpData = initRes?.razorpay;
      const order = initRes?.order;

      if (!rzpData || !order) {
        throw new Error('Failed to initiate payment session from server');
      }

      const advancePaid = initRes?.advanceAmount || (isCod ? 200 : order.finalAmount);
      const balanceDue =
        initRes?.balanceDue ?? Math.max(0, Number(order.finalAmount) - Number(advancePaid));

      const keyId = rzpData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!keyId) {
        setIsPlacing(false);
        throw new Error('Online payment gateway configuration is missing. Please contact support.');
      }

      // Load official Razorpay Checkout SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setIsPlacing(false);
        throw new Error(
          'Unable to load payment gateway SDK. Please check your internet connection.',
        );
      }

      const options = {
        key: keyId,
        amount: rzpData.amount,
        currency: rzpData.currency || 'INR',
        name: 'Fashion Friday',
        description: isCod
          ? `COD Advance Deposit (₹${advancePaid}) - Order #${order.orderNumber}`
          : `Order #${order.orderNumber}`,
        order_id: rzpData.orderId,
        prefill: {
          name: user.name || '',
          contact: user.phone || '',
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: async () => {
            setIsPlacing(false);
            setPaymentError(
              'Payment window was closed before completion. Your items are still saved—you can retry or chat with us on WhatsApp.',
            );
            toast.info(
              'Payment was cancelled. Your order has not been placed and your items remain in your cart.',
            );
            try {
              const activeToken =
                typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
              await cancelPendingOrderAction(order.id, activeToken || undefined);
            } catch (dismissErr) {
              console.warn('[PaymentStep] Cancel pending order notice:', dismissErr);
            }
          },
        },
        handler: async (response: any) => {
          console.log('[PaymentStep] Step 4: Razorpay payment response received:', response);
          try {
            setIsPlacing(true);
            const activeToken =
              typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

            const verifyPayload = {
              orderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };

            let verifyRes: any;
            try {
              verifyRes = await verifyPaymentAction({
                ...verifyPayload,
                token: activeToken || undefined,
              });
            } catch (vErr) {
              console.warn(
                '[PaymentStep] Server verifyPaymentAction failed, trying api.post fallback:',
                vErr,
              );
            }

            if (!verifyRes?.success) {
              const clientVerify = await api.post<any>('/orders/verify-payment', verifyPayload);
              verifyRes = { success: true, ...clientVerify };
            }

            if (!verifyRes?.success || verifyRes.error) {
              throw new Error(verifyRes?.error || 'Payment verification failed');
            }
            console.log('[PaymentStep] Step 5: Verified! Clearing cart and redirecting...');
            if (isBuyNowMode && buyNowItem) {
              await removeItemByProduct(buyNowItem.productId, buyNowItem.size, true);
              setBuyNowItem(null);
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('ff_buy_now_item');
              }
            } else {
              await clearCart(true);
            }
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('checkout_shipping_address');
            }
            if (isCod) {
              toast.success(
                `₹${advancePaid} Advance Paid! COD Order placed successfully. Balance of ₹${balanceDue} payable on delivery.`,
              );
            } else {
              toast.success('Payment verified! Your order has been placed.');
            }
            router.push('/account/orders');
          } catch (verifyErr: any) {
            console.error('[PaymentStep] Payment verification error:', verifyErr);
            const msg = verifyErr.message || 'Payment verification failed. Please contact support.';
            setPaymentError(msg);
            toast.error(msg);
          } finally {
            setIsPlacing(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', async (resp: any) => {
        console.error('[PaymentStep] Payment failed:', resp.error);
        const errMsg = resp.error?.description || 'Payment was unsuccessful. Please try again.';
        setPaymentError(errMsg);
        toast.error(errMsg);
        setIsPlacing(false);
        try {
          const activeToken =
            typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
          await cancelPendingOrderAction(order.id, activeToken || undefined);
        } catch (failErr) {
          console.warn('[PaymentStep] Cancel pending order notice:', failErr);
        }
      });

      rzp.open();
    } catch (err: any) {
      console.error('[PaymentStep] ERROR: Order placement failed:', err);
      const errMsg = err.message || 'Failed to place order. Please try again.';
      setPaymentError(errMsg);
      toast.error(errMsg);
      setIsPlacing(false);
    } finally {
      console.log('[PaymentStep] ---------------- ORDER PROCESS FINISHED ----------------');
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen px-4 pt-[108px] pb-36 transition-colors duration-300 sm:pt-[116px] md:px-6 lg:pt-[170px] lg:pb-32">
      <CheckoutProgress currentStage={3} />

      <main className="mx-auto max-w-4xl pt-0 sm:pt-1">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between px-2">
            <h2 className="text-foreground-subtle text-[10px] font-black tracking-[0.25em] uppercase">
              Payment Selection
            </h2>
            <button
              onClick={() => {
                setShowInfo(true);
              }}
              className="hover:text-foreground-subtle flex items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-colors"
            >
              Payment Policy <InfoIcon size={14} />
            </button>
          </div>

          {/* Compact Order & Delivery Context */}
          {(cartItems.length > 0 || shippingAddress) && (
            <div className="border-border bg-background-muted/30 grid grid-cols-1 gap-3 rounded-2xl border p-4 sm:grid-cols-2">
              {cartItems.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="bg-background-muted text-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                    <PackageIcon size={17} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-foreground-muted text-[10px] font-bold tracking-wider uppercase">
                      Order Summary ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                    </p>
                    <p className="text-foreground truncate text-xs font-bold">
                      {cartItems[0]?.product?.name || 'Selected Item'}
                      {cartItems.length > 1 ? ` +${cartItems.length - 1} more` : ''} • ₹
                      {baseTotal.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              )}

              {shippingAddress && (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="bg-background-muted text-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                      <MapPinIcon size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground-muted text-[10px] font-bold tracking-wider uppercase">
                        Delivering To
                      </p>
                      <p className="text-foreground truncate text-xs font-bold">
                        {shippingAddress.recipientName || 'Customer'}
                        {shippingAddress.city ? `, ${shippingAddress.city}` : ''}
                        {shippingAddress.pincode ? ` - ${shippingAddress.pincode}` : ''}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={isBuyNowMode ? '/checkout/review?mode=buy_now' : '/checkout/review'}
                    className="text-foreground-muted hover:text-foreground shrink-0 text-[11px] font-bold underline underline-offset-2"
                  >
                    Edit
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Payment Error / Dismiss Recovery Banner */}
          {paymentError && (
            <div className="space-y-3 rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <AlertCircleIcon size={18} className="mt-0.5 shrink-0 text-red-500" />
                  <div>
                    <p className="text-xs font-bold text-red-600 dark:text-red-400">
                      Payment could not be completed
                    </p>
                    <p className="text-foreground-muted mt-0.5 text-xs leading-relaxed">
                      {paymentError}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isPlacing}
                  onClick={handlePlaceOrder}
                  className="bg-foreground text-background shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  Retry
                </button>
              </div>
              <CheckoutWhatsAppHelp
                step="payment"
                items={cartItems}
                totalAmount={payableAmount}
                paymentMethod={paymentMethod}
                errorMessage={paymentError}
                variant="error"
              />
            </div>
          )}

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
              type="button"
              disabled={!isCodEligible}
              onClick={() => {
                if (!isCodEligible) {
                  toast.info('Cash on Delivery unavailable', {
                    description:
                      'One or more items in your cart require online payment (Prepaid Only).',
                  });
                  return;
                }
                setPaymentMethod('cod');
              }}
              className={`group flex items-center justify-between rounded-3xl border p-6 transition-all duration-300 ${
                !isCodEligible
                  ? 'border-border/60 bg-background-muted/40 cursor-not-allowed border-dashed opacity-60'
                  : paymentMethod === 'cod'
                    ? 'border-foreground bg-foreground text-background shadow-xl'
                    : 'border-border bg-background hover:bg-background-muted'
              }`}
            >
              <div className="flex items-center gap-4 text-left">
                <div
                  className={`rounded-xl p-3 ${
                    paymentMethod === 'cod' && isCodEligible
                      ? 'bg-background text-foreground'
                      : 'bg-background-muted'
                  }`}
                >
                  <TruckIcon size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black tracking-tight uppercase italic">
                      Cash on Delivery
                    </h3>
                    {!isCodEligible && (
                      <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[9px] font-black text-amber-600 uppercase dark:bg-amber-500/20 dark:text-amber-400">
                        Prepaid Only
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[9px] font-bold tracking-widest uppercase opacity-60">
                    {!isCodEligible
                      ? 'Not eligible for items in your cart'
                      : 'Pay ₹200 Advance Online + Balance on Delivery'}
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Non-COD items notification banner */}
          {!isCodEligible && (
            <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs font-medium text-amber-800 dark:text-amber-300">
              <span className="flex h-2 w-2 shrink-0 rounded-full bg-amber-500" />
              <p className="text-[11px] leading-relaxed">
                <strong className="font-bold">Notice:</strong> Cash on Delivery is disabled because
                one or more products in your order are marked as <strong>Prepaid Only</strong>.
                Please pay online via UPI, Cards, or Netbanking.
              </p>
            </div>
          )}

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
                  <p className="text-xs font-bold tracking-wide text-orange-600 uppercase">
                    COD Policy: ₹{payableAmount} Advance (Deducted from Total)
                  </p>
                  <p className="text-xs leading-relaxed text-orange-900/80 dark:text-orange-200/80">
                    Why ₹{payableAmount} advance? It confirms genuine orders and prevents fake COD
                    bookings.{' '}
                    <span className="font-bold text-orange-600 dark:text-orange-400">
                      ₹{payableAmount} is deducted from your bill
                    </span>
                    —you pay only{' '}
                    <span className="font-bold text-orange-600 dark:text-orange-400">
                      ₹{balanceDue}
                    </span>{' '}
                    in cash on delivery.
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

          {/* Secured by Razorpay & Trust Badges */}
          <div className="border-border bg-background-muted/20 rounded-3xl border p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <LockIcon size={15} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-foreground text-xs font-bold">
                  100% Secure Checkout • Powered by Razorpay
                </span>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                256-Bit SSL Encrypted
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="border-border/60 bg-background flex items-start gap-3 rounded-2xl border p-3.5">
                <VerifiedIcon
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                />
                <div>
                  <p className="text-foreground text-xs font-bold">100% Authentic</p>
                  <p className="text-foreground-muted mt-0.5 text-[11px] leading-snug">
                    Quality checked before dispatch with instant order confirmation.
                  </p>
                </div>
              </div>

              <div className="border-border/60 bg-background flex items-start gap-3 rounded-2xl border p-3.5">
                <RefreshCcwIcon
                  size={17}
                  className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                />
                <div>
                  <p className="text-foreground text-xs font-bold">Easy Returns & Exchange</p>
                  <p className="text-foreground-muted mt-0.5 text-[11px] leading-snug">
                    Hassle-free size exchange and return support on eligible orders.
                  </p>
                </div>
              </div>

              <Link
                href="/whatsapp-reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="border-border/60 bg-background hover:border-foreground/30 flex items-start gap-3 rounded-2xl border p-3.5 transition-colors"
              >
                <CheckCircleIcon
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                />
                <div>
                  <p className="text-foreground text-xs font-bold">Verified Customer Reviews</p>
                  <p className="text-foreground-muted mt-0.5 text-[11px] leading-snug">
                    View real customer feedback & delivery screenshots →
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* WhatsApp Assistance (Inline, non-blocking) */}
          {!paymentError && (
            <CheckoutWhatsAppHelp
              step="payment"
              items={cartItems}
              totalAmount={payableAmount}
              paymentMethod={paymentMethod}
            />
          )}
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
                    <span>Product Total</span>
                    <span className="text-foreground font-black">₹{baseTotal}</span>
                  </div>
                  {paymentMethod === 'cod' ? (
                    <>
                      <div className="flex justify-between text-orange-500">
                        <span>Online Advance Deposit</span>
                        <span>₹{payableAmount}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Balance Due on Delivery</span>
                        <span>₹{balanceDue}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-emerald-500">
                      <span>Shipping</span>
                      <span>FREE</span>
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
                  {paymentMethod === 'cod' ? 'COD Advance (Pay Online)' : 'Final Payable'}{' '}
                  <span
                    className={`inline-block transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <ChevronUpIcon size={10} />
                  </span>
                </p>
                <p className="text-foreground text-2xl leading-tight font-black italic">
                  ₹{payableAmount}
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
                      : 'Pay Now'}
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
                  <span className="font-black text-orange-500">COD (Cash on Delivery):</span>{' '}
                  Requires a ₹200 advance deposit online to confirm the order. The remaining balance
                  is payable in cash upon doorstep delivery.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
