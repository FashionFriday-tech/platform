"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeftIcon } from "@ff/ui";

export default function EditorialError({ slug }: { slug: string }) {
  return (
    <div className="h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl space-y-12"
      >
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[1em] text-brand opacity-60 block">
            Error 404
          </span>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-tight text-foreground">
            Data <br /> Dissolved
          </h1>
          <p className="text-foreground-muted text-sm font-medium tracking-wide uppercase opacity-40">
            The entity <span className="text-foreground">"{slug}"</span> does
            not exist in our current catalog.
          </p>
        </div>

        <Link
          href="/"
          className="group inline-flex items-center gap-4 px-12 py-5 border border-border text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-500"
        >
          <ArrowLeftIcon
            size={14}
            className="group-hover:-translate-x-2 transition-transform"
          />
          Return to Catalog
        </Link>
      </motion.div>

      {/* Aesthetic Background Element */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,var(--surface-muted)_0%,transparent_100%)] opacity-50" />
    </div>
  );
}
