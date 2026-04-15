import { estimateDetailedCopy } from "@/lib/content/site-copy";
import type { EstimateFormDraft } from "@/lib/estimate/estimate-detailed-session";
import {
  questionIdFromAnswerLabel,
  type EstimateQuestionId,
} from "@/lib/estimate-core/question-model";

const copy = estimateDetailedCopy;

function valueFromAnswerLabel(
  options: readonly { value: string; label: string }[],
  answer: string
): string {
  const trimmed = answer.trim();
  const byLabel = options.find((o) => o.label === trimmed);
  if (byLabel) return byLabel.value;
  const byValue = options.find((o) => o.value === trimmed);
  if (byValue) return byValue.value;
  return "unknown";
}

function industryFromDisplayAnswer(answer: string): Pick<
  EstimateFormDraft,
  "industry" | "industryDisplayLine"
> {
  const trimmed = answer.trim();
  const match = copy.industryOptions.find((o) => trimmed.includes(o.label));
  if (match) {
    return { industry: match.value, industryDisplayLine: trimmed };
  }
  return { industry: "other", industryDisplayLine: trimmed };
}

/**
 * 見積スナップショットの `answers`（日本語ラベルキー）からフォーム下書きへの部分復元。
 */
export function parseEstimateAnswersRecordToFormDraftPatch(
  answers: Record<string, string>
): Partial<EstimateFormDraft> {
  const patch: Partial<EstimateFormDraft> = {};

  for (const [label, raw] of Object.entries(answers)) {
    const id = questionIdFromAnswerLabel(label);
    if (!id) continue;
    const value = String(raw ?? "").trim();
    if (!value) continue;

    switch (id) {
      case "industry": {
        const ind = industryFromDisplayAnswer(value);
        patch.industry = ind.industry;
        patch.industryDisplayLine = ind.industryDisplayLine;
        break;
      }
      case "summary":
        patch.summary = value;
        break;
      case "pain":
        patch.pain = value;
        break;
      case "teamSize":
        patch.teamSize = valueFromAnswerLabel(copy.teamOptions, value);
        break;
      case "timeline":
        patch.timeline = valueFromAnswerLabel(copy.timelineOptions, value);
        break;
      case "integration":
        patch.integration = valueFromAnswerLabel(copy.integrationOptions, value);
        break;
      case "hostingContext":
        patch.hostingContext = valueFromAnswerLabel(copy.hostingContextOptions, value);
        break;
      case "usageSurface":
        patch.usageSurface = valueFromAnswerLabel(copy.usageSurfaceOptions, value);
        break;
      case "dataSensitivity":
        patch.dataSensitivity = valueFromAnswerLabel(copy.dataSensitivityOptions, value);
        break;
      case "audienceScope":
        patch.audienceScope = valueFromAnswerLabel(copy.audienceScopeOptions, value);
        break;
      case "currentWorkflow":
        patch.currentWorkflow = valueFromAnswerLabel(copy.currentWorkflowOptions, value);
        break;
      case "updateFrequency":
        patch.updateFrequency = valueFromAnswerLabel(copy.updateFrequencyOptions, value);
        break;
      case "designExpectation":
        patch.designExpectation = valueFromAnswerLabel(copy.designExpectationOptions, value);
        break;
      case "loginModel":
        patch.loginModel = valueFromAnswerLabel(copy.loginModelOptions, value);
        break;
      case "budgetBand":
        patch.budgetBand = valueFromAnswerLabel(copy.budgetBandOptions, value);
        break;
      case "budgetFeel":
        patch.budgetFeel = value;
        break;
      case "constraints":
        patch.constraints = value;
        break;
    }
  }

  return patch;
}

/** answers レコードから、値が入っている質問IDの集合 */
export function estimateQuestionIdsAnsweredInRecord(
  answers: Record<string, string>
): Set<EstimateQuestionId> {
  const out = new Set<EstimateQuestionId>();
  for (const [label, raw] of Object.entries(answers)) {
    if (!String(raw ?? "").trim()) continue;
    const id = questionIdFromAnswerLabel(label);
    if (id) out.add(id);
  }
  return out;
}
