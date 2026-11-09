import { api } from '@/lib/api-client';

import { type CreateQualityInput, type QualityItem, type UpdateQualityInput } from '../types';

export async function fetchQualities(category?: string): Promise<QualityItem[]> {
  const params: Record<string, string> = {};
  if (category && category !== 'All') {
    params.category = category;
  }
  const data = await api.get<QualityItem[]>('/admin/qualities', { params });
  return data ?? [];
}

export async function createQuality(data: CreateQualityInput): Promise<QualityItem> {
  return api.post<QualityItem>('/admin/qualities', data);
}

export async function updateQuality(id: string, data: UpdateQualityInput): Promise<QualityItem> {
  return api.patch<QualityItem>(`/admin/qualities/${id}`, data);
}

export async function deleteQuality(id: string): Promise<boolean> {
  await api.delete(`/admin/qualities/${id}`);
  return true;
}

export async function reorderQualities(
  items: { id: string; position: number }[],
): Promise<boolean> {
  await api.patch('/admin/qualities/reorder', { items });
  return true;
}
