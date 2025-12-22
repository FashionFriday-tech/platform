import BrandScroll from "@/components/sections/home/BrandScroll";
import FeaturedCategories from "@/components/sections/home/FeaturedCatagories";
import FreeShipping from "@/components/sections/home/FreeShipping";
import Hero from "@/components/sections/home/Hero";
import InfluencerCarousel from "@/components/sections/home/InfluencerCarousel";
import NewArrivals from "@/components/sections/home/NewArrivals";
import ShopByBrand from "@/components/sections/home/ShopByBrands";
import TrendingSection from "@/components/sections/home/TrendingSection";
import WhyChooseUs from "@/components/sections/home/WhyChooseUs";

export default function Home() {
  return (
    <div>
      <Hero />
      <BrandScroll />
      <FeaturedCategories />
      <TrendingSection />
      <NewArrivals />
      <FreeShipping />
      <ShopByBrand />
      <InfluencerCarousel />
      <WhyChooseUs />
    </div>
  );
}
