export interface ModelGroupProduct {
  id: string;
  name: string;
  slug: string;
  mainImage?: string;
  colors?: string[];
  sellingPrice: number;
  ogPrice?: number;
  totalStock: number;
  status: string;
  modelGroup?: string;
  brand?: string[];
  category?: { id: string; name: string; slug: string } | null;
  createdAt?: string;
}

export interface ModelGroupDetail {
  modelGroup: string;
  count: number;
  totalStock: number;
  brand: string[];
  category?: { id: string; name: string; slug: string } | null;
  products: ModelGroupProduct[];
  updatedAt?: string;
}

export interface ModelGroupsResponse {
  data: ModelGroupDetail[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

