import { estimateDetailedCopy } from "@/lib/content/site-copy";
import { ESTIMATE_DETAILED_ANSWER_KEY_ORDER } from "@/lib/estimate/estimate-detailed-answer-order";
import type { EstimateFormDraft } from "@/lib/estimate/estimate-detailed-session";

const copy = estimateDetailedCopy;

function optionLabel(
  options: readonly { value: string; label: string }[],
  value: string
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

/** フォーム状態から API / sessionStorage 用の answers を、固定順のキーで構築する */
export function buildEstimateDetailedAnswersRecord(f: EstimateFormDraft): Record<string, string> {
  const pain = f.pain.trim();
  const budgetNote = f.budgetFeel.trim();
  const constraints = f.constraints.trim();

  const getters: Record<string, string | undefined> = {
    業種: optionLabel(copy.industryOptions, f.industry),
    "いまいちばんやりたいこと・課題": f.summary.trim() || undefined,
    "会社やチームの人数のイメージ": optionLabel(copy.teamOptions, f.teamSize),
    "いつ頃までに、という希望": optionLabel(copy.timelineOptions, f.timeline),
    "今お使いのツールや、他のシステムとのつなぎ": optionLabel(
      copy.integrationOptions,
      f.integration
    ),
    "主な使い方・載せる場所": optionLabel(copy.usageSurfaceOptions, f.usageSurface),
    "扱う情報に個人情報は含まれますか": optionLabel(
      copy.dataSensitivityOptions,
      f.dataSensitivity
    ),
    "誰が使う・見るか（社内・外部）": optionLabel(copy.audienceScopeOptions, f.audienceScope),
    "いまの情報の扱い方（中心）": optionLabel(
      copy.currentWorkflowOptions,
      f.currentWorkflow
    ),
    "情報の更新の頻度": optionLabel(copy.updateFrequencyOptions, f.updateFrequency),
    "見た目・デザインの期待": optionLabel(
      copy.designExpectationOptions,
      f.designExpectation
    ),
    "ログインの使い方": optionLabel(copy.loginModelOptions, f.loginModel),
    "ご予算のイメージ": optionLabel(copy.budgetBandOptions, f.budgetBand),
    "うまくいっていないこと": pain ? pain.slice(0, 400) : undefined,
    "予算の補足": budgetNote ? budgetNote.slice(0, 120) : undefined,
    "気になること・制約": constraints ? constraints.slice(0, 600) : undefined,
  };

  const answers: Record<string, string> = {};
  for (const key of ESTIMATE_DETAILED_ANSWER_KEY_ORDER) {
    const raw = getters[key];
    if (raw !== undefined && String(raw).trim()) {
      answers[key] = String(raw).trim();
    }
  }
  return answers;
}
