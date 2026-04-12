import type { EstimateFormDraft } from "@/lib/estimate/estimate-detailed-session";
import type { EstimateQuestionId } from "@/lib/estimate-core/question-model";
import type { VisitorJourneySummary } from "@/lib/journey/visitor-journey";

export type VisitorJourneyEstimatePrefillResult = {
  draftPatch: Partial<EstimateFormDraft>;
  prefilledQuestionIds: EstimateQuestionId[];
  confirmLines: string[];
};

export function buildEstimateDraftFromVisitorJourney(
  summary: VisitorJourneySummary | null | undefined
): VisitorJourneyEstimatePrefillResult {
  if (!summary) {
    return { draftPatch: {}, prefilledQuestionIds: [], confirmLines: [] };
  }

  const draftPatch: Partial<EstimateFormDraft> = {};
  const prefilledQuestionIds: EstimateQuestionId[] = [];
  const confirmLines: string[] = [];

  if (summary.industryBundle) {
    draftPatch.industry = summary.industryBundle.domainId;
    draftPatch.industryDisplayLine = [
      summary.industryBundle.domainId,
      summary.industryBundle.domainDetailId ?? "",
      summary.industryBundle.note ?? "",
    ]
      .filter(Boolean)
      .join(" / ");
    prefilledQuestionIds.push("industry");
    confirmLines.push(`業種: ${draftPatch.industryDisplayLine}`);
  }

  if (summary.lastFreeformSummary) {
    draftPatch.summary = summary.lastFreeformSummary;
    confirmLines.push(`相談メモ: ${summary.lastFreeformSummary}`);
  }

  if (summary.estimateSignals?.teamSize) {
    draftPatch.teamSize = summary.estimateSignals.teamSize;
    prefilledQuestionIds.push("teamSize");
    confirmLines.push(`人数感: ${summary.estimateSignals.teamSize}`);
  }
  if (summary.estimateSignals?.timeline) {
    draftPatch.timeline = summary.estimateSignals.timeline;
    prefilledQuestionIds.push("timeline");
    confirmLines.push(`時期: ${summary.estimateSignals.timeline}`);
  }
  if (summary.estimateSignals?.integration) {
    draftPatch.integration = summary.estimateSignals.integration;
    prefilledQuestionIds.push("integration");
    confirmLines.push(`連携: ${summary.estimateSignals.integration}`);
  }
  if (summary.estimateSignals?.usageSurface) {
    draftPatch.usageSurface = summary.estimateSignals.usageSurface;
    prefilledQuestionIds.push("usageSurface");
  }
  if (summary.estimateSignals?.audienceScope) {
    draftPatch.audienceScope = summary.estimateSignals.audienceScope;
    prefilledQuestionIds.push("audienceScope");
  }

  return { draftPatch, prefilledQuestionIds, confirmLines };
}
