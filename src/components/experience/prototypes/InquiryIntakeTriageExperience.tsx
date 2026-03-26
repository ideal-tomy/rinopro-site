"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Inbox, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  buildInquiryIntakeMock,
  type InquiryIntakeMockResult,
} from "@/lib/experience/inquiry-intake-mock";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const SAMPLES = [
  "商品が届いたが箱が潰れている。交換したい",
  "来月からプランを解約したい。手続きを教えて",
  "ログインできない。エラーコード 403 が出る",
] as const;

const tagContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.06,
    },
  },
};

const tagItem = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 420, damping: 28 },
  },
};

interface InquiryIntakeTriageExperienceProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

function priorityStyles(p: InquiryIntakeMockResult["priority"]) {
  switch (p) {
    case "高":
      return "border-rose-500/50 bg-rose-500/15 text-rose-100";
    case "中":
      return "border-amber-500/45 bg-amber-500/12 text-amber-100";
    default:
      return "border-silver/35 bg-silver/10 text-text-sub";
  }
}

export function InquiryIntakeTriageExperience({
  meta,
  className,
}: InquiryIntakeTriageExperienceProps) {
  const reduceMotion = useReducedMotion();
  const [text, setText] = useState("");
  const [result, setResult] = useState<InquiryIntakeMockResult | null>(null);
  const [runKey, setRunKey] = useState(0);

  const run = () => {
    setResult(buildInquiryIntakeMock(text));
    setRunKey((k) => k + 1);
  };

  const staticTagList = result && reduceMotion;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="overflow-hidden rounded-xl border-l-4 border-l-[#f59e0b] border-y border-r border-silver/20 bg-[#12151c] shadow-md">
        <div className="flex items-center gap-2 border-b border-silver/15 bg-amber-500/10 px-4 py-2.5">
          <Inbox className="h-4 w-4 text-amber-400" aria-hidden />
          <span className="text-xs font-semibold text-amber-100/95 md:text-sm">
            チケット・トリアージ
          </span>
        </div>

        <div className="p-4 md:p-6">
          <h2 className="mb-3 text-sm font-semibold text-accent md:text-[1rem]">
            新着問い合わせ（未分類）
          </h2>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={meta.inputHint}
            rows={4}
            className="mb-3 resize-y text-sm md:text-[1rem]"
          />
          <div className="mb-3 flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setText(s)}
                className="rounded-lg border border-silver/30 px-3 py-1.5 text-left text-xs text-text-sub transition hover:border-amber-500/40 hover:text-text md:text-sm"
              >
                {s}
              </button>
            ))}
          </div>
          <Button type="button" onClick={run} disabled={!text.trim()}>
            分類・タグ付与・下書き生成
          </Button>
          <p className="mt-2 text-xs text-text-sub">
            ツールdemoは{" "}
            <Link
              href={`/demo/${meta.demoSlug}`}
              className="text-accent underline-offset-2 hover:underline"
            >
              こちら
            </Link>
          </p>
        </div>
      </div>

      {result && (
        <div
          key={runKey}
          className="space-y-4 rounded-xl border border-silver/20 bg-base-dark/90 p-4 md:p-6"
        >
          <div className="flex flex-wrap items-start gap-3">
            <div
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-semibold md:text-[1rem]",
                priorityStyles(result.priority)
              )}
            >
              優先度: {result.priority}
            </div>
            <div className="rounded-full border border-silver/30 bg-silver/5 px-3 py-1 text-sm text-text md:text-[1rem]">
              カテゴリ: {result.category}
            </div>
            <div className="rounded-full border border-indigo-500/35 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-100/95 md:text-[1rem]">
              担当: {result.department}
            </div>
          </div>

          <div className="rounded-lg border border-silver/20 bg-base-dark/60 p-3">
            <p className="text-xs font-medium text-text-sub">優先度の理由</p>
            <p className="mt-1 text-sm leading-relaxed text-text md:text-[1rem]">
              {result.priorityReason}
            </p>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-text-sub">
              <Tag className="h-3.5 w-3.5" aria-hidden />
              自動付与タグ
            </p>
            {staticTagList ? (
              <ul className="flex flex-wrap gap-2">
                {result.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-100/90 md:text-sm"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            ) : (
              <motion.ul
                className="flex flex-wrap gap-2"
                variants={tagContainer}
                initial="hidden"
                animate="show"
                aria-label="付与されたタグ"
              >
                {result.tags.map((t) => (
                  <motion.li
                    key={t}
                    variants={tagItem}
                    className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-100/90 md:text-sm"
                  >
                    {t}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>

          <div>
            <p className="mb-1 text-xs font-medium text-text-sub">
              顧客向け返信（草案）
            </p>
            <pre className="whitespace-pre-wrap rounded-lg border border-silver/20 bg-base-dark/60 p-3 text-sm text-text md:text-[1rem]">
              {result.draftReply}
            </pre>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-text-sub">社内メモ</p>
            <p className="text-sm text-text-sub md:text-[1rem]">
              {result.internalNote}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
