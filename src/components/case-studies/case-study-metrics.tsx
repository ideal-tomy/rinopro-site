import type { CaseStudyMetric } from "@/lib/content/case-study-detail";
import { CaseStudyArrowRight } from "@/components/case-studies/case-study-icons";

type CaseStudyMetricsProps = {
  metrics: readonly CaseStudyMetric[];
};

export function CaseStudyMetrics({ metrics }: CaseStudyMetricsProps) {
  if (metrics.length === 0) return null;

  return (
    <div>
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-tertiary)] md:text-[12px]">
        想定例 — 数値はイメージです。実際の効果は要件・運用により異なります。
      </p>
      <ul className="mt-8 divide-y divide-[var(--color-border-light)] border-y border-[var(--color-border-light)]">
        {metrics.map((m) => (
          <li
            key={m.label}
            className="grid gap-4 py-8 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-8 md:py-10"
          >
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-tertiary)]">
                {m.label}
              </p>
              <p className="mt-2 font-mono text-[clamp(1.35rem,3vw,2rem)] font-bold tabular-nums leading-none text-[var(--color-text-secondary)]">
                {m.before}
              </p>
            </div>
            <CaseStudyArrowRight
              className="mx-auto size-5 shrink-0 text-[var(--color-accent-primary)] md:mx-0"
              aria-hidden
            />
            <div className="md:text-right">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-tertiary)] md:invisible">
                {m.label}
              </p>
              <p className="mt-2 font-mono text-[clamp(1.35rem,3vw,2rem)] font-bold tabular-nums leading-none text-[var(--color-accent-primary)]">
                {m.after}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
