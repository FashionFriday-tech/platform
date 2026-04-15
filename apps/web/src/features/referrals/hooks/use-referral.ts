import React, { useCallback, useMemo, useState } from 'react';

import { ClockIcon, UsersIcon, WalletIcon } from '@ff/ui';

import { type ReferralMetric, type ReferralUser, type SortCriteria } from '../types';

export function useReferral() {
  const [copied, setCopied] = useState(false);
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('all');

  const referralCode = 'FRIDAY-CAPTAIN-11';
  const referralLink = `https://fashionfriday.in/invite/${referralCode}`;

  const metrics: ReferralMetric[] = useMemo(
    () => [
      {
        label: 'Activated',
        value: '₹1,200',
        icon: React.createElement(WalletIcon, { size: 16 }),
        color: 'text-emerald-500',
      },
      {
        label: 'Inactive',
        value: '₹300',
        icon: React.createElement(ClockIcon, { size: 16 }),
        color: 'text-orange-500',
      },
      {
        label: 'Network',
        value: '15 Users',
        icon: React.createElement(UsersIcon, { size: 16 }),
        color: 'text-foreground',
      },
    ],
    [],
  );

  const rawUsers: ReferralUser[] = useMemo(
    () => [
      { id: 1, name: 'Rahul S.', date: '22/01/26', status: 'Inactive', timestamp: 1737504000000 },
      { id: 2, name: 'Sana K.', date: '24/01/26', status: 'Active', timestamp: 1737676800000 },
      { id: 3, name: 'Kevin V.', date: '15/01/26', status: 'Active', timestamp: 1736899200000 },
      { id: 4, name: 'Aditi R.', date: '25/01/26', status: 'Inactive', timestamp: 1737763200000 },
      { id: 5, name: 'Mohammed A.', date: '18/01/26', status: 'Active', timestamp: 1737158400000 },
      { id: 6, name: 'Priya M.', date: '10/01/26', status: 'Inactive', timestamp: 1736467200000 },
      { id: 7, name: 'Daniel T.', date: '05/01/26', status: 'Inactive', timestamp: 1736035200000 },
      { id: 8, name: 'Neha P.', date: '20/01/26', status: 'Active', timestamp: 1737331200000 },
      { id: 9, name: 'Arjun D.', date: '12/01/26', status: 'Inactive', timestamp: 1736640000000 },
      { id: 10, name: 'Fatima Z.', date: '08/01/26', status: 'Inactive', timestamp: 1736294400000 },
      { id: 11, name: 'Chris L.', date: '21/01/26', status: 'Active', timestamp: 1737417600000 },
      { id: 12, name: 'Ishaan K.', date: '23/01/26', status: 'Inactive', timestamp: 1737590400000 },
      { id: 13, name: 'Meera N.', date: '14/01/26', status: 'Active', timestamp: 1736812800000 },
      { id: 14, name: 'John P.', date: '03/01/26', status: 'Inactive', timestamp: 1735948800000 },
      { id: 15, name: 'Zoya H.', date: '26/01/26', status: 'Active', timestamp: 1737849600000 },
    ],
    [],
  );

  const sortedUsers = useMemo(() => {
    let filteredList = [...rawUsers];
    if (sortCriteria === 'active') {
      filteredList = filteredList.filter((u) => u.status === 'Active');
    } else if (sortCriteria === 'Inactive') {
      filteredList = filteredList.filter((u) => u.status === 'Inactive');
    }
    return filteredList.sort((a, b) => b.timestamp - a.timestamp);
  }, [sortCriteria, rawUsers]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {
      // Handle or log error silently
    });
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, []);

  const onShareClick = useCallback(() => {
    const handleShare = async () => {
      const shareData: ShareData = {
        title: 'Fashion Friday - Style That Moves',
        text: 'Hey! Check out Fashion Friday. Use my referral link to get ₹100 reward!',
        url: referralLink,
      };

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-optional-chain
      if (navigator.canShare && navigator.canShare({ files: [] })) {
        try {
          const response = await fetch('/images/refferal/hero.png');
          const blob = await response.blob();
          const file = new File([blob], 'invite.png', { type: blob.type });
          shareData.files = [file];
        } catch {
          // Silent catch
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch {
          // Silent catch
        }
      } else {
        handleCopy(referralLink);
      }
    };

    void handleShare();
  }, [referralLink, handleCopy]);

  return {
    copied,
    sortCriteria,
    setSortCriteria,
    referralCode,
    referralLink,
    metrics,
    sortedUsers,
    handleCopy,
    onShareClick,
  };
}
