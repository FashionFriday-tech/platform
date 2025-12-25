export type BagItem = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number; 
  size: string;
  color: string;
  image: string;
  quantity: number;
  inStock: boolean;
};

export const bagItems: BagItem[] = [
  {
    id: "1",
    name: "Oversized Graphic Tee",
    price: 1299,
    originalPrice: 1999,
    size: "M",
    color: "Black",
    image: 
      "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/a5d6c45d-49fa-4f41-805c-9eb0d02d0e82/NIKE+CORTEZ+SE.png",
    quantity: 1,
    inStock: true,
  },
  {
    id: "2",
    name: "Pleated Wide-Leg Trousers",
    price: 2499,
    size: "32",
    color: "Charcoal",
    image: 
      "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/128904c9-6281-4d00-8ff0-ed791031c0bd/W+NIKE+AIR+MAX+MOTO+2K.png",
    quantity: 2,
    inStock: true,
  },
];