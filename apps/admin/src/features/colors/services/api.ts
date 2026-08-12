import { api } from '@/lib/api-client';

import { type Color, type CreateColorInput, type UpdateColorInput } from '../types';

export async function fetchColors(): Promise<Color[]> {
  const data = await api.get<Color[]>('/admin/colors');
  return data ?? [];
}

export async function createColor(data: CreateColorInput): Promise<Color> {
  return api.post<Color>('/admin/colors', data);
}

export async function updateColor(id: string, data: UpdateColorInput): Promise<Color> {
  return api.patch<Color>(`/admin/colors/${id}`, data);
}

export async function deleteColor(id: string): Promise<boolean> {
  await api.delete(`/admin/colors/${id}`);
  return true;
}
