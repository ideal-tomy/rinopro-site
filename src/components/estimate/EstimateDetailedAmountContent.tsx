"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useConciergeChat } from "@/components/chat/concierge-chat-context";
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
  type EstimateDetailedFlowState,
} from "@/lib/estimate/estimate-detailed-session";
import {
  compareEstimateToBudgetBand,
  resolveBudgetBandFromFlow,
} from "@/lib/estimate/estimate-detailed-budget";
import { EstimateDetailedPhilosophyFootnote } from "@/components/estimate/EstimateDetailedPhilosophyFootnote";
import { EstimateDetailedResumeQuestionsButton } from "@/components/estimate/EstimateDetailedResumeQuestionsButton";

const copy = estimateDetailedCopy;

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
    setFlow(f);
  }, [router]);

  useEffect(() => {
    setConciergeOpen(false);
  }, [setConciergeOpen]);

  const goContact = useCallback(() => {
    if (!flow?.ai) return;
    const requirementDocMarkdown = formatRequirementDocMarkdown(flow.ai);
    const snapshot: EstimateSnapshot = {
      schemaVersion: ESTIMATE_SNAPSHOT_SCHEMA_VERSION,
      source: "estimate_detailed",
      createdAt: new Date().toISOString(),
      priorContext: flow.priorContext || undefined,
      answers: flow.answers,
      ai: flow.ai,
      requirementDocMarkdown,
    };
    const payload = buildHandoffPayloadV2FromDetailed(snapshot);
    const { href, storeInSession } = buildContactHandoffNavigation(payload);
    if (storeInSession) {
      storeHandoffPayloadInSession(payload);
    }
    suppressNextChatAutoOpen();
    setConciergeOpen(false);
    router.push(href);
  }, [flow, router, setConciergeOpen]);

  if (!flow?.ai) {
    return <p className="text-center text-sm text-text-sub">移動中…</p>;
  }

  const { estimateLoMan, estimateHiMan } = flow.ai;
  const backHref = "/estimate-detailed/result";
  const budgetBand = resolveBudgetBandFromFlow(flow);
  const budgetVsEstimate = compareEstimateToBudgetBand(estimateHiMan, budgetBand);

  return (
    <div className="space-y-10">
      <header className="space-y-2 text-center">
        <p className="text-sm font-medium text-accent">{copy.amountPageKicker}</p>
        <h1 className="text-2xl font-bold text-text md:text-3xl">{copy.amountPageTitle}</h1>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-text-sub">
          {copy.amountPageSub}
        </p>
      </header>

      <section
        className="mx-auto max-w-xl rounded-2xl border-2 border-accent/50 bg-gradient-to-b from-accent/10 to-base-dark/80 px-6 py-10 text-center shadow-lg shadow-accent/5 md:px-10 md:py-12"
        aria-label={copy.sectionRange}
      >
        <p className="text-sm font-medium text-text-sub">{copy.amountHeroPrefix}</p>
        <p className="mt-2 flex flex-wrap items-baseline justify-center gap-1 text-4xl font-bold tabular-nums text-accent md:text-5xl">
          <span>{estimateLoMan}</span>
          <span className="text-2xl font-semibold text-text md:text-3xl">
            {copy.amountBetween}
          </span>
          <span>{estimateHiMan}</span>
        </p>
        <p className="mt-2 text-base font-medium text-text">{copy.amountHeroSuffix}</p>
        <p className="mt-6 text-left text-xs leading-relaxed text-text-sub md:text-sm">
          {copy.rangeDisclaimer}
        </p>
        {budgetVsEstimate === "within" ? (
          <p
            className="mt-5 rounded-lg border border-accent/40 bg-accent/15 px-4 py-3 text-center text-base font-semibold text-accent"
            role="status"
          >
            {copy.budgetWithinMessage}
          </p>
        ) : null}
      </section>

      <div className="rounded-xl border border-silver/20 bg-base-dark/40 p-4 md:p-5">
        <p className="text-xs font-medium text-text-sub">やさしい要約（再掲）</p>
        <p className="mt-2 text-sm leading-relaxed text-text-sub">
          {flow.ai.plainCustomerSummary}
        </p>
      </div>

      <EstimateDetailedPhilosophyFootnote />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <Button type="button" className="min-h-12 w-full px-8 text-base sm:w-auto" onClick={goContact}>
          {copy.btnContact}
        </Button>
        <EstimateDetailedResumeQuestionsButton className="min-h-12 w-full sm:w-auto">
          {copy.btnBackToQuestionsShort}
        </EstimateDetailedResumeQuestionsButton>
        <Button type="button" variant="ghost" className="min-h-12 w-full sm:w-auto" asChild>
          <Link href={backHref}>{copy.backToResult}</Link>
        </Button>
      </div>
    </div>
  );
}
