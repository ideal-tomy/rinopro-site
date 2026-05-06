import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { CaseStudyDetailView } from "@/components/case-studies/case-study-detail-view";
import {
  getAllCaseStudySlugs,
  getCaseStudyDetail,
} from "@/lib/content/case-study-detail";
import {
  getImplementationShowcaseBySlug,
  resolveImplementationShowcaseHref,
} from "@/lib/content/implementation-showcase";

export function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = getCaseStudyDetail(slug);
  if (!detail) {
    return { title: "ページが見つかりません | AXEON" };
  }
  return {
    title: detail.metaTitle,
    description: detail.metaDescription,
  };
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = getCaseStudyDetail(slug);
  const showcase = getImplementationShowcaseBySlug(slug);
  if (!detail || !showcase) notFound();

  const demoHref = resolveImplementationShowcaseHref(showcase);

  return (
    <PageShell>
      <CaseStudyDetailView
        detail={detail}
        demoHref={demoHref}
        demoOpenInNewTab={showcase.openInNewTab}
      />
    </PageShell>
  );
}
