import { useEffect, useMemo, useRef, useState } from 'react';

import { useAuthStore } from '@/store/auth-store';

import { type Address, type PincodeAPIResponse } from '../types';
import { cleanPhoneDigits, formatPhone334 } from '../utils/phone';

export function useAddressForm(initialData: Address | null, isFirstAddress: boolean) {
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState<Partial<Address>>(() => {
    if (initialData) {
      return {
        ...initialData,
        phone: formatPhone334(initialData.phone ?? ''),
        altPhone: initialData.altPhone ? formatPhone334(initialData.altPhone) : '',
      };
    }
    const rawCleanPhone = user?.phone ? user.phone.replace(/\D/g, '').slice(-10) : '';
    const cleanPhone = rawCleanPhone ? formatPhone334(rawCleanPhone) : '';
    const cleanName = user?.name ?? '';
    return {
      type: 'Home',
      isDefault: isFirstAddress || false,
      phone: cleanPhone,
      name: cleanName,
    };
  });
  const [loading, setLoading] = useState(false);
  const altPhoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!initialData && user) {
      setFormData((prev) => {
        const rawCleanPhone = user.phone ? user.phone.replace(/\D/g, '').slice(-10) : '';
        const cleanPhone = rawCleanPhone ? formatPhone334(rawCleanPhone) : '';
        const cleanName = user.name ?? '';
        let hasChanges = false;
        const next = { ...prev };

        if (!prev.phone && cleanPhone) {
          next.phone = cleanPhone;
          hasChanges = true;
        }
        if (!prev.name && cleanName) {
          next.name = cleanName;
          hasChanges = true;
        }

        return hasChanges ? next : prev;
      });
    }
  }, [user, initialData]);

  const isFormValid = useMemo(() => {
    const requiredFields = [
      formData.name,
      formData.phone,
      formData.pincode,
      formData.addressLine2,
      formData.city,
    ];
    return (
      requiredFields.every((f) => f && f.trim().length > 0) &&
      cleanPhoneDigits(formData.phone ?? '').length === 10 &&
      formData.pincode?.length === 6 &&
      !!formData.district
    );
  }, [formData]);

  useEffect(() => {
    if (cleanPhoneDigits(formData.phone ?? '').length === 10) {
      altPhoneRef.current?.focus();
    }
  }, [formData.phone]);

  useEffect(() => {
    if (formData.pincode?.length === 6) {
      const fetchRegion = async () => {
        setLoading(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode ?? ''}`);
          const data = (await res.json()) as PincodeAPIResponse[];

          if (data[0]?.Status === 'Success' && data[0].PostOffice) {
            const details = data[0].PostOffice[0];
            setFormData((prev) => ({
              ...prev,
              state: details.State,
              district: details.District,
            }));
          } else {
            setFormData((prev) => ({ ...prev, state: '', district: '' }));
          }
        } catch {
          setFormData((prev) => ({ ...prev, state: '', district: '' }));
        } finally {
          setLoading(false);
        }
      };
      void fetchRegion();
    } else if (formData.district || formData.state) {
      queueMicrotask(() => {
        setFormData((prev) => ({ ...prev, state: '', district: '' }));
      });
    }
  }, [formData.pincode, formData.district, formData.state]);

  return {
    formData,
    setFormData,
    loading,
    altPhoneRef,
    isFormValid,
  };
}
