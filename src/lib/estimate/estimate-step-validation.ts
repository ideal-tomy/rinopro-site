import type { EstimateFormDraft } from "@/lib/estimate/estimate-detailed-session";
import {
  shouldAskEstimateQuestion,
  type EstimateQuestionId,
} from "@/lib/estimate-core/question-model";
import type { EstimateWizardStepDefinition, EstimateWizardStepId } from "@/lib/estimate-core/wizard-steps";
import { ESTIMATE_WIZARD_STEP_DEFINITIONS } from "@/lib/estimate-core/wizard-steps";
import { shouldShowEstimateWizardStepForForm } from "@/lib/estimate/estimate-wizard-step-visibility";

/** ウィザード表示と送信ゲートで同一の「聞く質問」範囲を決める */
export type EstimateWizardSessionScope = {
  prefilledQuestionIds?: Iterable<EstimateQuestionId>;
  answeredQuestionIds?: Iterable<EstimateQuestionId>;
};

export function getVisibleEstimateWizardSteps(
  form: EstimateFormDraft,
  scope?: EstimateWizardSessionScope
): readonly EstimateWizardStepDefinition[] {
  return ESTIMATE_WIZARD_STEP_DEFINITIONS.filter((step) => {
    if (!step.questionId) return true;
    if (
      !shouldAskEstimateQuestion({
        questionId: step.questionId,
        prefilledQuestionIds: scope?.prefilledQuestionIds,
        answeredQuestionIds: scope?.answeredQuestionIds,
      })
    ) {
      return false;
    }
    return shouldShowEstimateWizardStepForForm({
      questionId: step.questionId,
      form,
    });
  });
}

const OPTIONAL_QUESTION_IDS: ReadonlySet<EstimateQuestionId> = new Set([
  "pain",
  "budgetFeel",
  "constraints",
  "budgetBand",
]);

export type EstimateStepValidationResult = {
  ok: boolean;
  reason?: string;
};

/**
 * 業種だけは「未確定」不可。それ以外の選択式は value `unknown` を明示的な回答として通す
 * （コピー上の「わからなくても進められる」と整合）。
 */
function hasMeaningfulValue(value: string, questionId: EstimateQuestionId): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed === "unknown" && questionId === "industry") return false;
  return true;
}

function fieldValueByQuestionId(
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

function stepReason(stepId: EstimateWizardStepId): string {
  switch (stepId) {
    case "industry":
      return "業種を選んでください。";
    case "productArchetype":
      return "何を作りたいかを入力または選択してください。";
    case "problemSummary":
      return "困っていること・変えたいことを入力または選択してください。";
    case "teamSize":
      return "人数のイメージを選んでください。";
    case "timeline":
      return "時期の希望を選んでください。";
    case "integration":
      return "他システムとのつなぎ方を選んでください。";
    case "hostingContext":
      return "利用環境のイメージを選んでください。";
    case "usageSurface":
      return "主な使い方・載せる場所を選んでください。";
    case "dataSensitivity":
      return "個人情報の有無を選んでください。";
    case "audienceScope":
      return "公開範囲を選んでください。";
    case "currentWorkflow":
      return "現在の運用方法を選んでください。";
    case "updateFrequency":
      return "更新頻度を選んでください。";
    case "designExpectation":
      return "デザイン期待値を選んでください。";
    case "loginModel":
      return "ログイン方式を選んでください。";
    case "review":
      return "必須項目が未入力です。";
    default:
      return "必須項目を入力してください。";
  }
}

export function validateEstimateWizardStep(
  form: EstimateFormDraft,
  stepId: EstimateWizardStepId
): EstimateStepValidationResult {
  if (stepId === "review") return { ok: true };
  const step = ESTIMATE_WIZARD_STEP_DEFINITIONS.find((item) => item.id === stepId);
  if (!step?.questionId) return { ok: true };
  if (OPTIONAL_QUESTION_IDS.has(step.questionId)) return { ok: true };
  const value = fieldValueByQuestionId(form, step.questionId);
  if (hasMeaningfulValue(value, step.questionId)) return { ok: true };
  return { ok: false, reason: stepReason(stepId) };
}

export function findFirstInvalidEstimateWizardStep(
  form: EstimateFormDraft,
  stepIds: readonly EstimateWizardStepId[]
): EstimateStepValidationResult {
  for (const stepId of stepIds) {
    const result = validateEstimateWizardStep(form, stepId);
    if (!result.ok) return result;
  }
  return { ok: true };
}

export function findFirstInvalidInWizardScope(
  form: EstimateFormDraft,
  scope?: EstimateWizardSessionScope
): EstimateStepValidationResult {
  const visible = getVisibleEstimateWizardSteps(form, scope);
  const questionStepIds = visible
    .map((s) => s.id)
    .filter((id): id is EstimateWizardStepId => id !== "review");
  return findFirstInvalidEstimateWizardStep(form, questionStepIds);
}

export function isEstimateFormGloballySubmittable(
  form: EstimateFormDraft,
  scope?: EstimateWizardSessionScope
): boolean {
  const visible = getVisibleEstimateWizardSteps(form, scope);
  for (const step of visible) {
    if (!step.questionId) continue;
    if (!validateEstimateWizardStep(form, step.id).ok) return false;
  }
  return true;
}
