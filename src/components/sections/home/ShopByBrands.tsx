import ShopByBrand from "@/components/ui/sections/BrandGrid";

const brands = [
  { id: 1, name: "New Balance", logo: "/brand-logos/newbalance.png", href: "/shop/new-balance" },
  { id: 2, name: "Nike", logo: "/brand-logos/nike.png", href: "/shop/nike" },
  { id: 3, name: "Adidas", logo: "/brand-logos/adidas.png", href: "/shop/adidas" },
  { id: 4, name: "Puma", logo: "/brand-logos/puma.png", href: "/shop/puma" },
  { id: 5, name: "Crocs", logo: "/brand-logos/crocs.png", href: "/shop/crocs" },
  { id: 6, name: "Birkenstock", logo: "/brand-logos/birkenstock.png", href: "/shop/birkenstock" },
  { id: 7, name: "Zara", logo: "/brand-logos/zara.png", href: "/shop/zara" },
  { id: 8, name: "Converse", logo: "/brand-logos/converse.png", href: "/shop/converse" },
  { id: 9, name: "Asics", logo: "/brand-logos/asics.png", href: "/shop/asics" },
  { id: 10, name: "Vans", logo: "/brand-logos/vans.png", href: "/shop/vans" },
  { id: 11, name: "Under Armour", logo: "/brand-logos/underarmour.png", href: "/shop/under-armour" },
  { id: 12, name: "Stüssy", logo: "/brand-logos/stussy.png", href: "/shop/stussy" },
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