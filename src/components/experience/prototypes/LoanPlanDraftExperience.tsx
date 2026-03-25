"use client";

import { BeforeAfterDocumentShell } from "@/components/experience/shells/BeforeAfterDocumentShell";
import {
  buildLoanPlanDraftMock,
  LOAN_PLAN_DRAFT_SAMPLES,
} from "@/lib/experience/loan-plan-draft-mock";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import { cn } from "@/lib/utils";

interface LoanPlanDraftExperienceProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

export function LoanPlanDraftExperience({
  meta,
  className,
}: LoanPlanDraftExperienceProps) {
  return (
    <BeforeAfterDocumentShell
      meta={meta}
      className={cn(className)}
      sampleTexts={LOAN_PLAN_DRAFT_SAMPLES}
      buildMock={buildLoanPlanDraftMock}
      leftPanelTitle="事業メモ（雑でOK）"
      centerButtonLabel="計画のたたき台を生成（モック）"
      rightPanelTitle="事業計画・資金計画（体裁イメージ）"
    />
  );
}
