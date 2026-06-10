import { type SellerStatus } from '@ff/database';

export class SellerQueryDto {
  search?: string;
  categoryId?: string;
  status?: SellerStatus;
  page?: number;
  limit?: number;
}
