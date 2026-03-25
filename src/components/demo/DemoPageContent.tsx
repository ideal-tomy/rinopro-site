"use client";

import Link from "next/link";
import { List } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FeaturedExperienceVideoCard } from "@/components/experience/FeaturedExperienceVideoCard";
import {
  getFeaturedExperiencePrototypes,
  getOtherExperiencePrototypes,
  type ExperiencePrototypeMeta,
  type FeaturedExperienceSlug,
} from "@/lib/experience/prototype-registry";
import { FEATURED_SHOWCASE_VIDEO_BY_SLUG } from "@/lib/experience/featured-showcase-media";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";
import { StaggerGrid } from "@/components/layout/PageSectionWithScroll";
import {
  getFunctionTagClass,
  getIndustryTagClass,
} from "@/lib/demo/demo-taxonomy";
import { cn } from "@/lib/utils";

interface DemoPageContentProps {
  demos: (AiDemo | DemoItem)[];
}

function getDemoSlug(demo: AiDemo | DemoItem): string | undefined {
  return typeof demo.slug === "object" ? demo.slug?.current : demo.slug;
}

function findDemoForPrototype(
  demos: (AiDemo | DemoItem)[],
  meta: ExperiencePrototypeMeta
): AiDemo | DemoItem | undefined {
  return demos.find((d) => getDemoSlug(d) === meta.demoSlug);
}

function PrototypeTagRow({ demo }: { demo: AiDemo | DemoItem | undefined }) {
  if (!demo) return null;
  const functionTags = demo.functionTags ?? [];
  const industryTags = demo.industryTags ?? [];
  if (functionTags.length === 0 && industryTags.length === 0) return null;
  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-1 sm:gap-1.5">
      {functionTags.slice(0, 1).map((t) => (
        <span
          key={`fn-${t}`}
          className={cn(
            "shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium md:px-2 md:text-xs",
            getFunctionTagClass(t)
          )}
        >
          {t}
        </span>
      ))}
      {industryTags.slice(0, 2).map((t) => (
        <span
          key={`ind-${t}`}
          className={cn(
            "shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium md:px-2 md:text-xs",
            getIndustryTagClass(t)
          )}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

export function DemoPageContent({ demos }: DemoPageContentProps) {
  const featured = getFeaturedExperiencePrototypes();
  /** 飲食ダッシュボード → 社内ナレッジの順（レジストリの逆順） */
  const featuredOrdered = [...featured].reverse();
  const others = getOtherExperiencePrototypes();
  const othersTrack3 = others.filter((p) => p.tier === "track3");
  const othersTrack2 = others.filter((p) => p.tier === "track2");

  return (
    <div className="relative pb-32">
      <div className="container mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <header className="mb-10">
          <h1 className="text-2xl font-bold text-accent md:text-3xl">
            体験・ツールdemo
          </h1>
        </header>

        <section
          id="featured-experiences"
          className="mb-16 scroll-mt-24"
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

        <section
          className="mb-16"
          aria-labelledby="other-experiences-heading"
        >
          <h2
            id="other-experiences-heading"
            className="mb-6 text-lg font-semibold text-accent md:text-xl"
          >
            その他のインタラクティブ体験
          </h2>
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-medium text-text md:text-[1rem]">
              ③ プロダクト寄り
            </h3>
            <StaggerGrid layout="list">
              {othersTrack3.map((p) => (
                <Card
                  key={p.slug}
                  className="border-silver/25 p-5 transition-colors hover:border-accent/40"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                    <Link
                      href={`/experience/${p.slug}`}
                      className="min-w-0 shrink text-accent underline-offset-2 hover:underline"
                    >
                      <span className="text-[1rem] font-semibold text-text md:text-lg">
                        {p.title}
                      </span>
                    </Link>
                    <PrototypeTagRow demo={findDemoForPrototype(demos, p)} />
                  </div>
                  <p className="mt-2 text-sm text-text-sub">
                    {p.shortDescription}
                  </p>
                </Card>
              ))}
            </StaggerGrid>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-text md:text-[1rem]">
              ② 画面体験
            </h3>
            <StaggerGrid layout="list">
              {othersTrack2.map((p) => (
                <Card
                  key={p.slug}
                  className="border-silver/25 p-5 transition-colors hover:border-accent/40"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                    <Link
                      href={`/experience/${p.slug}`}
                      className="min-w-0 shrink text-accent underline-offset-2 hover:underline"
                    >
                      <span className="text-[1rem] font-semibold text-text md:text-lg">
                        {p.title}
                      </span>
                    </Link>
                    <PrototypeTagRow demo={findDemoForPrototype(demos, p)} />
                  </div>
                  <p className="mt-2 text-sm text-text-sub">
                    {p.shortDescription}
                  </p>
                </Card>
              ))}
            </StaggerGrid>
          </div>
        </section>
      </div>

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
