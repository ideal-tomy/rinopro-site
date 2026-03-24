"use client";

import Link from "next/link";
import { List } from "lucide-react";
import { DemoMatrixSection } from "./DemoMatrixSection";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import { Card } from "@/components/ui/card";
import { FeaturedExperienceVideoCard } from "@/components/experience/FeaturedExperienceVideoCard";
import {
  getFeaturedExperiencePrototypes,
  getOtherExperiencePrototypes,
} from "@/lib/experience/prototype-registry";
import { FEATURED_SHOWCASE_VIDEO_BY_SLUG } from "@/lib/experience/featured-showcase-media";
import type { FeaturedExperienceSlug } from "@/lib/experience/prototype-registry";
import type { AiDemo, CaseStudy, DemoItem } from "@/lib/sanity/types";
import { StaggerGrid } from "@/components/layout/PageSectionWithScroll";

interface DemoPageContentProps {
  demos: (AiDemo | DemoItem)[];
  caseStudies: CaseStudy[];
}

export function DemoPageContent({ demos, caseStudies }: DemoPageContentProps) {
  const featured = getFeaturedExperiencePrototypes();
  const others = getOtherExperiencePrototypes();
  const othersTrack3 = others.filter((p) => p.tier === "track3");
  const othersTrack2 = others.filter((p) => p.tier === "track2");

  return (
    <div className="relative pb-32">
      <div className="container mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <header className="mb-12">
          <h1 className="text-2xl font-bold text-accent md:text-3xl">
            体験・ツールdemo
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-text-sub md:text-[1rem]">
            まずは画面に近いプロトタイプで流れを掴み、続けてチャット型のモックdemoカタログや業種マトリクスから深掘りできます。
          </p>
        </header>

        <section
          id="featured-experiences"
          className="mb-16 scroll-mt-24"
          aria-labelledby="featured-experiences-heading"
        >
          <h2
            id="featured-experiences-heading"
            className="mb-2 text-lg font-semibold text-accent md:text-xl"
          >
            まずここから（注目の2本）
          </h2>
          <p className="mb-6 max-w-2xl text-sm text-text-sub md:text-[1rem]">
            社内ナレッジBOTと飲食オペレーション・ダッシュボード。動画が未配置の環境では静かなプレビュー表示に切り替わります。
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {featured.map((p) => (
              <FeaturedExperienceVideoCard
                key={p.slug}
                meta={p}
                videoSrc={
                  FEATURED_SHOWCASE_VIDEO_BY_SLUG[p.slug as FeaturedExperienceSlug]
                }
              />
            ))}
          </div>
        </section>

        <section
          className="mb-16"
          aria-labelledby="other-experiences-heading"
        >
          <h2
            id="other-experiences-heading"
            className="mb-2 text-lg font-semibold text-accent md:text-xl"
          >
            その他のインタラクティブ体験
          </h2>
          <p className="mb-6 max-w-2xl text-sm text-text-sub md:text-[1rem]">
            ③プロダクト寄り・②画面体験の残りです。いずれもモック結果で操作感を確認できます。
          </p>
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-medium text-text md:text-base">
              ③ プロダクト寄り
            </h3>
            <StaggerGrid layout="list">
              {othersTrack3.map((p) => (
                <Card
                  key={p.slug}
                  className="border-silver/25 p-5 transition-colors hover:border-accent/40"
                >
                  <Link
                    href={`/experience/${p.slug}`}
                    className="block text-accent underline-offset-2 hover:underline"
                  >
                    <span className="text-base font-semibold text-text md:text-lg">
                      {p.title}
                    </span>
                  </Link>
                  <p className="mt-2 text-sm text-text-sub">
                    {p.shortDescription}
                  </p>
                </Card>
              ))}
            </StaggerGrid>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-text md:text-base">
              ② 画面体験
            </h3>
            <StaggerGrid layout="list">
              {othersTrack2.map((p) => (
                <Card
                  key={p.slug}
                  className="border-silver/25 p-5 transition-colors hover:border-accent/40"
                >
                  <Link
                    href={`/experience/${p.slug}`}
                    className="block text-accent underline-offset-2 hover:underline"
                  >
                    <span className="text-base font-semibold text-text md:text-lg">
                      {p.title}
                    </span>
                  </Link>
                  <p className="mt-2 text-sm text-text-sub">
                    {p.shortDescription}
                  </p>
                </Card>
              ))}
            </StaggerGrid>
          </div>
        </section>

        <section className="mb-16" aria-labelledby="case-studies-heading">
          <h2
            id="case-studies-heading"
            className="mb-4 text-lg font-semibold text-accent md:text-xl"
          >
            事例・紹介（Sanity）
          </h2>
          {caseStudies.length > 0 ? (
            <StaggerGrid cols="2" layout="list">
              {caseStudies.map((c) => (
                <ExperienceCard key={c._id} caseStudy={c} />
              ))}
            </StaggerGrid>
          ) : (
            <p className="text-sm text-text-sub">
              掲載中の事例は準備中です。
            </p>
          )}
        </section>

        <section
          className="mb-4 rounded-xl border border-silver/20 bg-base-dark/30 p-6 md:p-8"
          aria-labelledby="mock-catalog-heading"
        >
          <h2
            id="mock-catalog-heading"
            className="text-lg font-semibold text-accent md:text-xl"
          >
            モックdemoカタログ
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-text-sub md:text-[1rem]">
            問い合わせ文→返信案や入力試し込みなど、ツールdemoを一覧から選べます。
          </p>
          <Link
            href="/demo/list"
            className="mt-5 inline-flex items-center text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            モックdemo一覧へ →
          </Link>
        </section>
      </div>

      <DemoMatrixSection demos={demos} />

      <Link
        href="/demo/list"
        className="fixed bottom-20 left-4 z-30 flex items-center gap-2 rounded-full border border-silver/30 bg-base-dark/90 px-4 py-2.5 text-sm text-text-sub backdrop-blur-sm transition-colors hover:border-accent/40 hover:text-accent md:bottom-24 md:left-6"
        aria-label="モックdemo一覧を開く"
      >
        <List className="h-4 w-4" />
        <span>モック一覧</span>
      </Link>
    </div>
  );
}
