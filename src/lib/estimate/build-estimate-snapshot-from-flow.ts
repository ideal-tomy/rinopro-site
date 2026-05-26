import {
  ESTIMATE_SNAPSHOT_SCHEMA_VERSION,
  formatRequirementDocMarkdown,
  type EstimateSnapshot,
} from "@/lib/estimate/estimate-snapshot";
import type { EstimateDetailedFlowState } from "@/lib/estimate/estimate-detailed-session";

/** 詳細見積フロー session から問い合わせ同封用スナップショットを組み立てる */
export function buildEstimateSnapshotFromFlow(
  flow: EstimateDetailedFlowState
): EstimateSnapshot | null {
  if (!flow.ai) return null;
  return {
    schemaVersion: ESTIMATE_SNAPSHOT_SCHEMA_VERSION,
    source: "estimate_detailed",
    createdAt: new Date().toISOString(),
    priorContext: flow.priorContext || undefined,
    answers: flow.answers,
    ai: flow.ai,
    visitorJourney: flow.visitorJourney ?? undefined,
    inquiryPreparation: flow.inquiryPreparation ?? undefined,
    requirementDocMarkdown: formatRequirementDocMarkdown(flow.ai, flow.answers),
  };
}
