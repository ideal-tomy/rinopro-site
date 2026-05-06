import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AboutSectionHeader } from "@/components/about/AboutSectionHeader";
import { aboutCopy } from "@/lib/content/site-copy";
import { cn } from "@/lib/utils";

const sectionShell =
  "container mx-auto max-w-6xl px-4 md:px-6 py-24 md:py-[100px]";
const proseBody =
  "text-[16px] leading-[1.8] text-[var(--color-text-secondary)] md:text-[17px]";
const cardShell =
  "rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 md:p-8";

export function AboutPageContent() {
  const {
    hero,
    founding,
    leaderProfiles,
    principles,
    background,
    approach,
    teamModel,
    scope,
    company,
    cta,
  } = aboutCopy;

  return (
    <div className="about-page-content">
      {/* 1 ヒーロー */}
      <section
        className={cn(sectionShell, "scroll-mt-32")}
        aria-labelledby="about-hero-heading"
      >
        <div className="mx-auto max-w-3xl text-left">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-primary)] md:text-[13px]">
            {hero.kicker}
          </p>
          <h1
            id="about-hero-heading"
            className="mt-4 text-balance font-bold tracking-tight text-[var(--color-text-primary)] text-[clamp(1.875rem,4.2vw,2.75rem)] leading-[1.2]"
          >
            {hero.headline}
          </h1>
          <div
            className="mt-6 h-px max-w-[120px] bg-gradient-to-r from-[var(--color-accent-primary)]/55 via-[var(--color-accent-primary)]/35 to-transparent"
            aria-hidden
          />
          <p className={cn("mt-8 max-w-2xl whitespace-pre-line", proseBody)}>
            {hero.sub}
          </p>
        </div>
      </section>

      <hr className="mx-auto h-px max-w-6xl border-0 bg-gradient-to-r from-transparent via-[var(--color-border-light)] to-transparent px-4" />

      {/* 創業の経緯 */}
      <section
        className={cn(sectionShell, "scroll-mt-32")}
        aria-labelledby="about-founding-heading"
      >
        <AboutSectionHeader
          id="about-founding-heading"
          kicker={founding.kicker}
          title={founding.heading}
        />
        <div className="mx-auto max-w-3xl space-y-5 md:space-y-6">
          {founding.paragraphs.map((p, i) => (
            <p key={i} className={proseBody}>
              {p}
            </p>
          ))}
        </div>
      </section>

      <hr className="mx-auto h-px max-w-6xl border-0 bg-gradient-to-r from-transparent via-[var(--color-border-light)] to-transparent px-4" />

      {/* 代表・技術責任者 */}
      <section
        className={cn(sectionShell, "scroll-mt-32")}
        aria-labelledby="about-leaders-heading"
      >
        <AboutSectionHeader
          id="about-leaders-heading"
          kicker={leaderProfiles.kicker}
          title={leaderProfiles.heading}
          description={leaderProfiles.intro}
        />
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2 lg:gap-8">
          {leaderProfiles.profiles.map((profile) => (
            <article key={profile.title} className={cn(cardShell, "flex h-full flex-col")}>
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-primary)] md:text-sm">
                {profile.title}
              </p>
              <p className="mt-3 text-lg font-bold text-[var(--color-text-primary)] md:text-xl">
                {profile.name}
              </p>
              <p className={cn(proseBody, "mt-5 flex-1 border-t border-[var(--color-border-light)] pt-5")}>
                {profile.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <hr className="mx-auto h-px max-w-6xl border-0 bg-gradient-to-r from-transparent via-[var(--color-border-light)] to-transparent px-4" />

      {/* 3つの考え方 */}
      <section
        id="about-principles"
        className={cn(sectionShell, "scroll-mt-32")}
        aria-labelledby="about-principles-heading"
      >
        <AboutSectionHeader
          id="about-principles-heading"
          kicker={principles.kicker}
          title={principles.heading}
        />
        <ul className="mx-auto grid list-none gap-6 lg:grid-cols-3 lg:gap-8">
          {principles.items.map((item) => (
            <li key={item.index}>
              <article className={cn(cardShell, "flex h-full flex-col")}>
                <p className="font-mono text-[13px] font-medium tabular-nums tracking-widest text-[var(--color-accent-primary)] md:text-sm">
                  {item.index}
                </p>
                <h3 className="mt-4 text-xl font-bold leading-snug text-[var(--color-text-primary)] md:text-2xl">
                  {item.title}
                </h3>
                <p
                  className={cn(
                    proseBody,
                    "mt-5 flex-1 whitespace-pre-line border-t border-[var(--color-border-light)] pt-5"
                  )}
                >
                  {item.body}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <hr className="mx-auto h-px max-w-6xl border-0 bg-gradient-to-r from-transparent via-[var(--color-border-light)] to-transparent px-4" />

      {/* 3 背景 */}
      <section
        className={cn(sectionShell, "scroll-mt-32")}
        aria-labelledby="about-background-heading"
      >
        <AboutSectionHeader
          id="about-background-heading"
          kicker={background.kicker}
          title={background.heading}
        />
        <div className="mx-auto max-w-3xl space-y-5 md:space-y-6">
          {background.paragraphs.map((p, i) => (
            <p key={i} className={proseBody}>
              {p}
            </p>
          ))}
        </div>
      </section>

      <hr className="mx-auto h-px max-w-6xl border-0 bg-gradient-to-r from-transparent via-[var(--color-border-light)] to-transparent px-4" />

      {/* 4 アプローチ */}
      <section
        className={cn(sectionShell, "scroll-mt-32")}
        aria-labelledby="about-approach-heading"
      >
        <AboutSectionHeader
          id="about-approach-heading"
          kicker={approach.kicker}
          title={approach.heading}
          description={approach.intro}
        />
        <div className="grid gap-6 lg:grid-cols-4">
          {approach.steps.map((step) => (
            <article key={step.stepIndex} className={cardShell}>
              <div className="flex flex-wrap items-baseline gap-2 gap-y-1">
                <span className="font-mono text-xs font-medium tabular-nums text-accent md:text-[13px]">
                  STEP {step.stepIndex}
                </span>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] md:text-xl">
                  {step.title}
                </h3>
                <span className="text-[13px] text-[var(--color-text-tertiary)] md:text-[14px]">
                  {step.duration}
                </span>
              </div>
              <div className="mt-6 space-y-5 border-t border-[var(--color-border-light)] pt-6">
                <div>
                  <h4 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent-primary)]">
                    {approach.consultLabel}
                  </h4>
                  <ul className="mt-2 list-disc space-y-2 pl-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)] marker:text-[var(--color-accent-primary)]/70 md:text-[16px] md:leading-[1.75]">
                    {step.consult.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent-primary)]">
                    {approach.techLabel}
                  </h4>
                  <ul className="mt-2 list-disc space-y-2 pl-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)] marker:text-[var(--color-accent-primary)]/70 md:text-[16px] md:leading-[1.75]">
                    {step.tech.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <hr className="mx-auto h-px max-w-6xl border-0 bg-gradient-to-r from-transparent via-[var(--color-border-light)] to-transparent px-4" />

      {/* 5 標準体制 */}
      <section
        className={cn(sectionShell, "scroll-mt-32")}
        aria-labelledby="about-team-heading"
      >
        <AboutSectionHeader
          id="about-team-heading"
          kicker={teamModel.kicker}
          title={teamModel.heading}
          description={teamModel.intro}
        />
        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:justify-center lg:gap-0 lg:divide-x lg:divide-[var(--color-border-light)]">
          <div className="flex-1 lg:max-w-md lg:pr-8">
            <article className={cn(cardShell, "h-full")}>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] md:text-xl">
                {teamModel.strategyLead.title}
              </h3>
              <ul className="mt-6 space-y-3 text-[16px] leading-[1.7] text-[var(--color-text-secondary)] md:text-[17px]">
                {teamModel.strategyLead.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-[var(--color-accent-primary)]/80" aria-hidden>
                      ・
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
          <div className="flex shrink-0 flex-col items-center justify-center gap-2 px-4 py-3 lg:w-44 lg:py-0">
            <div
              className="hidden lg:block lg:h-full lg:min-h-[48px] lg:w-px lg:bg-gradient-to-b lg:from-transparent lg:via-accent/35 lg:to-transparent"
              aria-hidden
            />
            <p className="text-center text-[13px] font-semibold leading-snug tracking-wide text-[var(--color-accent-primary)] md:text-[14px]">
              {teamModel.fusionLabel}
            </p>
            <div
              className="hidden lg:block lg:h-full lg:min-h-[48px] lg:w-px lg:bg-gradient-to-b lg:from-transparent lg:via-accent/35 lg:to-transparent"
              aria-hidden
            />
          </div>
          <div className="flex-1 lg:max-w-md lg:pl-8">
            <article className={cn(cardShell, "h-full")}>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] md:text-xl">
                {teamModel.aiEngineeringLead.title}
              </h3>
              <ul className="mt-6 space-y-3 text-[16px] leading-[1.7] text-[var(--color-text-secondary)] md:text-[17px]">
                {teamModel.aiEngineeringLead.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-[var(--color-accent-primary)]/80" aria-hidden>
                      ・
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-3xl space-y-5 md:mt-14">
          {teamModel.footnotes.map((note, i) => (
            <p key={i} className={proseBody}>
              {note}
            </p>
          ))}
        </div>
      </section>

      <hr className="mx-auto h-px max-w-6xl border-0 bg-gradient-to-r from-transparent via-[var(--color-border-light)] to-transparent px-4" />

      {/* 6 対応可能領域 */}
      <section
        className={cn(sectionShell, "scroll-mt-32")}
        aria-labelledby="about-scope-heading"
      >
        <AboutSectionHeader
          id="about-scope-heading"
          kicker={scope.kicker}
          title={scope.heading}
        />
        <dl className="mx-auto divide-y divide-[var(--color-border-light)] rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-6 py-2 md:max-w-3xl md:px-8">
          {scope.rows.map((row) => (
            <div
              key={row.label}
              className="grid gap-2 py-5 sm:grid-cols-[minmax(9rem,11rem)_1fr] sm:gap-8 md:grid-cols-[12rem_1fr]"
            >
              <dt className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent-primary)] md:text-sm">
                {row.label}
              </dt>
              <dd className={cn(proseBody, "text-[15px] md:text-[16px]")}>
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <hr className="mx-auto h-px max-w-6xl border-0 bg-gradient-to-r from-transparent via-[var(--color-border-light)] to-transparent px-4" />

      {/* 7 会社概要 */}
      <section
        className={cn(sectionShell, "scroll-mt-32")}
        aria-labelledby="about-company-heading"
      >
        <AboutSectionHeader
          id="about-company-heading"
          kicker={company.kicker}
          title={company.heading}
        />
        <dl className="mx-auto divide-y divide-[var(--color-border-light)] rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-6 py-2 md:max-w-3xl md:px-8">
          {company.rows.map((row) => (
            <div
              key={row.label}
              className="grid gap-2 py-5 sm:grid-cols-[minmax(8rem,10rem)_1fr] sm:gap-8"
            >
              <dt className="text-[13px] font-semibold text-[var(--color-text-primary)] md:text-sm">
                {row.label}
              </dt>
              <dd className={cn(proseBody, "text-[15px] md:text-[16px]")}>
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 8 CTA */}
      <section
        className={cn(sectionShell, "scroll-mt-32 pb-28 md:pb-32")}
        aria-labelledby="about-cta-heading"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="about-cta-heading"
            className="text-balance font-bold tracking-tight text-[var(--color-text-primary)] text-[clamp(1.5rem,3.4vw,2.25rem)] leading-snug"
          >
            {cta.heading}
          </h2>
          <div
            className="mx-auto mt-6 h-px max-w-[120px] bg-gradient-to-r from-transparent via-[var(--color-accent-primary)]/50 to-transparent md:mt-8"
            aria-hidden
          />
          <p className={cn("mt-8 text-balance md:mt-10", proseBody)}>
            {cta.sub}
          </p>
          <div className="mt-10 flex w-full flex-col justify-center gap-4 sm:flex-row sm:gap-5 md:mt-12">
            <Button
              asChild
              size="lg"
              className="w-full min-h-11 px-8 sm:w-auto sm:min-w-[260px]"
            >
              <Link href={cta.primaryHref}>{cta.primaryLabel}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full min-h-11 sm:w-auto sm:min-w-[220px]"
            >
              <Link href={cta.secondaryHref}>{cta.secondaryLabel}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
