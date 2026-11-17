export class PaymentQueryDto {
  search?: string;
  status?: string;
  method?: string;
  startDate?: string;
  endDate?: string;
  page?: string | number;
  limit?: string | number;
  sortField?: string;
  sortDir?: 'asc' | 'desc';
  riskFilter?: string;
}

export class RefundPaymentDto {
  amount?: number;
  reason?: string;
}

export class VoidPaymentDto {
  reason?: string;
}
