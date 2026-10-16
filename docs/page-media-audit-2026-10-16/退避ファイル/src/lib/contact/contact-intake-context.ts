import type { EstimateFormDraft } from "@/lib/estimate/estimate-detailed-session";
import type { EstimateSnapshot } from "@/lib/estimate/estimate-snapshot";
import { buildEstimateDraftFromVisitorJourney } from "@/lib/journey/visitor-journey-estimate-prefill";
import type { VisitorJourneySummary } from "@/lib/journey/visitor-journey";
import {
  CONTACT_INTAKE_INITIAL_FORM,
  mergeEstimateFormDraft,
} from "@/lib/contact/contact-intake-initial-form";
import {
  estimateQuestionIdsAnsweredInRecord,
  parseEstimateAnswersRecordToFormDraftPatch,
} from "@/lib/contact/parse-estimate-answers-to-form-draft";
import type { EstimateQuestionId } from "@/lib/estimate-core/question-model";
import { isContactSyntheticEstimateSnapshot } from "@/lib/contact/build-contact-synthetic-snapshot";

export type ContactIntakeBootstrap = {
  /** ヒアリングUIの初期値 */
  formDraft: EstimateFormDraft;
  /** 見積スナップショットの answers に含まれる質問（ウィザードでは再質問しない） */
  lockedQuestionIds: ReadonlySet<EstimateQuestionId>;
};

/**
 * 問い合わせページの入口文脈から、ヒアリング用フォームの初期状態を組み立てる。
 * - 詳細見積スナップショットあり: 回答を復元し、当該質問はロック（読み取り専用扱いは UI 側）
 * - 匿名ジャーニー: 既存の見積 prefill と同じ patch をマージ（直流入ではウィザードで再質問するため prefilled は使わない）
 */
export function bootstrapContactIntakeForm(args: {
  estimateSnapshot: EstimateSnapshot | null | undefined;
  visitorJourney: VisitorJourneySummary | null | undefined;
}): ContactIntakeBootstrap {
  let draft = { ...CONTACT_INTAKE_INITIAL_FORM };
  const locked = new Set<EstimateQuestionId>();

  const journeyResult = buildEstimateDraftFromVisitorJourney(args.visitorJourney);
  draft = mergeEstimateFormDraft(draft, journeyResult.draftPatch);

  if (args.estimateSnapshot?.answers) {
    const patch = parseEstimateAnswersRecordToFormDraftPatch(
      args.estimateSnapshot.answers
    );
    draft = mergeEstimateFormDraft(draft, patch);
    for (const id of estimateQuestionIdsAnsweredInRecord(
      args.estimateSnapshot.answers
    )) {
      locked.add(id);
    }
  }

  return {
    formDraft: draft,
    lockedQuestionIds: locked,
  };
}

/** 詳細見積API由来のスナップショットか（問い合わせ用合成スナップショットは除く） */
export function hasRealEstimateAiSnapshot(
  snapshot: EstimateSnapshot | null | undefined
): boolean {
  return Boolean(snapshot?.ai && !isContactSyntheticEstimateSnapshot(snapshot));
}
