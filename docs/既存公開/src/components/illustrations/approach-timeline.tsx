"use client";

import { useId } from "react";

export type ApproachTimelineStep = {
  number: string;
  title: string;
  duration: string;
};

type ApproachTimelineProps = {
  steps: ApproachTimelineStep[];
};

export function ApproachTimeline({ steps }: ApproachTimelineProps) {
  const uid = useId().replace(/:/g, "");
  const lineGradientId = `approach-line-${uid}`;
  const n = steps.length;
  const markerXs =
    n <= 1 ? [500] : Array.from({ length: n }, (_, i) => 96 + (i * (808 / (n - 1))));

  return (
    <div className="approach-timeline-root mx-auto w-full max-w-[1100px]">
      <div className="hidden md:block">
        <svg viewBox="0 0 1000 72" className="mb-5 h-auto w-full" aria-hidden>
          <defs>
            <linearGradient id={lineGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <line
            x1="80"
            y1="36"
            x2="920"
            y2="36"
            stroke={`url(#${lineGradientId})`}
            strokeWidth="2"
          />
          {markerXs.map((cx, i) => (
            <g key={steps[i]?.number ?? i}>
              <circle
                cx={cx}
                cy="36"
                r="22"
                fill="var(--color-bg-pure)"
                stroke="var(--color-accent-primary)"
                strokeWidth="2"
              />
              <text
                x={cx}
                y="42"
                textAnchor="middle"
                fill="var(--color-accent-primary)"
                fontSize="13"
                fontWeight="700"
              >
                {steps[i]?.number ?? ""}
              </text>
            </g>
          ))}
        </svg>
        <div
          className="grid gap-4 lg:gap-6"
          style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
        >
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-4 py-4 text-center shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent-primary)]">
                {step.duration}
              </p>
              <p className="mt-2 text-[17px] font-bold leading-snug text-[var(--color-text-primary)]">
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative ml-2 border-l-2 border-[var(--color-accent-primary)] pl-6 md:hidden">
        {steps.map((step) => (
          <div key={step.number} className="relative pb-10 last:pb-0">
            <span
              className="absolute -left-[29px] top-1 size-3.5 rounded-full border-2 border-[var(--color-accent-primary)] bg-[var(--color-bg-pure)]"
              aria-hidden
            />
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent-primary)]">
              {step.duration}
            </p>
            <p className="mt-1 text-[17px] font-bold text-[var(--color-text-primary)]">{step.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
