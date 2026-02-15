import {
  InfoIcon,
  MailIcon,
  HelpCircleIcon,
  TruckIcon,
  RefreshCcwIcon,
  ShieldIcon,
  FileTextIcon,
  RulerIcon,
  CreditCardIcon,
  StarBadgeIcon,
} from '@ff/ui';
import { ComponentType } from 'react';

export type IconComponent = ComponentType<{ size?: number }>;

export interface HelpSection {
  id: string;
  label: string;
  href: string;
  icon: IconComponent;
  tagline: string;
}

export const helpSections: HelpSection[] = [
  {
    id: 'about',
    label: 'About Us',
    href: '/help/about',
    icon: InfoIcon,
    tagline: 'Who we are and why we exist.',
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '/help/contact',
    icon: MailIcon,
    tagline: 'Reach the support team.',
  },
  {
    id: 'faq',
    label: 'FAQ',
    href: '/help/faq',
    icon: HelpCircleIcon,
    tagline: 'Quick answers to common questions.',
  },
  {
    id: 'payments',
    label: 'Payments & Billing',
    href: '/help/payments',
    icon: CreditCardIcon,
    tagline: 'Payment methods, COD & refunds.',
  },
  {
    id: 'shipping',
    label: 'Shipping & Delivery',
    href: '/help/shipping',
    icon: TruckIcon,
    tagline: 'Dispatch, timelines & tracking.',
  },
  {
    id: 'returns',
    label: 'Returns & Refunds',
    href: '/help/returns',
    icon: RefreshCcwIcon,
    tagline: 'Return eligibility & settlements.',
  },
  {
    id: 'size-guide',
    label: 'Size Guide',
    href: '/help/size-guide',
    icon: RulerIcon,
    tagline: 'Find your correct fit.',
  },
  {
    id: 'quality-guide',
    label: 'Quality Guide',
    href: '/help/quality-guide',
    icon: StarBadgeIcon,
    tagline: 'Quality standards & authenticity.',
  },
  {
    id: 'privacy-policy',
    label: 'Privacy Policy',
    href: '/help/privacy-policy',
    icon: ShieldIcon,
    tagline: 'How your data is handled.',
  },
  {
    id: 'terms-conditions',
    label: 'Terms & Conditions',
    href: '/help/terms-conditions',
    icon: FileTextIcon,
    tagline: 'Platform usage rules.',
  },
];
