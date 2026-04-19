export type TransactionType = 'reward' | 'refund' | 'purchase' | 'topup';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  timestamp: number;
}
