import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ServiceOfferingDetailView } from "@/components/services/ServiceOfferingDetailView";
import {
  getAllServiceOfferingSlugs,
  getServiceOffering,
} from "@/lib/content/service-offerings";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllServiceOfferingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const offering = getServiceOffering(slug);
  if (!offering) {
    return { title: "ページが見つかりません | AXEON" };
  }
  const path = `/services/${slug}`;
  return {
    title: offering.metaTitle,
    description: offering.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      title: offering.metaTitle,
      description: offering.metaDescription,
      url: path,
      type: "website",
    },
  };
}

export default async function ServiceOfferingPage({ params }: Props) {
  const { slug } = await params;
  const offering = getServiceOffering(slug);
  if (!offering) notFound();

  return (
    <PageShell>
      <ServiceOfferingDetailView offering={offering} />
    </PageShell>
  );
}
