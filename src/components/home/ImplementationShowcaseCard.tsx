import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImplementationShowcaseItem } from "@/lib/content/implementation-showcase";

export type ImplementationShowcaseCardProps = {
  item: ImplementationShowcaseItem;
  href: string;
  priorityImage?: boolean;
  /** カードフッターのリンク文言（LP は詳細ページ誘導が主） */
  ctaLabel?: string;
};

function isAbsoluteHttpUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

function isVideoPath(path: string): boolean {
  const normalized = path.toLowerCase();
  return normalized.endsWith(".mp4") || normalized.endsWith(".webm") || normalized.endsWith(".ogg");
}

export function ImplementationShowcaseCard({
  item,
  href,
  priorityImage = false,
  ctaLabel = "詳しく見る",
}: ImplementationShowcaseCardProps) {
  const external = isAbsoluteHttpUrl(href);
  const videoThumbnail = isVideoPath(item.thumbnailSrc);
  const sharedClass =
    "interactive-card group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] text-left motion-reduce:hover:!transform-none motion-reduce:hover:!shadow-none motion-reduce:active:!transform-none motion-safe:transition-[transform,box-shadow,border-color] motion-safe:duration-300 hover:border-[var(--color-accent-primary)]/35 hover:shadow-lg md:hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2";

  const inner = (
    <>
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-[var(--color-bg-neutral)]">
        {videoThumbnail ? (
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
        <p className="mt-auto pt-6 text-[15px] font-semibold text-[var(--color-accent-primary)] md:text-[16px]">
          <span className="inline-flex items-center gap-1 underline-offset-4 group-hover:underline">
            {ctaLabel}
            {external ? (
              <ExternalLink className="size-4 shrink-0" aria-hidden />
            ) : (
              <ArrowRight
                className="size-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-1"
                aria-hidden
              />
            )}
          </span>
        </p>
      </div>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title="外部サイトに移動します"
        className={sharedClass}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={sharedClass}>
      {inner}
    </Link>
  );
}
