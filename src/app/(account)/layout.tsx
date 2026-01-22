import { ReactNode } from "react";
export const metadata = {
  title: "My Account | Fashion Friday",
  description:
    "Manage your profile, orders, and account settings on Fashion Friday.",
  openGraph: {
    title: "My Account | Fashion Friday",
    description:
      "Access your profile, order history, and settings easily on Fashion Friday.",
    type: "website",
    url: "https://www.fashionfriday.in/account",
  },
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <main>{children}</main>;
}
