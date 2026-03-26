"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ConciergePick } from "@/lib/demo/intelligent-concierge";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";
import {
  getFunctionTagClass,
  getIndustryTagClass,
} from "@/lib/demo/demo-taxonomy";

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
        "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
        isLive
          ? "border border-accent/50 bg-accent/10 text-accent"
          : "border border-silver/40 bg-silver/10 text-text-sub"
      )}
    >
      {isLive ? "実AI" : "モック"}
    </span>
  );
}

function RecommendationCard({ pick }: { pick: ConciergePick }) {
  const { demo, reason } = pick;
  const slug = getSlug(demo);
  const imageUrl = demo.image?.url;
  const oneLiner = demo.oneLiner ?? demo.description;
  const functionTags = demo.functionTags ?? [];
  const industryTags = demo.industryTags ?? [];

  return (
    <Link
      href={slug ? `/demo/${slug}` : "/demo/list"}
      className="group flex w-[min(78vw,320px)] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-silver/20 bg-base-dark transition-colors hover:border-accent/40"
    >
      {imageUrl ? (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={demo.title}
            fill
            className="object-cover transition-transform group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            sizes="(max-width: 768px) 78vw, 320px"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-silver/10" />
      )}
      <div className="flex flex-1 flex-col p-3">
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          <RunModeBadge demo={demo} />
          <h3 className="line-clamp-2 text-sm font-semibold text-text group-hover:text-accent">
            {demo.title}
          </h3>
        </div>
        {reason ? (
          <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-accent/90">
            {reason}
          </p>
        ) : null}
        {oneLiner ? (
          <p className="mb-2 line-clamp-2 flex-1 text-xs leading-relaxed text-text-sub">
            {oneLiner}
          </p>
        ) : null}
        <div className="mb-2 flex flex-wrap gap-1">
          {functionTags.slice(0, 1).map((t) => (
            <span
              key={`fn-${t}`}
              className={cn(
                "rounded-full border px-1.5 py-0.5 text-[10px] font-medium",
                getFunctionTagClass(t)
              )}
            >
              {t}
            </span>
          ))}
          {industryTags.slice(0, 2).map((t) => (
            <span
              key={`ind-${t}`}
              className={cn(
                "rounded-full border px-1.5 py-0.5 text-[10px] font-medium",
                getIndustryTagClass(t)
              )}
            >
              {t}
            </span>
          ))}
        </div>
        <span className="inline-flex h-8 items-center rounded-md border border-silver/30 px-2.5 text-xs font-medium text-text-sub group-hover:border-accent/50 group-hover:text-accent">
          体験する
        </span>
      </div>
    </Link>
  );
}

export function DemoListRecommendationPopup({
  picks,
  open,
  onClose,
}: {
  picks: ConciergePick[];
  open: boolean;
  onClose: () => void;
}) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [mounted, setMounted] = useState(false);

  const hasPicks = picks.length > 0;

  const updateScrollState = () => {
    const node = railRef.current;
    if (!node) return;
    setCanLeft(node.scrollLeft > 4);
    setCanRight(node.scrollLeft + node.clientWidth < node.scrollWidth - 4);
  };

  const subtitle = useMemo(() => {
    if (picks.length === 0) return "";
    return `${picks.length}件を抽出しました。横スクロールで比較できます。`;
  }, [picks.length]);

  useEffect(() => {
    if (!open || !hasPicks) return;
    updateScrollState();
  }, [open, picks]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !hasPicks) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, hasPicks]);

  useEffect(() => {
    if (!open || !hasPicks) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, hasPicks, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && hasPicks ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="提案ポップアップを閉じる"
            className="absolute inset-0 bg-base/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          />

          <motion.div
            className="relative z-10 flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-accent/35 bg-base-dark shadow-2xl"
            initial={{ opacity: 0, y: 14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="flex items-start justify-between gap-3 border-b border-silver/20 px-4 py-3">
              <div>
                <h2 className="text-[16px] font-semibold text-white">
                  あなた向けに3つ抽出しました
                </h2>
                <p className="mt-1 text-sm text-text-sub">{subtitle}</p>
              </div>
              <button
                type="button"
                className="rounded-md p-2 text-text-sub transition-colors hover:text-accent"
                onClick={onClose}
                aria-label="閉じる"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative px-4 py-4">
              <div
                ref={railRef}
                className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
                onScroll={updateScrollState}
              >
                {picks.map((pick) => (
                  <RecommendationCard
                    key={getSlug(pick.demo) ?? pick.demo._id}
                    pick={pick}
                  />
                ))}
              </div>

              {canLeft ? (
                <button
                  type="button"
                  className="absolute left-5 top-1/2 hidden -translate-y-1/2 rounded-full border border-silver/40 bg-base-dark/90 p-1.5 text-text-sub md:block"
                  onClick={() =>
                    railRef.current?.scrollBy({
                      left: -railRef.current.clientWidth * 0.72,
                      behavior: "smooth",
                    })
                  }
                  aria-label="左にスクロール"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              ) : null}
              {canRight ? (
                <button
                  type="button"
                  className="absolute right-5 top-1/2 hidden -translate-y-1/2 rounded-full border border-silver/40 bg-base-dark/90 p-1.5 text-text-sub md:block"
                  onClick={() =>
                    railRef.current?.scrollBy({
                      left: railRef.current.clientWidth * 0.72,
                      behavior: "smooth",
                    })
                  }
                  aria-label="右にスクロール"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
