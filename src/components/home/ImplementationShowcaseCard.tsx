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

export function ImplementationShowcaseCard({
  item,
  priorityImage = false,
}: ImplementationShowcaseCardProps) {
  const demoHref = resolveImplementationDemoHref(item);
  const detailHref = resolveImplementationDetailHref(item);
  const demoOpensExternal = isAbsoluteHttpUrl(demoHref);
  const videoThumbnail = isVideoPath(item.thumbnailSrc);
  const slideSources =
    item.thumbnailSlides && item.thumbnailSlides.length > 0
      ? item.thumbnailSlides
      : null;

  return (
    <article
      className={cn(
        "interactive-card group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] text-left",
        "motion-reduce:hover:!transform-none motion-reduce:hover:!shadow-none",
        "motion-safe:transition-[transform,box-shadow,border-color] motion-safe:duration-300",
        "hover:border-[var(--color-accent-primary)]/35 hover:shadow-lg md:hover:-translate-y-1"
      )}
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-[var(--color-bg-neutral)]">
        {slideSources ? (
          <ShowcaseThumbnailSlides
            slides={slideSources}
            alt={item.thumbnailAlt}
            sizes="(max-width: 768px) 82vw, (max-width: 1024px) 45vw, 320px"
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
            sizes="(max-width: 768px) 82vw, (max-width: 1024px) 45vw, 320px"
            priority={priorityImage}
          />
        )}
        {item.liveDemo ? (
          <span
            className={cn(
              "showcase-live-badge absolute right-2 top-2 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-bg-pure)] md:right-2.5 md:top-2.5 md:text-[11px]",
              "bg-[var(--color-accent-primary)]"
            )}
          >
            LIVE DEMO
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="text-[15px] font-bold leading-snug text-[var(--color-accent-primary)] md:text-[16px]">
          {item.brandName}
        </p>
        <h3 className="mt-2 text-balance text-[17px] font-semibold leading-snug text-[var(--color-text-primary)] md:text-lg">
          {item.productTitle}
        </h3>
        <p className="mt-2 text-[15px] leading-[1.75] text-[var(--color-text-secondary)] md:text-[16px]">
          {item.catchCopy}
        </p>
        <p className="mt-4">
          <span className="inline-flex rounded-full border border-[var(--color-border-light)] bg-[var(--color-bg-base)] px-3 py-1 text-[13px] font-medium text-[var(--color-text-secondary)] md:text-[14px]">
            {item.industryLabel}
          </span>
        </p>
        <div className="mt-auto flex flex-col gap-2.5 pt-6 sm:flex-row">
          <Button asChild size="sm" className="min-h-10 flex-1 gap-1.5">
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
          <Button asChild variant="outline" size="sm" className="min-h-10 flex-1">
            <Link href={detailHref}>詳細</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
