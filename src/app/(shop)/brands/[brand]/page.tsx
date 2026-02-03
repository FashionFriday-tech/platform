import { Metadata } from "next";
import { notFound } from "next/navigation";
import BrandClient from "./_components/Client";
import brandLogos from "@/data/brandLogos";

type Props = {
  params: Promise<{ brand: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params;

  const brandData = brandLogos.find(
    (b) => b.slug.toLowerCase() === brand.toLowerCase()
  );

  if (!brandData) {
    return { title: "Brand Not Found" };
  }

  return {
    title: `Buy ${brandData.name} Gear | Fashion Friday`,
    description: `Shop the latest collection of ${brandData.name}. High quality products with fast delivery.`,
  };
}

export default async function BrandPage({ params }: Props) {
  const { brand } = await params;

  const brandExists = brandLogos.some(
    (b) => b.slug.toLowerCase() === brand.toLowerCase()
  );

  if (!brandExists) {
    notFound();
  }

  return <BrandClient brand={brand} />;
}
