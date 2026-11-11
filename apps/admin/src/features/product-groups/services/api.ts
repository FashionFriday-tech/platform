import api from '@/lib/api-client';

import { type ModelGroupDetail, type ModelGroupProduct, type ModelGroupsResponse } from '../types';

export async function fetchModelGroupsDetails(
  search?: string,
  page = 1,
  limit = 50,
): Promise<ModelGroupsResponse> {
  const query = new URLSearchParams();
  if (search?.trim()) {
    query.set('search', search.trim());
  }
  query.set('page', String(page));
  query.set('limit', String(limit));

  const res = await api.get<ModelGroupsResponse>(
    `/admin/products/model-groups/details?${query.toString()}`,
  );
  return (
    res ?? {
      data: [],
      meta: { total: 0, page: 1, limit: 50, totalPages: 0 },
    }
  );
}

export async function fetchModelGroupProducts(group: string): Promise<ModelGroupProduct[]> {
  const clean = encodeURIComponent(group.trim().toLowerCase());
  const res = await api.get<ModelGroupProduct[]>(`/admin/products/model-groups/${clean}/products`);
  return res ?? [];
}

export async function renameModelGroup(
  oldGroup: string,
  newGroup: string,
): Promise<{ success: boolean; updatedCount: number; oldGroup: string; newGroup: string }> {
  const cleanOld = encodeURIComponent(oldGroup.trim().toLowerCase());
  return api.put<{ success: boolean; updatedCount: number; oldGroup: string; newGroup: string }>(
    `/admin/products/model-groups/${cleanOld}`,
    { newGroup },
  );
}

export async function addProductsToGroup(
  group: string,
  productIds: string[],
): Promise<{ success: boolean; updatedCount: number; group: string; productIds: string[] }> {
  const clean = encodeURIComponent(group.trim().toLowerCase());
  return api.post<{ success: boolean; updatedCount: number; group: string; productIds: string[] }>(
    `/admin/products/model-groups/${clean}/products`,
    { productIds },
  );
}

export async function removeProductFromGroup(
  productId: string,
): Promise<{ success: boolean; product: any }> {
  return api.delete<{ success: boolean; product: any }>(
    `/admin/products/model-groups/products/${encodeURIComponent(productId)}`,
  );
}

