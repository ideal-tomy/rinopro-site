"use client";

import { ScrollSavingLink } from "@/components/navigation/ScrollSavingLink";
import { useCurrentLocationString } from "@/hooks/use-current-location";
import { buildExperienceEntryHref } from "@/lib/navigation/experience-entry";
import { ExperienceCard } from "./ExperienceCard";
import { PageSectionWithScroll, StaggerGrid } from "@/components/layout/PageSectionWithScroll";
import { Card } from "@/components/ui/card";
import { SkeletonShimmer } from "@/components/ui/skeleton";
import { EXPERIENCE_PROTOTYPES } from "@/lib/experience/prototype-registry";
import type { CaseStudy } from "@/lib/sanity/types";

interface ExperiencePageContentProps {
  items: CaseStudy[];
}

export function ExperiencePageContent({ items }: ExperiencePageContentProps) {
  const returnSource = useCurrentLocationString();
  const track3 = EXPERIENCE_PROTOTYPES.filter((p) => p.tier === "track3");
  const track2 = EXPERIENCE_PROTOTYPES.filter((p) => p.tier === "track2");

  return (
    <PageSectionWithScroll
      title="まず触って、イメージを合わせてください。"
      cta={{ href: "/contact", label: "相談する" }}
    >
      <p className="mb-10 max-w-2xl text-sm text-text-sub md:text-[1rem]">
        アプリやダッシュボードに近い画面で、導入後の使い心地をイメージできます。
        あわせて
        <a href="/demo" className="mx-1 text-accent underline-offset-2 hover:underline">
          ツールdemo
        </a>
        から、チャット型の試し方もご利用ください。
      </p>

      <section className="mb-14" aria-labelledby="interactive-prototypes-heading">
        <h2
          id="interactive-prototypes-heading"
          className="mb-2 text-lg font-semibold text-accent md:text-xl"
        >
          インタラクティブ体験（プロトタイプ）
        </h2>
        <p className="mb-6 max-w-2xl text-sm text-text-sub md:text-[1rem]">
          ③はプロダクト寄り4本（秘書・クレーム返信・社内ナレッジBOT・飲食ダッシュボード）、続いて②の画面体験3本です。いずれもモック結果で流れを確認できます。
        </p>
        <div className="mb-8">
          <h3 className="mb-3 text-sm font-medium text-text md:text-base">
            ③ プロダクト寄り
          </h3>
          <StaggerGrid layout="list">
            {track3.map((p) => (
              <Card
                key={p.slug}
                className="border-silver/25 p-5 transition-colors hover:border-accent/40"
              >
                <ScrollSavingLink
                  href={buildExperienceEntryHref(p.slug, returnSource)}
                  className="block text-accent underline-offset-2 hover:underline"
                >
                  <span className="text-base font-semibold text-text md:text-lg">
                    {p.title}
                  </span>
                </ScrollSavingLink>
                <p className="mt-2 text-sm text-text-sub">{p.shortDescription}</p>
              </Card>
            ))}
          </StaggerGrid>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-medium text-text md:text-base">
            ② 画面体験
          </h3>
          <StaggerGrid layout="list">
            {track2.map((p) => (
              <Card
                key={p.slug}
                className="border-silver/25 p-5 transition-colors hover:border-accent/40"
              >
                <ScrollSavingLink
                  href={buildExperienceEntryHref(p.slug, returnSource)}
                  className="block text-accent underline-offset-2 hover:underline"
                >
                  <span className="text-base font-semibold text-text md:text-lg">
                    {p.title}
                  </span>
                </ScrollSavingLink>
                <p className="mt-2 text-sm text-text-sub">{p.shortDescription}</p>
              </Card>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <h2 className="mb-4 text-lg font-semibold text-accent md:text-xl">
        事例・紹介（Sanity）
      </h2>
      {items.length > 0 ? (
        <StaggerGrid cols="2" layout="list">
          {items.map((c) => (
            <ExperienceCard key={c._id} caseStudy={c} />
          ))}
        </StaggerGrid>
      ) : (
        <div className="mb-12 flex flex-col gap-6">
          {[1, 2, 3].map((i) => (
            <SkeletonShimmer key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      )}
    </PageSectionWithScroll>
  );
}
