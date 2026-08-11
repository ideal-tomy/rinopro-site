"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { IndustryLpConfig, IndustryLpCta } from "@/lib/content/industry-lp/types";
import { cn } from "@/lib/utils";

function CtaButton({
  cta,
  className,
}: {
  cta: IndustryLpCta;
  className?: string;
}) {
  const base =
    cta.variant === "primary"
      ? "bg-[var(--color-accent-primary)] text-white hover:opacity-95"
      : "border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] text-[var(--color-text-primary)] hover:border-[var(--color-accent-primary)]/50";
  const classNames = cn(
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-bold transition",
    base,
    className
  );
  if (cta.external) {
    return (
      <a
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer"
        className={classNames}
      >
        {cta.label}
      </a>
    );
  }
  return (
    <Link href={cta.href} className={classNames}>
      {cta.label}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-bold tracking-[0.14em] text-[var(--color-accent-primary)]">
      {children}
    </p>
  );
}

function SectionShell({
  id,
  children,
  tone = "default",
}: {
  id?: string;
  children: React.ReactNode;
  tone?: "default" | "mute" | "pure";
}) {
  const bg =
    tone === "mute"
      ? "bg-[var(--color-bg-warm,var(--color-bg))]"
      : tone === "pure"
        ? "bg-[var(--color-bg-pure)]"
        : "bg-transparent";
  return (
    <section
      id={id}
      className={cn("border-b border-[var(--color-border-light)]", bg)}
    >
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-20">{children}</div>
    </section>
  );
}

