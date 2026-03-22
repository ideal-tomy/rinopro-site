import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { ExperiencePrototypeRunner } from "@/components/experience/ExperiencePrototypeRunner";
import {
  EXPERIENCE_PROTOTYPES,
  getExperiencePrototypeBySlug,
} from "@/lib/experience/prototype-registry";

export function generateStaticParams() {
  return EXPERIENCE_PROTOTYPES.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = getExperiencePrototypeBySlug(slug);
  if (!meta) return { title: "体験 | rinopro" };
  return {
    title: `${meta.title} | 体験 | rinopro`,
    description: meta.shortDescription,
  };
}

export default async function ExperiencePrototypePage({ params }: Props) {
  const { slug } = await params;
  const meta = getExperiencePrototypeBySlug(slug);
  if (!meta) notFound();

  const tierLabel = meta.tier === "track3" ? "③ プロダクト寄り" : "② 画面体験";

  return (
    <PageShell>
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-14 md:px-6">
        <nav className="mb-6 text-sm text-text-sub">
          <Link href="/experience" className="text-accent underline-offset-2 hover:underline">
            体験トップ
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
        <p className="mb-8 max-w-2xl text-sm text-text-sub md:text-base">
          {meta.shortDescription}
        </p>
        <Suspense
          fallback={
            <p className="text-sm text-text-sub">体験画面を読み込んでいます…</p>
          }
        >
          <ExperiencePrototypeRunner meta={meta} />
        </Suspense>
      </div>
    </PageShell>
  );
}
