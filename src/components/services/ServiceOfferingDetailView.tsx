import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IllustrationReveal } from "@/components/illustrations/illustration-reveal";
import { HomeSectionShell } from "@/components/home/HomeSectionShell";
import { Button } from "@/components/ui/button";
import { homeLandingCtaButtonClass } from "@/lib/content/home-landing-styles";
import type { ServiceOfferingDetail } from "@/lib/content/service-offerings";
import { INDUSTRY_SHOWCASE_ITEMS } from "@/lib/content/industry-showcase";
import { ServiceOfferingImprovementCycleDiagram } from "@/components/illustrations/service-offering-improvement-cycle";
import { ServiceOfferingDataStackDiagram } from "@/components/illustrations/service-offering-data-stack";
import { ServiceJourneyDiagram } from "@/components/services/ServiceJourneyDiagram";

type ServiceOfferingDetailViewProps = {
  offering: ServiceOfferingDetail;
};

function contactHref(query?: string): string {
  if (!query) return "/contact";
  return `/contact?${query}`;
}

function EmphasisText({ text }: { text: string }) {
  const segments = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.startsWith("**") && seg.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-[var(--color-text-primary)]">
              {seg.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{seg}</span>;
      })}
    </>
  );
}

export function ServiceOfferingDetailView({ offering }: ServiceOfferingDetailViewProps) {
  const { hero, why, issues, journey, pitfalls, outcomes, relatedLinks } = offering;

  return (
    <div className="home-landing-copy">
      <HomeSectionShell tone="pure">
        <header className="container mx-auto max-w-4xl px-4 pb-12 pt-16 text-center md:px-6 md:pb-16 md:pt-24">
          <p className="text-[13px] font-semibold tracking-[0.18em] text-[var(--color-accent-primary)] md:text-sm">
            {hero.eyebrow}
          </p>
          <h1 className="mt-4 text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-snug tracking-tight text-[var(--color-text-primary)]">
            {hero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-[46ch] text-[17px] leading-[1.8] text-[var(--color-text-secondary)] md:text-[18px]">
            {hero.lead}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <Button asChild className={homeLandingCtaButtonClass}>
              <Link href={contactHref(hero.contactQuery)}>
                <span className="inline-flex items-center gap-2">
                  このサービスについて相談する
                  <ArrowRight className="size-5" aria-hidden />
                </span>
              </Link>
            </Button>
            <Button asChild variant="outline" className={homeLandingCtaButtonClass}>
              <Link href="/services">サービスハブへ</Link>
            </Button>
          </div>
        </header>
      </HomeSectionShell>

      <HomeSectionShell tone="neutral">
        <section
          className="container mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24"
          aria-labelledby="offering-why-heading"
        >
          <h2
            id="offering-why-heading"
            className="text-center text-[clamp(1.35rem,3vw,1.85rem)] font-bold text-[var(--color-text-primary)]"
          >
            {why.heading}
          </h2>
          <div className="mx-auto mt-8 max-w-3xl space-y-5 text-[16px] leading-[1.85] text-[var(--color-text-secondary)] md:mt-10 md:text-[17px]">
            {why.paragraphs.map((p, i) => (
              <p key={i}>
                <EmphasisText text={p} />
              </p>
            ))}
          </div>
          {why.callouts?.length ? (
            <ul className="mx-auto mt-10 grid max-w-4xl list-none gap-4 md:mt-12 md:grid-cols-2">
              {why.callouts.map((c) => (
                <li
                  key={c.label}
                  className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]"
                >
                  <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-primary)] md:text-sm">
                    {c.label}
                  </p>
                  <p className="mt-3 text-[16px] leading-[1.8] text-[var(--color-text-secondary)]">{c.text}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </HomeSectionShell>

      <HomeSectionShell tone="pure">
        <section
          className="container mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24"
          aria-labelledby="offering-issues-heading"
        >
          <h2
            id="offering-issues-heading"
            className="text-center text-[clamp(1.35rem,3vw,1.85rem)] font-bold text-[var(--color-text-primary)]"
          >
            {issues.heading}
          </h2>
          <ul className="mt-10 grid list-none gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
            {issues.cards.map((card) => (
              <li
                key={card.title}
                className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)] md:p-7"
              >
                <h3 className="text-[17px] font-semibold text-[var(--color-text-primary)] md:text-lg">{card.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:text-[16px]">{card.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </HomeSectionShell>

      <HomeSectionShell tone="neutral">
        <section
          className="container mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24"
          aria-labelledby="offering-journey-heading"
        >
          <h2
            id="offering-journey-heading"
            className="text-center text-[clamp(1.35rem,3vw,1.85rem)] font-bold text-[var(--color-text-primary)]"
          >
            {journey.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-center text-[16px] leading-[1.85] text-[var(--color-text-secondary)] md:mt-8 md:text-[17px]">
            {journey.intro}
          </p>
          <IllustrationReveal className="mt-12 md:mt-14">
            <ServiceJourneyDiagram steps={journey.steps} />
          </IllustrationReveal>
          {offering.slug === "data-platform" ? (
            <IllustrationReveal className="mx-auto mt-14 max-w-2xl md:mt-16">
              <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 md:p-8">
                <p className="text-center text-[15px] font-semibold text-[var(--color-text-primary)] md:text-[16px]">
                  データの流れと役割のイメージ
                </p>
                <p className="mx-auto mt-2 max-w-[40ch] text-center text-[14px] leading-[1.75] text-[var(--color-text-tertiary)] md:text-[15px]">
                  実際の構成は御社の既存システムと規制に合わせて設計します。ここは役割の整理用の抽象図です。
                </p>
                <div className="mt-6 flex justify-center">
                  <ServiceOfferingDataStackDiagram />
                </div>
              </div>
            </IllustrationReveal>
          ) : null}
          {offering.slug === "continuous-improvement" ? (
            <IllustrationReveal className="mx-auto mt-14 max-w-2xl md:mt-16">
              <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 md:p-8">
                <p className="text-center text-[15px] font-semibold text-[var(--color-text-primary)] md:text-[16px]">
                  改善サイクル（イメージ）
                </p>
                <p className="mx-auto mt-2 max-w-[40ch] text-center text-[14px] leading-[1.75] text-[var(--color-text-tertiary)] md:text-[15px]">
                  計測・レビュー・実装・振り返りを回すときの関係性を簡略化しています。
                </p>
                <div className="mt-6 flex justify-center">
                  <ServiceOfferingImprovementCycleDiagram />
                </div>
              </div>
            </IllustrationReveal>
          ) : null}
        </section>
      </HomeSectionShell>

      <HomeSectionShell tone="pure">
        <section
          className="container mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24"
          aria-labelledby="offering-pitfalls-heading"
        >
          <h2
            id="offering-pitfalls-heading"
            className="text-center text-[clamp(1.35rem,3vw,1.85rem)] font-bold text-[var(--color-text-primary)]"
          >
            {pitfalls.heading}
          </h2>
          <div className="mt-10 grid gap-8 md:mt-12 md:grid-cols-2 md:gap-10">
            <div className="rounded-2xl border border-[var(--color-border-light)] border-l-4 border-l-orange-400/60 bg-[var(--color-bg-neutral)] p-6 md:p-8">
              <h3 className="text-[17px] font-semibold text-[var(--color-text-primary)] md:text-lg">{pitfalls.stumblingTitle}</h3>
              <ul className="mt-5 list-disc space-y-3 pl-5 text-[15px] leading-[1.85] text-[var(--color-text-secondary)] marker:text-[var(--color-accent-primary)] md:text-[16px]">
                {pitfalls.stumblingItems.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[var(--color-border-light)] border-l-4 border-l-accent/60 bg-[var(--color-bg-pure)] p-6 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)] md:p-8">
              <h3 className="text-[17px] font-semibold text-[var(--color-text-primary)] md:text-lg">{pitfalls.supportTitle}</h3>
              <ul className="mt-5 list-disc space-y-3 pl-5 text-[15px] leading-[1.85] text-[var(--color-text-secondary)] marker:text-[var(--color-accent-primary)] md:text-[16px]">
                {pitfalls.supportItems.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </HomeSectionShell>

      <HomeSectionShell tone="neutral">
        <section
          className="container mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24"
          aria-labelledby="offering-outcomes-heading"
        >
          <h2
            id="offering-outcomes-heading"
            className="text-center text-[clamp(1.35rem,3vw,1.85rem)] font-bold text-[var(--color-text-primary)]"
          >
            {outcomes.heading}
          </h2>
          <ul className="mx-auto mt-8 max-w-3xl list-none space-y-4 md:mt-10">
            {outcomes.bullets.map((line) => (
              <li
                key={line}
                className="flex gap-3 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-5 py-4 text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:text-[16px]"
              >
                <span className="mt-2 size-2 shrink-0 rounded-full bg-[var(--color-accent-primary)]" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-8 max-w-3xl text-[12px] font-semibold tracking-[0.12em] text-[var(--color-accent-primary)] md:mt-10 md:text-[13px]">
            将来像
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-[16px] leading-[1.9] text-[var(--color-text-secondary)] md:mt-4 md:text-[17px]">
            {outcomes.futureParagraph}
          </p>
        </section>
      </HomeSectionShell>

      {offering.showIndustryGrid ? (
        <HomeSectionShell tone="pure">
          <section
            className="container mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24"
            aria-labelledby="offering-industry-hub-heading"
          >
            <h2
              id="offering-industry-hub-heading"
              className="text-center text-[clamp(1.35rem,3vw,1.85rem)] font-bold text-[var(--color-text-primary)]"
            >
              業種別のヒントと事例導線
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-center text-[16px] leading-[1.85] text-[var(--color-text-secondary)] md:mt-8 md:text-[17px]">
              各業界ページでは、よくある負荷と改善の考え方、関連デモへのリンクをまとめています。
            </p>
            <ul className="mt-10 grid list-none gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
              {INDUSTRY_SHOWCASE_ITEMS.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={item.hubPath}
                    className="group interactive-card flex h-full flex-col rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)] transition-colors hover:border-[var(--color-accent-primary)] md:p-7"
                  >
                    <span className="text-[15px] font-semibold text-[var(--color-accent-primary)] md:text-[16px]">
                      {item.label}
                    </span>
                    <span className="mt-2 text-[15px] leading-[1.75] text-[var(--color-text-secondary)] md:text-[16px]">
                      {item.tagline}
                    </span>
                    <span className="mt-4 text-[15px] font-semibold text-[var(--color-accent-primary)] underline-offset-4 group-hover:underline">
                      業界ページへ
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </HomeSectionShell>
      ) : null}

      <HomeSectionShell tone="pure">
        <section
          className="container mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24"
          aria-labelledby="offering-related-heading"
        >
          <h2
            id="offering-related-heading"
            className="text-center text-[clamp(1.25rem,2.8vw,1.65rem)] font-bold text-[var(--color-text-primary)]"
          >
            {relatedLinks.heading}
          </h2>
          <ul className="mx-auto mt-8 flex max-w-xl flex-col gap-3 md:mt-10">
            {relatedLinks.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)] px-5 py-4 text-[16px] font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent-primary)]/35"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="size-5 shrink-0 text-[var(--color-accent-primary)]" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </HomeSectionShell>

      <HomeSectionShell>
        <footer className="container mx-auto max-w-3xl px-4 pb-24 pt-4 text-center md:px-6 md:pb-32">
          <Button asChild className={homeLandingCtaButtonClass}>
            <Link href={contactHref(hero.contactQuery)}>相談する</Link>
          </Button>
        </footer>
      </HomeSectionShell>
    </div>
  );
}
