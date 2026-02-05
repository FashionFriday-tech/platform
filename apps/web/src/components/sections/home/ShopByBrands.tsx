import ShopByBrand from "@/components/ui/sections/BrandGrid";

const brands = [
  { id: 1, name: "New Balance", logo: "/images/brand-logos/newbalance.png", href: "/shop/new-balance" },
  { id: 2, name: "Nike", logo: "/images/brand-logos/nike.png", href: "/shop/nike" },
  { id: 3, name: "Adidas", logo: "/images/brand-logos/adidas.png", href: "/shop/adidas" },
  { id: 4, name: "Puma", logo: "/images/brand-logos/puma.png", href: "/shop/puma" },
  { id: 5, name: "Crocs", logo: "/images/brand-logos/crocs.png", href: "/shop/crocs" },
  { id: 6, name: "Birkenstock", logo: "/images/brand-logos/birkenstock.png", href: "/shop/birkenstock" },
  { id: 7, name: "Zara", logo: "/images/brand-logos/zara.png", href: "/shop/zara" },
  { id: 8, name: "Converse", logo: "/images/brand-logos/converse.png", href: "/shop/converse" },
  { id: 9, name: "Asics", logo: "/images/brand-logos/asics.png", href: "/shop/asics" },
  { id: 10, name: "Vans", logo: "/images/brand-logos/vans.png", href: "/shop/vans" },
  { id: 11, name: "Under Armour", logo: "/images/brand-logos/underarmour.png", href: "/shop/under-armour" },
  { id: 12, name: "Stüssy", logo: "/images/brand-logos/stussy.png", href: "/shop/stussy" },
];


export default function HomePage() {
  return (
    <ShopByBrand
      brands={brands}
      heading="Shop By Brand"
      viewAllHref="/brands"
    />
  );
}