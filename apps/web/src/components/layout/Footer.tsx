"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  ChevronUp,
  ArrowUpRight,
} from "lucide-react";

const FOOTER_SECTIONS = [
  {
    title: "Shop",
    links: [
      { name: "New Arrivals", href: "/new-arrivals" },
      { name: "Best Sellers", href: "/best-sellers" },
      { name: "Men", href: "/men" },
      { name: "Women", href: "/women" },
      { name: "Accessories", href: "/accessories" },
      { name: "Footwear", href: "/footwear" },
      { name: "Gift Cards", href: "/gift-cards" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { name: "Contact Us", href: "/contact" },
      { name: "Track Order", href: "/track-order" },
      { name: "Returns & Exchanges", href: "/returns" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "Size Guide", href: "/size-guide" },
      { name: "Payment Options", href: "/payment-options" },
      { name: "FAQs", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Our Story", href: "/our-story" },
      { name: "Careers", href: "/careers" },
      { name: "Press & Media", href: "/press" },
      { name: "Sustainability", href: "/sustainability" },
      { name: "Store Locator", href: "/store-locator" },
      { name: "Affiliates", href: "/affiliates" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Refund Policy", href: "/refund-policy" },
      { name: "Shipping Policy", href: "/shipping-policy" },
      { name: "Cookie Policy", href: "/cookie-policy" },
      { name: "Disclaimer", href: "/disclaimer" },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: "https://fashionfriday.in" },
  { icon: Instagram, href: "https://instagram.com/fashionfriday.in" },
  { icon: Youtube, href: "https://Youtube.com/fashionfriday.store" },
  { icon: Twitter, href: "https://x.com/fashionfriday.in" },
];

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <footer className="w-full flex flex-col mb-14 sm:mb-0">
      <button
        type="button"
        className="flex mt-0.5 py-4 justify-center items-center gap-2 bg-background text-forground w-full transition-colors border-y border-foreground"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>More about Online Shopping at Fashion Friday</span>
        <ChevronUp
          className={`transition-transform duration-500 ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>

      {isOpen && (
        <div className="text-black pt-16 pb-8 px-6 md:px-12 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col xl:flex-row mb-16 gap-12 xl:gap-20">
            <div className="flex flex-col items-center text-center xl:items-start xl:text-start shrink-0">
              <Image
                src="/images/logos/ff-logo2.png"
                alt="Fashion Friday"
                width={144}
                height={40}
                className="w-36 mb-8 invert dark:invert-0"
              />
              <p className="text-foreground-muted text-sm leading-relaxed max-w-sm">
                Experience the Great Outdoors in Style with Fashion Friday. Shop
                now and gear up for adventure in Fashion Friday!
              </p>
              <div className="flex gap-4 mt-8">
                {SOCIAL_LINKS.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blackground hover:bg-forground text-foreground hover:text-background border p-2 rounded-full transition-colors"
                  >
                    <social.icon size={18} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-8 md:gap-4">
              {FOOTER_SECTIONS.map((section) => (
                <div key={section.title} className="flex flex-col text-foreground">
                  <h3 className="font-semibold text-lg mb-6">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="group flex gap-2 text-sm text-foreground-muted transition-colors items-center"
                        >
                          {link.name}

                          <ArrowUpRight
                            size={16}
                            className="text-background group-hover:text-foreground transition-colors"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="text-foreground-muted flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 gap-2">
            <div className="text-sm">
              &copy; {new Date().getFullYear()} Fashion Friday - All Rights
              Reserved
            </div>
            <div className="transition-colors">
              <a
                href="https://unity11solutions.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Design & Development by <span className="underline">Unity11</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
