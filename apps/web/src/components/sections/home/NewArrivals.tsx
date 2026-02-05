import FeatureRail, {CollectionItem} from "@/components/ui/sections/FeatureRail";

  // --- DATA ---
const collections: CollectionItem[] = [
  {
    id: 1,
    title: "Urban Utility",
    subtitle: "Function meets form",
    image: "/images/new-arrival/1.png",
    href: "/shop/utility",
    color: "bg-orange-500",
  },
  {
    id: 2,
    title: "Soft Tailoring",
    subtitle: "The new office code",
    image: "/images/new-arrival/2.png",
    href: "/shop/tailoring",
    color: "bg-blue-500",
  },
  {
    id: 3,
    title: "Evening Haze",
    subtitle: "After hours essential",
    image: "/images/new-arrival/3.png",
    href: "/shop/evening",
    color: "bg-purple-500",
  },
  {
    id: 4,
    title: "Denim Redux",
    subtitle: "Raw & reconstructed",
    image: "/images/new-arrival/4.png",
    href: "/shop/denim",
    color: "bg-indigo-500",
  },
  {
    id: 5,
    title: "Denim Redux",
    subtitle: "Raw & reconstructed",
    image: "/images/new-arrival/5.png",
    href: "/shop/denim",
    color: "bg-indigo-500",
  },
  {
    id: 6,
    title: "Denim Redux",
    subtitle: "Raw & reconstructed",
    image: "/images/new-arrival/6.png",
    href: "/shop/denim",
    color: "bg-indigo-500",
  },
  {
    id: 7,
    title: "Denim Redux",
    subtitle: "Raw & reconstructed",
    image: "/images/new-arrival/7.png",
    href: "/shop/denim",
    color: "bg-indigo-500",
  },
];


export default function HomePage() {
  return (
    <>
      <FeatureRail
        collections={collections}
        heading="New Arrivals"
        subheading="This Week's Highlights"
      />
    </>
  );
}
