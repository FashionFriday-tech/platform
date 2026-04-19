import React from 'react';

import { RefreshCcwIcon, TicketPercentIcon } from '@ff/ui';

import { useWallet } from '../hooks/use-wallet';
import { SubWalletCard } from './sub-wallet-card';
import { WalletActivity } from './wallet-activity';
import { WalletHero } from './wallet-hero';

export function WalletPage() {
  const { filter, setFilter, totals, sortedLedger } = useWallet();

  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-500">
      <WalletHero totalBalance={totals.total} />

      <section className="mx-auto max-w-5xl space-y-20 px-4 md:px-8">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          <SubWalletCard
            label="Refund Wallet"
            value={`₹${totals.refundBalance}`}
            icon={<RefreshCcwIcon size={20} />}
            description="Verified returns. Fully usable for your next order."
            action="Details"
            color="emerald-400"
          />
          <SubWalletCard
            label="Reward Wallet"
            value={`₹${totals.rewardWallet}`}
            icon={<TicketPercentIcon size={20} />}
            description="Referrals & Giftcards. Auto-applies 5% on orders."
            action="Details"
            color="red-400"
          />
        </div>

        <WalletActivity sortedLedger={sortedLedger} filter={filter} setFilter={setFilter} />
      </section>
    </div>
  );
}
