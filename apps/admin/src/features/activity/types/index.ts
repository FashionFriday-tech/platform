export type ActivityType = 'order' | 'campaign' | 'product' | 'team';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  time: string;
  timestamp: string; // ISO string for sorting
  user: {
    name: string;
    avatar: string;
  };
}

export const FILTER_OPTIONS = [
  { value: 'all', label: 'All Activities' },
  { value: 'order', label: 'Orders' },
  { value: 'product', label: 'Products' },
  { value: 'campaign', label: 'Campaigns' },
  { value: 'team', label: 'Team' },
];

export const MOCK_ACTIVITY_LOG: Activity[] = [];
