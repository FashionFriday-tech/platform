import type React from 'react';

export type ClaimStatus = 'idle' | 'pending' | 'approved';

export interface SocialTask {
  id: string;
  platform: string;
  profileUrl: string;
  icon: React.ReactNode;
  rewardAmount: number;
  status: ClaimStatus;
  actionLabel: string;
  placeholder: string;
  cardStyle: string;
}

export interface Milestone {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  rewardAmount: number;
  imageUrl: string;
}
