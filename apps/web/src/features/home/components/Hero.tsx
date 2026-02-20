import Image from 'next/image';

import ImageCarousel from '@/components/ui/sections/ImageCarousel';

export default function Hero() {
  return (
    // OUTER SECTION: Padding around the grid
    <section className="lg:mt-18 min-h-screen w-full p-2 pb-6 lg:p-6">
      <div className="SM:mt-18 grid min-h-[80vh] grid-cols-1 gap-4 lg:h-[95vh] lg:grid-cols-12">
        <div className="h-125 rounded-4xl group relative w-full lg:col-span-6 lg:h-full">
          <ImageCarousel />
        </div>
        <div className="flex h-full flex-col gap-4 lg:col-span-6">
          <div className="min-h-50 rounded-4xl relative flex grow flex-col justify-center overflow-hidden p-8 lg:p-12">
            <Image
              src="/images/hero/hero-grid1.png"
              alt="Accessories Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="h-50 grid shrink-0 grid-cols-2 gap-4 lg:h-[50%]">
            <div className="rounded-4xl group relative h-full w-full overflow-hidden">
              <Image
                src="/images/hero/hero-grid1.png"
                alt="Accessories Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="rounded-4xl group relative h-full w-full overflow-hidden">
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
