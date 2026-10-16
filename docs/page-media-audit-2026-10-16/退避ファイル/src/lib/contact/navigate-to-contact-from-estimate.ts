import {
  buildContactMessageDraft,
  buildContactUrlFromEstimate,
  buildHandoffPayloadV2FromDetailed,
  storeContactHandoffBundle,
} from "@/lib/chat/estimate-handoff";
import { buildEstimateSnapshotFromFlow } from "@/lib/estimate/build-estimate-snapshot-from-flow";
import type { EstimateDetailedFlowState } from "@/lib/estimate/estimate-detailed-session";

/**
 * 詳細見積フロー（AI 生成済み）から問い合わせへ遷移する href を準備する。
 * sessionStorage に handoff を保存し、成功時は href を返す。
 */
export function prepareContactNavigationFromEstimateFlow(
  flow: EstimateDetailedFlowState
): string | null {
  const snapshot = buildEstimateSnapshotFromFlow(flow);
  if (!snapshot) return null;

  const text = buildContactMessageDraft(buildHandoffPayloadV2FromDetailed(snapshot));
  const { href } = buildContactUrlFromEstimate(text);
  storeContactHandoffBundle({ text, snapshot });
  return href;
}
