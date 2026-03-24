"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";

type Props = {
  meta: ExperiencePrototypeMeta;
  videoSrc: string;
  className?: string;
};

export function FeaturedExperienceVideoCard({
  meta,
  videoSrc,
  className,
}: Props) {
  const [videoFailed, setVideoFailed] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const showVideo =
    !prefersReducedMotion && !videoFailed && Boolean(videoSrc);

  return (
    <Link
      href={`/experience/${meta.slug}`}
      className={cn(
        "group block overflow-hidden rounded-xl border border-silver/25 bg-base-dark/50 transition-[border-color,transform] duration-300 hover:border-accent/40 hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-base-dark via-base-dark/90 to-base-dark/70">
        {showVideo ? (
          <video
            className="h-full w-full object-cover opacity-85 transition-opacity duration-300 group-hover:opacity-95"
            src={videoSrc}
            muted
            playsInline
            loop
            autoPlay
            preload="metadata"
            aria-hidden
            onError={() => setVideoFailed(true)}
          />
        ) : null}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/25",
            !showVideo && "from-black/55 via-black/35 to-black/20"
          )}
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
          <h3 className="text-base font-semibold leading-snug text-text md:text-lg">
            {meta.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-text-sub md:text-sm">
            {meta.shortDescription}
          </p>
          <span className="mt-3 inline-block text-xs font-medium text-accent/90 underline-offset-4 opacity-90 transition-opacity group-hover:opacity-100 group-hover:underline">
            体験を開く
          </span>
        </div>
      </div>
    </Link>
  );
}
