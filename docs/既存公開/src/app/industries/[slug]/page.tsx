import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { IndustryLpPage } from "@/components/industries/IndustryLpPage";
import {
  getAllIndustryLpSlugs,
  getIndustryLp,
} from "@/lib/content/industry-lp";

export function generateStaticParams() {
  return getAllIndustryLpSlugs().map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = getIndustryLp(slug);
  if (!config) {
    return { title: "ページが見つかりません | AXEON" };
  }
  return {
    title: config.ogp.title,
    description: config.ogp.description,
    openGraph: {
      title: config.ogp.title,
      description: config.ogp.description,
      images: [{ url: config.ogp.image.src, alt: config.ogp.image.alt }],
    },
  };
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const config = getIndustryLp(slug);
  if (!config) notFound();

  return (
    <PageShell>
      <IndustryLpPage config={config} />
    </PageShell>
  );
}
