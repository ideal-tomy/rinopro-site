import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { CaseStudyDetailView } from "@/components/case-studies/case-study-detail-view";
import { PageShell } from "@/components/layout/PageShell";
import { ExperiencePrototypeRunner } from "@/components/experience/ExperiencePrototypeRunner";
import { DemoExploreStickyRail } from "@/components/experience/DemoExploreStickyRail";
import { parseReturnToFromSearchParams } from "@/lib/navigation/experience-entry";
import {
  ALLOWED_INTERACTIVE_EXPERIENCE_SLUGS,
  isAllowedInteractiveExperienceSlug,
} from "@/lib/content/experience-gallery";
import {
  FLAGSHIP_CASE_STUDY_SLUGS,
  getImplementationShowcaseBySlug,
  isFlagshipCaseStudySlug,
  resolveImplementationDemoHref,
} from "@/lib/content/implementation-showcase";
import {
  getCaseStudyDetail,
  getCaseStudyOpenGraphImageSrc,
} from "@/lib/content/case-study-detail";
import { getExperiencePrototypeBySlug } from "@/lib/experience/prototype-registry";

export function generateStaticParams() {
  const slugs = new Set<string>([
    ...FLAGSHIP_CASE_STUDY_SLUGS,
    ...ALLOWED_INTERACTIVE_EXPERIENCE_SLUGS,
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export const dynamicParams = true;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function isLiveDemoMode(
  searchParams: Record<string, string | string[] | undefined>
): boolean {
  const mode = searchParams.mode;
  if (mode === "live") return true;
  if (Array.isArray(mode) && mode.includes("live")) return true;
  return false;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const liveMode =
    isAllowedInteractiveExperienceSlug(slug) && isLiveDemoMode(sp);

  if (liveMode) {
    const meta = getExperiencePrototypeBySlug(slug);
    if (!meta) return { title: "体験 | AXEON" };
    return {
      title: `${meta.title} | 体験 | AXEON`,
      description: meta.shortDescription,
    };
  }

  if (isFlagshipCaseStudySlug(slug)) {
    const detail = getCaseStudyDetail(slug);
    if (!detail) return { title: "実装事例 | AXEON" };
    return {
      title: detail.metaTitle,
      description: detail.metaDescription,
      openGraph: {
        images: [{ url: getCaseStudyOpenGraphImageSrc(detail) }],
      },
    };
  }

  if (isAllowedInteractiveExperienceSlug(slug)) {
    const meta = getExperiencePrototypeBySlug(slug);
    if (!meta) return { title: "体験 | AXEON" };
    return {
      title: `${meta.title} | 体験 | AXEON`,
      description: meta.shortDescription,
    };
  }

  return { title: "体験 | AXEON" };
}

async function renderInteractiveExperience(
  slug: string,
  searchParams: Record<string, string | string[] | undefined>
) {
  const meta = getExperiencePrototypeBySlug(slug);
  if (!meta) notFound();

  const returnHref = parseReturnToFromSearchParams(searchParams);

  const tierLabel =
    meta.tier === "track3" ? "③ プロダクト寄り" : "② 画面体験";
  const exploreSuggestions = ALLOWED_INTERACTIVE_EXPERIENCE_SLUGS.filter(
    (s) => s !== slug
  )
    .map((s) => {
      const m = getExperiencePrototypeBySlug(s);
      return m ? { slug: m.slug, title: m.title } : null;
    })
    .filter((x): x is { slug: string; title: string } => x != null);
  const crumbBackHref = returnHref ?? "/experience";
  const crumbBackLabel = returnHref ? "前のページ" : "体験ギャラリー";

  return (
    <PageShell>
      <div className="container mx-auto max-w-6xl px-4 pb-28 pt-8 md:px-6 md:pb-32 md:pt-14">
        <nav className="mb-6 text-sm text-text-sub">
          <Link
            href={crumbBackHref}
            className="text-accent underline-offset-2 hover:underline"
          >
            {crumbBackLabel}
          </Link>
          <span className="mx-2 text-silver/50">/</span>
          <span className="text-text">{meta.title}</span>
        </nav>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent md:text-sm">
            {tierLabel}
          </span>
          <span className="text-xs text-text-sub md:text-sm">
            プロトタイプ（モック結果）
          </span>
        </div>
        <h1 className="mb-3 text-2xl font-bold text-accent md:text-3xl">
          {meta.title}
        </h1>
        {meta.foldLeadCopy ? (
          <details className="mb-8 max-w-2xl">
            <summary className="cursor-pointer list-none text-sm text-accent underline-offset-2 hover:underline md:text-[16px] [&::-webkit-details-marker]:hidden">
              <span className="underline">この体験の説明（任意）</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-text-sub md:text-[16px]">
              {meta.shortDescription}
            </p>
          </details>
        ) : (
          <p className="mb-8 max-w-2xl text-sm text-text-sub md:text-[16px]">
            {meta.shortDescription}
          </p>
        )}
        <Suspense
          fallback={
            <p className="text-sm text-text-sub">体験画面を読み込んでいます…</p>
          }
        >
          <ExperiencePrototypeRunner meta={meta} />
        </Suspense>
      </div>
      <DemoExploreStickyRail
        returnHref={returnHref}
        hubHref="/experience"
        listHref="/experience"
        suggestions={exploreSuggestions}
      />
    </PageShell>
  );
}

export default async function ExperienceSlugPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const liveMode = isLiveDemoMode(sp);

  if (isAllowedInteractiveExperienceSlug(slug) && liveMode) {
    return renderInteractiveExperience(slug, sp);
  }

  if (isFlagshipCaseStudySlug(slug)) {
    const detail = getCaseStudyDetail(slug);
    const showcase = getImplementationShowcaseBySlug(slug);
    if (!detail || !showcase) {
      permanentRedirect("/experience");
    }

    const demoHref = resolveImplementationDemoHref(showcase);

    return (
      <PageShell>
        <CaseStudyDetailView
          detail={detail}
          demoHref={demoHref}
          demoOpenInNewTab={true}
        />
      </PageShell>
    );
  }

  if (isAllowedInteractiveExperienceSlug(slug)) {
    return renderInteractiveExperience(slug, sp);
  }

  permanentRedirect("/experience");
}
