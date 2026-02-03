"use client";
import React from "react";
import Link from "next/link";

export const BrandCard = ({ brand }: { brand: any }) => {
  return (
    <Link href={`/brands/${brand.slug}`} className="group">
      <div
        className="group relative aspect-square overflow-hidden rounded-[3rem] flex justify-center items-center hover:scale-95 duration-500"
        style={{
          backgroundColor:
            brand.color === "#000000" ? "var(--color-foreground)" : brand.color,
        }}
      >
        {" "}
        <img
          src={brand.logo}
          alt={brand.name}
          className={`w-40 object-contain group-hover:scale-125 duration-500  ${
            brand.color === "#000000" ? "dark:invert-0 invert" : "invert"
          }`}
        />
      </div>
      <div className="mt-3 px-1">
        <h3 className="text-foreground text-center font-bold text-sm truncate uppercase tracking-tight">
          {brand.name}
        </h3>
      </div>
    </Link>
  );
};
