import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { CaseStudyDetailView } from "@/components/case-studies/case-study-detail-view";
import {
  getAllCaseStudySlugs,
  getCaseStudyDetail,
  getCaseStudyOpenGraphImageSrc,
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
  const ogImage = getCaseStudyOpenGraphImageSrc(detail);
  const canonicalPath = `/case-studies/${slug}`;
  return {
    title: detail.metaTitle,
    description: detail.metaDescription,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: detail.metaTitle,
      description: detail.metaDescription,
      url: canonicalPath,
      type: "article",
      images: [{ url: ogImage, alt: detail.heroTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: detail.metaTitle,
      description: detail.metaDescription,
      images: [ogImage],
    },
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
