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
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-base/95 via-base/55 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
          <h3 className="text-balance text-[1rem] font-semibold text-text md:text-lg">
            {item.label}
          </h3>
          <p className="mt-1 text-[15px] leading-[1.8] text-text-sub md:text-[16px]">{item.tagline}</p>
        </div>
      </div>
      <div className="p-7 md:p-8">
        <p className="text-[15px] leading-[1.8] text-white/[0.85] md:text-[16px]">
          <span className="font-semibold text-white">よくある負荷</span>
          <span className="mt-3 block font-normal">{item.painHint}</span>
        </p>
        <p className="mt-5 text-[15px] leading-[1.8] text-white/[0.85] md:text-[16px]">
          <span className="font-semibold text-white">改善のヒント</span>
          <span className="mt-3 block font-normal">{item.solutionHint}</span>
        </p>
        <p className="mt-5 text-[15px] font-semibold leading-[1.8] text-accent underline-offset-4 group-hover:underline md:text-[16px]">
          詳しく見る
        </p>
      </div>
    </Link>
  );
}
