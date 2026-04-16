"use client";

import { useMemo } from "react";
import { EstimateDetailedHearingWizard } from "@/components/estimate/EstimateDetailedHearingWizard";
import { estimateDetailedCopy } from "@/lib/content/site-copy";
import type { EstimateFormDraft } from "@/lib/estimate/estimate-detailed-session";
import { isContactIntakeFormSatisfied } from "@/lib/contact/contact-intake-satisfaction";
import type { EstimateQuestionId } from "@/lib/estimate-core/question-model";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const copy = estimateDetailedCopy;

type Props = {
  form: EstimateFormDraft;
  setForm: React.Dispatch<React.SetStateAction<EstimateFormDraft>>;
  /** 見積スナップショット等で既に確定している質問（ウィザードでは再表示しない） */
  answeredQuestionIds: ReadonlySet<EstimateQuestionId>;
  onComplete: () => void;
};

export function ContactIntakeHearingBlock({
  form,
  setForm,
  answeredQuestionIds,
  onComplete,
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const canSubmitGlobal = useMemo(
    () => isContactIntakeFormSatisfied(form, { answeredQuestionIds }),
    [form, answeredQuestionIds]
  );

  return (
    <div className="space-y-3 rounded-xl border border-accent/25 bg-accent/5 p-4 md:p-5">
      <div>
        <h2 className="text-lg font-semibold text-accent">{copy.sectionHearing}</h2>
        <p className="mt-1 text-sm leading-relaxed text-text-sub">
          初回返信で具体的にお返しするため、詳細見積と同じ質問にそろえてください。すでに見積で伺った内容は下にまとまっている場合、ここでは不足分だけ表示されます。
        </p>
      </div>
      <EstimateDetailedHearingWizard
        form={form}
        setForm={setForm}
        prefersReducedMotion={prefersReducedMotion}
        isExiting={false}
        onSubmit={onComplete}
        canSubmitGlobal={canSubmitGlobal}
        answeredQuestionIds={answeredQuestionIds}
      />
    </div>
  );
}
