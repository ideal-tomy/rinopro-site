"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  DEMO_HUB_TYPE_SECTION_SLUGS,
  getExperiencePrototypeBySlug,
} from "@/lib/experience/prototype-registry";
import { DEMO_HUB_TYPE_SECTION_BADGES } from "@/lib/demo/demo-hub-sections";
import { cn } from "@/lib/utils";

const typeMetas = DEMO_HUB_TYPE_SECTION_SLUGS.map((slug) => {
  const meta = getExperiencePrototypeBySlug(slug);
  if (!meta) throw new Error(`TypeExperienceSection: missing prototype ${slug}`);
  return meta;
});

function TypeExperienceCard({
  className,
  meta,
}: {
  className?: string;
  meta: (typeof typeMetas)[number];
}) {
  const badge =
    DEMO_HUB_TYPE_SECTION_BADGES[
      meta.slug as keyof typeof DEMO_HUB_TYPE_SECTION_BADGES
    ];
  return (
    <Card
      className={cn(
        "flex min-w-[min(100vw-3rem,20rem)] shrink-0 snap-start flex-col border-silver/25 p-5 transition-colors hover:border-accent/40 md:min-w-0",
        className
      )}
    >
      <span className="mb-2 inline-flex w-fit rounded-full border border-silver/35 bg-base-dark/80 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-text-sub md:text-xs">
        {badge}
      </span>
      <Link
        href={`/experience/${meta.slug}`}
        className="text-accent underline-offset-2 hover:underline"
      >
        <span className="text-[1rem] font-semibold text-text md:text-lg">
          {meta.title}
        </span>
      </Link>
      <p className="mt-2 flex-1 text-sm text-text-sub">{meta.shortDescription}</p>
      <Link
        href={`/experience/${meta.slug}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/90"
      >
        体験する
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </Card>
  );
}

interface TypeExperienceSectionProps {
  /** 見出しの id（アンカー用） */
  headingId?: string;
  className?: string;
}

/**
 * 「タイプ別に体験する」6件。PCは3列×2行、スマホは横スクロール。
 * 設定は `DEMO_HUB_TYPE_SECTION_SLUGS` / `DEMO_HUB_TYPE_SECTION_BADGES` に集約。
 */
export function TypeExperienceSection({
  headingId = "type-experiences-heading",
  className,
}: TypeExperienceSectionProps) {
  return (
    <section
      className={cn(className)}
      aria-labelledby={headingId}
    >
      <div className="mb-6">
        <h2
          id={headingId}
          className="text-lg font-semibold text-accent md:text-xl"
        >
          タイプ別に体験する
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-text-sub md:text-[1rem]">
          リアルタイムの言語整理、書類のたたき台、承認操作、検索・メール・資料——形式の違いを並べて比べられます。
        </p>
      </div>

      {/* PC: 3列×2行 */}
      <div className="hidden gap-4 md:grid md:grid-cols-3 md:gap-5">
        {typeMetas.map((meta) => (
          <TypeExperienceCard key={meta.slug} meta={meta} />
        ))}
      </div>

      {/* スマホ: 横スクロール */}
      <div className="relative left-1/2 w-screen -translate-x-1/2 md:hidden">
        <div
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2"
          aria-label="タイプ別体験の一覧（横スクロール）"
        >
          {typeMetas.map((meta) => (
            <TypeExperienceCard key={meta.slug} meta={meta} />
          ))}
        </div>
      </div>
    </section>
  );
}
