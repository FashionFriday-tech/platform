import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowDown, Mail } from "lucide-react";
import ImageCarousel from "@/components/ui/sections/ImageCarousel";

export default function Hero() {
  return (
    // OUTER SECTION: Padding around the grid
    <section className="w-full min-h-screen p-2 pb-6 lg:p-6 bg-black lg:mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[80vh] SM:mt-18 lg:h-[85vh]">
        

        <div className="lg:col-span-6 relative h-125 lg:h-full rounded-4xl group w-full">
         <ImageCarousel />
        </div>
        <div className="lg:col-span-6 flex flex-col gap-4 h-full">
          <div className="min-h-50 grow p-8 lg:p-12 bg-black text-white rounded-4xl flex flex-col justify-center relative overflow-hidden">
            <Image
                src="/hero/hero-grid1.png"
                alt="Accessories Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:gap-6 h-50 lg:h-[50%] shrink-0">
            <div className="relative rounded-4xl overflow-hidden group w-full h-full">
              <Image
                src="/hero/hero-grid1.png"
                alt="Accessories Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* <div className="absolute bottom-4 left-4 bg-black text-white backdrop-blur-sm px-6 py-2 rounded-full">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Shop Now
                </span>
              </div> */}
            </div>

            <div className="relative rounded-4xl overflow-hidden group w-full h-full">
              <Image
                src="/hero/hero-grid2.png"
                alt="Insulated Gear"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* <div className="absolute bottom-4 left-4 bg-black text-white backdrop-blur-sm px-6 py-2 rounded-full">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Shop Now
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