export function IndustryLpPage({ config }: { config: IndustryLpConfig }) {
  const [tabId, setTabId] = useState(config.resultTabs.tabs[0]?.id ?? "");
  const activeTab =
    config.resultTabs.tabs.find((t) => t.id === tabId) ??
    config.resultTabs.tabs[0];

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <header className="sticky top-0 z-30 border-b border-[var(--color-border-light)] bg-[var(--color-bg-pure)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <span className="truncate text-sm font-semibold">
            {config.demoName}
          </span>
          <CtaButton cta={config.hero.ctas[0]} className="!py-2 text-xs sm:text-sm" />
        </div>
      </header>

      {/* Hero */}
      <SectionShell tone="pure">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.25] tracking-tight">
              {config.hero.headline}
            </h1>
            <p className="mt-4 text-base font-semibold leading-relaxed text-[var(--color-text-secondary)] md:text-lg">
              {config.hero.subline}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-text-secondary)] md:text-base">
              {config.hero.body}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaButton cta={config.hero.ctas[0]} />
              <CtaButton cta={config.hero.ctas[1]} />
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[var(--color-bg)]">
            <Image
              src={config.hero.visual.src}
              alt={config.hero.visual.alt}
              fill
              priority
              className={
                config.hero.visual.fit === "cover"
                  ? "object-cover"
                  : "object-contain p-2"
              }
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {config.hero.visual.note ? (
              <p className="absolute bottom-2 right-3 text-[11px] text-[var(--color-text-secondary)]">
                {config.hero.visual.note}
              </p>
            ) : null}
          </div>
        </div>
      </SectionShell>

      {/* Impact */}
      <SectionShell>
        <p className="text-[15px] leading-relaxed md:text-base">
          {config.impact.mainFigure.lead}{" "}
          <span className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[var(--color-accent-primary)]">
            {config.impact.mainFigure.value}
          </span>{" "}
          {config.impact.mainFigure.trail}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-secondary)]">
          {config.impact.basis}
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {config.impact.metrics.map((m) => (
            <li
              key={m.label}
              className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-4"
            >
              <p className="text-xl font-bold">{m.value}</p>
              <p className="mt-1 text-xs leading-snug text-[var(--color-text-secondary)]">
                {m.label}
              </p>
            </li>
          ))}
        </ul>
      </SectionShell>

      {/* Problem */}
      <SectionShell>
        <SectionLabel>{config.problem.label}</SectionLabel>
        <h2 className="text-[clamp(1.35rem,3vw,2rem)] font-bold leading-snug">
          {config.problem.headline}
        </h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          {config.problem.lead}
        </p>
        {config.problem.diagram ? (
          <div className="relative mt-8 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-xl bg-[var(--color-bg-pure)]">
            <Image
              src={config.problem.diagram.src}
              alt={config.problem.diagram.alt}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
        ) : null}
        <ol className="mt-8 grid gap-4 sm:grid-cols-2">
          {config.problem.items.map((item) => (
            <li
              key={item.no}
              className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-5"
            >
              <p className="font-mono text-xs font-bold text-[var(--color-text-secondary)]">
                {item.no}
              </p>
              <h3 className="mt-1 text-base font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-8 rounded-xl border border-[var(--color-accent-primary)]/25 bg-[var(--color-bg-pure)] p-5">
          <p className="font-bold leading-snug">{config.problem.summary.headline}</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {config.problem.summary.body}
          </p>
        </div>
      </SectionShell>

      {/* Recurring */}
      <SectionShell tone="mute">
        <SectionLabel>{config.recurringProblems.label}</SectionLabel>
        <h2 className="text-[clamp(1.35rem,3vw,2rem)] font-bold leading-snug">
          {config.recurringProblems.headline}
        </h2>
        <div className="relative mt-8 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-xl bg-[var(--color-bg-pure)]">
          <Image
            src={config.recurringProblems.diagram.src}
            alt={config.recurringProblems.diagram.alt}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>
        <p className="mt-6 font-semibold leading-relaxed">
          {config.recurringProblems.closing.line1}
        </p>
        {config.recurringProblems.closing.line2 ? (
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {config.recurringProblems.closing.line2}
          </p>
        ) : null}
      </SectionShell>

      {/* Fit */}
      <SectionShell>
        <SectionLabel>{config.fit.label}</SectionLabel>
        <h2 className="text-[clamp(1.35rem,3vw,2rem)] font-bold leading-snug">
          {config.fit.headline}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          {config.fit.lead}
        </p>
        {config.fit.scopeNote ? (
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {config.fit.scopeNote}
          </p>
        ) : null}
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {config.fit.conditions.map((c) => (
            <li
              key={c.no}
              className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-5"
            >
              {c.roleLabel ? (
                <p className="text-xs font-bold text-[var(--color-accent-primary)]">
                  {c.roleLabel}
                </p>
              ) : null}
              <h3 className="mt-1 text-base font-bold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {c.body}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm font-semibold leading-relaxed">
          {config.fit.affirm}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {config.fit.exclude}
        </p>
      </SectionShell>

      {/* Usecases */}
      <SectionShell tone="pure">
        <SectionLabel>{config.usecases.label}</SectionLabel>
        <h2 className="text-[clamp(1.35rem,3vw,2rem)] font-bold leading-snug">
          {config.usecases.headline}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          {config.usecases.lead}
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {config.usecases.items.map((item) => (
            <li
              key={item.industry}
              className="rounded-xl border border-[var(--color-border-light)] p-5"
            >
              <p className="text-sm font-bold">{item.industry}</p>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                {item.scope}
              </p>
              <p className="mt-3 text-sm font-medium leading-relaxed text-[var(--color-accent-primary)]">
                「{item.quote}」
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
          {config.usecases.more}
        </p>
      </SectionShell>

      {/* Parts */}
      <SectionShell>
        <SectionLabel>{config.partsCatalog.label}</SectionLabel>
        <h2 className="text-[clamp(1.35rem,3vw,2rem)] font-bold leading-snug">
          {config.partsCatalog.headline}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          {config.partsCatalog.lead}
        </p>
        {config.partsCatalog.diagram ? (
          <div className="relative mt-8 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-xl bg-[var(--color-bg-pure)]">
            <Image
              src={config.partsCatalog.diagram.src}
              alt={config.partsCatalog.diagram.alt}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
        ) : null}
        <ul className="mt-8 space-y-4">
          {config.partsCatalog.items.map((item) => (
            <li
              key={item.no}
              className="flex flex-col gap-3 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <p className="font-mono text-xs font-bold text-[var(--color-text-secondary)]">
                  {item.no}
                </p>
                <h3 className="mt-1 text-base font-bold">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {item.body}
                </p>
              </div>
              {item.demoUrl ? (
                <a
                  href={item.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-sm font-bold text-[var(--color-accent-primary)] underline-offset-4 hover:underline"
                >
                  デモを開く ↗
                </a>
              ) : (
                <Link
                  href="/contact"
                  className="shrink-0 text-sm font-bold text-[var(--color-accent-primary)] underline-offset-4 hover:underline"
                >
                  相談する →
                </Link>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
          {config.partsCatalog.closing}
        </p>
      </SectionShell>

      {/* Result tabs */}
      <SectionShell tone="mute">
        <SectionLabel>{config.resultTabs.sectionLabel}</SectionLabel>
        <h2 className="text-[clamp(1.35rem,3vw,2rem)] font-bold leading-snug">
          {config.resultTabs.headline}
        </h2>
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
          {config.resultTabs.note}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {config.resultTabs.tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTabId(tab.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                tab.id === activeTab?.id
                  ? "bg-[var(--color-accent-primary)] text-white"
                  : "border border-[var(--color-border-light)] bg-[var(--color-bg-pure)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 md:items-center">
            <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
              {activeTab.caption}
            </p>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--color-bg-pure)]">
              <Image
                src={activeTab.image.src}
                alt={activeTab.image.alt}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        ) : null}
      </SectionShell>

      {/* Comparison */}
      <SectionShell>
        <SectionLabel>{config.comparison.label}</SectionLabel>
        <h2 className="text-[clamp(1.35rem,3vw,2rem)] font-bold leading-snug">
          {config.comparison.headline}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          {config.comparison.lead}
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border-light)]">
                <th className="py-3 pr-3 font-semibold">観点</th>
                <th className="py-3 pr-3 font-semibold text-[var(--color-text-secondary)]">
                  {config.comparison.columns.common}
                </th>
                <th className="py-3 font-semibold text-[var(--color-accent-primary)]">
                  {config.comparison.columns.ours}
                </th>
              </tr>
            </thead>
            <tbody>
              {config.comparison.rows.map((row) => (
                <tr
                  key={row.point}
                  className="border-b border-[var(--color-border-light)] align-top"
                >
                  <td className="py-3 pr-3 font-medium">{row.point}</td>
                  <td className="py-3 pr-3 text-[var(--color-text-secondary)]">
                    {row.common}
                  </td>
                  <td className="py-3">{row.ours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-[var(--color-text-secondary)]">
          {config.comparison.fairnessNote}
        </p>
      </SectionShell>

      {/* Growth */}
      <SectionShell tone="pure">
        <SectionLabel>{config.growth.label}</SectionLabel>
        <h2 className="text-[clamp(1.35rem,3vw,2rem)] font-bold leading-snug">
          {config.growth.headline}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          {config.growth.lead}
        </p>
        <ol className="mt-8 space-y-4">
          {config.growth.cycles.map((c) => (
            <li
              key={c.no}
              className="rounded-xl border border-[var(--color-border-light)] p-5"
            >
              <p className="font-mono text-xs font-bold text-[var(--color-text-secondary)]">
                {c.no}
              </p>
              <h3 className="mt-1 font-bold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {c.body}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm font-semibold">{config.growth.closing}</p>
      </SectionShell>

      {/* ROI summary */}
      <SectionShell id="roi">
        <SectionLabel>{config.roiSummary.label}</SectionLabel>
        <h2 className="text-[clamp(1.35rem,3vw,2rem)] font-bold leading-snug">
          {config.roiSummary.headline}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          {config.roiSummary.lead}
        </p>
        <p className="mt-6 text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-[var(--color-accent-primary)]">
          {config.roiSummary.figureValue}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-secondary)]">
          {config.roiSummary.basis}
        </p>
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
          {config.roiSummary.disclaimer}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CtaButton
            cta={{
              label: "試算・導入について相談する",
              href: "/contact",
              variant: "primary",
            }}
          />
          <CtaButton cta={config.finalCta.tryCta} />
        </div>
      </SectionShell>

      {/* Process */}
      <SectionShell tone="mute">
        <SectionLabel>{config.process.label}</SectionLabel>
        <h2 className="text-[clamp(1.35rem,3vw,2rem)] font-bold leading-snug">
          {config.process.headline}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          {config.process.lead}
        </p>
        <ol className="mt-8 space-y-4">
          {config.process.steps.map((s) => (
            <li
              key={s.no}
              className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs font-bold text-[var(--color-text-secondary)]">
                  {s.no}
                </span>
                <span className="rounded-full bg-[var(--color-accent-primary)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--color-accent-primary)]">
                  {s.costLabel}
                </span>
              </div>
              <h3 className="mt-2 font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
          {config.process.exitNote}
        </p>
      </SectionShell>

      {/* FAQ */}
      <SectionShell>
        <SectionLabel>FAQ</SectionLabel>
        <h2 className="text-[clamp(1.35rem,3vw,2rem)] font-bold leading-snug">
          よくある質問
        </h2>
        <div className="mt-8 space-y-3">
          {config.faq.map((item) => (
            <details
              key={item.q}
              open={item.defaultOpen}
              className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-5 py-4"
            >
              <summary className="cursor-pointer list-none font-semibold marker:content-none">
                {item.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </SectionShell>

      {/* Final CTA */}
      <SectionShell id="final-cta" tone="pure">
        <h2 className="text-[clamp(1.35rem,3vw,2rem)] font-bold leading-snug">
          {config.finalCta.headline}
        </h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          {config.finalCta.body}
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {config.finalCta.assurances.map((a) => (
            <li
              key={a}
              className="rounded-full border border-[var(--color-border-light)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]"
            >
              {a}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CtaButton
            cta={{
              label: config.finalCta.contactLabel,
              href: config.finalCta.contactHref,
              variant: "primary",
            }}
          />
          <CtaButton cta={config.finalCta.tryCta} />
        </div>
      </SectionShell>
    </div>
  );
}
