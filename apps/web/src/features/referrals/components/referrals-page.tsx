import React from 'react';

import { useReferral } from '../hooks/use-referral';
import { ReferralActivity } from './referral-activity';
import { ReferralHero } from './referral-hero';
import { ReferralMetrics } from './referral-metrics';

export function ReferralsPage() {
  const {
    copied,
    sortCriteria,
    setSortCriteria,
    referralCode,
    metrics,
    sortedUsers,
    handleCopy,
    onShareClick,
  } = useReferral();

  return (
    <div className="bg-background text-foreground min-h-screen px-4 py-10 transition-colors duration-500 md:px-8">
      <main className="mx-auto max-w-4xl space-y-4 md:pt-20">
        <ReferralHero
          referralCode={referralCode}
          copied={copied}
          handleCopy={handleCopy}
          onShareClick={onShareClick}
        />

        <ReferralMetrics metrics={metrics} />

        <ReferralActivity
          sortedUsers={sortedUsers}
          sortCriteria={sortCriteria}
          setSortCriteria={setSortCriteria}
        />
      </main>
    </div>
  );
}
