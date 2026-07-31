'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  BellIcon,
  CategoryIcon,
  SearchIcon,
  SearchListIcon,
  ShoppingBagIcon,
  UserIcon,
  WishlistIcon,
} from '@ff/ui';

import { AnimatedLogo } from '@/components/ui/animated-logo';
import { useCart } from '@/features/cart';
import { useAuthStore } from '@/store/auth-store';

import { MobileMenu } from './MobileMenu';

// --- Helper Functions ---
const getInitials = (name: string) => {
  if (!name) {
    return '';
  }
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

// --- Data Configuration ---
const navStructure = [
  {
    label: 'New Arrivals',
    href: '/new-arrivals',
  },
  {
    label: 'Men',
    href: '/category/men',
  },
  {
    label: 'Women',
    href: '/category/women',
  },
  {
    label: 'Sale',
    href: '/sale',
    isRed: true,
  },
  {
    label: 'SNKRS',
    href: '/snkrs',
  },
];

export function Header() {
  const user = useAuthStore((state) => state.user);
  const { itemCount, isMounted } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleOpenSearch = useCallback(() => {
    router.push('/search');
  }, [router]);

  useEffect(() => {
    window.addEventListener('open-search', handleOpenSearch);
    window.addEventListener('open-menu', handleOpenMobileMenu);
    return () => {
      window.removeEventListener('open-search', handleOpenSearch);
      window.removeEventListener('open-menu', handleOpenMobileMenu);
    };
  }, [handleOpenSearch, handleOpenMobileMenu]);

  const [redMarquee, setRedMarquee] = useState(
    'FREE SHIPPING ON PRE PAY • COD available +200 advance',
  );
  const [blueMarquee, setBlueMarquee] = useState(
    'NEW DROPS EVERY FRIDAY • 100% VERIFIED AUTHENTIC • EXPRESS DELIVERY',
  );
  const [redLink, setRedLink] = useState<string | null>(null);
  const [blueLink, setBlueLink] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== '/') {
      return;
    }
    const fetchMarqueeCampaigns = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';
        const res = await fetch(`${API_URL}/campaigns`);
        if (res.ok) {
          const campaigns: {
            placement: string;
            title: string;
            linkUrl?: string;
            isActive: boolean;
          }[] = await res.json();
          const activeRed = campaigns.find((c) => c.placement === 'marquee-red' && c.isActive);
          const activeBlue = campaigns.find((c) => c.placement === 'marquee-blue' && c.isActive);
          if (activeRed?.title) {
            setRedMarquee(activeRed.title);
            setRedLink(activeRed.linkUrl || null);
          }
          if (activeBlue?.title) {
            setBlueMarquee(activeBlue.title);
            setBlueLink(activeBlue.linkUrl || null);
          }
        }
      } catch {
        // Silent fallback to defaults
      }
    };
    void fetchMarqueeCampaigns();
  }, [pathname]);

  // Hide header on login and signup pages
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  // Unified alternating segments: when red ends, electric blue starts next!
  const marqueeSegments = Array(8)
    .fill([
      { text: redMarquee, link: redLink, isRed: true },
      { text: blueMarquee, link: blueLink, isRed: false },
    ])
    .flat();

  return (
    <>
      <header className="bg-background fixed top-0 right-0 left-0 z-50 hidden lg:block">
        {/* DESKTOP TOP BAR */}
        <div className="text-foreground relative z-50 mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
          <Link href="/" className="relative z-50 flex h-8 items-center">
            <AnimatedLogo className="text-2xl font-black tracking-tighter uppercase lg:text-3xl" />
          </Link>

          {/* Clean Navigation: No Dropdowns */}
          <nav className="hidden h-full items-center gap-2 lg:flex">
            {navStructure.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`group relative px-4 py-2 text-[12px] font-black tracking-[0.2em] uppercase ${item.isRed ? 'text-destructive' : 'text-foreground'} `}
              >
                <span className="relative z-10">{item.label}</span>

                {/* Top Left Bracket */}
                <span className="border-brand absolute top-0 left-0 h-1 w-1 border-t border-l opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:opacity-100" />

                {/* Bottom Right Bracket */}
                <span className="border-brand absolute right-0 bottom-0 h-1 w-1 border-r border-b opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
              </Link>
            ))}
          </nav>

          <div className="z-50 flex items-center gap-5">
            <Link
              href="/search"
              className="text-foreground hover:text-brand hidden items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-colors lg:flex"
              aria-label="Search"
            >
              <SearchIcon className="text-lg" />
            </Link>
            <div className="bg-border hidden h-4 w-px lg:block" />
            <div className="text-foreground flex items-center gap-4">
              <Link href="/account/wishlist">
                <WishlistIcon className="hover:text-brand text-xl transition-colors" />
              </Link>
              <Link href="/checkout/cart" className="relative">
                <ShoppingBagIcon className="hover:text-brand text-2xl transition-colors" />
                {isMounted && itemCount > 0 && (
                  <span className="bg-brand text-brand-foreground absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-black">
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link
                href="/account"
                className="hover:text-brand flex items-center transition-colors"
              >
                {user ? (
                  user.avatarUrl && user.avatarUrl !== '' ? (
                    <div className="border-border relative h-8 w-8 overflow-hidden rounded-full border transition-transform hover:scale-110">
                      <Image src={user.avatarUrl} alt={user.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="bg-foreground text-background flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black uppercase transition-transform hover:scale-110">
                      {getInitials(user.name)}
                    </div>
                  )
                ) : (
                  <UserIcon className="text-2xl" />
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* SINGLE ALTERNATING MARQUEE: RED SECTION THEN ELECTRIC BLUE SECTION (Desktop) */}
        {pathname === '/' && (
          <div className="bg-background relative z-40 hidden w-full overflow-hidden lg:block">
            <div className="animate-marquee flex w-max whitespace-nowrap">
              {[0, 1].map((set) => (
                <div key={set} className="flex items-center">
                  {marqueeSegments.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        clipPath: 'polygon(26px 0%, 100% 0%, calc(100% - 26px) 100%, 0% 100%)',
                      }}
                      className={`mx-1 flex items-center gap-3 px-12 py-2 text-white transition-all ${
                        item.isRed ? 'bg-[#FF0000]' : 'bg-[#0052FF]'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                      <span className="text-[10px] font-black tracking-[0.25em] uppercase">
                        {item.link ? (
                          <Link href={item.link} className="hover:underline">
                            {item.text}
                          </Link>
                        ) : (
                          item.text
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* MOBILE UI */}
      <div
        className={`bg-background text-foreground sticky top-0 z-50 flex w-full flex-col lg:hidden ${
          pathname === '/' || pathname.startsWith('/categor') ? '' : 'border-border/20 border-b'
        }`}
      >
        <div className="relative flex h-14 w-full items-center justify-between px-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenMobileMenu();
            }}
            className="text-foreground hover:bg-foreground/5 -ml-1 flex h-10 w-10 items-center justify-center rounded-lg transition-colors active:scale-95"
            aria-label="Open Navigation Menu"
          >
            <svg
              width="28"
              height="24"
              viewBox="0 0 28 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-7"
            >
              <line x1="1.5" y1="8" x2="26.5" y2="8" />
              <line x1="1.5" y1="16" x2="26.5" y2="16" />
            </svg>
          </button>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link
              href="/"
              className="flex items-center whitespace-nowrap transition-transform active:scale-95"
            >
              <AnimatedLogo className="text-xl font-black tracking-tighter uppercase sm:text-2xl" />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/account/notifications" className="relative">
              <BellIcon className="text-xl" />
              <span className="bg-destructive absolute top-0 right-0 h-2 w-2 rounded-full" />
            </Link>
            <Link href="/account/wishlist">
              <WishlistIcon className="text-xl" />
            </Link>
          </div>
        </div>

        {/* MOBILE ALTERNATING MARQUEE: RED SECTION THEN ELECTRIC BLUE SECTION */}
        {pathname === '/' && (
          <div className="bg-background relative z-40 flex h-7 w-full items-center overflow-hidden">
            <div className="animate-marquee flex h-full w-max whitespace-nowrap">
              {[0, 1].map((set) => (
                <div key={set} className="flex h-full items-center">
                  {marqueeSegments.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        clipPath: 'polygon(18px 0%, 100% 0%, calc(100% - 18px) 100%, 0% 100%)',
                      }}
                      className={`mx-1 flex h-full items-center gap-2 px-8 text-white ${
                        item.isRed ? 'bg-[#FF0000]' : 'bg-[#0052FF]'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                      <span className="text-[9px] font-black tracking-[0.22em] uppercase">
                        {item.link ? (
                          <Link href={item.link} className="hover:underline">
                            {item.text}
                          </Link>
                        ) : (
                          item.text
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <nav className="bg-background/95 border-border/40 fixed inset-x-0 bottom-0 z-[100] flex h-[calc(3.5rem+env(safe-area-inset-bottom,0px))] items-center justify-between border-t px-6 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md lg:hidden">
        <Link href="/category/men">
          <CategoryIcon className="text-[25px]" />
        </Link>
        <Link href="/search" aria-label="Search">
          <SearchListIcon className="text-[25px]" />
        </Link>
        <Link href="/" className="flex scale-110 items-center justify-center">
          <Image
            src="/images/logos/ff-logo.png"
            width={32}
            height={32}
            alt="logo"
            className="object-contain dark:invert"
          />
        </Link>
        <Link href="/checkout/cart" className="relative">
          <ShoppingBagIcon className="text-[25px]" />
          {isMounted && itemCount > 0 && (
            <span className="bg-brand text-brand-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-black">
              {itemCount}
            </span>
          )}
        </Link>
        <Link href="/account">
          <UserIcon className="text-[25px]" />
        </Link>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMobileMenu}
        onOpenSearch={handleOpenSearch}
      />
    </>
  );
}
