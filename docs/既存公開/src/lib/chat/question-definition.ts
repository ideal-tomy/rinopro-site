import type {
  CanonicalFactKey,
  CandidateFactKey,
  FactCollectionState,
} from "@/lib/facts/canonical-facts";

export type EmittedFactKey = CanonicalFactKey | CandidateFactKey;

export type QuestionFactEmission = {
  factKey: EmittedFactKey;
  state: FactCollectionState;
};

export type QuestionChoiceDefinition<TOptionId extends string = string> = {
  optionId: TOptionId;
  label: string;
  emitsFacts: readonly QuestionFactEmission[];
  allowsFreeform?: boolean;
  analyticsKey?: string;
  routingKey?: string;
};

export type QuestionStepDefinition<
  TStepId extends string = string,
  TOptionId extends string = string,
> = {
  questionId: TStepId;
  stepKey: TStepId;
  stepLabel: string;
  question: string;
  nextStepKey?: string;
  choices: readonly QuestionChoiceDefinition<TOptionId>[];
};

export function createFactEmission(
  factKey: EmittedFactKey,
  state: FactCollectionState = "direct"
): QuestionFactEmission {
  return { factKey, state };
}

export function createQuestionChoice<TOptionId extends string>(
  optionId: TOptionId,
  label: string,
  emitsFacts: readonly QuestionFactEmission[],
  extras: Pick<
    QuestionChoiceDefinition<TOptionId>,
    "allowsFreeform" | "analyticsKey" | "routingKey"
  > = {}
): QuestionChoiceDefinition<TOptionId> {
  return {
    optionId,
    label,
    emitsFacts,
    ...extras,
  };
}

export function createQuestionStep<
  TStepId extends string,
  TOptionId extends string,
>(
  questionId: TStepId,
  stepLabel: string,
  question: string,
  choices: readonly QuestionChoiceDefinition<TOptionId>[],
  nextStepKey?: string
): QuestionStepDefinition<TStepId, TOptionId> {
  return {
    questionId,
    stepKey: questionId,
    stepLabel,
    question,
    choices,
    nextStepKey,
  };
}

export function findQuestionChoiceByOptionId<
  TOptionId extends string,
  TChoice extends QuestionChoiceDefinition<TOptionId>,
>(choices: readonly TChoice[], optionId: string): TChoice | undefined {
  return choices.find((choice) => choice.optionId === optionId);
}
