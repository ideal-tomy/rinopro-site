import type { EstimateQuestionId } from "@/lib/estimate-core/question-model";

export type EstimateWizardStepId =
  | EstimateQuestionId
  | "review";

export type EstimateWizardStepDefinition = {
  id: EstimateWizardStepId;
  questionId?: EstimateQuestionId;
  selectOnly?: boolean;
};

export const ESTIMATE_WIZARD_STEP_DEFINITIONS: readonly EstimateWizardStepDefinition[] = [
  { id: "industry", questionId: "industry", selectOnly: true },
  { id: "productArchetype", questionId: "productArchetype" },
  { id: "problemSummary", questionId: "problemSummary" },
  { id: "pain", questionId: "pain" },
  { id: "teamSize", questionId: "teamSize", selectOnly: true },
  { id: "timeline", questionId: "timeline", selectOnly: true },
  { id: "integration", questionId: "integration", selectOnly: true },
  { id: "hostingContext", questionId: "hostingContext", selectOnly: true },
  { id: "usageSurface", questionId: "usageSurface", selectOnly: true },
  { id: "dataSensitivity", questionId: "dataSensitivity", selectOnly: true },
  { id: "audienceScope", questionId: "audienceScope", selectOnly: true },
  { id: "currentWorkflow", questionId: "currentWorkflow", selectOnly: true },
  { id: "updateFrequency", questionId: "updateFrequency", selectOnly: true },
  { id: "designExpectation", questionId: "designExpectation", selectOnly: true },
  { id: "loginModel", questionId: "loginModel", selectOnly: true },
  { id: "budgetBand", questionId: "budgetBand", selectOnly: true },
  { id: "budgetFeel", questionId: "budgetFeel" },
  { id: "constraints", questionId: "constraints" },
  { id: "review" },
] as const;
