'use client';

import React, { useEffect, useState } from 'react';

import { OrderDetailsView } from '../../../features/orders/components/OrderDetailsView';
import { api } from '../../../lib/api-client';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        const resolvedParams = await params;
        const data: any = await api.get(`/orders/${resolvedParams.id}`);
        if (!data) {
          setError(true);
          return;
        }

        const address =
          typeof data.shippingAddress === 'string'
            ? JSON.parse(data.shippingAddress)
            : data.shippingAddress || {};

        // map data to match admin shape
        const mapped = {
          ...data,
          status: data.status?.toLowerCase() || 'pending',
          customer: {
            id: data.userId,
            name: address?.fullName || data.user?.name || 'Unknown',
            phone: address?.phoneNumber || data.user?.phone || '',
            altPhone: address?.altPhoneNumber || data.user?.altPhone,
            email: data.user?.email,
          },
          shippingAddress: {
            fullName: address?.fullName || data.user?.name || '',
            phoneNumber: address?.phoneNumber || data.user?.phone || '',
            altPhoneNumber: address?.altPhoneNumber || data.user?.altPhone || '',
            street: address?.street || '',
            building: address?.building || '',
            landmark: address?.landmark || '',
            city: address?.city || '',
            district: address?.district || '',
            state: address?.state || '',
            pincode: address?.pincode || '',
          },
          totalAmount: Number(data.totalAmount ?? 0),
          discountAmount: Number(data.discountAmount ?? 0),
          shippingFees: Number(data.shippingFees ?? 0),
          finalAmount: Number(data.finalAmount ?? data.totalAmount ?? 0),
          total: Number(data.finalAmount || data.totalAmount || 0),
          paymentType: data.paymentMethod?.toLowerCase() === 'cod' ? 'cod' : 'prepaid',
          tracking: {
            trackingId: data.trackingNumber || '',
            courierService: data.courierPartner || 'Delhivery',
          },
          seller:
            data.items?.find((i: any) => i.seller)?.seller ||
            data.items?.find((i: any) => i.product?.seller)?.product?.seller ||
            null,
          items:
            data.items?.map((item: any) => ({
              id: item.id,
              productId: item.productId,
              sellerId: item.sellerId,
              productSellerId: item.productSellerId,
              categoryId: item.categoryId,
              categoryName: item.categoryName,
              seller: item.seller || item.product?.seller || null,
              productName: item.name,
              size: item.size,
              color: item.color,
              quality: item.quality || item.product?.quality || null,
              colors: item.colors || item.product?.colors || [],
              product: item.product || null,
              quantity: item.quantity,
              price: Number(item.price ?? 0),
              sku:
                item.sku ||
                item.product?.sku ||
                (item.productId ? `SKU-${String(item.productId).slice(-6).toUpperCase()}` : 'N/A'),
              productImage:
                (item.image && !item.image.includes('photo-1523381210434-271e8be1f52b')
                  ? item.image
                  : null) ||
                item.product?.mainImage ||
                item.product?.image ||
                item.image ||
                '',
            })) || [],
        };

        setOrder(mapped);
      } catch (err) {
        console.error('Failed to load order details', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    void loadOrder();
  }, [params]);

  if (loading) {
    return <div className="p-8 text-center">Loading order details...</div>;
  }

  if (error || !order) {
    return <div className="p-8 text-center text-red-500">Order not found.</div>;
  }

  return <OrderDetailsView order={order} />;
}
