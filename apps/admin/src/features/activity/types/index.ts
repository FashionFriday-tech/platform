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

export const MOCK_ACTIVITY_LOG: Activity[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order #4829 was fulfilled and shipped',
    description: 'Shipped via BlueDart (Tracking: BD82910384)',
    time: '2 minutes ago',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    user: { name: 'Jimmy Sullivan', avatar: 'https://i.pravatar.cc/150?u=jimmy' },
  },
  {
    id: '2',
    type: 'campaign',
    title: 'Summer Sale banner was activated',
    description: 'Placement: Home Carousel',
    time: '1 hour ago',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    user: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  },
  {
    id: '3',
    type: 'product',
    title: 'Restocked "Classic White Sneaker" (Qty: 200)',
    time: '3 hours ago',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    user: { name: 'Marcus Johnson', avatar: 'https://i.pravatar.cc/150?u=marcus' },
  },
  {
    id: '4',
    type: 'order',
    title: 'Order #4828 was placed (₹4,500)',
    time: '5 hours ago',
    timestamp: new Date(Date.now() - 300 * 60000).toISOString(),
    user: { name: 'System', avatar: 'https://i.pravatar.cc/150?u=sys' },
  },
  {
    id: '5',
    type: 'team',
    title: 'Invited new Sales Manager',
    description: 'Sent invite to emma.w@fashionfriday.com',
    time: 'Yesterday',
    timestamp: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
    user: { name: 'Jimmy Sullivan', avatar: 'https://i.pravatar.cc/150?u=jimmy' },
  },
  {
    id: '6',
    type: 'product',
    title: 'Updated pricing for "Denim Jacket"',
    description: 'Changed from ₹2,999 to ₹2,499',
    time: 'Yesterday',
    timestamp: new Date(Date.now() - 26 * 60 * 60000).toISOString(),
    user: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  },
  {
    id: '7',
    type: 'order',
    title: 'Refund processed for Order #4810',
    description: 'Amount: ₹1,200',
    time: '2 days ago',
    timestamp: new Date(Date.now() - 48 * 60 * 60000).toISOString(),
    user: { name: 'Marcus Johnson', avatar: 'https://i.pravatar.cc/150?u=marcus' },
  },
  {
    id: '8',
    type: 'campaign',
    title: 'Deleted "Spring Clearance" banner',
    time: '3 days ago',
    timestamp: new Date(Date.now() - 72 * 60 * 60000).toISOString(),
    user: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  },
  {
    id: '9',
    type: 'product',
    title: 'Added new product "Leather Crossbody Bag"',
    time: '4 days ago',
    timestamp: new Date(Date.now() - 96 * 60 * 60000).toISOString(),
    user: { name: 'Jimmy Sullivan', avatar: 'https://i.pravatar.cc/150?u=jimmy' },
  },
  {
    id: '10',
    type: 'team',
    title: 'Sarah Chen accepted team invite',
    time: 'Last week',
    timestamp: new Date(Date.now() - 168 * 60 * 60000).toISOString(),
    user: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  },
];
