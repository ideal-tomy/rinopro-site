import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ShowcaseThumbnailSlides } from "@/components/home/ShowcaseThumbnailSlides";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ImplementationShowcaseItem } from "@/lib/content/implementation-showcase";
import {
  resolveImplementationDemoHref,
  resolveImplementationDetailHref,
} from "@/lib/content/implementation-showcase";

export type ImplementationShowcaseCardProps = {
  item: ImplementationShowcaseItem;
  priorityImage?: boolean;
  variant?: "default" | "compact";
  /** default カードの業種ピル（おすすめ一覧などで非表示にする） */
  showIndustryLabel?: boolean;
};

function isVideoPath(path: string): boolean {
  const normalized = path.toLowerCase();
  return (
    normalized.endsWith(".mp4") ||
    normalized.endsWith(".webm") ||
    normalized.endsWith(".ogg")
  );
}

function isAbsoluteHttpUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * 静的HTMLの提案LP（/lp/...）や外部URLは Next の <Link>（クライアント遷移）だと
 * RSC を取得できず白画面になるため、フルページ遷移（<a>）が必要。
 */
function needsHardNavigation(url: string): boolean {
  return isAbsoluteHttpUrl(url) || url.startsWith("/lp/");
}

export function ImplementationShowcaseCard({
  item,
  priorityImage = false,
  variant = "default",
  showIndustryLabel = true,
}: ImplementationShowcaseCardProps) {
  const compact = variant === "compact";
  const imageSizes = compact
    ? "(max-width: 1024px) 72vw, 18vw"
    : "(max-width: 768px) 82vw, (max-width: 1024px) 45vw, 320px";
  const demoHref = resolveImplementationDemoHref(item);
  const detailHref = resolveImplementationDetailHref(item);
  const showDetailCta = item.showDetailCta !== false;
  const demoOpensExternal = isAbsoluteHttpUrl(demoHref);
  const videoThumbnail = isVideoPath(item.thumbnailSrc);
  const slideSources =
    item.thumbnailSlides && item.thumbnailSlides.length > 0
      ? item.thumbnailSlides
      : null;

  return (
    <article
      className={cn(
        "interactive-card group flex h-full flex-col overflow-hidden border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] text-left",
        compact ? "rounded-xl" : "rounded-2xl",
        "motion-reduce:hover:!transform-none motion-reduce:hover:!shadow-none",
        "motion-safe:transition-[transform,box-shadow,border-color] motion-safe:duration-300",
        compact
          ? "hover:border-[var(--color-accent-primary)]/35 hover:shadow-md"
          : "hover:border-[var(--color-accent-primary)]/35 hover:shadow-lg md:hover:-translate-y-1"
      )}
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-[var(--color-bg-neutral)]">
        {slideSources ? (
          <ShowcaseThumbnailSlides
            slides={slideSources}
            alt={item.thumbnailAlt}
            sizes={imageSizes}
            priority={priorityImage}
            className="motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.04]"
          />
        ) : videoThumbnail ? (
          <video
            src={item.thumbnailSrc}
            aria-label={item.thumbnailAlt}
            className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.04]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <Image
            src={item.thumbnailSrc}
            alt={item.thumbnailAlt}
            fill
            className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.04]"
            sizes={imageSizes}
            priority={priorityImage}
          />
        )}
        {item.liveDemo ? (
          <span
            className={cn(
              "showcase-live-badge absolute right-2 top-2 rounded px-2 py-0.5 font-bold uppercase tracking-wider text-[var(--color-bg-pure)]",
              compact ? "text-[9px] md:text-[10px]" : "text-[10px] md:right-2.5 md:top-2.5 md:text-[11px]",
              "bg-[var(--color-accent-primary)]"
            )}
          >
            LIVE DEMO
          </span>
        ) : null}
      </div>
      <div
        className={cn(
          "flex flex-1 flex-col",
          compact ? "p-3 md:p-3.5" : "p-5 md:p-6"
        )}
      >
        <p
          className={cn(
            "font-bold leading-snug text-[var(--color-accent-primary)]",
            compact ? "text-[13px]" : "text-[15px] md:text-[16px]"
          )}
        >
          {item.brandName}
        </p>
        <h3
          className={cn(
            "mt-1.5 text-balance font-semibold leading-snug text-[var(--color-text-primary)]",
            compact ? "text-[14px] leading-[1.35]" : "mt-2 text-[17px] md:text-lg"
          )}
        >
          {item.productTitle}
        </h3>
        <p
          className={cn(
            "mt-1.5 leading-[1.45] text-[var(--color-text-secondary)]",
            compact
              ? "line-clamp-2 text-[13px]"
              : "mt-2 line-clamp-3 text-[15px] md:text-[16px]"
          )}
        >
          {item.catchCopy}
        </p>
        {!compact && showIndustryLabel ? (
          <p className="mt-4">
            <span className="inline-flex rounded-full border border-[var(--color-border-light)] bg-[var(--color-bg-base)] px-3 py-1 text-[13px] font-medium text-[var(--color-text-secondary)] md:text-[14px]">
              {item.industryLabel}
            </span>
          </p>
        ) : null}
        <div
          className={cn(
            "mt-auto flex flex-col gap-2",
            compact ? "pt-3" : "gap-2.5 pt-6",
            !compact && showDetailCta ? "sm:flex-row" : ""
          )}
        >
          <Button
            asChild
            size="sm"
            className={cn(
              compact ? "min-h-9 gap-1 text-[13px]" : "min-h-10 gap-1.5",
              showDetailCta && !compact ? "flex-1" : "w-full"
            )}
          >
            <a
              href={demoHref}
              target="_blank"
              rel="noopener noreferrer"
              title={
                demoOpensExternal ? "外部サイトでデモを開きます" : "新しいタブでデモを開きます"
              }
            >
              デモ体験
              <ExternalLink className="size-3.5 shrink-0" aria-hidden />
            </a>
          </Button>
          {showDetailCta ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className={cn(compact ? "min-h-9 text-[13px]" : "min-h-10 flex-1")}
            >
              {needsHardNavigation(detailHref) ? (
                <a href={detailHref}>詳細</a>
              ) : (
                <Link href={detailHref}>詳細</Link>
              )}
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
