import type { CSSProperties } from "react";
import type { ServiceJourneyStep } from "@/lib/content/service-offerings";
import { cn } from "@/lib/utils";

type ServiceJourneyDiagramProps = {
  steps: readonly ServiceJourneyStep[];
};

const chevronClipPath =
  "polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%, 12px 50%)";

export function ServiceJourneyDiagram({ steps }: ServiceJourneyDiagramProps) {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="hidden md:block">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((step, i) => (
            <div
              key={`arrow-${step.number}`}
              className={cn(
                "relative overflow-hidden border border-[var(--color-accent-primary)]/45 bg-[var(--color-accent-primary)] text-[var(--color-bg-pure)]",
                i === 0 ? "rounded-l-md" : "",
                i === steps.length - 1 ? "rounded-r-md" : ""
              )}
              style={{ clipPath: chevronClipPath } as CSSProperties}
            >
              <div className="px-4 py-3 text-center">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-[var(--color-bg-pure)]/85">
                  {step.duration}
                </p>
                <p className="mt-1 text-[15px] font-bold leading-tight">{step.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-7 grid gap-4 lg:gap-6"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((step) => (
            <div key={`card-${step.number}`} className="flex h-full flex-col items-center">
              <div className="flex size-12 items-center justify-center rounded-full border-2 border-[var(--color-accent-primary)] bg-[var(--color-bg-pure)] text-[14px] font-bold text-[var(--color-accent-primary)]">
                {step.number}
              </div>
              <div className="mt-3 flex h-full w-full flex-col rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-4 py-4 text-center shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent-primary)]">
                  {step.duration}
                </p>
                <p className="mt-1 text-[17px] font-bold leading-snug text-[var(--color-text-primary)]">
                  {step.title}
                </p>
                <p className="mx-auto mt-2 max-w-[26ch] text-[14px] leading-[1.65] text-[var(--color-text-secondary)]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative ml-2 border-l-2 border-[var(--color-accent-primary)] pl-6 md:hidden">
        {steps.map((step) => (
          <div key={`sp-${step.number}`} className="relative pb-10 last:pb-0">
            <span
              className="absolute -left-[29px] top-1 flex size-6 items-center justify-center rounded-full border-2 border-[var(--color-accent-primary)] bg-[var(--color-bg-pure)] text-[11px] font-bold text-[var(--color-accent-primary)]"
              aria-hidden
            >
              {step.number}
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent-primary)]">
              {step.duration}
            </p>
            <p className="mt-1 text-[17px] font-bold text-[var(--color-text-primary)]">{step.title}</p>
            <p className="mt-2 text-[14px] leading-[1.65] text-[var(--color-text-secondary)]">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
