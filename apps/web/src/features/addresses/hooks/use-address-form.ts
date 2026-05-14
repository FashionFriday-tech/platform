'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

import { type Address, type PincodeAPIResponse } from '../types';

export function useAddressForm(initialData: Address | null, isFirstAddress: boolean) {
  const [formData, setFormData] = useState<Partial<Address>>(
    initialData ?? { type: 'Home', isDefault: isFirstAddress || false },
  );
  const [loading, setLoading] = useState(false);
  const altPhoneRef = useRef<HTMLInputElement>(null);

  const isFormValid = useMemo(() => {
    const requiredFields = [
      formData.name,
      formData.phone,
      formData.pincode,
      formData.addressLine1,
      formData.addressLine2,
      formData.city,
    ];
    return (
      requiredFields.every((f) => f && f.trim().length > 0) &&
      formData.phone?.length === 10 &&
      formData.pincode?.length === 6 &&
      !!formData.district
    );
  }, [formData]);

  useEffect(() => {
    if (formData.phone?.length === 10) {
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
