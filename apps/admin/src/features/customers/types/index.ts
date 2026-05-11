export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'active' | 'blocked';
  ordersCount: number;
  totalSpent: number;
  joinDate: string;
  lastOrderDate: string;
}

export type SortField =
  | 'name'
  | 'email'
  | 'joinDate'
  | 'totalSpent'
  | 'ordersCount'
  | 'lastOrderDate';
export type SortDirection = 'asc' | 'desc';
