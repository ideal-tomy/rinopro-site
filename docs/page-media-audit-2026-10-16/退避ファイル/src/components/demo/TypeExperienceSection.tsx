"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCurrentLocationString } from "@/hooks/use-current-location";
import { buildExperienceEntryHref } from "@/lib/navigation/experience-entry";
import {
  DEMO_HUB_TYPE_SECTION_SLUGS,
  getExperiencePrototypeBySlug,
} from "@/lib/experience/prototype-registry";
import { MockStyleExperienceCard } from "@/components/demo/MockStyleExperienceCard";
import { Button } from "@/components/ui/button";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

const typeMetas = DEMO_HUB_TYPE_SECTION_SLUGS.map((slug) => {
  const meta = getExperiencePrototypeBySlug(slug);
  if (!meta) throw new Error(`TypeExperienceSection: missing prototype ${slug}`);
  return meta;
});

function getDemoSlug(demo: AiDemo | DemoItem): string | undefined {
  return typeof demo.slug === "object" ? demo.slug?.current : demo.slug;
}

function findDemoForSlug(
  demos: (AiDemo | DemoItem)[] | undefined,
  slug: string
): AiDemo | DemoItem | undefined {
  return demos?.find((d) => getDemoSlug(d) === slug);
}

interface TypeExperienceSectionProps {
  demos?: (AiDemo | DemoItem)[];
  headingId?: string;
  className?: string;
  /** 見出しの配置（`/demo`・一覧・トップの目的別などで `center` を指定可能） */
  headingAlign?: "start" | "center";
  /**
   * PC のみ。`carousel` は自動カルーセル（現状トップでは未使用・`/demo`・`/demo/list` は grid 推奨）。
   */
  pcLayout?: "grid" | "carousel";
}

const CAROUSEL_TRANSITION_MS = 2000;

/** 3パネル（先頭3件・後半3件・先頭の複製）で常に右→左へ流し、ループ時のみ瞬時にリセット */
const CAROUSEL_PANEL_COUNT = 3;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return reduced;
}

/**
 * 「タイプ別に体験する」6件。PCは3列×2行またはカルーセル、スマホは横スクロール。
 * 主な利用箇所: `/demo` 体験ハブ、`/demo/list`（コンシェルジュブロック直下）。
 */
