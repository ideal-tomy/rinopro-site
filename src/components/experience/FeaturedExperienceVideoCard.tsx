"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";

type Props = {
  meta: ExperiencePrototypeMeta;
  videoSrc: string;
  className?: string;
  /**
   * `hub`: /demo 用。動画下にタイトル・説明・2CTA。
   * `split`: トップ用。hub と同じく動画＋下段にタイトル・説明・単一CTA（オーバーレイなし）。
   * `default`: 動画上オーバーレイ＋カード全体リンク。
   */
  variant?: "hub" | "split" | "default";
};

export function FeaturedExperienceVideoCard({
  meta,
  videoSrc,
  className,
  variant = "default",
}: Props) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const cardRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const ensureVideoPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (videoFailed) return;
    if (!video.paused) return;
    void video.play().catch(() => {
      // Autoplay can fail transiently on some devices; retry hooks below will re-attempt.
    });
  }, [videoFailed]);

  const showVideo =
    inViewport &&
    !videoFailed &&
    Boolean(videoSrc);

  useEffect(() => {
    if (!showVideo) return;
    ensureVideoPlayback();
    const timer = globalThis.setTimeout(() => {
      ensureVideoPlayback();
    }, 200);
    return () => globalThis.clearTimeout(timer);
  }, [showVideo, ensureVideoPlayback]);

  useEffect(() => {
    if (!showVideo) return;
    const resumeOnVisible = () => {
      if (document.visibilityState === "visible") {
        ensureVideoPlayback();
      }
    };
    document.addEventListener("visibilitychange", resumeOnVisible);
    return () => document.removeEventListener("visibilitychange", resumeOnVisible);
  }, [showVideo, ensureVideoPlayback]);

  useEffect(() => {
    if (!showVideo) return;
    const video = videoRef.current;
    if (!video) return;
    const onReady = () => ensureVideoPlayback();
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
    };
  }, [showVideo, ensureVideoPlayback]);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInViewport(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: "180px 0px", threshold: 0.01 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const ctaButtonClass =
    "w-full min-h-12 px-4 text-[15px] font-semibold leading-snug sm:min-h-[3.25rem] sm:text-[1.05rem] md:min-h-14 md:text-[1.125rem]";

  if (variant === "hub") {
    return (
      <article
        ref={cardRef}
        className={cn(
          "overflow-hidden rounded-xl border border-silver/25 bg-base-dark/50 transition-[border-color,box-shadow] duration-300 hover:border-accent/40",
          className
        )}
      >
        <div
          className={cn(
            "relative aspect-video w-full overflow-hidden",
            showVideo
              ? "bg-black"
              : "bg-gradient-to-br from-base-dark via-base-dark/90 to-base-dark/70"
          )}
        >
          {showVideo ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={videoSrc}
              muted
              playsInline
              loop
              autoPlay
              preload="metadata"
              aria-label={`${meta.title}のプレビュー動画`}
              onError={() => setVideoFailed(true)}
            />
          ) : null}
        </div>

        <div className="border-t border-silver/20 bg-base-dark/90 px-4 py-4 md:px-5 md:py-5">
          <h3 className="text-[1rem] font-semibold leading-snug text-text md:text-lg">
            {meta.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-text-sub md:text-[1rem]">
            {meta.shortDescription}
          </p>

          <Button asChild variant="default" size="lg" className={cn("mt-4", ctaButtonClass)}>
            <Link href={`/experience/${meta.slug}`}>体験を開く</Link>
          </Button>
        </div>
      </article>
    );
  }

  if (variant === "split") {
    return (
      <article
        ref={cardRef}
        className={cn(
          "overflow-hidden rounded-xl border border-silver/25 bg-base-dark/50 transition-[border-color,box-shadow] duration-300 hover:border-accent/40",
          className
        )}
      >
        <div
          className={cn(
            "relative aspect-video w-full overflow-hidden",
            showVideo
              ? "bg-black"
              : "bg-gradient-to-br from-base-dark via-base-dark/90 to-base-dark/70"
          )}
        >
          {showVideo ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={videoSrc}
              muted
              playsInline
              loop
              autoPlay
              preload="metadata"
              aria-label={`${meta.title}のプレビュー動画`}
              onError={() => setVideoFailed(true)}
            />
          ) : null}
        </div>

        <div className="border-t border-silver/20 bg-base-dark/90 px-4 py-4 md:px-5 md:py-5">
          <h3 className="text-[1rem] font-semibold leading-snug text-text md:text-lg">
            {meta.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-text-sub md:text-[1rem]">
            {meta.shortDescription}
          </p>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="mt-4 w-full min-h-12 border-silver/25 px-4 text-[15px] font-medium text-text-sub hover:border-action/45 hover:bg-action/10 hover:text-action sm:min-h-[3.25rem] sm:text-[1.05rem] md:min-h-14"
          >
            <Link href={`/experience/${meta.slug}`}>体験を開く</Link>
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article ref={cardRef}>
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
              ref={videoRef}
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
            <h3 className="text-[1rem] font-semibold leading-snug text-text md:text-lg">
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
    </article>
  );
}
