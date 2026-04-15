import type React from 'react';

export interface ReferralUser {
  id: number;
  name: string;
  date: string;
  status: 'Active' | 'Inactive';
  timestamp: number;
}

export interface ReferralMetric {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export type SortCriteria = 'all' | 'active' | 'Inactive';
