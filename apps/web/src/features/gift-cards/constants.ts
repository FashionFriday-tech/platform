import React from 'react';

import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from '@ff/ui';

import type { Milestone, SocialTask } from './types';

export const initialSocialTasks: SocialTask[] = [
  {
    id: 'soc-1',
    platform: 'Instagram',
    profileUrl: 'https://instagram.com',
    icon: React.createElement(InstagramIcon, { size: 32 }),
    rewardAmount: 50,
    status: 'idle',
    actionLabel: 'Follow us',
    placeholder: 'Your Instagram Handle',
    cardStyle: 'bg-gradient-to-bl from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
  },
  {
    id: 'soc-2',
    platform: 'Twitter',
    profileUrl: 'https://twitter.com',
    icon: React.createElement(TwitterIcon, { size: 32 }),
    rewardAmount: 50,
    status: 'idle',
    actionLabel: 'Follow us',
    placeholder: 'Your X Handle',
    cardStyle: 'bg-gradient-to-tr from-blue-600 to-blue-400',
  },
  {
    id: 'soc-3',
    platform: 'YouTube',
    profileUrl: 'https://youtube.com',
    icon: React.createElement(YoutubeIcon, { size: 32 }),
    rewardAmount: 100,
    status: 'idle',
    actionLabel: 'Subscribe',
    placeholder: 'Your Channel Name',
    cardStyle: 'bg-gradient-to-tr from-red-600 to-red-900',
  },
  {
    id: 'soc-4',
    platform: 'Facebook',
    profileUrl: 'https://facebook.com',
    icon: React.createElement(FacebookIcon, { size: 32 }),
    rewardAmount: 50,
    status: 'idle',
    actionLabel: 'Follow us',
    placeholder: 'Your Facebook Profile URL',
    cardStyle: 'bg-gradient-to-br from-[#1877F2] to-[#0F5BD8]',
  },
];

export const initialMilestones: Milestone[] = [
  {
    id: 'mile-1',
    title: 'Silver Member',
    targetAmount: 5000,
    currentAmount: 5000,
    rewardAmount: 500,
    imageUrl:
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'mile-2',
    title: 'Gold Elite',
    targetAmount: 10000,
    currentAmount: 3250,
    rewardAmount: 1500,
    imageUrl:
      'https://images.unsplash.com/photo-1628527304948-06157ee3c8a6?q=80&w=800&auto=format&fit=crop',
  },
];
