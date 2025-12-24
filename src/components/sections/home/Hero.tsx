import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowDown, Mail } from "lucide-react";

export default function Hero() {
  return (
    // OUTER SECTION: Padding around the grid
    <section className="w-full p-4 lg:p-6 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[80vh] mt-18 lg:h-[85vh]">
        

        <div className="lg:col-span-6 relative h-125 lg:h-full rounded-3xl overflow-hidden group">
          <Image
            src="/hero/main-hero.png"
            alt="New Season Collection"
            fill
            priority
            className="object-cover object-bottom"
          />

          <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-between">
            <div className="self-end"></div>

            <div className="flex items-end justify-between w-full">
              <div className="flex gap-2 lg:gap-3">
                <button className="bg-white pl-4 pr-2 py-2 rounded-full flex items-center gap-3 hover:bg-gray-100 transition-colors shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Learn More
                  </span>
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <ArrowDown className="w-4 h-4 text-white" />
                  </div>
                </button>

                <button className="bg-white pl-4 pr-2 py-2 rounded-full flex items-center gap-3 hover:bg-gray-100 transition-colors shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Contact
                  </span>
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 flex flex-col gap-4 h-full">
          <div className="grow p-8 lg:p-12 bg-black rounded-3xl flex flex-col justify-center relative overflow-hidden">
            <div className="z-10 relative flex justify-between gap-10 items-center">
              <h1 className="text-4xl lg:text-5xl font-black uppercase leading-[0.9] tracking-tight text-gray-100">
                <div className="flex gap-4">
                  For <ArrowRight className="w-10 h-10 stroke-[1.5px] text-gray-100" />
                </div>
                 Everyone
                <br /> But Not
                <br /> Anyone
              </h1>

              <p className="text-sm lg:text-lg font-medium text-gray-100 max-w-sm leading-relaxed hidden lg:block">
                We establish personal relationships with our boutiques to make
                sure each is vetted for a stress-free shopping experience.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:gap-6 h-50 lg:h-[50%] shrink-0">
            <div className="relative rounded-2xl overflow-hidden group w-full h-full">
              <Image
                src="/hero/hero-grid1.png"
                alt="Accessories Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-xs font-bold uppercase tracking-wider">
                  #RipStop
                </span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden group w-full h-full">
              <Image
                src="/hero/hero-grid2.png"
                alt="Insulated Gear"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-xs font-bold uppercase tracking-wider">
                  #Insulated
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
