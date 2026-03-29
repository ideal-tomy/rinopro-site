"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ConciergePick } from "@/lib/demo/intelligent-concierge";
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
        "inline-block shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium",
        isLive
          ? "border border-accent/45 bg-accent/10 text-accent"
          : "border border-silver/35 bg-silver/10 text-text-sub"
      )}
    >
      {isLive ? "実AI" : "モック"}
    </span>
  );
}

/**
 * モーダル内で「一覧が最初から見える」ことを優先した横長1行カード（選択式・自由記述共通）。
 */
function DemoPickRow({
  pick,
  index,
  onNavigate,
}: {
  pick: ConciergePick;
  index: number;
  onNavigate: () => void;
}) {
  const { demo, reason } = pick;
  const slug = getSlug(demo);
  const imageUrl = demo.image?.url;
  const href = slug ? `/demo/${slug}` : "/demo/list";

  return (
    <li>
      <Link
        href={href}
        onClick={() => onNavigate()}
        aria-label={`${index + 1}件目: ${demo.title}のdemoを開く`}
        className={cn(
          "flex gap-3 rounded-xl border border-silver/20 bg-base-dark/95 p-2.5 text-left",
          "transition-[border-color,box-shadow] duration-200 hover:border-accent/45 hover:shadow-[0_0_20px_rgba(0,242,255,0.08)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
        )}
      >
        <div className="relative h-[4.5rem] w-[6.25rem] shrink-0 overflow-hidden rounded-lg bg-silver/15">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="100px"
            />
          ) : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          <div className="flex min-w-0 items-center gap-2">
            <RunModeBadge demo={demo} />
            <h2 className="truncate text-[13px] font-semibold leading-snug text-white/95">
              {demo.title}
            </h2>
          </div>
          {reason ? (
            <p className="line-clamp-2 text-[11px] leading-snug text-accent/90">
              {reason}
            </p>
          ) : null}
          <span className="text-[11px] font-medium text-accent/95">
            体験する →
          </span>
        </div>
      </Link>
    </li>
  );
}

const footerLinkClass =
  "text-[13px] font-medium text-accent underline-offset-2 transition-colors hover:text-accent/90 hover:underline";

export interface ConciergeDemoRecommendOverlayProps {
  picks: ConciergePick[];
  onResetFlow: () => void;
  onDismissForNavigation: () => void;
  /** 既定: demo検索ボットに戻る。フリーテキスト経路では「閉じる」など */
  resetFlowLabel?: string;
}

export function ConciergeDemoRecommendOverlay({
  picks,
  onResetFlow,
  onDismissForNavigation,
  resetFlowLabel = "demo検索ボットに戻る",
}: ConciergeDemoRecommendOverlayProps) {
  return (
    <div
      className="absolute inset-0 z-40 flex flex-col bg-base/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="concierge-demo-rec-title"
    >
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-silver/15 px-4 py-2.5">
        <div className="min-w-0">
          <h2
            id="concierge-demo-rec-title"
            className="text-sm font-semibold leading-snug text-white/95"
          >
            おすすめの demo（最大3件）
          </h2>
          <p className="mt-0.5 text-[11px] leading-snug text-text/75">
            行をタップすると、その demo のページへ進みます。
          </p>
        </div>
        <button
          type="button"
          onClick={onResetFlow}
          className="shrink-0 rounded-md px-2 py-1 text-[12px] font-medium text-accent underline-offset-2 transition-colors hover:bg-accent/10 hover:underline"
        >
          {resetFlowLabel}
        </button>
      </div>

      {/* flex-1 が高さ0に潰れないよう下限を付与。basis-0 で親内で伸縮し、長いときはスクロール */}
      <div className="max-h-full min-h-[min(38dvh,280px)] flex-1 basis-0 overflow-y-auto px-4 py-2.5">
        {picks.length > 0 ? (
          <ol className="flex list-none flex-col gap-2 p-0">
            {picks.map((pick, i) => (
              <DemoPickRow
                key={getSlug(pick.demo) ?? pick.demo._id}
                pick={pick}
                index={i}
                onNavigate={onDismissForNavigation}
              />
            ))}
          </ol>
        ) : (
          <p className="text-sm text-text/85">
            いまはカタログを読み込めませんでした。一覧からお選びください。
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-center gap-x-5 gap-y-1 border-t border-silver/15 bg-base/40 px-4 py-2">
        <Link
          href="/demo"
          className={footerLinkClass}
          onClick={() => onDismissForNavigation()}
        >
          一覧で探す
        </Link>
        <Link
          href="/estimate-detailed"
          className={footerLinkClass}
          onClick={() => onDismissForNavigation()}
        >
          詳細見積もり
        </Link>
      </div>
    </div>
  );
}
