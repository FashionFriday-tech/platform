'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from '@/components/ui/magicUi/ScrollBasedVelocity';
import { brandLogos as BrandLogo } from '@/features/brand';

// Helper for clean URLs
const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-');

// --- Reusable Sub-component ---
const BrandList = ({
  logos,
  priorityStart = false,
}: {
  logos: typeof BrandLogo;
  priorityStart?: boolean;
}) => (
  <>
    {logos.map(({ name, logo }, idx) => (
      <div key={`${name}-${idx}`} className="mx-10">
        <Link
          href={`/brands/${slugify(name)}`}
          className="relative block h-16 w-16 transition-transform hover:scale-110 active:scale-95 lg:w-24"
        >
          <Image
            src={logo}
            alt={name}
            fill
            sizes="100px"
            className="object-contain invert-0 dark:invert"
            priority={priorityStart && idx < 4}
          />
        </Link>
      </div>
    ))}
  </>
);

export default function BrandScroll() {
  // Logic to split the array
  const midIndex = Math.ceil(BrandLogo.length / 2);
  const BRAND_ROW_A = BrandLogo.slice(0, midIndex);
  const BRAND_ROW_B = BrandLogo.slice(midIndex);

  return (
    <section className="w-full overflow-hidden py-2 lg:py-4">
      <div className="relative flex w-full flex-col items-center justify-center">


        <ScrollVelocityContainer className="flex w-full flex-col gap-2 sm:gap-3">
          {/* Row 1: First Half (Moving Right) */}
          <ScrollVelocityRow baseVelocity={1} direction={1}>
            <BrandList logos={BRAND_ROW_A} priorityStart />
          </ScrollVelocityRow>

          {/* Row 2: Second Half (Moving Left) */}
          <ScrollVelocityRow baseVelocity={1} direction={-1}>
            <BrandList logos={BRAND_ROW_B} />
          </ScrollVelocityRow>
        </ScrollVelocityContainer>

        {/* Side Gradients */}
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-1/4 bg-linear-to-r to-transparent" />
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-1/4 bg-linear-to-l to-transparent" />
      </div>
    </section>
  );
}
