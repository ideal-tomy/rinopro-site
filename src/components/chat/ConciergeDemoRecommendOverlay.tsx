"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ConciergeCtaButton,
  ConciergeCtaLink,
} from "@/components/chat/ConciergeChoiceButton";
import { cn } from "@/lib/utils";
import type { ConciergePick } from "@/lib/demo/intelligent-concierge";
import {
  getFunctionTagClass,
  getIndustryTagClass,
} from "@/lib/demo/demo-taxonomy";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";

function getSlug(demo: AiDemo | DemoItem): string | undefined {
  return typeof demo.slug === "object" ? demo.slug?.current : demo.slug;
}

function RunModeBadge({ demo }: { demo: AiDemo | DemoItem }) {
  if ((demo as AiDemo)._type !== "aiDemo") return null;
  const runMode = (demo as AiDemo).runMode ?? "mock_preview";
  const isLive = runMode === "ai_live";
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
        isLive
          ? "border border-accent/50 bg-accent/10 text-accent"
          : "border border-silver/40 bg-silver/10 text-text-sub"
      )}
    >
      {isLive ? "実AI" : "モック"}
    </span>
  );
}

function PickCard({
  pick,
  onNavigate,
}: {
  pick: ConciergePick;
  onNavigate: () => void;
}) {
  const { demo, reason } = pick;
  const slug = getSlug(demo);
  const imageUrl = demo.image?.url;
  const oneLiner = demo.oneLiner ?? demo.description;
  const functionTags = demo.functionTags ?? [];
  const industryTags = demo.industryTags ?? [];

  return (
    <Link
      href={slug ? `/demo/${slug}` : "/demo/list"}
      className={cn(
        "group flex w-[min(78vw,220px)] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-silver/20 bg-base-dark transition-colors hover:border-accent/40 sm:w-[200px]"
      )}
      onClick={() => onNavigate()}
    >
      {imageUrl ? (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={demo.title}
            fill
            className="object-cover transition-transform group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            sizes="220px"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-silver/10" />
      )}
      <div className="flex flex-1 flex-col p-2.5">
        <div className="mb-1 flex flex-wrap items-center gap-1.5">
          <RunModeBadge demo={demo} />
          <h2 className="line-clamp-2 text-xs font-semibold leading-snug text-text group-hover:text-accent">
            {demo.title}
          </h2>
        </div>
        {reason ? (
          <p className="mb-1 line-clamp-2 text-[10px] leading-tight text-accent/90">
            {reason}
          </p>
        ) : null}
        {oneLiner ? (
          <p className="mb-2 line-clamp-2 flex-1 text-[10px] leading-4 text-text-sub">
            {oneLiner}
          </p>
        ) : null}
        <div className="mb-2 flex flex-wrap gap-1">
          {functionTags.slice(0, 1).map((t) => (
            <span
              key={`fn-${t}`}
              className={cn(
                "rounded-full border px-1.5 py-0.5 text-[9px] font-medium",
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
                "rounded-full border px-1.5 py-0.5 text-[9px] font-medium",
                getIndustryTagClass(t)
              )}
            >
              {t}
            </span>
          ))}
        </div>
        <span className="inline-flex h-7 items-center rounded-md border border-silver/30 px-2 text-[10px] font-medium text-text-sub group-hover:border-accent/50 group-hover:text-accent">
          体験する
        </span>
      </div>
    </Link>
  );
}

export interface ConciergeDemoRecommendOverlayProps {
  picks: ConciergePick[];
  onResetFlow: () => void;
  onDismissForNavigation: () => void;
}

export function ConciergeDemoRecommendOverlay({
  picks,
  onResetFlow,
  onDismissForNavigation,
}: ConciergeDemoRecommendOverlayProps) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col bg-base/92 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="concierge-demo-rec-title"
    >
      <div className="shrink-0 border-b border-silver/15 px-4 py-3">
        <h2
          id="concierge-demo-rec-title"
          className="text-sm font-semibold leading-relaxed text-text/95"
        >
          おすすめの demo（最大3件）
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-text/80">
          カードをタップして体験ページへ進めます。
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-4 py-3">
        {picks.length > 0 ? (
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden pb-2 [scrollbar-width:thin]">
            {picks.map((pick) => (
              <div key={getSlug(pick.demo) ?? pick.demo._id} className="snap-start">
                <PickCard
                  pick={pick}
                  onNavigate={onDismissForNavigation}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text/85">
            いまはカタログを読み込めませんでした。一覧からお選びください。
          </p>
        )}
      </div>

      <div className="shrink-0 space-y-2 border-t border-silver/15 bg-base/50 px-4 py-3">
        <ConciergeCtaButton
          type="button"
          variant="secondary"
          onClick={onResetFlow}
        >
          demo検索ボットに戻る
        </ConciergeCtaButton>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ConciergeCtaLink
            href="/demo"
            variant="secondary"
            onClick={() => onDismissForNavigation()}
          >
            一覧で探す
          </ConciergeCtaLink>
          <ConciergeCtaLink
            href="/estimate-detailed"
            variant="primary"
            onClick={() => onDismissForNavigation()}
          >
            概算見積もり
          </ConciergeCtaLink>
        </div>
      </div>
    </div>
  );
}
