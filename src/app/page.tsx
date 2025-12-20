import BrandScroll from "@/components/sections/home/BrandScroll";
import FeaturedCategories from "@/components/sections/home/FeaturedCatagories";
import Hero from "@/components/sections/home/Hero";



export default function Home() {
  return (
    <div>
      <Hero/>
      <BrandScroll/>
      <FeaturedCategories />
    </div>
  );
}
