import type { EstimateFormDraft } from "@/lib/estimate/estimate-detailed-session";
import {
  buildEstimateFormDraftFactValues,
  hasMinimumEstimateFacts,
} from "@/lib/estimate/estimate-detailed-session";
import { shouldShowEstimateWizardStepForForm } from "@/lib/estimate/estimate-wizard-step-visibility";
import { ESTIMATE_WIZARD_STEP_DEFINITIONS } from "@/lib/estimate-core/wizard-steps";
import type { EstimateQuestionId } from "@/lib/estimate-core/question-model";

/** 未入力・unknown でも送信前ヒアリングとして通す */
const OPTIONAL_FOR_CONTACT_INTAKE: ReadonlySet<EstimateQuestionId> = new Set([
  "pain",
  "budgetFeel",
  "constraints",
  "budgetBand",
]);

function formValueForQuestion(
  form: EstimateFormDraft,
  questionId: EstimateQuestionId
): string {
  switch (questionId) {
    case "industry":
      return form.industry;
    case "productArchetype":
      return form.productArchetype;
    case "problemSummary":
      return form.problemSummary;
    case "pain":
      return form.pain;
    case "teamSize":
      return form.teamSize;
    case "timeline":
      return form.timeline;
    case "integration":
      return form.integration;
    case "hostingContext":
      return form.hostingContext;
    case "usageSurface":
      return form.usageSurface;
    case "dataSensitivity":
      return form.dataSensitivity;
    case "audienceScope":
      return form.audienceScope;
    case "currentWorkflow":
      return form.currentWorkflow;
    case "updateFrequency":
      return form.updateFrequency;
    case "designExpectation":
      return form.designExpectation;
    case "loginModel":
      return form.loginModel;
    case "budgetBand":
      return form.budgetBand;
    case "budgetFeel":
      return form.budgetFeel;
    case "constraints":
      return form.constraints;
    default: {
      const _x: never = questionId;
      void _x;
      return "";
    }
  }
}

/** 問い合わせ送信前に、最低 facts セットがそろったかを確認する。 */
export function isContactIntakeFormSatisfied(form: EstimateFormDraft): boolean {
  if (form.industry === "unknown") return false;
  if (!hasMinimumEstimateFacts(buildEstimateFormDraftFactValues(form))) return false;

  for (const step of ESTIMATE_WIZARD_STEP_DEFINITIONS) {
    const q = step.questionId;
    if (!q) continue;
    if (!shouldShowEstimateWizardStepForForm({ questionId: q, form })) continue;
    if (OPTIONAL_FOR_CONTACT_INTAKE.has(q)) continue;
    const v = formValueForQuestion(form, q);
    if (v === "unknown" || !String(v).trim()) return false;
  }
  return true;
}
