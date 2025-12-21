import BrandScroll from "@/components/sections/home/BrandScroll";
import FeaturedCategories from "@/components/sections/home/FeaturedCatagories";
import Hero from "@/components/sections/home/Hero";
import NewArrivals from "@/components/sections/home/NewArrivals";
import ShopByBrand from "@/components/sections/home/ShopByBrands";
import TrendingSection from "@/components/sections/home/TrendingSection";



export default function Home() {
  return (
    <div>
      <Hero />
      <BrandScroll />
      <FeaturedCategories />
      <TrendingSection />
      <NewArrivals />
      <ShopByBrand />
    </div>
  );
}
