// src/features/home/data/trending.ts
export interface TrendingProduct {
  readonly id: number;
  readonly title: string;
  readonly image: string;
  readonly slug: string;
}

export const trendingProducts: TrendingProduct[] = [
  { id: 1, title: "The Roseline Ring", image: "/images/trending/1.png", slug: "roseline-ring" },
  { id: 2, title: "Zoe Link Earrings", image: "/images/trending/2.png", slug: "zoe-link-earrings" },
  { id: 3, title: "The Hibiscus Ring II", image: "/images/trending/3.png", slug: "hibiscus-ring-ii" },
  { id: 4, title: "Chubby Gold Hoops", image: "/images/trending/4.png", slug: "chubby-gold-hoops" },
  { id: 5, title: "Serpent Chain Gold", image: "/images/trending/5.png", slug: "serpent-chain-gold" },
  { id: 6, title: "Midnight Studs", image: "/images/trending/6.png", slug: "midnight-studs" },
  { id: 7, title: "Infinity Band", image: "/images/trending/7.png", slug: "infinity-band" },
];