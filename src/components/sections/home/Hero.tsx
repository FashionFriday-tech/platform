import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowDown, Mail } from "lucide-react";

export default function Hero() {
  return (
    // OUTER SECTION: Padding around the grid
    <section className="w-full p-4 lg:p-6 bg-white">
      
      {/* 1. MAIN GRID HEIGHT: Changed to fixed 'h-[80vh]' 
         2. on Mobile, we use 'min-h-[80vh]' to allow scrolling if text is long
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 min-h-[80vh] lg:h-[80vh]">
        
        {/* --- LEFT COLUMN WRAPPER (7 Cols) --- */}
        {/* h-full ensures it respects the 80vh parent */}
        <div className="lg:col-span-7 flex flex-col gap-4 lg:gap-6 h-full">
          
          {/* 1. TOP BLOCK: Text Content */}
          {/* 'flex-grow' makes this take up all remaining space (approx 60-70%) */}
          <div className="grow p-8 lg:p-12 bg-black rounded-3xl flex flex-col justify-between relative overflow-hidden">
            
            <div className="mb-4 lg:mb-0">
               <ArrowRight className="w-10 h-10 stroke-[1.5px] text-gray-100" />
            </div>

            <div className="z-10 relative flex justify-between items-center">
              <h1 className="text-4xl lg:text-5xl font-black uppercase leading-[0.9] tracking-tight text-gray-100 mb-6">
                For<br/> Everyone<br/> But Not<br/> Anyone
              </h1>
              
              <p className="text-sm lg:text-lg font-medium text-gray-100 max-w-sm leading-relaxed hidden lg:block">
                We establish personal relationships with our boutiques to make sure each is vetted for a stress-free shopping experience.
              </p>
            </div>
          </div>

          {/* 2. BOTTOM BLOCK: Split Images */}
          {/* Changed fixed pixel height to 'h-[35%]' so it scales with the 80vh */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6 h-50 lg:h-[35%] shrink-0">
            {/* Small Image 1 */}
            <div className="relative rounded-2xl overflow-hidden group w-full h-full">
              <Image
                src="/hero/hero-grid1.png"
                alt="Accessories Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-xs font-bold uppercase tracking-wider">#RipStop</span>
              </div>
            </div>

            {/* Small Image 2 */}
            <div className="relative rounded-2xl overflow-hidden group w-full h-full">
               <Image
                src="/hero/hero-grid2.png"
                alt="Insulated Gear"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-xs font-bold uppercase tracking-wider">#Insulated</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Main Hero Image (5 Cols) --- */}
        {/* h-full makes it fill the entire 80vh height */}
        <div className="lg:col-span-5 relative h-125 lg:h-full rounded-3xl overflow-hidden group">
          <Image
            src="/hero/main-hero.png"
            alt="New Season Collection"
            fill
            priority
            className="object-cover"
          />
          
          {/* Overlay Content */}
          <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-between">
            <div className="self-end"></div>

            <div className="flex items-end justify-between w-full">
               {/* Shop Now Button */}
               <Link href="/shop/new" className="group/btn relative z-10">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/30 backdrop-blur-md flex items-center justify-center rounded-full transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:bg-white">
                    <span className="text-xs font-bold text-white uppercase group-hover/btn:text-black text-center leading-tight">Shop<br/>Now</span>
                  </div>
               </Link>

               {/* Action Pills */}
               <div className="flex gap-2 lg:gap-3">
                  <button className="bg-white pl-4 pr-2 py-2 rounded-full flex items-center gap-3 hover:bg-gray-100 transition-colors shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider">Learn More</span>
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <ArrowDown className="w-4 h-4 text-white" />
                    </div>
                  </button>
                  
                   <button className="bg-white pl-4 pr-2 py-2 rounded-full flex items-center gap-3 hover:bg-gray-100 transition-colors shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider">Contact</span>
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4 text-white" />
                    </div>
                  </button>
               </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}