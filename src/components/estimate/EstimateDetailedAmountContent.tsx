"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useConciergeChat } from "@/components/chat/concierge-chat-context";
import { EstimateDetailedInquiryPreparation } from "@/components/estimate/EstimateDetailedInquiryPreparation";
import { suppressNextChatAutoOpen } from "@/lib/chat/chat-auto-open";
import {
  buildContactHandoffNavigation,
  buildHandoffPayloadV2FromDetailed,
  storeHandoffPayloadInSession,
} from "@/lib/chat/estimate-handoff";
import { estimateDetailedCopy } from "@/lib/content/site-copy";
import {
  ESTIMATE_SNAPSHOT_SCHEMA_VERSION,
  formatRequirementDocMarkdown,
  type EstimateSnapshot,
} from "@/lib/estimate/estimate-snapshot";
import {
  readEstimateDetailedFlow,
  writeEstimateDetailedFlow,
  type EstimateDetailedFlowState,
} from "@/lib/estimate/estimate-detailed-session";
import {
  compareEstimateToBudgetBand,
  resolveBudgetBandFromFlow,
} from "@/lib/estimate/estimate-detailed-budget";
import { EstimateDetailedPhilosophyFootnote } from "@/components/estimate/EstimateDetailedPhilosophyFootnote";
import { EstimateDetailedResumeQuestionsButton } from "@/components/estimate/EstimateDetailedResumeQuestionsButton";
import {
  evaluateInquiryGate,
  type EstimateInquiryPreparation,
} from "@/lib/inquiry/inquiry-brief";
import { recordVisitorEstimateAnswers } from "@/lib/journey/visitor-journey-storage";

const copy = estimateDetailedCopy;

function buildSnapshotFromFlow(flow: EstimateDetailedFlowState): EstimateSnapshot | null {
  if (!flow.ai) return null;
  return {
    schemaVersion: ESTIMATE_SNAPSHOT_SCHEMA_VERSION,
    source: "estimate_detailed",
    createdAt: new Date().toISOString(),
    priorContext: flow.priorContext || undefined,
    answers: flow.answers,
    ai: flow.ai,
    visitorJourney: flow.visitorJourney ?? undefined,
    inquiryPreparation: flow.inquiryPreparation ?? undefined,
    requirementDocMarkdown: formatRequirementDocMarkdown(flow.ai, flow.answers),
  };
}

