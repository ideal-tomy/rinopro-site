import type { CaseStudyMetric } from "@/lib/content/case-study-detail";
import { CaseStudyArrowUpRight } from "@/components/case-studies/case-study-icons";

type CaseStudyMetricsProps = {
  metrics: readonly CaseStudyMetric[];
};

export function CaseStudyMetrics({ metrics }: CaseStudyMetricsProps) {
  if (metrics.length === 0) return null;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="group relative overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(38,65,142,0.45)] md:p-7"
          >
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-tertiary)]">
              {m.label}
            </p>

            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-mono text-[clamp(2rem,5vw,2.85rem)] font-bold leading-none tabular-nums text-[var(--color-accent-primary)]">
                {m.after}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[13px] text-[var(--color-text-tertiary)]">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold"
                style={{
                  color: "var(--color-warm-strong)",
                  backgroundColor: "color-mix(in srgb, var(--color-warm) 22%, transparent)",
                }}
              >
                <CaseStudyArrowUpRight className="size-3.5" aria-hidden />
                改善
              </span>
              <span>
                従来 <span className="line-through">{m.before}</span> から
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-tertiary)] md:text-[12px]">
        ※ 想定例 — 数値はイメージです。実際の効果は要件・運用により異なります。
      </p>
    </div>
  );
}
