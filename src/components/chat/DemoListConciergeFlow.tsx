"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ConciergeChoiceButton,
  ConciergeCtaButton,
} from "@/components/chat/ConciergeChoiceButton";
import { ConciergeDemoRecommendOverlay } from "@/components/chat/ConciergeDemoRecommendOverlay";
import { cn } from "@/lib/utils";
import {
  CONCIERGE_DEPTH_OPTIONS,
  CONCIERGE_DOMAIN_OPTIONS,
  CONCIERGE_ISSUE_OPTIONS,
  CONCIERGE_ROLE_OPTIONS,
  pickRecommendedDemos,
  type ConciergeAnswers,
  type ConciergeDomainId,
  type ConciergePick,
} from "@/lib/demo/intelligent-concierge";
import type {
  AiDemo,
  AiDemoAudienceRole,
  AiDemoAutomationDepth,
  AiDemoIssueTag,
  DemoItem,
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
  onDismissForNavigation: () => void;
  /** 最終ステップ確定時: 一覧ページのチップ・提案レールと同期 */
  onWizardComplete?: (
    answers: ConciergeAnswers,
    picks: ConciergePick[]
  ) => void;
  /** 「demo検索ボットに戻る」でウィザードをリセットしたとき */
  onWizardReset?: () => void;
}

export function DemoListConciergeFlow({
  disabled = false,
  onUseFreeform,
  onDismissForNavigation,
  onWizardComplete,
  onWizardReset,
}: DemoListConciergeFlowProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<ConciergeAnswers>>({});
  const [demos, setDemos] = useState<(AiDemo | DemoItem)[] | null>(null);
  const [recommendationPicks, setRecommendationPicks] = useState<
    ConciergePick[] | null
  >(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/demos/catalog")
      .then((r) => r.json())
      .then((data: unknown) => {
        if (cancelled) return;
        setDemos(Array.isArray(data) ? (data as (AiDemo | DemoItem)[]) : []);
      })
      .catch(() => {
        if (!cancelled) setDemos([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const progress = useMemo(() => {
    return [0, 1, 2, 3].map((i) =>
      i <= step ? "bg-accent/80" : "bg-silver/25"
    );
  }, [step]);

  const catalogLoading = demos === null;

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
    const full = { ...answers, automationDepth: id } as ConciergeAnswers;
    setAnswers(full);
    const picks = pickRecommendedDemos(demos ?? [], full);
    setRecommendationPicks(picks);
    onWizardComplete?.(full, picks);
  };

  const resetRecommendationFlow = () => {
    setRecommendationPicks(null);
    setStep(0);
    setAnswers({});
    onWizardReset?.();
  };

  const flowDisabled = disabled || catalogLoading;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {recommendationPicks !== null && (
        <ConciergeDemoRecommendOverlay
          picks={recommendationPicks}
          onResetFlow={resetRecommendationFlow}
          onDismissForNavigation={onDismissForNavigation}
        />
      )}

      <div className="shrink-0 border-b border-silver/15 px-4 py-3">
        <div className="mt-1 flex gap-1" aria-hidden>
          {progress.map((cls, i) => (
            <div key={i} className={cn("h-0.5 flex-1 rounded-full", cls)} />
          ))}
        </div>
        <p className="mt-3 text-sm font-medium leading-relaxed tracking-wide text-text/95">
          {STEP_HEADLINES[step]}
        </p>
        {catalogLoading && (
          <p className="mt-2 text-xs text-text-sub">demo一覧を読み込み中…</p>
        )}
      </div>

      <div className="max-h-[min(44vh,300px)] overflow-y-auto px-4 py-3 md:max-h-[min(50vh,360px)]">
        {step === 0 && (
          <div className="grid grid-cols-2 gap-2">
            {CONCIERGE_DOMAIN_OPTIONS.map((opt, idx) => (
              <ConciergeChoiceButton
                key={opt.id}
                type="button"
                order={idx + 1}
                label={opt.label}
                disabled={flowDisabled}
                selected={answers.domain === opt.id}
                onClick={() => pickDomain(opt.id)}
              />
            ))}
            <ConciergeChoiceButton
              type="button"
              order={CONCIERGE_DOMAIN_OPTIONS.length + 1}
              label="自由記述で相談する"
              disabled={disabled}
              className="col-span-2"
              onClick={onUseFreeform}
            />
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 gap-2">
            {CONCIERGE_ROLE_OPTIONS.map((opt, idx) => (
              <ConciergeChoiceButton
                key={opt.id}
                type="button"
                order={idx + 1}
                label={opt.label}
                disabled={flowDisabled}
                selected={answers.audienceRole === opt.id}
                onClick={() => pickRole(opt.id)}
              />
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
            {CONCIERGE_ISSUE_OPTIONS.map((opt, idx) => (
              <ConciergeChoiceButton
                key={opt.id}
                type="button"
                order={idx + 1}
                label={opt.label}
                disabled={flowDisabled}
                selected={answers.issue === opt.id}
                onClick={() => pickIssue(opt.id)}
              />
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 gap-2">
            {CONCIERGE_DEPTH_OPTIONS.map((opt, idx) => (
              <ConciergeChoiceButton
                key={opt.id}
                type="button"
                order={idx + 1}
                label={opt.label}
                disabled={flowDisabled}
                selected={answers.automationDepth === opt.id}
                onClick={() => pickDepth(opt.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-silver/15 bg-base/30 px-4 py-3">
        {step > 0 ? (
          <ConciergeCtaButton
            type="button"
            variant="secondary"
            disabled={disabled}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            一つ前に戻る
          </ConciergeCtaButton>
        ) : (
          <p className="text-xs leading-relaxed text-text/95">
            自由記述を選ぶと、すぐ入力欄から相談できます。
          </p>
        )}
      </div>
    </div>
  );
}
