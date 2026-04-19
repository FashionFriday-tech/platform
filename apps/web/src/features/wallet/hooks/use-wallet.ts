import { useMemo, useState } from 'react';

import { type Transaction, type TransactionType, type WalletTotals } from '../types';

export function useWallet() {
  const [filter, setFilter] = useState<'all' | TransactionType>('all');

  const totals: WalletTotals = useMemo(
    () => ({
      total: 3199,
      rewardWallet: 700,
      refundBalance: 2499,
    }),
    [],
  );

  const transactions: Transaction[] = useMemo(
    () => [
      {
        id: 'TX101',
        type: 'reward',
        amount: 100,
        date: '26 Jan 2026',
        status: 'completed',
        description: 'Referral Reward: Rahul S.',
        timestamp: 1737885600000,
      },
      {
        id: 'TX102',
        type: 'refund',
        amount: 2499,
        date: '24 Jan 2026',
        status: 'completed',
        description: 'Refund: Order #FF9021',
        timestamp: 1737712800000,
      },
      {
        id: 'TX103',
        type: 'reward',
        amount: 500,
        date: '23 Jan 2026',
        status: 'completed',
        description: 'Gift Card: BDAY500',
        timestamp: 1737626400000,
      },
      {
        id: 'TX104',
        type: 'purchase',
        amount: -1200,
        date: '22 Jan 2026',
        status: 'completed',
        description: 'Payment for Shoes',
        timestamp: 1737540000000,
      },
    ],
    [],
  );

  const sortedLedger = useMemo(() => {
    return transactions
      .filter((t) => filter === 'all' || t.type === filter)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [filter, transactions]);

  return {
    filter,
    setFilter,
    totals,
    sortedLedger,
  };
}
