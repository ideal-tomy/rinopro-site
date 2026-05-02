import Image from "next/image";
import Link from "next/link";
import type { IndustryShowcaseItemWithPath } from "@/lib/content/industry-showcase";

interface IndustryShowcaseCardProps {
  item: IndustryShowcaseItemWithPath;
  /** トップの LCP 用。先頭カードのみ true */
  priorityImage?: boolean;
}

export function IndustryShowcaseCard({
  item,
  priorityImage = false,
}: IndustryShowcaseCardProps) {
  return (
    <Link
      href={item.hubPath}
      className="group block overflow-hidden rounded-2xl border border-silver/20 bg-base-dark/55 shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--color-elevated)_12%,transparent)] ring-1 ring-warm/15 ring-inset transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priorityImage}
          unoptimized
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-base/95 via-base/55 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
          <h3 className="text-[1rem] font-semibold text-text md:text-lg">
            {item.label}
          </h3>
          <p className="mt-1 text-sm text-text-sub">{item.tagline}</p>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm leading-relaxed text-text-sub">
          <span className="font-medium text-text/90">よくある負荷</span>
          <br />
          {item.painHint}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-sub">
          <span className="font-medium text-text/90">改善のヒント</span>
          <br />
          {item.solutionHint}
        </p>
        <p className="mt-4 text-sm font-medium text-accent underline-offset-4 group-hover:underline">
          詳しく見る
        </p>
      </div>
    </Link>
  );
}
