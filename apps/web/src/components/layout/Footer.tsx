'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowUpRightIcon,
  ChevronUpIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from '@ff/ui';

const FOOTER_SECTIONS = [
  {
    title: 'Shop',
    links: [
      { name: 'New Arrivals', href: '/new-arrivals' },
      { name: 'Best Sellers', href: '/best-sellers' },
      { name: 'Men', href: '/men' },
      { name: 'Women', href: '/women' },
      { name: 'Accessories', href: '/accessories' },
      { name: 'Footwear', href: '/footwear' },
      { name: 'Gift Cards', href: '/gift-cards' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'Track Order', href: '/track-order' },
      { name: 'Returns & Exchanges', href: '/returns' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Size Guide', href: '/size-guide' },
      { name: 'Payment Options', href: '/payment-options' },
      { name: 'FAQs', href: '/faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Story', href: '/our-story' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press & Media', href: '/press' },
      { name: 'Sustainability', href: '/sustainability' },
      { name: 'Store Locator', href: '/store-locator' },
      { name: 'Affiliates', href: '/affiliates' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Refund Policy', href: '/refund-policy' },
      { name: 'Shipping Policy', href: '/shipping-policy' },
      { name: 'Cookie Policy', href: '/cookie-policy' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: FacebookIcon, href: 'https://fashionfriday.in' },
  { icon: InstagramIcon, href: 'https://instagram.com/fashionfriday.in' },
  { icon: YoutubeIcon, href: 'https://Youtube.com/fashionfriday.store' },
  { icon: TwitterIcon, href: 'https://x.com/fashionfriday.in' },
];

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <footer className="mb-14 flex w-full flex-col sm:mb-0">
      <button
        type="button"
        className="bg-background text-forground border-foreground mt-0.5 flex w-full items-center justify-center gap-2 border-y py-4 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>More about Online Shopping at Fashion Friday</span>
        <ChevronUpIcon
          className={`transition-transform duration-500 ${isOpen ? 'rotate-0' : 'rotate-180'}`}
        />
      </button>

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-4 px-6 pb-8 pt-16 text-black duration-300 md:px-12">
          <div className="mb-16 flex flex-col gap-12 xl:flex-row xl:gap-20">
            <div className="flex shrink-0 flex-col items-center text-center xl:items-start xl:text-start">
              <Image
                src="/images/logos/ff-logo2.png"
                alt="Fashion Friday"
                width={144}
                height={40}
                className="mb-8 w-36 invert dark:invert-0"
              />
              <p className="text-foreground-muted max-w-sm text-sm leading-relaxed">
                Experience the Great Outdoors in Style with Fashion Friday. Shop now and gear up for
                adventure in Fashion Friday!
              </p>
              <div className="mt-8 flex gap-4">
                {SOCIAL_LINKS.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blackground hover:bg-forground text-foreground hover:text-background rounded-full border p-2 transition-colors"
                  >
                    <social.icon size={18} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-8 md:grid-cols-4 md:gap-4">
              {FOOTER_SECTIONS.map((section) => (
                <div key={section.title} className="text-foreground flex flex-col">
                  <h3 className="mb-6 text-lg font-semibold">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-foreground-muted group flex items-center gap-2 text-sm transition-colors"
                        >
                          {link.name}

                          <ArrowUpRightIcon
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

          <div className="text-foreground-muted flex flex-col items-center justify-between gap-2 border-t border-gray-200 pt-8 md:flex-row">
            <div className="text-sm">
              &copy; {new Date().getFullYear()} Fashion Friday - All Rights Reserved
            </div>
            <div className="transition-colors">
              <Link href="https://unity11solutions.com" target="_blank" rel="noopener noreferrer">
                Design & Development by <span className="underline">Unity11</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
