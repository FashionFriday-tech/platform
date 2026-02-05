export type BrandCategory =
  | "sneakers"
  | "fashion"
  | "luxury"
  | "watches"
  | "electronics"
  | "streetwear"
  | "sportswear"
  | "footwear"
  | "accessories";

export interface Brand {
  name: string;
  slug: string;
  color: string; 
  logo: string;
  categories: BrandCategory[];
}
