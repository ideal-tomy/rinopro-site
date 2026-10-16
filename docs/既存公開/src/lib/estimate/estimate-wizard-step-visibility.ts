import type { EstimateFormDraft } from "@/lib/estimate/estimate-detailed-session";
import type { EstimateQuestionId } from "@/lib/estimate-core/question-model";

/**
 * すでに他の回答で趣旨がカバーできる、またはリスクが低いと判断できるステップを省略する。
 * （prefilled / answered は shouldAskEstimateQuestion 側）
 */
export function shouldShowEstimateWizardStepForForm(args: {
  questionId: EstimateQuestionId;
  form: EstimateFormDraft;
}): boolean {
  const { questionId, form } = args;

  if (
    questionId === "loginModel" &&
    form.dataSensitivity === "no" &&
    (form.audienceScope === "internal_only" ||
      form.usageSurface === "internal_only")
  ) {
    return false;
  }

  if (questionId === "updateFrequency" && form.integration === "standalone") {
    return false;
  }

  return true;
}
