'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { cleanPhoneDigits, formatPhone334 } from '@/features/addresses';
import {
  createAddressAction,
  fetchUserAddressesAction,
} from '@/features/addresses/services/addresses.actions';
import {
  sendOtpAction,
  signupAction,
  verifyOtpAction,
} from '@/features/auth/services/auth.actions';
import { useCart } from '@/features/cart';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';

import { type AddressDetails } from '../types';

export function useCheckoutReview() {
  const [address, setAddress] = useState<AddressDetails | null>(null);
  const [pendingAddress, setPendingAddress] = useState<AddressDetails | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!user;
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);

  const { cartItems, totals, isMounted } = useCart();
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  // Load default address for authenticated users if not already set
  useEffect(() => {
    async function loadDefaultAddress() {
      if (!user) {
        return;
      }
      try {
        const savedAddresses = await fetchUserAddressesAction();
        if (savedAddresses.length > 0) {
          const defaultOrFirst = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
          setAddress({
            pincode: defaultOrFirst.pincode,
            city: defaultOrFirst.city,
            area: defaultOrFirst.addressLine2,
            landmark: defaultOrFirst.landmark || '',
            building: defaultOrFirst.addressLine1 || '',
            recipientName: defaultOrFirst.name,
            primaryPhone: defaultOrFirst.phone,
            altPhone: defaultOrFirst.altPhone || '',
          });
        }
      } catch (err) {
        console.error('Failed to load user address in checkout:', err);
      }
    }
    void loadDefaultAddress();
  }, [user]);

  const pricing = {
    subtotal: totals.subtotal,
    discount: totals.discount,
    total: totals.total,
    itemCount: totals.itemCount,
  };

  /**
   * Save address from drawer:
   * If user is unauthenticated, send OTP to primary mobile number and prompt for verification.
   * If user is authenticated, save directly into user's database address table.
   */
  const handleSaveAddress = useCallback(
    async (data: AddressDetails) => {
      const cleanPhone = cleanPhoneDigits(data.primaryPhone);

      if (!user) {
        // Hold address in pending state, trigger OTP, and open verification modal
        setPendingAddress(data);
        setShowAddressForm(false);
        try {
          await sendOtpAction(cleanPhone);
          setShowOTPModal(true);
          toast.success(`OTP sent to +91 ${formatPhone334(cleanPhone)} (Test OTP: 786786)`);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Failed to send verification code';
          toast.error(msg);
          setShowAddressForm(true);
        }
        return;
      }

      // User is already authenticated: persist directly to backend
      setIsSavingAddress(true);
      try {
        await createAddressAction({
          name: data.recipientName.trim(),
          phone: cleanPhone,
          altPhone: data.altPhone ? cleanPhoneDigits(data.altPhone) : undefined,
          pincode: data.pincode.trim(),
          addressLine1: data.building?.trim() || '',
          addressLine2: data.area.trim(),
          landmark: data.landmark?.trim() || undefined,
          city: data.city.trim(),
          district: 'Malappuram',
          state: 'Kerala',
          type: 'Home',
          isDefault: true,
        });

        setAddress(data);
        setShowAddressForm(false);
        toast.success('Shipping address saved!');
      } catch (err) {
        console.error('Failed to persist checkout address:', err);
        setAddress(data);
        setShowAddressForm(false);
      } finally {
        setIsSavingAddress(false);
      }
    },
    [user],
  );

  /**
   * Verify checkout OTP:
   * 1. Verifies OTP.
   * 2. If new user, creates account using name & primary phone from address drawer (no email asked).
   * 3. Logs user in and sets tokens.
   * 4. Persists the pending address into the user's database address table.
   * 5. Sets the address as active shipping address.
   */
  const handleVerifyCheckoutOtp = useCallback(
    async (otp: string) => {
      const targetAddress = pendingAddress || address;
      if (!targetAddress) {
        throw new Error('No address details found. Please enter your address again.');
      }

      const cleanPhone = cleanPhoneDigits(targetAddress.primaryPhone);
      setIsVerifyingOtp(true);

      try {
        const verifyRes = await verifyOtpAction(cleanPhone, otp);
        let authUser = verifyRes.user;

        if (verifyRes.isNewUser) {
          // Automatic account signup without asking email or separate page
          const signupRes = await signupAction(
            cleanPhone,
            targetAddress.recipientName.trim(),
            `${cleanPhone}@fashionfriday.in`,
            verifyRes.otpToken,
          );
          authUser = signupRes.user;

          if (signupRes.accessToken && signupRes.refreshToken) {
            if (typeof window !== 'undefined') {
              localStorage.setItem('accessToken', signupRes.accessToken);
              localStorage.setItem('refreshToken', signupRes.refreshToken);
            }
          }
        } else {
          if (verifyRes.accessToken && verifyRes.refreshToken) {
            if (typeof window !== 'undefined') {
              localStorage.setItem('accessToken', verifyRes.accessToken);
              localStorage.setItem('refreshToken', verifyRes.refreshToken);
            }
          }
        }

        if (authUser) {
          useAuthStore.getState().login(authUser);
          void useCartStore.getState().syncWithServer(true);
          void useWishlistStore.getState().syncWithServer(true);
        }

        // Persist the address to user's database address table
        try {
          await createAddressAction({
            name: targetAddress.recipientName.trim(),
            phone: cleanPhone,
            altPhone: targetAddress.altPhone ? cleanPhoneDigits(targetAddress.altPhone) : undefined,
            pincode: targetAddress.pincode.trim(),
            addressLine1: targetAddress.building?.trim() || '',
            addressLine2: targetAddress.area.trim(),
            landmark: targetAddress.landmark?.trim() || undefined,
            city: targetAddress.city.trim(),
            district: 'Malappuram',
            state: 'Kerala',
            type: 'Home',
            isDefault: true,
          });
        } catch (saveErr) {
          console.error('Failed to save address after checkout verification:', saveErr);
        }

        setAddress(targetAddress);
        setPendingAddress(null);
        setShowOTPModal(false);
        setIsLoggedIn(true);
        toast.success('Account verified & address saved successfully!');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Invalid OTP. Please try again.';
        throw new Error(msg);
      } finally {
        setIsVerifyingOtp(false);
      }
    },
    [pendingAddress, address],
  );

  /**
   * Resend OTP for the pending address phone
   */
  const handleResendOtp = useCallback(async () => {
    const targetAddress = pendingAddress || address;
    if (!targetAddress) {
      return;
    }
    const cleanPhone = cleanPhoneDigits(targetAddress.primaryPhone);
    await sendOtpAction(cleanPhone);
    toast.success(
      `New verification code sent to +91 ${formatPhone334(cleanPhone)} (Test OTP: 786786)`,
    );
  }, [pendingAddress, address]);

  /**
   * Continue button click handler:
   * If no address, open address drawer.
   * If address exists but user not logged in, trigger OTP verification modal for that phone.
   * If logged in, proceed directly to payment.
   */
  const handleContinue = useCallback(() => {
    if (!address) {
      setShowAddressForm(true);
    } else if (!user) {
      const cleanPhone = cleanPhoneDigits(address.primaryPhone);
      setPendingAddress(address);
      void sendOtpAction(cleanPhone)
        .then(() => {
          setShowOTPModal(true);
          toast.success(`OTP sent to +91 ${formatPhone334(cleanPhone)} (Test OTP: 786786)`);
        })
        .catch((err: unknown) => {
          toast.error(err instanceof Error ? err.message : 'Failed to send OTP');
        });
    } else {
      router.push('/checkout/payment');
    }
  }, [address, user, router]);

  return {
    address,
    setAddress,
    pendingAddress,
    handleSaveAddress,
    showAddressForm,
    setShowAddressForm,
    isExpanded,
    setIsExpanded,
    isLoggedIn,
    setIsLoggedIn,
    showOTPModal,
    setShowOTPModal,
    pricing,
    cartItems,
    isMounted,
    handleContinue,
    handleVerifyCheckoutOtp,
    handleResendOtp,
    isVerifyingOtp,
    isSavingAddress,
  };
}
