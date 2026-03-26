"use client";

import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageSectionDivider } from "@/components/layout/PageSectionDivider";
import { FeaturedExperienceVideoCard } from "@/components/experience/FeaturedExperienceVideoCard";
import { TypeExperienceSection } from "@/components/demo/TypeExperienceSection";
import { PurposePickSection } from "@/components/demo/PurposePickSection";
import {
  getFeaturedExperiencePrototypes,
  type FeaturedExperienceSlug,
} from "@/lib/experience/prototype-registry";
import { FEATURED_SHOWCASE_VIDEO_BY_SLUG } from "@/lib/experience/featured-showcase-media";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";

interface DemoPageContentProps {
  demos: (AiDemo | DemoItem)[];
}

export function DemoPageContent({ demos }: DemoPageContentProps) {
  const featured = getFeaturedExperiencePrototypes();
  /** 飲食ダッシュボード → 社内ナレッジの順（レジストリの逆順） */
  const featuredOrdered = [...featured].reverse();

  return (
    <div className="relative pb-32">
      <div className="container mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <header className="mb-10 text-center">
          <h1 className="text-2xl font-bold text-accent md:text-3xl">
            体験・ツールdemo
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-text-sub md:text-[1rem]">
            情報提供を、読みやすい画面と操作感で体験できるよう並べています。
          </p>
        </header>

        <div className="py-10 md:py-14">
          <PageSectionDivider />
        </div>

        {/* 1段目: Featured */}
        <section
          id="featured-experiences"
          className="scroll-mt-24 pb-16 md:pb-20"
          aria-label="注目のインタラクティブ体験"
        >
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6">
            {featuredOrdered.map((p) => (
              <FeaturedExperienceVideoCard
                key={p.slug}
                variant="hub"
                meta={p}
                videoSrc={
                  FEATURED_SHOWCASE_VIDEO_BY_SLUG[p.slug as FeaturedExperienceSlug]
                }
              />
            ))}
          </div>
        </section>

        <div className="py-10 md:py-14">
          <PageSectionDivider />
        </div>

        <TypeExperienceSection
          demos={demos}
          headingAlign="center"
          className="pb-16 md:pb-20"
        />

        <div className="py-10 md:py-14">
          <PageSectionDivider />
        </div>

        <PurposePickSection
          demos={demos}
          headingAlign="center"
          className="pb-16 md:pb-20"
        />

        <div className="py-10 md:py-14">
          <PageSectionDivider />
        </div>

        {/* モック一覧（網羅探索） */}
        <section aria-labelledby="catalog-cta-heading">
          <Card className="border-silver/30 bg-base-dark/60 p-6 md:p-8">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="min-w-0">
                <h2
                  id="catalog-cta-heading"
                  className="text-lg font-semibold text-accent md:text-xl"
                >
                  モックdemo一覧で網羅探索
                </h2>
                <p className="mt-2 text-sm text-text-sub md:text-[1rem]">
                  業種・用途タグで100本超のシナリオを横断できます。コンシェルジュで条件を絞り、比較の起点にも使えます。
                </p>
              </div>
              <Link
                href="/demo/list"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-5 py-3 text-sm font-medium text-accent transition-colors hover:border-accent/60 hover:bg-accent/15"
              >
                <LayoutGrid className="h-5 w-5" aria-hidden />
                一覧を開く
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
