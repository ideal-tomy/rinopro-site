import type { CanonicalFactKey, FactEnvelope } from "@/lib/facts/canonical-facts";
import type { EstimateFormDraft } from "@/lib/estimate/estimate-detailed-session";
import type { EstimateQuestionId } from "@/lib/estimate-core/question-model";
import { buildFreeformFollowupLines } from "@/lib/freeform/freeform-followup-policy";
import {
  buildVisitorJourneyFactEnvelopes,
  type VisitorJourneySummary,
} from "@/lib/journey/visitor-journey";

export type VisitorJourneyEstimatePrefillResult = {
  draftPatch: Partial<EstimateFormDraft>;
  prefilledQuestionIds: EstimateQuestionId[];
  confirmLines: string[];
  factEnvelopes: FactEnvelope[];
};

const FACT_TO_QUESTION_ID: Partial<Record<CanonicalFactKey, EstimateQuestionId>> = {
  industryBundle: "industry",
  productArchetype: "productArchetype",
  problemSummary: "problemSummary",
  teamSize: "teamSize",
  timeline: "timeline",
  integration: "integration",
  usageSurface: "usageSurface",
  dataSensitivity: "dataSensitivity",
  audienceScope: "audienceScope",
};

const FACT_TO_DRAFT_KEY: Partial<Record<CanonicalFactKey, keyof EstimateFormDraft>> = {
  productArchetype: "productArchetype",
  problemSummary: "problemSummary",
  teamSize: "teamSize",
  timeline: "timeline",
  integration: "integration",
  usageSurface: "usageSurface",
  dataSensitivity: "dataSensitivity",
  audienceScope: "audienceScope",
};

export function buildEstimateDraftFromVisitorJourney(
  summary: VisitorJourneySummary | null | undefined
): VisitorJourneyEstimatePrefillResult {
  if (!summary) {
    return {
      draftPatch: {},
      prefilledQuestionIds: [],
      confirmLines: [],
      factEnvelopes: [],
    };
  }

  const draftPatch: Partial<EstimateFormDraft> = {};
  const prefilledQuestionIds: EstimateQuestionId[] = [];
  const confirmLines: string[] = [];
  const factEnvelopes = buildVisitorJourneyFactEnvelopes(summary);

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

  if (summary.lastFreeformNormalizedText || summary.lastFreeformSummary) {
    draftPatch.problemSummary = summary.lastFreeformNormalizedText ?? summary.lastFreeformSummary;
    prefilledQuestionIds.push("problemSummary");
    confirmLines.push(`困りごとメモ: ${summary.lastFreeformSummary}`);
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

  for (const envelope of factEnvelopes) {
    if (envelope.state === "candidate" && envelope.key !== "productArchetype") continue;
    const draftKey = FACT_TO_DRAFT_KEY[envelope.key as CanonicalFactKey];
    if (draftKey && !draftPatch[draftKey]) {
      draftPatch[draftKey] = envelope.value as never;
      if (
        envelope.key === "productArchetype" ||
        envelope.key === "problemSummary" ||
        envelope.key === "timeline" ||
        envelope.key === "integration" ||
        envelope.key === "usageSurface" ||
        envelope.key === "dataSensitivity" ||
        envelope.key === "audienceScope"
      ) {
        const label =
          envelope.key === "productArchetype"
            ? "作りたいもの"
            : envelope.key === "problemSummary"
              ? "困りごと"
              : envelope.key === "timeline"
            ? "時期"
            : envelope.key === "integration"
              ? "連携"
              : envelope.key === "usageSurface"
                ? "使い方"
                : envelope.key === "dataSensitivity"
                  ? "個人情報"
                  : "利用範囲";
        confirmLines.push(`${label}: ${envelope.value}`);
      }
    }
    const questionId = FACT_TO_QUESTION_ID[envelope.key as CanonicalFactKey];
    if (questionId && !prefilledQuestionIds.includes(questionId)) {
      prefilledQuestionIds.push(questionId);
    }
  }

  for (const line of buildFreeformFollowupLines(factEnvelopes)) {
    if (!confirmLines.includes(line)) confirmLines.push(line);
  }

  return { draftPatch, prefilledQuestionIds, confirmLines, factEnvelopes };
}
