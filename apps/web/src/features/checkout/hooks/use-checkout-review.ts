'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { cleanPhoneDigits, formatPhone334 } from '@/features/addresses';
import {
  createAddressAction,
  fetchUserAddressesAction,
} from '@/features/addresses/services/addresses.actions';
import { type Address } from '@/features/addresses/types';
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

export function addressToDetails(addr: Address): AddressDetails {
  return {
    id: addr.id,
    recipientName: addr.name,
    primaryPhone: addr.phone,
    altPhone: addr.altPhone || '',
    pincode: addr.pincode,
    building: addr.addressLine1 || '',
    area: addr.addressLine2 || '',
    landmark: addr.landmark || '',
    city: addr.city || '',
    district: addr.district || '',
    state: addr.state || '',
  };
}

export function useCheckoutReview() {
  const [address, setAddress] = useState<AddressDetails | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('checkout_shipping_address');
        if (stored) {
          return JSON.parse(stored) as AddressDetails;
        }
      } catch {
        // ignore
      }
    }
    return null;
  });
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showAddressDrawer, setShowAddressDrawer] = useState(false);
  const [addressDrawerMode, setAddressDrawerMode] = useState<'list' | 'add'>('add');
  const [pendingAddress, setPendingAddress] = useState<AddressDetails | null>(null);
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

  // Load saved addresses for authenticated users and set default/active
  useEffect(() => {
    async function loadUserAddresses() {
      if (!user) {
        setSavedAddresses([]);
        return;
      }
      setIsLoadingAddresses(true);
      try {
        const fetched = await fetchUserAddressesAction();
        setSavedAddresses(fetched);
        if (fetched.length > 0) {
          setAddress((current) => {
            if (current?.id && fetched.some((a) => a.id === current.id)) {
              return current;
            }
            const defaultOrFirst = fetched.find((a) => a.isDefault) || fetched[0];
            const loaded = addressToDetails(defaultOrFirst);
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('checkout_shipping_address', JSON.stringify(loaded));
            }
            return loaded;
          });
        }
      } catch (err) {
        console.error('Failed to load user addresses in checkout:', err);
      } finally {
        setIsLoadingAddresses(false);
      }
    }
    void loadUserAddresses();
  }, [user]);

  const handleOpenAddressSelection = useCallback(() => {
    if (savedAddresses.length > 0) {
      setAddressDrawerMode('list');
    } else {
      setAddressDrawerMode('add');
    }
    setShowAddressDrawer(true);
  }, [savedAddresses.length]);

  const handleSelectSavedAddress = useCallback((addr: Address) => {
    const selected = addressToDetails(addr);
    setAddress(selected);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('checkout_shipping_address', JSON.stringify(selected));
    }
    setShowAddressDrawer(false);
    toast.success(`Delivering to ${selected.recipientName}`);
  }, []);

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
        setShowAddressDrawer(false);
        try {
          await sendOtpAction(cleanPhone);
          setShowOTPModal(true);
          toast.success(`OTP sent to +91 ${formatPhone334(cleanPhone)} via WhatsApp`);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Failed to send verification code';
          toast.error(msg);
          setShowAddressDrawer(true);
        }
        return;
      }

      // User is already authenticated: persist directly to backend
      setIsSavingAddress(true);
      try {
        const saved = await createAddressAction({
          name: data.recipientName.trim(),
          phone: cleanPhone,
          altPhone: data.altPhone ? cleanPhoneDigits(data.altPhone) : undefined,
          pincode: data.pincode.trim(),
          addressLine1: data.building?.trim() || '',
          addressLine2: data.area.trim(),
          landmark: data.landmark?.trim() || undefined,
          city: data.city.trim(),
          district: data.district?.trim() || '',
          state: data.state?.trim() || '',
          type: 'Home',
          isDefault: savedAddresses.length === 0,
        });

        if (saved) {
          setSavedAddresses((prev) => [saved, ...prev.filter((a) => a.id !== saved.id)]);
        }

        const finalAddress: AddressDetails = {
          ...data,
          id: saved?.id || data.id,
          district: saved?.district || data.district || '',
          state: saved?.state || data.state || '',
        };

        setAddress(finalAddress);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('checkout_shipping_address', JSON.stringify(finalAddress));
        }
        setShowAddressDrawer(false);
        toast.success('Shipping address saved!');
      } catch (err) {
        console.error('Failed to persist checkout address:', err);
        setAddress(data);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('checkout_shipping_address', JSON.stringify(data));
        }
        setShowAddressDrawer(false);
      } finally {
        setIsSavingAddress(false);
      }
    },
    [user, savedAddresses.length],
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
        let savedAddressRecord: Address | null = null;
        try {
          savedAddressRecord = await createAddressAction({
            name: targetAddress.recipientName.trim(),
            phone: cleanPhone,
            altPhone: targetAddress.altPhone ? cleanPhoneDigits(targetAddress.altPhone) : undefined,
            pincode: targetAddress.pincode.trim(),
            addressLine1: targetAddress.building?.trim() || '',
            addressLine2: targetAddress.area.trim(),
            landmark: targetAddress.landmark?.trim() || undefined,
            city: targetAddress.city.trim(),
            district: targetAddress.district?.trim() || '',
            state: targetAddress.state?.trim() || '',
            type: 'Home',
            isDefault: true,
          });
        } catch (saveErr) {
          console.error('Failed to save address after checkout verification:', saveErr);
        }

        if (savedAddressRecord) {
          setSavedAddresses((prev) => [savedAddressRecord!, ...prev]);
        }

        const finalAddress: AddressDetails = {
          ...targetAddress,
          id: savedAddressRecord?.id || targetAddress.id,
        };
        setAddress(finalAddress);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('checkout_shipping_address', JSON.stringify(finalAddress));
        }
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
    toast.success(`New verification code sent to +91 ${formatPhone334(cleanPhone)} via WhatsApp`);
  }, [pendingAddress, address]);

  /**
   * Continue button click handler:
   * If no address, open address drawer.
   * If address exists but user not logged in, trigger OTP verification modal for that phone.
   * If logged in, proceed directly to payment.
   */
  const handleContinue = useCallback(() => {
    if (!address) {
      handleOpenAddressSelection();
    } else if (!user) {
      const cleanPhone = cleanPhoneDigits(address.primaryPhone);
      setPendingAddress(address);
      void sendOtpAction(cleanPhone)
        .then(() => {
          setShowOTPModal(true);
          toast.success(`OTP sent to +91 ${formatPhone334(cleanPhone)} via WhatsApp`);
        })
        .catch((err: unknown) => {
          toast.error(err instanceof Error ? err.message : 'Failed to send OTP');
        });
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('checkout_shipping_address', JSON.stringify(address));
      }
      const queryParam = address.id ? `?addressId=${encodeURIComponent(address.id)}` : '';
      router.push(`/checkout/payment${queryParam}`);
    }
  }, [address, user, router, handleOpenAddressSelection]);

  return {
    address,
    setAddress,
    savedAddresses,
    isLoadingAddresses,
    handleSelectSavedAddress,
    handleOpenAddressSelection,
    addressDrawerMode,
    setAddressDrawerMode,
    showAddressDrawer,
    setShowAddressDrawer,
    showAddressForm: showAddressDrawer,
    setShowAddressForm: setShowAddressDrawer,
    pendingAddress,
    handleSaveAddress,
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
}
