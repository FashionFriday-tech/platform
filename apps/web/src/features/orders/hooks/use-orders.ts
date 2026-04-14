import { useMemo, useState } from 'react';

import { orders } from '../data';
import { type OrderStatus } from '../types';

export function useOrders() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('shipping');

  const flattenedOrders = useMemo(() => {
    return orders
      .filter((o) => o.status === activeTab)
      .flatMap((order) =>
        order.items.map((item) => ({
          ...order,
          uniqueShipmentId: `${order.id}-${item.id}`,
          displayItem: item,
        })),
      );
  }, [activeTab]);

  const getCount = (status: OrderStatus) => {
    return orders
      .filter((o) => o.status === status)
      .reduce((acc, curr) => acc + curr.items.length, 0);
  };

  return {
    activeTab,
    setActiveTab,
    flattenedOrders,
    getCount,
  };
}
