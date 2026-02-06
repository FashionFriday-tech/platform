"use client";

import Link from "next/link";
import { quickLinks } from "@/data/profile";
import { motion } from "framer-motion";
import { ExternalLinkIcon } from "@ff/ui";

export default function QuickLinksGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 sm:gap-6 mt-12">
      {quickLinks.map((link, index) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.label}
            href={link.href}
            className="group relative flex items-center gap-6 p-4 sm:flex-col sm:items-center sm:text-center sm:p-6 sm:rounded-4xl bg-background border-b border-border sm:border sm:bg-background-muted/30 transition-all duration-500 hover:bg-background sm:hover:shadow-2xl sm:hover:shadow-foreground/5 sm:hover:border-foreground/20 sm:hover:-translate-y-2"
          >
            {/* Icon Container - Uses semantic background-muted */}
            <div className="relative flex items-center justify-center shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl border border-border sm:mb-6 transition-all duration-500 group-hover:bg-foreground group-hover:text-background group-hover:rotate-6 shadow-sm">
              <Icon size={24} />
            </div>

            {/* Content Area */}
            <div className="flex-1 sm:flex-none">
              <h3 className="text-lg sm:text-xl sm:font-bold uppercase tracking-tighter text-foreground">
                {link.label}
              </h3>
              <p className="hidden sm:block mt-2 text-foreground text-xs font-medium uppercase tracking-widest leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {link.description}
              </p>
            </div>

            {/* Visual indicator for mobile links */}
            <div className="sm:hidden text-foreground-subtle group-hover:text-foreground transition-colors">
              <ExternalLinkIcon className="opacity-40" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}