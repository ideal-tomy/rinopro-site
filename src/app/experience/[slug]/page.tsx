import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { ExperiencePrototypeRunner } from "@/components/experience/ExperiencePrototypeRunner";
import { DemoExploreStickyRail } from "@/components/experience/DemoExploreStickyRail";
import { parseReturnToFromSearchParams } from "@/lib/navigation/experience-entry";
import { getSuggestedNextExperiences } from "@/lib/experience/suggested-next-experiences";
import {
  EXPERIENCE_PROTOTYPES,
  getExperiencePrototypeBySlug,
} from "@/lib/experience/prototype-registry";

export function generateStaticParams() {
  return EXPERIENCE_PROTOTYPES.map((p) => ({ slug: p.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = getExperiencePrototypeBySlug(slug);
  if (!meta) return { title: "体験 | Axeon" };
  return {
    title: `${meta.title} | 体験 | Axeon`,
    description: meta.shortDescription,
  };
}

export default async function ExperiencePrototypePage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const meta = getExperiencePrototypeBySlug(slug);
  if (!meta) notFound();

  const sp = await searchParams;
  const returnHref = parseReturnToFromSearchParams(sp);

  const tierLabel = meta.tier === "track3" ? "③ プロダクト寄り" : "② 画面体験";
  const compactHero = slug === "legal-professional-mini-sfa-demo";
  const exploreSuggestions = getSuggestedNextExperiences(slug, 2);
  const crumbBackHref = returnHref ?? "/demo";
  const crumbBackLabel = returnHref ? "前のページ" : "体験・demoハブ";

  return (
    <PageShell>
      <div className="container mx-auto max-w-6xl px-4 pb-28 pt-8 md:px-6 md:pb-32 md:pt-14">
        <nav
          className={compactHero ? "mb-4 text-xs text-text-sub md:mb-6 md:text-sm" : "mb-6 text-sm text-text-sub"}
        >
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
        <h1
          className={
            compactHero
              ? "mb-2 text-xl font-bold text-accent md:mb-3 md:text-3xl"
              : "mb-3 text-2xl font-bold text-accent md:text-3xl"
          }
        >
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
          <p
            className={
              compactHero
                ? "mb-5 max-w-2xl text-xs leading-relaxed text-text-sub md:mb-8 md:text-sm"
                : "mb-8 max-w-2xl text-sm text-text-sub md:text-[16px]"
            }
          >
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
        suggestions={exploreSuggestions}
      />
    </PageShell>
  );
}
