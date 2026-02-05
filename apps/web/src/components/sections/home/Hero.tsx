import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowDown, Mail } from "lucide-react";
import ImageCarousel from "@/components/ui/sections/ImageCarousel";

export default function Hero() {
  return (
    // OUTER SECTION: Padding around the grid
    <section className="w-full min-h-screen p-2 pb-6 lg:p-6 lg:mt-18">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[80vh] SM:mt-18 lg:h-[95vh]">
        <div className="lg:col-span-6 relative h-125 lg:h-full rounded-4xl group w-full">
         <ImageCarousel />
        </div>
        <div className="lg:col-span-6 flex flex-col gap-4 h-full">
          <div className="min-h-50 grow p-8 lg:p-12 rounded-4xl flex flex-col justify-center relative overflow-hidden">
            <Image
                src="/images/hero/hero-grid1.png"
                alt="Accessories Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
          </div>
          <div className="grid grid-cols-2 gap-4  h-50 lg:h-[50%] shrink-0">
            <div className="relative rounded-4xl overflow-hidden group w-full h-full">
              <Image
                src="/images/hero/hero-grid1.png"
                alt="Accessories Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="relative rounded-4xl overflow-hidden group w-full h-full">
              <Image
                src="/images/hero/hero-grid2.png"
                alt="Insulated Gear"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


