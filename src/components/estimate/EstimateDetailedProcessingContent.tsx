"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { estimateDetailedCopy } from "@/lib/content/site-copy";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  acquireEstimateProcessingLock,
  releaseEstimateProcessingLock,
} from "@/lib/estimate/estimate-detailed-processing-lock";
import {
  readEstimateDetailedFlow,
  writeEstimateDetailedFlow,
} from "@/lib/estimate/estimate-detailed-session";
import { fetchEstimateDetailedWithRetry } from "@/lib/estimate/fetch-estimate-detailed-with-retry";

const copy = estimateDetailedCopy;
const MIN_MS = 4500;
const FADE_IN_SEC = 1;

const PROGRESS_MESSAGES = [
  "回答を読み取っています…",
  "前提をそろえています…",
  "文章に整えています…",
] as const;

function youtubeEmbedUrl(input: string): string | null {
  try {
    const u = new URL(input);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace(/^\//, "");
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
    }
  } catch {
    return null;
  }
  return null;
}

function WaitMedia({ url }: { url: string }) {
  const embed = youtubeEmbedUrl(url);
  if (embed) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-silver/25 bg-black">
        <iframe
          title={copy.processingVideoHeading}
          src={embed}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <video
      className="w-full rounded-xl border border-silver/25 bg-black"
      controls
      playsInline
      autoPlay
      muted
      loop
      preload="metadata"
    >
      <source src={url} />
    </video>
  );
}

export function EstimateDetailedProcessingContent() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const startedAt = useRef(Date.now());
  const [tipIndex, setTipIndex] = useState(0);
  const [progressIndex, setProgressIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [showRetryHint, setShowRetryHint] = useState(false);

  const videoUrl =
    typeof process.env.NEXT_PUBLIC_ESTIMATE_WAIT_VIDEO_URL === "string"
      ? process.env.NEXT_PUBLIC_ESTIMATE_WAIT_VIDEO_URL.trim()
      : "";

  useEffect(() => {
    const iv = setInterval(() => {
      setTipIndex((i) => (i + 1) % copy.processingTips.length);
    }, 6500);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setProgressIndex((i) => (i + 1) % PROGRESS_MESSAGES.length);
    }, 3200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const flow = readEstimateDetailedFlow();
    if (!flow) {
      router.replace("/estimate-detailed");
      return;
    }
    if (flow.ai) {
      router.replace("/estimate-detailed/result");
      return;
    }

    if (!acquireEstimateProcessingLock()) {
      const poll = setInterval(() => {
        const s = readEstimateDetailedFlow();
        if (s?.ai) {
          clearInterval(poll);
          router.replace("/estimate-detailed/result");
        }
      }, 400);
      return () => clearInterval(poll);
    }

    const run = async () => {
      try {
        const ai = await fetchEstimateDetailedWithRetry({
          answers: flow.answers,
          priorContext: flow.priorContext || undefined,
          onRetry: () => setShowRetryHint(true),
        });
        writeEstimateDetailedFlow({
          ...flow,
          ai,
        });
        const elapsed = Date.now() - startedAt.current;
        await new Promise((r) => setTimeout(r, Math.max(0, MIN_MS - elapsed)));
        router.replace("/estimate-detailed/result");
      } catch {
        releaseEstimateProcessingLock();
        setFailed(true);
      }
    };

    void run();
  }, [router]);

  if (failed) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <p className="text-destructive" role="alert">
          {copy.processingError}
        </p>
        <Button asChild className="min-h-11">
          <Link href="/estimate-detailed?reset=1">{copy.processingBackToForm}</Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="mx-auto max-w-2xl space-y-8"
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : FADE_IN_SEC,
        ease: "easeOut",
      }}
    >
      <header className="space-y-2 text-center">
        <p className="text-sm font-medium text-accent">{copy.processingProgressLabel}</p>
        {showRetryHint ? (
          <p className="text-xs text-text-sub" role="status">
            {copy.processingRetryHint}
          </p>
        ) : null}
        <h1 className="text-xl font-bold text-text md:text-2xl">{copy.processingTitle}</h1>
        <p className="text-sm leading-relaxed text-text-sub">{copy.processingSub}</p>
      </header>

      <div
        className="relative h-3 overflow-hidden rounded-full bg-silver/15"
        role="progressbar"
        aria-valuetext={PROGRESS_MESSAGES[progressIndex]}
        aria-busy="true"
      >
        <div className="h-full w-3/5 rounded-full bg-accent motion-safe:animate-pulse" />
      </div>
      <p className="text-center text-sm font-medium text-text">{PROGRESS_MESSAGES[progressIndex]}</p>

      {videoUrl ? (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-accent">{copy.processingVideoHeading}</h2>
          <WaitMedia url={videoUrl} />
        </section>
      ) : (
        <p className="text-center text-xs text-text-sub">{copy.processingVideoEmptyHint}</p>
      )}

      <section className="overflow-hidden rounded-xl border border-silver/25 bg-base-dark/50 p-5">
        <h2 className="text-sm font-semibold text-accent">{copy.processingTipHeading}</h2>
        <div className="relative mt-4 min-h-[6.5rem] md:min-h-[5.75rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tipIndex}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: 28, filter: "blur(8px)" }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, x: 0, filter: "blur(0px)" }
              }
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: -20, filter: "blur(6px)" }
              }
              transition={{
                duration: prefersReducedMotion ? 0.15 : 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-[16px] font-semibold leading-relaxed text-white/95 md:text-lg"
            >
              {copy.processingTips[tipIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button variant="outline" asChild className="min-h-11">
          <Link href="/flow" target="_blank" rel="noopener noreferrer">
            {copy.processingLinkFlow}
          </Link>
        </Button>
        <Button variant="outline" asChild className="min-h-11">
          <Link href="/demo/list" target="_blank" rel="noopener noreferrer">
            {copy.processingLinkDemo}
          </Link>
        </Button>
      </div>

    </motion.div>
  );
}
