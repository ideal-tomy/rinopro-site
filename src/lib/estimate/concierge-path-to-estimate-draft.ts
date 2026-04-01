import type { ConciergeTrack, FlowSelection } from "@/lib/chat/concierge-flow-definitions";
import {
  A_SCOPE_TO_TEAM_INT,
  B_SCOPE_TO_TEAM_CH,
} from "@/lib/chat/concierge-flow";
import type { EstimateFormDraft } from "@/lib/estimate/estimate-detailed-session";
import type { EstimateQuestionId } from "@/lib/estimate-core/question-model";

function selectionByStep(
  path: FlowSelection[],
  stepKey: string
): FlowSelection | undefined {
  return path.find((p) => p.stepKey === stepKey);
}

/** 概算ロジックの team_* → フォーム teamSize value */
function conciergeTeamIdToFormTeamSize(teamId: string): string | null {
  switch (teamId) {
    case "team_1_10":
      return "1-10";
    case "team_11_50":
      return "11-50";
    case "team_51_200":
      return "51-200";
    case "team_201_plus":
      return "201+";
    case "team_unknown":
      return "unknown";
    default:
      return null;
  }
}

/** 概算ロジックの int_* → フォーム integration value */
function conciergeIntIdToFormIntegration(intId: string): string | null {
  switch (intId) {
    case "int_required":
      return "required";
    case "int_maybe":
      return "nice";
    case "int_standalone":
      return "standalone";
    case "int_unknown":
      return "unknown";
    case "int_other":
      return "unknown";
    default:
      return null;
  }
}

export type ConciergePathPrefillResult = {
  draftPatch: Partial<EstimateFormDraft>;
  /** ウィザードで再質問しない（チャットで既に取れたとみなす） */
  prefilledQuestionIds: EstimateQuestionId[];
  /** UI 用: path から 1 件以上マッピングできた */
  hadPathMapping: boolean;
};

/**
 * トップコンシェルジュの path を詳細見積フォームに反映し、重複質問を減らす。
 */
export function prefillEstimateDraftFromConciergePath(
  track: ConciergeTrack,
  path: FlowSelection[]
): ConciergePathPrefillResult {
  const draftPatch: Partial<EstimateFormDraft> = {};
  const prefilledQuestionIds: EstimateQuestionId[] = [];
  let hadPathMapping = false;

  if (track === "A") {
    const scope = selectionByStep(path, "A_SCOPE");
    const mapped =
      scope?.optionId != null ? A_SCOPE_TO_TEAM_INT[scope.optionId] : undefined;
    if (mapped) {
      const teamSize = conciergeTeamIdToFormTeamSize(mapped.team);
      const integration = conciergeIntIdToFormIntegration(mapped.int);
      if (teamSize != null) {
        draftPatch.teamSize = teamSize;
        prefilledQuestionIds.push("teamSize");
        hadPathMapping = true;
      }
      if (integration != null) {
        draftPatch.integration = integration;
        prefilledQuestionIds.push("integration");
        hadPathMapping = true;
      }
    }
  } else if (track === "B") {
    const bScope = selectionByStep(path, "B_SCOPE");
    const bm =
      bScope?.optionId != null ? B_SCOPE_TO_TEAM_CH[bScope.optionId] : undefined;
    if (bm) {
      const teamSize = conciergeTeamIdToFormTeamSize(bm.team);
      if (teamSize != null) {
        draftPatch.teamSize = teamSize;
        prefilledQuestionIds.push("teamSize");
        hadPathMapping = true;
      }
    }
  }

  return { draftPatch, prefilledQuestionIds, hadPathMapping };
}
