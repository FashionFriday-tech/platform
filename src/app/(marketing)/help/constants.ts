import React, { ReactNode } from "react";
import { Info, Mail, HelpCircle, Truck, RefreshCcw, Shield, FileText, Ruler } from "lucide-react";
import { RiShieldStarFill } from "react-icons/ri";

export interface HelpSection {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  tagline: string;
}

export const helpSections: HelpSection[] = [
  { id: "about", label: "About Us", href: "/help/about", icon: React.createElement(Info, { size: 22 }), tagline: "Our brand philosophy." },
  { id: "contact", label: "Contact Us", href: "/help/contact", icon: React.createElement(Mail, { size: 22 }), tagline: "Talk to our team." },
  { id: "faq", label: "FAQ", href: "/help/faq", icon: React.createElement(HelpCircle, { size: 22 }), tagline: "Quick answers." },
  { id: "shipping", label: "Shipping", href: "/help/shipping", icon: React.createElement(Truck, { size: 22 }), tagline: "Delivery & Tracking." },
  { id: "returns", label: "Returns", href: "/help/returns", icon: React.createElement(RefreshCcw, { size: 22 }), tagline: "Easy return process." },
  { id: "size-guide", label: "Size Guide", href: "/help/size-guide", icon: React.createElement(Ruler, { size: 22 }), tagline: "Find your perfect fit." },
  { id: "quality-guide", label: "Quality Guide", href: "/help/quality-guide", icon: React.createElement(RiShieldStarFill, { size: 22 }), tagline: "Understand product authenticity." },
  { id: "refund-policy", label: "Refund Policy", href: "/help/refund-policy", icon: React.createElement(Shield, { size: 22 }), tagline: "Money-back terms." },
  { id: "privacy-policy", label: "Privacy", href: "/help/privacy-policy", icon: React.createElement(Shield, { size: 22 }), tagline: "Data protection." },
  { id: "terms", label: "Terms", href: "/help/terms", icon: React.createElement(FileText, { size: 22 }), tagline: "Legal agreement." },
];