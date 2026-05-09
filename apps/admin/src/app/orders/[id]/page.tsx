import React from 'react';
import { notFound } from 'next/navigation';
import { OrderDetailsView } from '../../../features/orders/components/OrderDetailsView';
import { mockOrders } from '../../../features/orders/services/mock-orders';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // In a real app, this would fetch from an API using the ID
  const resolvedParams = await params;
  const order = mockOrders.find((o) => o.id === resolvedParams.id);

  if (!order) {
    notFound();
  }

  return <OrderDetailsView order={order} />;
}
