export interface Color {
  id: string;
  name: string;
  hex: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateColorInput {
  name: string;
  hex: string;
}

export interface UpdateColorInput {
  name?: string;
  hex?: string;
}
