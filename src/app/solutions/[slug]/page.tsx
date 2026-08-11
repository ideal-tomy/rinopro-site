import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { IndustryHubContent } from "@/components/solutions/IndustryHubContent";
import {
  getAllIndustryShowcaseSlugs,
  getIndustryShowcaseBySlug,
} from "@/lib/content/industry-showcase";

export function generateStaticParams() {
  return getAllIndustryShowcaseSlugs().map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "construction") {
    return { title: "建設の記録デモ | AXEON" };
  }
  const item = getIndustryShowcaseBySlug(slug);
  if (!item) {
    return { title: "ページが見つかりません | AXEON" };
  }
  return {
    title: `${item.label}向けの改善ヒント | AXEON`,
    description: item.metaDescription,
  };
}

export default async function SolutionsIndustryPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "construction") {
    permanentRedirect("/industries/construction");
  }
  const item = getIndustryShowcaseBySlug(slug);
  if (!item) notFound();

  return (
    <PageShell>
      <IndustryHubContent item={item} />
    </PageShell>
  );
}
