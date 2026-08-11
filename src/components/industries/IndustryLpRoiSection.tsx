"use client";

import { useMemo, useState } from "react";
import {
  resolveIndustryRoiConfig,
  type IndustryRoiSpec,
} from "@/lib/content/industry-lp/roi-factory";
import { formatManYen } from "@/lib/content/industry-lp/format";
import type { IndustryLpCta } from "@/lib/content/industry-lp/types";
import { cn } from "@/lib/utils";

function CtaLink({
  cta,
  className,
}: {
  cta: IndustryLpCta;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-5 py-3 text-[14px] font-semibold transition-colors";
  const variantCls =
    cta.variant === "primary"
      ? "bg-[var(--lp-primary)] text-white hover:opacity-90"
      : "border border-[var(--lp-ink)]/20 bg-white text-[var(--lp-ink)] hover:border-[var(--lp-primary)]/50 hover:bg-[var(--lp-surface)]";

  if (cta.external) {
    return (
      <a
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, variantCls, className)}
      >
        {cta.label}
      </a>
    );
  }
  return (
    <a href={cta.href} className={cn(base, variantCls, className)}>
      {cta.label}
    </a>
  );
}

export function IndustryLpRoiSection({
  label,
  headline,
  lead,
  spec,
  secondaryCta,
}: {
  label: string;
  headline: string;
  lead: string;
  spec: IndustryRoiSpec;
  secondaryCta?: IndustryLpCta;
}) {
  const config = useMemo(() => resolveIndustryRoiConfig(spec), [spec]);
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(config.sliders.map((s) => [s.key, s.defaultValue]))
  );

  const loss = useMemo(
    () => config.computeAnnualLoss(values),
    [config, values]
  );
  const recoverable = useMemo(
    () => config.computeRecoverable(values),
    [config, values]
  );
  const dev = useMemo(() => config.estimateDevCost(), [config]);
  const payback =
    recoverable > 0
      ? `${((dev.low / recoverable) * 12).toFixed(1)}〜${((dev.high / recoverable) * 12).toFixed(1)}ヶ月`
      : null;

  const { leadTimeLabel, leadTimeValue } = config.outputs;
  const hasLeadTime = Boolean(leadTimeLabel && leadTimeValue);

  return (
    <section
      id="roi"
      className="scroll-mt-24 border-y border-[var(--lp-ink)]/10 bg-white py-14 md:py-20"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--lp-primary)]">
          {label}
        </p>
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 md:text-4xl [text-wrap:balance]">
          {headline}
        </h2>
        <p className="mb-8 max-w-3xl text-lg leading-relaxed text-slate-700 md:text-xl md:leading-8">
          {lead}
        </p>

        <div className="space-y-6">
          {config.sliders.map((s) => (
            <label key={s.key} className="block">
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-[16px] font-medium text-slate-900">
                  {s.label}
                </span>
                <span className="text-[16px] tabular-nums text-[var(--lp-primary)]">
                  {values[s.key].toLocaleString("ja-JP")}
                  {s.unit}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={values[s.key]}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    [s.key]: Number(e.target.value),
                  }))
                }
                className="w-full accent-[var(--lp-primary)]"
              />
              <p className="mt-1 text-[14px] leading-relaxed text-slate-500">
                {s.note}
              </p>
            </label>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-[var(--lp-surface)] p-5">
            <p className="text-[14px] leading-relaxed text-slate-500">
              {config.outputs.lossLabel}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
              {formatManYen(loss)}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--lp-primary)]/30 bg-[var(--lp-primary)]/5 p-5">
            <p className="text-[14px] leading-relaxed text-slate-500">
              {config.outputs.recoverableLabel}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--lp-primary)]">
              {formatManYen(recoverable)}
            </p>
          </div>
          {hasLeadTime ? (
            <div className="rounded-xl border border-[var(--lp-primary)]/25 bg-[var(--lp-primary)]/5 p-5 sm:col-span-2">
              <p className="text-[14px] leading-relaxed text-slate-500">
                {leadTimeLabel}
              </p>
              <p className="mt-1 text-xl font-bold tracking-tight text-[var(--lp-primary)] md:text-2xl">
                {leadTimeValue}
              </p>
            </div>
          ) : null}
          {payback && config.outputs.paybackLabel ? (
            <div className="rounded-xl border border-slate-200 bg-white p-5 sm:col-span-2">
              <p className="text-[14px] leading-relaxed text-slate-500">
                {config.outputs.paybackLabel}
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {payback}
              </p>
            </div>
          ) : null}
        </div>

        <p className="mt-6 text-[14px] leading-relaxed text-slate-500">
          {config.disclaimer}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <CtaLink cta={config.cta} />
          {secondaryCta ? <CtaLink cta={secondaryCta} /> : null}
        </div>
      </div>
    </section>
  );
}
