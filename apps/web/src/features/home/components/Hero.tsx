import Image from 'next/image';
import Link from 'next/link';
import ImageCarousel from '@/components/ui/sections/ImageCarousel';

export default function Hero() {
  return (
    // OUTER SECTION: Padding around the grid
    <section className="min-h-screen w-full p-2 pb-6 lg:mt-18 lg:p-6">
      <div className="SM:mt-18 grid min-h-[80vh] grid-cols-1 gap-4 lg:h-[95vh] lg:grid-cols-12">
        <div className="group relative h-125 w-full rounded-4xl lg:col-span-6 lg:h-full">
          <ImageCarousel />
        </div>
        <div className="flex h-full flex-col gap-4 lg:col-span-6">
          <div className="relative flex min-h-50 grow flex-col justify-center overflow-hidden rounded-4xl p-8 lg:p-12">
            <Image
              src="/images/hero/hero-grid1.png"
              alt="Accessories Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="grid h-50 shrink-0 grid-cols-2 gap-4 lg:h-[50%]">
            <div className="group relative h-full w-full overflow-hidden rounded-4xl">
              <Image
                src="/images/hero/hero-grid1.png"
                alt="Accessories Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="group relative h-full w-full overflow-hidden rounded-4xl">
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
