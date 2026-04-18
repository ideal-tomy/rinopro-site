"use client";

import { ScrollSavingLink } from "@/components/navigation/ScrollSavingLink";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import { buildExperienceEntryHref } from "@/lib/navigation/experience-entry";

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
  /** 設定時、遷移元の pathname + query を `returnTo` として体験リンクに付与 */
  entryLocation?: string;
};

export function FeaturedExperienceVideoCard({
  meta,
  videoSrc,
  className,
  variant = "default",
  entryLocation,
}: Props) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const experienceHref = entryLocation
    ? buildExperienceEntryHref(meta.slug, entryLocation)
    : `/experience/${meta.slug}`;

  const ensureVideoPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (videoFailed) return;
    if (!video.paused && !video.ended) {
      setPlaybackBlocked(false);
      return;
    }
    const playPromise = video.play();
    if (playPromise && typeof playPromise.then === "function") {
      void playPromise
        .then(() => {
          setPlaybackBlocked(false);
        })
        .catch(() => {
          setPlaybackBlocked(true);
        });
    } else {
      setPlaybackBlocked(false);
    }
  }, [videoFailed]);

  const showVideo =
    !videoFailed &&
    Boolean(videoSrc);

  useEffect(() => {
    if (!showVideo) return;
    ensureVideoPlayback();
    const timer = globalThis.setTimeout(() => {
      ensureVideoPlayback();
    }, 200);
    // Some desktop browsers defer autoplay sporadically; retry briefly.
    let attempts = 0;
    const interval = globalThis.setInterval(() => {
      attempts += 1;
      ensureVideoPlayback();
      if (attempts >= 12) {
        globalThis.clearInterval(interval);
      }
    }, 500);
    return () => {
      globalThis.clearTimeout(timer);
      globalThis.clearInterval(interval);
    };
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

  const handleManualPlay = useCallback(
    (event?: MouseEvent<HTMLButtonElement>) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      ensureVideoPlayback();
    },
    [ensureVideoPlayback]
  );

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

  const ctaButtonClass =
    "w-full min-h-12 px-4 text-[15px] font-semibold leading-snug sm:min-h-[3.25rem] sm:text-[1.05rem] md:min-h-14 md:text-[1.125rem]";

  if (variant === "hub") {
    return (
      <article
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
              preload="auto"
              aria-label={`${meta.title}のプレビュー動画`}
              onPlay={() => setPlaybackBlocked(false)}
              onError={() => setVideoFailed(true)}
            />
          ) : null}
          {showVideo && playbackBlocked ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <button
                type="button"
                className="rounded-full border border-silver/35 bg-base-dark/85 px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent/50 hover:text-accent"
                onClick={handleManualPlay}
                aria-label={`${meta.title}の動画を再生`}
              >
                タップして再生
              </button>
            </div>
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
            <ScrollSavingLink href={experienceHref}>体験を開く</ScrollSavingLink>
          </Button>
        </div>
      </article>
    );
  }

  if (variant === "split") {
    return (
      <article
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
              preload="auto"
              aria-label={`${meta.title}のプレビュー動画`}
              onPlay={() => setPlaybackBlocked(false)}
              onError={() => setVideoFailed(true)}
            />
          ) : null}
          {showVideo && playbackBlocked ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <button
                type="button"
                className="rounded-full border border-silver/35 bg-base-dark/85 px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent/50 hover:text-accent"
                onClick={handleManualPlay}
                aria-label={`${meta.title}の動画を再生`}
              >
                タップして再生
              </button>
            </div>
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
            <ScrollSavingLink href={experienceHref}>体験を開く</ScrollSavingLink>
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article>
      <ScrollSavingLink
        href={experienceHref}
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
              preload="auto"
              aria-hidden
              onPlay={() => setPlaybackBlocked(false)}
              onError={() => setVideoFailed(true)}
            />
          ) : null}
          {showVideo && playbackBlocked ? (
            <div className="absolute inset-0 z-[2] flex items-center justify-center bg-black/40">
              <button
                type="button"
                className="rounded-full border border-silver/35 bg-base-dark/85 px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent/50 hover:text-accent"
                onClick={handleManualPlay}
                aria-label={`${meta.title}の動画を再生`}
              >
                タップして再生
              </button>
            </div>
          ) : null}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/40 to-black/25",
              !showVideo && "from-black/55 via-black/35 to-black/20"
            )}
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 z-[3] p-4 md:p-5">
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
      </ScrollSavingLink>
    </article>
  );
}
