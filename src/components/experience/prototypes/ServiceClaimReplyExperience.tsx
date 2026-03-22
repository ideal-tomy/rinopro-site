"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  buildClaimMock,
  type ServiceClaimMockResult,
} from "@/lib/experience/service-claim-mock";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import { cn } from "@/lib/utils";

const SAMPLES = [
  "配送が1日遅れた。お詫びと再配送希望",
  "商品に傷、交換か返金希望",
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

  const selectedBody =
    bodies[selectedVariantIndex] ?? "";
  const selectedLabel =
    result?.variants[selectedVariantIndex]?.label ?? "";

  return (
    <div className={cn("space-y-6", className)}>
      <div className="rounded-xl border border-silver/25 bg-base-dark/80 p-4 md:p-6">
        <h2 className="mb-3 text-sm font-semibold text-accent md:text-base">
          入力
        </h2>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={meta.inputHint}
          rows={4}
          className="mb-3 resize-y text-sm md:text-base"
        />
        <div className="mb-3 flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setText(s)}
              className="rounded-full border border-silver/30 bg-silver/5 px-3 py-1 text-xs text-text-sub transition hover:border-accent/40 hover:text-text md:text-sm"
            >
              {s}
            </button>
          ))}
        </div>
        <Button type="button" onClick={run}>
          実行（モック結果）
        </Button>
        <p className="mt-2 text-xs text-text-sub">
          本画面はプロトタイプです。チャットで実AIを試す場合は{" "}
          <Link
            href={`/demo/${meta.demoSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline-offset-2 hover:underline"
          >
            ツールdemo
          </Link>
          へ。
        </p>
      </div>

      {result && bodies.length === result.variants.length && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-xl border border-silver/20 bg-base-dark p-4">
                <h3
                  id={replyHeadingId}
                  className="mb-3 text-sm font-semibold text-text md:text-base"
                >
                  お客様向け返信案
                </h3>
                <div
                  role="radiogroup"
                  aria-labelledby={replyHeadingId}
                  className="grid gap-3 md:grid-cols-3"
                >
                  {result.variants.map((v, i) => {
                    const selected = selectedVariantIndex === i;
                    return (
                      <div
                        key={v.key}
                        className={cn(
                          "flex flex-col rounded-lg border bg-silver/5 p-3 transition",
                          selected
                            ? "border-accent ring-2 ring-accent/40"
                            : "border-silver/20"
                        )}
                      >
                        <button
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setSelectedVariantIndex(i)}
                          className={cn(
                            "mb-2 rounded-md px-2 py-1.5 text-left text-xs font-medium outline-none ring-offset-base-dark focus-visible:ring-2 focus-visible:ring-accent md:text-sm",
                            selected
                              ? "bg-accent text-base-dark"
                              : "text-text-sub hover:bg-silver/10"
                          )}
                        >
                          {v.label}
                        </button>
                        <Textarea
                          value={bodies[i] ?? ""}
                          onChange={(e) => setBodyAt(i, e.target.value)}
                          rows={6}
                          className="min-h-[120px] flex-1 resize-y text-xs leading-relaxed text-text-sub md:text-sm"
                          aria-label={`${v.label}の返信本文`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                <h3 className="mb-2 text-sm font-semibold text-text md:text-base">
                  承認対象（送信案）
                </h3>
                <p className="mb-2 text-xs text-text-sub">
                  選択中: <span className="font-medium text-accent">{selectedLabel}</span>
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-sub">
                  {selectedBody || "（本文なし）"}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-accent/25 bg-accent/5 p-4">
              <h3 className="mb-2 text-sm font-semibold text-text md:text-base">
                社内共有メモ
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-sub">
                {result.internal}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-silver/20 bg-base-dark p-4">
            <h3 className="mb-3 text-sm font-semibold text-text md:text-base">
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
      )}
    </div>
  );
}
