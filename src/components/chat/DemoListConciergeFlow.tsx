"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CONCIERGE_DEPTH_OPTIONS,
  CONCIERGE_DOMAIN_OPTIONS,
  CONCIERGE_ISSUE_OPTIONS,
  CONCIERGE_ROLE_OPTIONS,
  type ConciergeAnswers,
  type ConciergeDomainId,
} from "@/lib/demo/intelligent-concierge";
import type {
  AiDemoAudienceRole,
  AiDemoAutomationDepth,
  AiDemoIssueTag,
} from "@/lib/sanity/types";

const STEP_HEADLINES = [
  "事業領域に近いものを選んでください",
  "ご自身の立ち位置に近いものを選んでください",
  "いま負荷が大きいと感じる領域はどれですか",
  "望ましい進め方に近いものを選んでください",
] as const;

interface DemoListConciergeFlowProps {
  disabled?: boolean;
  onUseFreeform: () => void;
  onInjectDraft: (text: string) => void;
}

export function DemoListConciergeFlow({
  disabled = false,
  onUseFreeform,
  onInjectDraft,
}: DemoListConciergeFlowProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<ConciergeAnswers>>({});

  const chipClass = (active: boolean) =>
    cn(
      "rounded-lg border px-2 py-1.5 text-left text-[11px] leading-snug transition-colors sm:rounded-full sm:px-3 sm:py-2 sm:text-sm",
      active
        ? "border-accent/60 bg-accent/15 text-accent"
        : "border-silver/30 text-text-sub hover:border-accent/40 hover:text-accent"
    );

  const progress = useMemo(() => {
    return [0, 1, 2, 3].map((i) =>
      i <= step ? "bg-accent/80" : "bg-silver/25"
    );
  }, [step]);

  const pickDomain = (id: ConciergeDomainId) => {
    setAnswers((prev) => ({ ...prev, domain: id }));
    setStep(1);
  };

  const pickRole = (id: AiDemoAudienceRole) => {
    setAnswers((prev) => ({ ...prev, audienceRole: id }));
    setStep(2);
  };

  const pickIssue = (id: AiDemoIssueTag) => {
    setAnswers((prev) => ({ ...prev, issue: id }));
    setStep(3);
  };

  const pickDepth = (id: AiDemoAutomationDepth) => {
    const full = { ...answers, automationDepth: id };
    const domainLabel =
      CONCIERGE_DOMAIN_OPTIONS.find((o) => o.id === full.domain)?.label ??
      "未選択";
    const roleLabel =
      CONCIERGE_ROLE_OPTIONS.find((o) => o.id === full.audienceRole)?.label ??
      "未選択";
    const issueLabel =
      CONCIERGE_ISSUE_OPTIONS.find((o) => o.id === full.issue)?.label ??
      "未選択";
    const depthLabel =
      CONCIERGE_DEPTH_OPTIONS.find((o) => o.id === full.automationDepth)?.label ??
      "未選択";

    onInjectDraft(
      [
        "【demo最短ルートの選択メモ】",
        `- 事業領域: ${domainLabel}`,
        `- 立ち位置: ${roleLabel}`,
        `- 課題: ${issueLabel}`,
        `- 進め方: ${depthLabel}`,
        "",
        "この条件に近い demo を 2〜3 件、理由つきで提案してください。",
      ].join("\n")
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-silver/15 px-4 py-3">
        <p className="mb-1 text-xs uppercase tracking-[0.16em] text-accent/90">
          Intelligent Concierge
        </p>
        <h3 className="mb-1 text-lg font-semibold text-text md:text-xl">
          デモへの最短ルート
        </h3>
        <p className="text-sm text-text-sub">
          4つの選択だけで、100本近いデモから近いものを最大3件に絞り込みます。いつでも一覧から探せます。
        </p>
        <div className="mt-3 flex gap-1" aria-hidden>
          {progress.map((cls, i) => (
            <div key={i} className={cn("h-0.5 flex-1 rounded-full", cls)} />
          ))}
        </div>
        <p className="mt-3 text-sm font-medium text-text">{STEP_HEADLINES[step]}</p>
      </div>

      <div className="max-h-[min(44vh,300px)] overflow-y-auto px-4 py-3 md:max-h-[min(50vh,360px)]">
        {step === 0 && (
          <div className="grid grid-cols-2 gap-2">
            {CONCIERGE_DOMAIN_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={disabled}
                onClick={() => pickDomain(opt.id)}
                className={chipClass(answers.domain === opt.id)}
              >
                {opt.label}
              </button>
            ))}
            <button
              type="button"
              disabled={disabled}
              onClick={onUseFreeform}
              className={chipClass(false)}
            >
              自由記述で相談する
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 gap-2">
            {CONCIERGE_ROLE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={disabled}
                onClick={() => pickRole(opt.id)}
                className={chipClass(answers.audienceRole === opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
            {CONCIERGE_ISSUE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={disabled}
                onClick={() => pickIssue(opt.id)}
                className={chipClass(answers.issue === opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 gap-2">
            {CONCIERGE_DEPTH_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={disabled}
                onClick={() => pickDepth(opt.id)}
                className={chipClass(answers.automationDepth === opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-silver/15 bg-base/30 px-4 py-3">
        {step > 0 ? (
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            一つ前に戻る
          </Button>
        ) : (
          <p className="text-xs text-text-sub">
            自由記述を選ぶと、すぐ入力欄から相談できます。
          </p>
        )}
      </div>
    </div>
  );
}
