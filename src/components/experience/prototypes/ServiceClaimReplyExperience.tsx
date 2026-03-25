"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  buildClaimMock,
  type ServiceClaimMockResult,
} from "@/lib/experience/service-claim-mock";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const SAMPLES = [
  "配送が1日遅れた。お詫びと再配送希望",
  "商品に傷、交換か返金希望",
  "怒りのメール：二度と使いません。全額返金を要求します",
] as const;

const APPROVAL_STEPS = [
  { id: 0, label: "① 下書き作成" },
  { id: 1, label: "② 上長確認中" },
  { id: 2, label: "③ 送信承認" },
] as const;

interface ServiceClaimReplyExperienceProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

export function ServiceClaimReplyExperience({
  meta,
  className,
}: ServiceClaimReplyExperienceProps) {
  const replyHeadingId = useId();
  const reduceMotion = useReducedMotion();
  const motionDuration = reduceMotion ? 0 : 0.22;

  const [text, setText] = useState("");
  const [result, setResult] = useState<ServiceClaimMockResult | null>(null);
  const [bodies, setBodies] = useState<string[]>([]);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [approvalStepIndex, setApprovalStepIndex] = useState(0);

  const run = () => {
    const data = buildClaimMock(text);
    setResult(data);
    setBodies(data.variants.map((v) => v.body));
    setSelectedVariantIndex(0);
    setApprovalStepIndex(0);
  };

  const setBodyAt = (index: number, value: string) => {
    setBodies((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const selectedBody = bodies[selectedVariantIndex] ?? "";
  const selectedLabel =
    result?.variants[selectedVariantIndex]?.label ?? "";

  return (
    <div className={cn("space-y-6", className)}>
      {/* メールクライアント風クローム */}
      <div className="overflow-hidden rounded-xl border border-indigo-500/25 bg-[#0d111f] shadow-lg shadow-indigo-950/40">
        <div className="flex items-center gap-2 border-b border-indigo-500/20 bg-indigo-950/50 px-3 py-2.5 md:px-4">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <Mail className="ml-2 h-4 w-4 text-indigo-300/90" aria-hidden />
          <span className="text-xs font-medium tracking-wide text-indigo-100/90 md:text-sm">
            CS返信スタジオ（モック）
          </span>
        </div>

        <div className="p-4 md:p-6">
          <h2 className="mb-3 text-sm font-semibold text-accent md:text-[1rem]">
            入力（怒りのメール原文・状況メモ）
          </h2>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={meta.inputHint}
            rows={4}
            className="mb-3 resize-y border-indigo-500/20 bg-[#0a0e17]/80 text-sm text-text md:text-[1rem]"
          />
          <div className="mb-3 flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setText(s)}
                className="rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3 py-1 text-left text-xs text-text-sub transition hover:border-accent/50 hover:text-text md:text-sm"
              >
                {s}
              </button>
            ))}
          </div>
          <Button type="button" onClick={run}>
            返信案を生成（モック）
          </Button>
          <p className="mt-2 text-xs text-text-sub">
            本画面はプロトタイプです。実AIは{" "}
            <Link
              href={`/demo/${meta.demoSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline-offset-2 hover:underline"
            >
              ツールdemo
            </Link>
            から。
          </p>
        </div>
      </div>

      {result && bodies.length === result.variants.length && (
        <div className="space-y-4">
          <div
            className="flex gap-3 rounded-xl border border-amber-500/35 bg-amber-500/[0.07] p-4"
            role="status"
          >
            <Flame
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-400"
              aria-hidden
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-200/90">
                AIメモ：いま一番怒っているポイント
              </p>
              <p className="mt-1 text-sm leading-relaxed text-text md:text-[1rem]">
                {result.angerFocus}
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,320px)]">
            <div className="space-y-4">
              <div className="rounded-xl border border-silver/20 bg-base-dark p-4 md:p-5">
                <h3
                  id={replyHeadingId}
                  className="mb-3 text-sm font-semibold text-text md:text-[1rem]"
                >
                  トーンをワンクリックで切替
                </h3>
                <p className="mb-3 text-xs text-text-sub md:text-sm">
                  標準・お詫び重視・妥協案の3パターン。本文はそのまま編集できます。
                </p>
                <div
                  role="tablist"
                  aria-labelledby={replyHeadingId}
                  className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3"
                >
                  {result.variants.map((v, i) => {
                    const selected = selectedVariantIndex === i;
                    return (
                      <button
                        key={v.key}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-controls={`tone-panel-${i}`}
                        onClick={() => setSelectedVariantIndex(i)}
                        className={cn(
                          "min-h-11 rounded-lg border px-3 py-2.5 text-left text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-accent md:min-h-12 md:text-[1rem]",
                          selected
                            ? "border-accent bg-accent/15 text-accent ring-2 ring-accent/35"
                            : "border-silver/30 bg-silver/5 text-text-sub hover:border-accent/40 hover:text-text"
                        )}
                      >
                        {v.label}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={selectedVariantIndex}
                    id={`tone-panel-${selectedVariantIndex}`}
                    role="tabpanel"
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
                    transition={{ duration: motionDuration }}
                  >
                    <p className="mb-2 text-xs font-medium text-text-sub">
                      選択中: {selectedLabel}
                    </p>
                    <Textarea
                      value={selectedBody}
                      onChange={(e) =>
                        setBodyAt(selectedVariantIndex, e.target.value)
                      }
                      rows={9}
                      className="min-h-[200px] resize-y text-sm leading-relaxed text-text md:text-[1rem]"
                      aria-label={`${selectedLabel}の返信本文`}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="rounded-xl border border-silver/20 bg-base-dark p-4">
                <h3 className="mb-3 text-sm font-semibold text-text md:text-[1rem]">
                  承認フロー（疑似）
                </h3>
                <div className="flex flex-wrap gap-3 text-xs md:text-sm">
                  {APPROVAL_STEPS.map((step) => {
                    const done = step.id < approvalStepIndex;
                    const current = step.id === approvalStepIndex;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => setApprovalStepIndex(step.id)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-left transition",
                          done &&
                            "border-emerald-500/40 bg-emerald-500/10 text-text-sub",
                          current &&
                            "border-amber-500/40 bg-amber-500/10 text-text",
                          !done &&
                            !current &&
                            "border-silver/30 text-text-sub hover:border-accent/40"
                        )}
                      >
                        {step.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 md:p-5">
              <h3 className="mb-2 text-sm font-semibold text-text md:text-[1rem]">
                社内共有メモ
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-sub md:text-[1rem]">
                {result.internal}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
