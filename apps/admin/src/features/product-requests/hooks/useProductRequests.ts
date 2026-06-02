'use client';

import { useEffect, useState } from 'react';

export interface ProductRequest {
  id: string;
  productName: string;
  imageUrl: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

export function useProductRequests() {
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';

  const fetchRequests = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/product-requests/admin`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Failed to fetch product requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    isLoading,
    refreshRequests: fetchRequests,
  };
}
