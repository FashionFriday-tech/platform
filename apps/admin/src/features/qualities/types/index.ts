export interface QualityItem {
  id: string;
  name: string;
  description?: string | null;
  categories: string[];
  position?: number;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQualityInput {
  name: string;
  description?: string | null;
  categories?: string[];
  position?: number;
}

export interface UpdateQualityInput {
  name?: string;
  description?: string | null;
  categories?: string[];
  position?: number;
}
