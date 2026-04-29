'use client';

import Link from 'next/link';

import { ArrowLeftIcon } from '@ff/ui';
import { motion } from 'motion/react';

export default function EditorialError({ slug }: { slug: string }) {
  return (
    <div className="bg-background flex h-screen flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl space-y-12"
      >
        <div className="space-y-4">
          <span className="text-brand block text-[10px] font-black tracking-[1em] uppercase opacity-60">
            Error 404
          </span>
          <h1 className="text-foreground text-6xl leading-tight font-black tracking-tighter uppercase italic md:text-8xl">
            Data <br /> Dissolved
          </h1>
          <p className="text-foreground-muted text-sm font-medium tracking-wide uppercase opacity-40">
            The entity <span className="text-foreground">"{slug}"</span> does not exist in our
            current catalog.
          </p>
        </div>

        <Link
          href="/"
          className="border-border hover:bg-foreground hover:text-background group inline-flex items-center gap-4 border px-12 py-5 text-[10px] font-black tracking-widest uppercase transition-all duration-500"
        >
          <ArrowLeftIcon size={14} className="transition-transform group-hover:-translate-x-2" />
          Return to Catalog
        </Link>
      </motion.div>

      {/* Aesthetic Background Element */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,var(--surface-muted)_0%,transparent_100%)] opacity-50" />
    </div>
  );
}
