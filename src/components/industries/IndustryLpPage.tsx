"use client";

import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import type {
  AssetRef,
  IndustryLpConfig,
  IndustryLpCta,
} from "@/lib/content/industry-lp/types";
import { IndustryLpRoiSection } from "@/components/industries/IndustryLpRoiSection";
import { cn } from "@/lib/utils";

/** ideal DemoLp brand に合わせたライトモード配色 */
const LP = {
  primary: "#0F766E",
  primaryHover: "#0d6660",
  accent: "#F59E0B",
  ink: "#0F172A",
  surface: "#F8FAFC",
} as const;

function CtaLink({
  cta,
  className,
}: {
  cta: IndustryLpCta;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-colors";
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

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--lp-primary)]">
      {children}
    </p>
  );
}

function Illustration({
  asset,
  className,
}: {
  asset: AssetRef;
  className?: string;
}) {
  return (
    <figure className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset.src}
        alt={asset.alt}
        className="mx-auto w-full max-w-4xl rounded-xl border border-[var(--lp-ink)]/10 bg-white"
      />
      {asset.note ? (
        <figcaption className="mt-2 text-center text-sm leading-relaxed text-slate-500">
          {asset.note}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function IndustryLpPage({ config }: { config: IndustryLpConfig }) {
  const [tabId, setTabId] = useState(config.resultTabs.tabs[0]?.id ?? "");
  const [faqOpen, setFaqOpen] = useState(() => {
    const i = config.faq.findIndex((f) => f.defaultOpen);
    return i >= 0 ? i : 0;
  });
  const activeTab =
    config.resultTabs.tabs.find((t) => t.id === tabId) ??
    config.resultTabs.tabs[0];

  const visibleProblemItems = config.problem.items.filter(
    (item) => !config.problem.cardHiddenItemNos?.includes(item.no)
  );

  return (
    <div
      className="demo-lp min-h-screen bg-[var(--lp-surface)] text-[var(--lp-ink)]"
      style={
        {
          "--lp-primary": LP.primary,
          "--lp-accent": LP.accent,
          "--lp-ink": LP.ink,
          "--lp-surface": LP.surface,
          colorScheme: "light",
        } as CSSProperties
      }
    >
      {/* B00 sticky */}
      <header className="sticky top-0 z-30 border-b border-[var(--lp-ink)]/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <span className="truncate text-sm font-semibold text-[var(--lp-ink)]">
            {config.demoName}
          </span>
          <CtaLink cta={config.hero.ctas[0]} className="shrink-0 !py-2" />
        </div>
      </header>

      {/* B01 hero */}
      <section className="relative overflow-hidden border-b border-[var(--lp-ink)]/10 bg-white">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:items-center md:py-16">
          <div>
            <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-[var(--lp-ink)] md:text-4xl lg:text-[2.75rem] [text-wrap:balance]">
              {config.hero.headline}
            </h1>
            <p className="mb-3 text-lg font-semibold leading-snug text-[var(--lp-ink)] md:text-xl [text-wrap:balance]">
              {config.hero.subline}
            </p>
            <p className="mb-6 text-[16px] leading-relaxed text-slate-600 md:text-lg md:leading-8">
              {config.hero.body}
            </p>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <CtaLink cta={config.hero.ctas[0]} />
              <CtaLink cta={config.hero.ctas[1]} />
            </div>
          </div>
          <div>
            <div className="relative mx-auto aspect-square w-full max-w-xl md:max-w-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={config.hero.visual.src}
                alt={config.hero.visual.alt}
                className={
                  config.hero.visual.fit === "contain"
                    ? "absolute inset-0 h-full w-full rounded-xl object-contain object-center"
                    : "h-full w-full rounded-xl border border-[var(--lp-ink)]/10 object-cover shadow-sm"
                }
              />
            </div>
            {config.hero.visual.note ? (
              <p className="mt-2 text-center text-sm leading-relaxed text-slate-500">
                {config.hero.visual.note}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* B02 impact — dark band */}
      <section className="border-b border-[var(--lp-ink)]/10 bg-[var(--lp-ink)] py-12 text-white md:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="text-center text-[16px] text-white/85 md:text-lg">
            {config.impact.mainFigure.lead}
          </p>
          <p className="mt-2 text-center text-3xl font-bold tabular-nums md:text-4xl">
            <span className="text-[var(--lp-accent)]">
              {config.impact.mainFigure.value}
            </span>
            <span className="ml-1 text-lg font-medium text-white/80">
              {config.impact.mainFigure.trail}
            </span>
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-white/55">
            {config.impact.basis}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {config.impact.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-4 text-center"
              >
                <p className="text-lg font-bold">{m.value}</p>
                <p className="mt-1 text-sm text-white/65">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B04 problem */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionLabel>{config.problem.label}</SectionLabel>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-[var(--lp-ink)] md:text-4xl [text-wrap:balance]">
            {config.problem.headline}
          </h2>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-slate-700 md:text-xl md:leading-8">
            {config.problem.lead}
          </p>

          {config.problem.diagram ? (
            <Illustration asset={config.problem.diagram} className="mb-10" />
          ) : null}

          {visibleProblemItems.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {visibleProblemItems.map((item) => (
                <div
                  key={item.no}
                  className="rounded-xl border border-[var(--lp-ink)]/10 p-5"
                >
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--lp-primary)]">
                    {item.no}
                  </p>
                  <h3 className="mb-2 font-bold text-[var(--lp-ink)]">
                    {item.title}
                  </h3>
                  <p className="text-[16px] leading-relaxed text-slate-600">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-8 rounded-xl border border-[var(--lp-ink)]/10 bg-[var(--lp-surface)] px-5 py-6">
            <p className="text-lg font-bold leading-snug text-[var(--lp-ink)] md:text-xl">
              {config.problem.summary.headline}
            </p>
            <p className="mt-2 text-[16px] leading-relaxed text-slate-600">
              {config.problem.summary.body}
            </p>
          </div>
        </div>
      </section>

      {/* recurring */}
      <section className="bg-[var(--lp-surface)] py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionLabel>{config.recurringProblems.label}</SectionLabel>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-[var(--lp-ink)] md:text-4xl [text-wrap:balance]">
            {config.recurringProblems.headline}
          </h2>
          <Illustration
            asset={config.recurringProblems.diagram}
            className="mb-8"
          />
          <div className="rounded-xl border border-[var(--lp-ink)]/10 bg-white px-5 py-6">
            <p className="text-lg font-bold leading-snug text-[var(--lp-ink)] md:text-xl">
              {config.recurringProblems.closing.line1}
            </p>
            {config.recurringProblems.closing.line2 ? (
              <p className="mt-2 text-[16px] leading-relaxed text-slate-600">
                {config.recurringProblems.closing.line2}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* B05 fit */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionLabel>{config.fit.label}</SectionLabel>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-[var(--lp-ink)] md:text-4xl [text-wrap:balance]">
            {config.fit.headline}
          </h2>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-slate-700 md:text-xl md:leading-8">
            {config.fit.lead}
          </p>
          {config.fit.scopeNote ? (
            <p className="mb-6 text-sm leading-relaxed text-slate-500">
              {config.fit.scopeNote}
            </p>
          ) : null}
          <div className="grid gap-4 md:grid-cols-3">
            {config.fit.conditions.map((c) => (
              <div
                key={c.no}
                className="rounded-xl border border-[var(--lp-ink)]/10 border-t-[3px] border-t-[var(--lp-primary)] bg-white p-5"
              >
                <p className="mb-1 text-xs font-semibold tracking-wide text-[var(--lp-primary)]">
                  {c.no}
                  {c.roleLabel ? ` · ${c.roleLabel}` : ""}
                </p>
                <h3 className="mb-2 font-bold leading-snug text-[var(--lp-ink)]">
                  {c.title}
                </h3>
                <p className="text-[16px] leading-relaxed text-slate-600">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[16px] font-medium leading-relaxed text-[var(--lp-ink)]">
            {config.fit.affirm}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            {config.fit.exclude}
          </p>
        </div>
      </section>

      {/* B06 usecases */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionLabel>{config.usecases.label}</SectionLabel>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-[var(--lp-ink)] md:text-4xl [text-wrap:balance]">
            {config.usecases.headline}
          </h2>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-slate-700 md:text-xl md:leading-8">
            {config.usecases.lead}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {config.usecases.items.map((u) => (
              <div
                key={u.industry}
                className="rounded-xl border border-[var(--lp-ink)]/10 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--lp-primary)]">
                  {u.industry}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  {u.scope}
                </p>
                <p className="mt-3 rounded-xl bg-[var(--lp-primary)]/[0.07] px-4 py-3 text-[16px] font-bold leading-relaxed text-slate-900 md:text-[17px] md:leading-8">
                  「{u.quote}」
                </p>
                <p className="mt-3 text-[16px] leading-relaxed text-slate-600">
                  {u.body}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-slate-500">
            {config.usecases.more}
          </p>
        </div>
      </section>

      {/* parts catalog */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionLabel>{config.partsCatalog.label}</SectionLabel>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-[var(--lp-ink)] md:text-4xl [text-wrap:balance]">
            {config.partsCatalog.headline}
          </h2>
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-slate-700 md:text-xl md:leading-8">
            {config.partsCatalog.lead}
          </p>
          {config.partsCatalog.diagram ? (
            <Illustration
              asset={config.partsCatalog.diagram}
              className="mb-10"
            />
          ) : null}
          <div className="grid gap-4 md:grid-cols-3">
            {config.partsCatalog.items.map((part) => (
              <article
                key={part.no}
                className="flex flex-col rounded-xl border border-[var(--lp-ink)]/10 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--lp-primary)]">
                  {part.no}
                </p>
                <h3 className="mt-1 text-lg font-bold text-[var(--lp-ink)]">
                  {part.name}
                </h3>
                <p className="mt-2 flex-1 text-[16px] leading-relaxed text-slate-600">
                  {part.body}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {part.standalone === false
                    ? `先に必要: ${(part.dependsOn ?? []).join("、")}`
                    : "単独で利用できます"}
                </p>
                <div className="mt-4">
                  {part.demoUrl ? (
                    <a
                      href={part.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-slate-700 hover:text-[var(--lp-primary)] hover:underline"
                    >
                      デモを試す ↗
                    </a>
                  ) : (
                    <Link
                      href="/contact"
                      className="text-sm font-semibold text-[var(--lp-primary)] hover:underline"
                    >
                      相談する →
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 text-[16px] font-medium leading-relaxed text-[var(--lp-ink)]">
            {config.partsCatalog.closing}
          </p>
        </div>
      </section>

      {/* result tabs */}
      <section className="bg-white py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--lp-primary)]">
            {config.resultTabs.sectionLabel}
          </p>
          <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-[var(--lp-ink)] md:text-4xl [text-wrap:balance]">
            {config.resultTabs.headline}
          </h2>

          <div className="mb-4 md:hidden">
            <select
              value={tabId}
              onChange={(e) => setTabId(e.target.value)}
              className="w-full rounded-lg border border-[var(--lp-ink)]/15 bg-white px-3 py-2.5 text-[16px] font-medium text-[var(--lp-ink)]"
            >
              {config.resultTabs.tabs.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div
            className="mb-4 hidden flex-wrap justify-center gap-2 md:flex"
            role="tablist"
          >
            {config.resultTabs.tabs.map((t) => {
              const selected = t.id === tabId;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setTabId(t.id)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    selected
                      ? "bg-[var(--lp-primary)] text-white"
                      : "border border-[var(--lp-ink)]/15 text-slate-600 hover:border-[var(--lp-primary)]/40"
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {activeTab ? (
            <div role="tabpanel" className="text-center">
              <p className="mb-4 text-[16px] font-medium leading-relaxed text-[var(--lp-ink)]">
                {activeTab.caption}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeTab.image.src}
                alt={activeTab.image.alt}
                className="mx-auto w-full rounded-xl border border-[var(--lp-ink)]/10 object-cover shadow-sm"
              />
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                {activeTab.image.note ?? config.resultTabs.note}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* comparison */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-5xl overflow-x-auto px-4 sm:px-6">
          <SectionLabel>{config.comparison.label}</SectionLabel>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-[var(--lp-ink)] md:text-4xl [text-wrap:balance]">
            {config.comparison.headline}
          </h2>
          <p className="mb-6 max-w-3xl text-lg leading-relaxed text-slate-700 md:text-xl md:leading-8">
            {config.comparison.lead}
          </p>
          <table className="w-full min-w-[560px] border-collapse text-left text-[16px]">
            <thead>
              <tr className="border-b border-[var(--lp-ink)]/15">
                <th className="py-3 pr-3 font-semibold text-[var(--lp-ink)]">
                  観点
                </th>
                <th className="py-3 pr-3 font-semibold text-slate-500">
                  {config.comparison.columns.common}
                </th>
                <th className="py-3 font-semibold text-[var(--lp-primary)]">
                  {config.comparison.columns.ours}
                </th>
              </tr>
            </thead>
            <tbody>
              {config.comparison.rows.map((row) => (
                <tr
                  key={row.point}
                  className="border-b border-[var(--lp-ink)]/10 odd:bg-white/60"
                >
                  <td className="py-3 pr-3 font-medium text-[var(--lp-ink)]">
                    {row.point}
                  </td>
                  <td className="py-3 pr-3 text-slate-500">{row.common}</td>
                  <td className="py-3 font-medium text-[var(--lp-ink)]">
                    {row.ours}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            {config.comparison.fairnessNote}
          </p>
        </div>
      </section>

      {/* growth */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionLabel>{config.growth.label}</SectionLabel>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-[var(--lp-ink)] md:text-4xl [text-wrap:balance]">
            {config.growth.headline}
          </h2>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-slate-700 md:text-xl md:leading-8">
            {config.growth.lead}
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {config.growth.cycles.map((c) => (
              <div
                key={c.no}
                className="rounded-xl border border-[var(--lp-ink)]/10 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--lp-primary)]">
                  {c.no}
                </p>
                <h3 className="mt-1 font-bold text-[var(--lp-ink)]">
                  {c.title}
                </h3>
                <p className="mt-2 text-[16px] leading-relaxed text-slate-600">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[16px] leading-relaxed text-slate-600">
            {config.growth.closing}
          </p>
        </div>
      </section>

      {/* ROI interactive */}
      <IndustryLpRoiSection
        label={config.roi.label}
        headline={config.roi.headline}
        lead={config.roi.lead}
        spec={config.roi.spec}
        secondaryCta={config.finalCta.tryCta}
      />

      {/* process */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionLabel>{config.process.label}</SectionLabel>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-[var(--lp-ink)] md:text-4xl [text-wrap:balance]">
            {config.process.headline}
          </h2>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-slate-700 md:text-xl md:leading-8">
            {config.process.lead}
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {config.process.steps.map((s) => (
              <div
                key={s.no}
                className="rounded-xl border border-[var(--lp-ink)]/10 bg-white p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--lp-primary)]">
                  {s.no}
                </p>
                <h3 className="mt-1 font-bold text-[var(--lp-ink)]">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-[var(--lp-primary)]">
                  {s.costLabel}
                </p>
                <p className="mt-2 text-[16px] leading-relaxed text-slate-600">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-slate-500">
            {config.process.exitNote}
          </p>
        </div>
      </section>

      {/* FAQ — 明背景では slate 固定（text-base 禁止: 色トークン衝突） */}
      <section className="bg-white py-14 md:py-20 text-slate-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-slate-900 md:text-4xl">
            よくある質問
          </h2>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {config.faq.map((item, i) => {
              const isOpen = faqOpen === i;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-4 py-4 text-left text-slate-900"
                    onClick={() => setFaqOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-[16px] font-semibold text-slate-900 md:text-lg">
                      {item.q}
                    </span>
                    <span className="text-slate-400" aria-hidden>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen ? (
                    <p className="pb-4 text-[16px] leading-relaxed text-slate-600">
                      {item.a}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* final CTA */}
      <section
        id="final-cta"
        className="scroll-mt-24 bg-[var(--lp-ink)] py-14 text-white md:py-20"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-white md:text-4xl [text-wrap:balance]">
            {config.finalCta.headline}
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-white/90 md:text-xl md:leading-8">
            {config.finalCta.body}
          </p>
          <ul className="mb-8 flex flex-wrap gap-3 text-[16px] text-white/85">
            {config.finalCta.assurances.map((a) => (
              <li
                key={a}
                className="rounded-full border border-white/20 px-3 py-1"
              >
                {a}
              </li>
            ))}
          </ul>
          <div className="mb-8">
            <CtaLink
              cta={{ ...config.finalCta.tryCta, variant: "secondary" }}
              className="!bg-white !text-[var(--lp-ink)]"
            />
          </div>
          <div className="rounded-2xl bg-white p-6 text-[var(--lp-ink)] shadow-lg md:p-8">
            <h3 className="mb-1 text-lg font-bold text-[var(--lp-primary)]">
              {config.finalCta.contactLabel}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-500">
              入力は約1分です。1営業日以内にご連絡します。
            </p>
            <Link
              href={config.finalCta.contactHref}
              className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--lp-primary)] px-5 py-3.5 text-sm font-bold text-white hover:opacity-90"
            >
              相談する
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--lp-ink)]/10 bg-white py-8 text-center text-sm text-slate-500">
        <p>AXEON</p>
        <Link
          href="/contact"
          className="mt-2 inline-block text-[var(--lp-primary)]"
        >
          お問い合わせ
        </Link>
      </footer>
    </div>
  );
}
