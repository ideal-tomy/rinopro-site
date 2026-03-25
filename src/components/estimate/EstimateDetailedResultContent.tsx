"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useConciergeChat } from "@/components/chat/concierge-chat-context";
import { estimateDetailedCopy } from "@/lib/content/site-copy";
import { releaseEstimateProcessingLock } from "@/lib/estimate/estimate-detailed-processing-lock";
import { readEstimateDetailedFlow, type EstimateDetailedFlowState } from "@/lib/estimate/estimate-detailed-session";
import { EstimateDetailedPhilosophyFootnote } from "@/components/estimate/EstimateDetailedPhilosophyFootnote";
import { EstimateDetailedResultBody } from "@/components/estimate/EstimateDetailedResultBody";
import { EstimateDetailedResumeQuestionsButton } from "@/components/estimate/EstimateDetailedResumeQuestionsButton";

const copy = estimateDetailedCopy;

export function EstimateDetailedResultContent() {
  const router = useRouter();
  const { setOpen: setConciergeOpen } = useConciergeChat();
  const [flow, setFlow] = useState<EstimateDetailedFlowState | null>(() =>
    readEstimateDetailedFlow()
  );

  useEffect(() => {
    releaseEstimateProcessingLock();
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

  if (!flow?.ai) {
    return <p className="text-center text-sm text-text-sub">移動中…</p>;
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-medium text-white/80">{copy.sectionResult}</p>
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          {copy.requirementDefinitionNote}のたたき台
        </h1>
        <p className="text-sm leading-relaxed text-white/85 md:text-[15px]">
          {copy.resultIntro}
        </p>
      </header>

      <section className="rounded-xl border border-accent/30 bg-accent/5 p-5 md:p-8">
        <EstimateDetailedResultBody result={flow.ai} answers={flow.answers} />

        <EstimateDetailedPhilosophyFootnote />

        <div className="mt-8 flex flex-col gap-3 border-t border-silver/20 pt-8 sm:flex-row sm:flex-wrap">
          <Button
            type="button"
            className="min-h-11 w-full sm:w-auto"
            onClick={() => router.push("/estimate-detailed/amount")}
          >
            {copy.btnConfirmAndShowAmount}
          </Button>
          <EstimateDetailedResumeQuestionsButton>{copy.btnEditAnswers}</EstimateDetailedResumeQuestionsButton>
        </div>
      </section>
    </div>
  );
}
