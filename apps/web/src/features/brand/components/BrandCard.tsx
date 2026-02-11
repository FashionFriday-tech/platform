"use client";
import React from "react";
import Link from "next/link";

export const BrandCard = ({ brand }: { brand: any }) => {
  return (
    <Link href={`/brands/${brand.slug}`} className="group">
      <div
        className="md:w-[250px] group relative aspect-3/4 overflow-hidden rounded-[2rem] flex justify-center items-center hover:scale-95 duration-500"
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
          </Link>
  );
};
