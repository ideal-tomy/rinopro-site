import type { ApproachTimelineStep } from "@/components/illustrations/approach-timeline";

type CaseStudyFlowStepsProps = {
  steps: readonly ApproachTimelineStep[];
};

export function CaseStudyFlowSteps({ steps }: CaseStudyFlowStepsProps) {
  return (
    <ol className="list-none space-y-0 border-t border-[var(--color-border-light)]">
      {steps.map((step, index) => (
        <li
          key={step.number}
          className="grid grid-cols-[4.5rem_1fr] gap-x-6 gap-y-2 border-b border-[var(--color-border-light)] py-8 md:grid-cols-[6rem_1fr] md:gap-x-10 md:py-10"
        >
          <span className="font-mono text-[clamp(2rem,4vw,3rem)] font-bold leading-none tabular-nums text-[var(--color-accent-primary)]">
            {step.number}
          </span>
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-tertiary)]">
              {step.duration}
            </p>
            <p className="mt-2 text-[18px] font-semibold leading-snug text-[var(--color-text-primary)] md:text-[20px]">
              {step.title}
            </p>
            {index < steps.length - 1 ? (
              <span className="sr-only">次のステップへ</span>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
