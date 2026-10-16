import type { EstimateFormDraft } from "@/lib/estimate/estimate-detailed-session";
import {
  isEstimateFormGloballySubmittable,
  type EstimateWizardSessionScope,
} from "@/lib/estimate/estimate-step-validation";

/** 問い合わせ送信前に、最低 facts セットがそろったかを確認する。 */
export function isContactIntakeFormSatisfied(
  form: EstimateFormDraft,
  scope?: EstimateWizardSessionScope
): boolean {
  return isEstimateFormGloballySubmittable(form, scope);
}
