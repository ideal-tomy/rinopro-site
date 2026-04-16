import { estimateDetailedCopy } from "@/lib/content/site-copy";
import { ESTIMATE_DETAILED_ANSWER_KEY_ORDER } from "@/lib/estimate/estimate-detailed-answer-order";
import { answerLabelFromQuestionId } from "@/lib/estimate-core/question-model";
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

  const industryAnswer =
    f.industryDisplayLine?.trim() ||
    optionLabel(copy.industryOptions, f.industry);

  const getters: Record<string, string | undefined> = {
    [answerLabelFromQuestionId("industry")]: industryAnswer,
    [answerLabelFromQuestionId("productArchetype")]: f.productArchetype.trim() || undefined,
    [answerLabelFromQuestionId("problemSummary")]: f.problemSummary.trim() || undefined,
    [answerLabelFromQuestionId("teamSize")]: optionLabel(copy.teamOptions, f.teamSize),
    [answerLabelFromQuestionId("timeline")]: optionLabel(copy.timelineOptions, f.timeline),
    [answerLabelFromQuestionId("integration")]: optionLabel(
      copy.integrationOptions,
      f.integration
    ),
    [answerLabelFromQuestionId("hostingContext")]: optionLabel(
      copy.hostingContextOptions,
      f.hostingContext
    ),
    [answerLabelFromQuestionId("usageSurface")]: optionLabel(copy.usageSurfaceOptions, f.usageSurface),
    [answerLabelFromQuestionId("dataSensitivity")]: optionLabel(
      copy.dataSensitivityOptions,
      f.dataSensitivity
    ),
    [answerLabelFromQuestionId("audienceScope")]: optionLabel(copy.audienceScopeOptions, f.audienceScope),
    [answerLabelFromQuestionId("currentWorkflow")]: optionLabel(
      copy.currentWorkflowOptions,
      f.currentWorkflow
    ),
    [answerLabelFromQuestionId("updateFrequency")]: optionLabel(copy.updateFrequencyOptions, f.updateFrequency),
    [answerLabelFromQuestionId("designExpectation")]: optionLabel(
      copy.designExpectationOptions,
      f.designExpectation
    ),
    [answerLabelFromQuestionId("loginModel")]: optionLabel(copy.loginModelOptions, f.loginModel),
    [answerLabelFromQuestionId("budgetBand")]: optionLabel(copy.budgetBandOptions, f.budgetBand),
    [answerLabelFromQuestionId("pain")]: pain ? pain.slice(0, 400) : undefined,
    [answerLabelFromQuestionId("budgetFeel")]: budgetNote ? budgetNote.slice(0, 120) : undefined,
    [answerLabelFromQuestionId("constraints")]: constraints ? constraints.slice(0, 600) : undefined,
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