export function EstimateDetailedAmountContent() {
  const router = useRouter();
  const { setOpen: setConciergeOpen } = useConciergeChat();
  const [flow, setFlow] = useState<EstimateDetailedFlowState | null>(() =>
    readEstimateDetailedFlow()
  );

  useEffect(() => {
    const f = readEstimateDetailedFlow();
    if (!f?.ai) {
      router.replace("/estimate-detailed");
      return;
    }
    // sessionStorage のスナップショットをマウント時に state へ同期（再訪・遷移直後の表示用）
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 外部ストア→React state の一回同期
    setFlow(f);
  }, [router]);

  useEffect(() => {
    setConciergeOpen(false);
  }, [setConciergeOpen]);

  useEffect(() => {
    if (!flow?.answers) return;
    recordVisitorEstimateAnswers(flow.answers);
  }, [flow?.answers]);

  const snapshot = flow ? buildSnapshotFromFlow(flow) : null;
  const inquiryPreparation = flow?.inquiryPreparation ?? null;
  const inquiryGate = evaluateInquiryGate({
    brief: inquiryPreparation?.brief,
    problemSummary: inquiryPreparation?.brief.problemSummary,
    targetSummary: inquiryPreparation?.brief.targetSummary,
    timelineSummary: inquiryPreparation?.brief.timelineSummary,
    followUpQuestions: inquiryPreparation?.followUpQuestions,
    followUpAnswers: inquiryPreparation?.followUpAnswers,
    hasViewedEstimateOrEquivalent: true,
    hasReviewedGeneratedBrief: inquiryPreparation?.brief != null,
  });
  const contactReady = inquiryGate.status === "sendable";

  const goContact = useCallback(() => {
    if (!snapshot) return;
    const payload = buildHandoffPayloadV2FromDetailed(snapshot);
    const { href, storeInSession } = buildContactHandoffNavigation(payload);
    if (storeInSession) {
      storeHandoffPayloadInSession(payload);
    }
    suppressNextChatAutoOpen();
    setConciergeOpen(false);
    router.push(href);
  }, [router, setConciergeOpen, snapshot]);

  const handlePreparationChange = useCallback(
    (next: EstimateInquiryPreparation) => {
      if (!flow?.ai) return;
      const updatedFlow: EstimateDetailedFlowState = {
        ...flow,
        inquiryPreparation: next,
      };
      setFlow(updatedFlow);
      writeEstimateDetailedFlow(updatedFlow);
    },
    [flow]
  );

  if (!flow?.ai) {
    return <p className="text-center text-sm text-text-sub">移動中…</p>;
  }

  const { estimateLoMan, estimateHiMan, estimateDrivers = [] } = flow.ai;
  const backHref = "/estimate-detailed/result";
  const budgetBand = resolveBudgetBandFromFlow(flow);
  const budgetVsEstimate = compareEstimateToBudgetBand(estimateHiMan, budgetBand);

  function driverEffectLabel(effect: "up" | "down" | "wide"): string {
    if (effect === "up") return copy.estimateDriverEffectUp;
    if (effect === "down") return copy.estimateDriverEffectDown;
    return copy.estimateDriverEffectWide;
  }

  return (
    <div className="space-y-10">
      <header className="space-y-2 text-center">
        <p className="text-sm font-medium text-accent">{copy.amountPageKicker}</p>
        <h1 className="text-2xl font-bold text-white md:text-3xl">{copy.amountPageTitle}</h1>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/85">
          {copy.amountPageSub}
        </p>
      </header>

      <section
        className="mx-auto max-w-xl rounded-2xl border-2 border-accent/50 bg-gradient-to-b from-accent/10 to-base-dark/80 px-6 py-10 text-center shadow-lg shadow-accent/5 md:px-10 md:py-12"
        aria-label={copy.sectionRange}
      >
        <p className="text-sm font-medium text-white/80">{copy.amountHeroPrefix}</p>
        <p className="mt-2 flex flex-wrap items-baseline justify-center gap-1 text-4xl font-bold tabular-nums text-accent md:text-5xl">
          <span>{estimateLoMan}</span>
          <span className="text-2xl font-semibold text-white md:text-3xl">
            {copy.amountBetween}
          </span>
          <span>{estimateHiMan}</span>
        </p>
        <p className="mt-2 text-[16px] font-medium text-white">{copy.amountHeroSuffix}</p>
        <p className="mt-6 text-left text-sm font-medium leading-relaxed text-white/90 md:text-[16px]">
          {copy.rangeDisclaimer}
        </p>
        {budgetVsEstimate === "within" ? (
          <p
            className="mt-5 rounded-lg border border-accent/40 bg-accent/15 px-4 py-3 text-center text-[16px] font-semibold text-white"
            role="status"
          >
            {copy.budgetWithinMessage}
          </p>
        ) : null}
      </section>

      {estimateDrivers.length > 0 ? (
        <section
          className="mx-auto max-w-xl rounded-xl border border-accent/30 bg-accent/[0.06] p-4 md:p-5"
          aria-label={copy.estimateDriversTitle}
        >
          <p className="text-sm font-semibold text-white">{copy.estimateDriversTitle}</p>
          <ul className="mt-3 space-y-3 text-left text-[15px] leading-relaxed text-white/90 md:text-[16px]">
            {estimateDrivers.map((d, i) => (
              <li key={`${i}-${d.factor.slice(0, 24)}`} className="flex flex-col gap-0.5 border-b border-silver/10 pb-3 last:border-b-0 last:pb-0">
                <span className="text-white/95">{d.factor}</span>
                <span className="text-xs text-accent/90 md:text-sm">{driverEffectLabel(d.effect)}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="rounded-xl border border-silver/20 bg-base-dark/40 p-4 md:p-5">
        <p className="text-sm font-semibold text-white">{copy.overviewTitleRecap}</p>
        <p className="mt-2 text-[16px] leading-relaxed text-white/90">
          {flow.ai.plainCustomerSummary}
        </p>
      </div>

      <EstimateDetailedPhilosophyFootnote />

      {snapshot ? (
        <EstimateDetailedInquiryPreparation
          snapshot={snapshot}
          initialPreparation={flow.inquiryPreparation ?? null}
          onPreparationChange={handlePreparationChange}
        />
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <Button
          type="button"
          className="min-h-12 w-full px-8 text-[16px] sm:w-auto"
          onClick={goContact}
          disabled={!contactReady}
        >
          {copy.btnContact}
        </Button>
        <EstimateDetailedResumeQuestionsButton className="min-h-12 w-full sm:w-auto">
          {copy.btnBackToQuestionsShort}
        </EstimateDetailedResumeQuestionsButton>
        <Button type="button" variant="ghost" className="min-h-12 w-full sm:w-auto" asChild>
          <Link href={backHref}>{copy.backToResult}</Link>
        </Button>
      </div>
      {!contactReady ? (
        <p className="text-center text-sm leading-relaxed text-white/70">
          {copy.inquiryPrepContactGate}
        </p>
      ) : null}
    </div>
  );
}
