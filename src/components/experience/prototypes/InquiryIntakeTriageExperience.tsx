"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  buildInquiryIntakeMock,
  type InquiryIntakeMockResult,
} from "@/lib/experience/inquiry-intake-mock";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import { cn } from "@/lib/utils";

const SAMPLES = [
  "商品が届いたが箱が潰れている。交換したい",
  "来月からプランを解約したい。手続きを教えて",
] as const;

interface InquiryIntakeTriageExperienceProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

export function InquiryIntakeTriageExperience({
  meta,
  className,
}: InquiryIntakeTriageExperienceProps) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<InquiryIntakeMockResult | null>(null);

  const run = () => {
    setResult(buildInquiryIntakeMock(text));
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="rounded-xl border border-silver/25 bg-base-dark/80 p-4 md:p-6">
        <h2 className="mb-3 text-sm font-semibold text-accent md:text-base">
          問い合わせ本文
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
              className="rounded-lg border border-silver/30 px-3 py-1.5 text-left text-xs text-text-sub transition hover:border-accent/40 hover:text-accent md:text-sm"
            >
              {s}
            </button>
          ))}
        </div>
        <Button type="button" onClick={run} disabled={!text.trim()}>
          分類・下書きを生成（モック）
        </Button>
      </div>

      {result && (
        <div className="space-y-4 rounded-xl border border-accent/25 bg-accent/5 p-4 md:p-6">
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-silver/30 px-3 py-0.5">
              カテゴリ: {result.category}
            </span>
            <span className="rounded-full border border-silver/30 px-3 py-0.5">
              優先度: {result.priority}
            </span>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-text-sub">タグ</p>
            <ul className="flex flex-wrap gap-2">
              {result.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-md bg-base-dark/80 px-2 py-0.5 text-xs text-text"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-text-sub">
              顧客向け返信（草案）
            </p>
            <pre className="whitespace-pre-wrap rounded-lg border border-silver/20 bg-base-dark/60 p-3 text-sm text-text">
              {result.draftReply}
            </pre>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-text-sub">社内メモ</p>
            <p className="text-sm text-text-sub">{result.internalNote}</p>
          </div>
        </div>
      )}
    </div>
  );
}