export function TypeExperienceSection({
  demos,
  headingId = "type-experiences-heading",
  className,
  headingAlign = "start",
  pcLayout = "grid",
}: TypeExperienceSectionProps) {
  const returnSource = useCurrentLocationString();
  const [carouselSlide, setCarouselSlide] = useState(0);
  const [carouselInstant, setCarouselInstant] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const showCarousel =
    pcLayout === "carousel" && !reducedMotion;
  const showCarouselAsGrid = pcLayout === "carousel" && reducedMotion;

  /** 論理スライド: 先頭3件 vs 後半3件（パネル2はパネル0と同じ見た目） */
  const carouselLogicalIndex = carouselSlide === 1 ? 1 : 0;

  const goToLogicalSlide = (logical: 0 | 1) => {
    if (logical === 0) {
      if (carouselSlide === 0) return;
      setCarouselInstant(true);
      setCarouselSlide(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCarouselInstant(false);
        });
      });
      return;
    }
    if (carouselSlide === 1) return;
    if (carouselSlide === 0) {
      setCarouselInstant(false);
      setCarouselSlide(1);
    } else {
      setCarouselInstant(true);
      setCarouselSlide(1);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCarouselInstant(false);
        });
      });
    }
  };

  const goNext = () => {
    if (carouselSlide === 2) {
      setCarouselInstant(true);
      setCarouselSlide(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCarouselInstant(false);
        });
      });
      return;
    }
    setCarouselInstant(false);
    setCarouselSlide((s) => Math.min(s + 1, 2) as 0 | 1 | 2);
  };

  /** 常に左方向の「次」と同じ並びへ進む（先頭3件の手前は後半3件＝瞬時ジャンプ） */
  const goPrev = () => {
    if (carouselSlide === 0) {
      setCarouselInstant(true);
      setCarouselSlide(1);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCarouselInstant(false);
        });
      });
      return;
    }
    setCarouselInstant(true);
    setCarouselSlide((s) => Math.max(s - 1, 0));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setCarouselInstant(false);
      });
    });
  };

  return (
    <section className={cn(className)} aria-labelledby={headingId}>
      <h2
        id={headingId}
        className={cn(
          "mb-8 text-lg font-semibold text-accent md:mb-10 md:text-xl",
          headingAlign === "center" && "text-center"
        )}
      >
        タイプ別に体験する
      </h2>

      {showCarousel ? (
        <div
          className="hidden md:block"
          role="region"
          aria-roledescription="カルーセル"
          aria-label="タイプ別体験（3件ずつ表示）"
        >
          <div className="overflow-hidden">
            <div
              className="flex w-[300%] will-change-transform"
              style={{
                transform: `translate3d(-${(carouselSlide * 100) / CAROUSEL_PANEL_COUNT}%,0,0)`,
                transitionProperty: "transform",
                transitionDuration: carouselInstant
                  ? "0ms"
                  : `${CAROUSEL_TRANSITION_MS}ms`,
                transitionTimingFunction:
                  "cubic-bezier(0.22, 0.99, 0.35, 1)",
              }}
            >
              {(
                [
                  { group: 0 as const, key: "a" },
                  { group: 1 as const, key: "b" },
                  { group: 0 as const, key: "loop" },
                ] as const
              ).map(({ group, key: panelKey }, panelIndex) => (
                <div
                  key={panelKey}
                  className="flex w-1/3 shrink-0 justify-center gap-x-14 lg:gap-x-16"
                  aria-hidden={carouselSlide !== panelIndex}
                >
                  {typeMetas.slice(group * 3, group * 3 + 3).map((meta) => {
                    const demo = findDemoForSlug(demos, meta.slug);
                    const oneLiner =
                      demo?.oneLiner ??
                      demo?.description ??
                      meta.shortDescription;
                    return (
                      <MockStyleExperienceCard
                        key={`${meta.slug}-${panelKey}`}
                        variant="grid"
                        href={buildExperienceEntryHref(meta.slug, returnSource)}
                        title={meta.title}
                        oneLiner={oneLiner}
                        functionTags={demo?.functionTags}
                        industryTags={demo?.industryTags}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-full border-silver/30 text-text hover:border-action/45 hover:bg-action/10 hover:text-action"
              aria-label="前の3件を表示"
              onClick={goPrev}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </Button>
            <div
              className="flex gap-2"
              role="group"
              aria-label="スライドの位置"
            >
              {([0, 1] as const).map((i) => (
                <button
                  key={i}
                  type="button"
                  aria-pressed={carouselLogicalIndex === i}
                  aria-label={`${i + 1}番目のスライド（カード ${i * 3 + 1}〜${i * 3 + 3}）`}
                  className={cn(
                    "h-2 rounded-full transition-[width,background-color] duration-300",
                    carouselLogicalIndex === i
                      ? "w-8 bg-action"
                      : "w-2 bg-silver/35 hover:bg-silver/50"
                  )}
                  onClick={() => goToLogicalSlide(i)}
                />
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-full border-silver/30 text-text hover:border-action/45 hover:bg-action/10 hover:text-action"
              aria-label="次の3件を表示"
              onClick={goNext}
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </Button>
          </div>
        </div>
      ) : null}

      {(pcLayout === "grid" || showCarouselAsGrid) && (
        <div className="hidden md:grid md:grid-cols-3 md:justify-items-center md:gap-x-14 md:gap-y-12 lg:gap-x-16">
          {typeMetas.map((meta) => {
            const demo = findDemoForSlug(demos, meta.slug);
            const oneLiner =
              demo?.oneLiner ?? demo?.description ?? meta.shortDescription;
            return (
              <MockStyleExperienceCard
                key={meta.slug}
                variant="grid"
                href={buildExperienceEntryHref(meta.slug, returnSource)}
                title={meta.title}
                oneLiner={oneLiner}
                functionTags={demo?.functionTags}
                industryTags={demo?.industryTags}
              />
            );
          })}
        </div>
      )}

      <div className="md:hidden">
        <p className="mb-3 text-[13px] text-text-sub/80">
          左右にスワイプして比較できます
        </p>
        <div
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
          aria-label="タイプ別体験の一覧（横スクロール）"
        >
          {typeMetas.map((meta) => {
            const demo = findDemoForSlug(demos, meta.slug);
            const oneLiner =
              demo?.oneLiner ?? demo?.description ?? meta.shortDescription;
            return (
              <MockStyleExperienceCard
                key={meta.slug}
                variant="rail"
                href={buildExperienceEntryHref(meta.slug, returnSource)}
                title={meta.title}
                oneLiner={oneLiner}
                functionTags={demo?.functionTags}
                industryTags={demo?.industryTags}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
