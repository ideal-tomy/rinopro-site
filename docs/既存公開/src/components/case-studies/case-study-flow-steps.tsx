import type { ApproachTimelineStep } from "@/components/illustrations/approach-timeline";

type CaseStudyFlowStepsProps = {
  steps: readonly ApproachTimelineStep[];
};

export function CaseStudyFlowSteps({ steps }: CaseStudyFlowStepsProps) {
  return (
    <ol className="relative m-0 list-none p-0">
      {/* 連結ライン */}
      <span
        className="pointer-events-none absolute bottom-6 left-[1.125rem] top-6 w-px bg-[var(--color-border-light)] md:left-[1.375rem]"
        aria-hidden
      />

      {steps.map((step, index) => (
        <li
          key={step.number}
          className="relative grid grid-cols-[2.25rem_1fr] gap-x-5 pb-8 last:pb-0 md:grid-cols-[2.75rem_1fr] md:gap-x-7"
        >
          {/* ノード */}
          <span
            className="relative z-[1] flex size-9 items-center justify-center rounded-full border border-[var(--color-accent-primary)] bg-[var(--color-bg-pure)] font-mono text-[13px] font-bold tabular-nums text-[var(--color-accent-primary)] md:size-11 md:text-[15px]"
            aria-hidden
          >
            {index + 1}
          </span>

          <div className="pt-1 md:pt-1.5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-tertiary)]">
              {step.duration}
            </p>
            <p className="mt-1.5 text-[17px] font-semibold leading-snug text-[var(--color-text-primary)] md:text-[19px]">
              {step.title}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
