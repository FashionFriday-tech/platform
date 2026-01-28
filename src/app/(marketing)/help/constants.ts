import {
  Info,
  Mail,
  HelpCircle,
  Truck,
  RefreshCcw,
  Shield,
  FileText,
  Ruler,
  CreditCard,
  LucideIcon,
} from "lucide-react";
import { RiShieldStarFill } from "react-icons/ri";
import { ComponentType } from "react";

export interface HelpSection {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon | ComponentType<{ size?: number }>;
  tagline: string;
}

export const helpSections: HelpSection[] = [
  {
    id: "about",
    label: "About Us",
    href: "/help/about",
    icon: Info,
    tagline: "Who we are and why we exist.",
  },
  {
    id: "contact",
    label: "Contact",
    href: "/help/contact",
    icon: Mail,
    tagline: "Reach the support team.",
  },
  {
    id: "faq",
    label: "FAQ",
    href: "/help/faq",
    icon: HelpCircle,
    tagline: "Quick answers to common questions.",
  },
  {
    id: "payments",
    label: "Payments & Billing",
    href: "/help/payments",
    icon: CreditCard,
    tagline: "Payment methods, COD & refunds.",
  },
  {
    id: "shipping",
    label: "Shipping & Delivery",
    href: "/help/shipping",
    icon: Truck,
    tagline: "Dispatch, timelines & tracking.",
  },
  {
    id: "returns",
    label: "Returns & Refunds",
    href: "/help/returns",
    icon: RefreshCcw,
    tagline: "Return eligibility & settlements.",
  },
  {
    id: "size-guide",
    label: "Size Guide",
    href: "/help/size-guide",
    icon: Ruler,
    tagline: "Find your correct fit.",
  },
  {
    id: "quality-guide",
    label: "Quality Guide",
    href: "/help/quality-guide",
    icon: RiShieldStarFill,
    tagline: "Quality standards & authenticity.",
  },
  {
    id: "privacy-policy",
    label: "Privacy Policy",
    href: "/help/privacy-policy",
    icon: Shield,
    tagline: "How your data is handled.",
  },
  {
    id: "terms-conditions",
    label: "Terms & Conditions",
    href: "/help/terms-conditions",
    icon: FileText,
    tagline: "Platform usage rules.",
  },
];
