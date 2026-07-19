'use client';

import Image from 'next/image';
import Link from 'next/link';

import type { Brand } from '@ff/schemas';

import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from '@/components/ui/magicUi/ScrollBasedVelocity';
import { useBrands } from '@/features/brand';
import { cn } from '@/lib/utils';

// Helper for clean URLs
const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-');

// --- Reusable Sub-component ---
const BrandList = ({
  logos,
  priorityStart = false,
}: {
  logos: Brand[];
  priorityStart?: boolean;
}) => (
  <>
    {logos.map(({ name, logo, slug }, idx) => (
      <div key={`${slug || name}-${idx}`} className="mx-3.5 sm:mx-5 md:mx-8 lg:mx-10">
        <Link
          href={`/brands/${slug || slugify(name)}`}
          className="relative block h-10.5 w-10.5 transition-transform hover:scale-110 active:scale-95 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-24"
        >
          {logo ? (
            <Image
              src={logo}
              alt={name}
              fill
              sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 96px"
              className="object-contain invert-0 dark:invert"
              priority={priorityStart && idx < 4}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[10px] font-bold uppercase sm:text-xs">
              {name}
            </span>
          )}
        </Link>
      </div>
    ))}
  </>
);

export default function BrandScroll({
  initialBrands,
  className,
}: {
  initialBrands?: Brand[];
  className?: string;
}) {
  const { brands, isLoading } = useBrands(initialBrands);

  if (isLoading || brands.length === 0) {
    return null;
  }

  // Logic to split the array into two rows for the marquee
  const midIndex = Math.ceil(brands.length / 2);
  const BRAND_ROW_A = brands.slice(0, midIndex);
  const BRAND_ROW_B = brands.slice(midIndex);

  return (
    <div className={cn('w-full overflow-hidden py-0 sm:py-1 lg:py-4', className)}>
      <div className="relative flex w-full flex-col items-center justify-center">
        <ScrollVelocityContainer className="flex w-full flex-col gap-1.5 sm:gap-2.5">
          {/* Row 1: First Half (Moving Right) */}
          <ScrollVelocityRow baseVelocity={0.6} direction={1}>
            <BrandList logos={BRAND_ROW_A} priorityStart />
          </ScrollVelocityRow>

          {/* Row 2: Second Half (Moving Left) */}
          <ScrollVelocityRow baseVelocity={0.6} direction={-1}>
            <BrandList logos={BRAND_ROW_B} />
          </ScrollVelocityRow>
        </ScrollVelocityContainer>

        {/* Side Gradients */}
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-1/4 bg-linear-to-r to-transparent" />
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-1/4 bg-linear-to-l to-transparent" />
      </div>
    </div>
  );
}

