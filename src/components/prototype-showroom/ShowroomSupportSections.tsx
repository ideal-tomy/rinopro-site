import type { ReactNode } from "react";
import Link from "next/link";
import { IllustrationReveal } from "@/components/illustrations/illustration-reveal";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { HomeSectionShell } from "@/components/home/HomeSectionShell";
import { Button } from "@/components/ui/button";
import { homeLandingCtaButtonClass } from "@/lib/content/home-landing-styles";
import {
  PROTOTYPE_SHOWROOM_COLLABORATION,
  PROTOTYPE_SHOWROOM_CONTACT_HREF,
  PROTOTYPE_SHOWROOM_CORE_FLOW,
  PROTOTYPE_SHOWROOM_CROSS_INDUSTRY,
  PROTOTYPE_SHOWROOM_FINAL_CTA,
  PROTOTYPE_SHOWROOM_PROBLEM,
  PROTOTYPE_SHOWROOM_TO_BUSINESS,
} from "@/lib/content/prototype-showroom";
import { cn } from "@/lib/utils";

function SectionContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24",
        className
      )}
    >
      {children}
    </div>
  );
}

export function FieldProblemSection() {
  return (
    <HomeSectionShell tone="neutral">
      <SectionContainer>
        <IllustrationReveal>
          <HomeLandingSectionHeading
            id="showroom-problem-heading"
            index="01"
            title={PROTOTYPE_SHOWROOM_PROBLEM.title}
            description={PROTOTYPE_SHOWROOM_PROBLEM.body}
          />
        </IllustrationReveal>
        <ul className="mx-auto grid max-w-4xl gap-3 md:grid-cols-2">
          {PROTOTYPE_SHOWROOM_PROBLEM.painPoints.map((point) => (
            <IllustrationReveal key={point}>
              <li className="flex gap-3 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-4 py-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                <span
                  className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-primary)]"
                  aria-hidden
                />
                <span>{point}</span>
              </li>
            </IllustrationReveal>
          ))}
        </ul>
        <IllustrationReveal>
          <p className="mx-auto mt-12 max-w-3xl text-center text-[17px] font-semibold leading-[1.8] text-[var(--color-text-primary)] md:text-[18px]">
            {PROTOTYPE_SHOWROOM_PROBLEM.closing}
          </p>
        </IllustrationReveal>
      </SectionContainer>
    </HomeSectionShell>
  );
}

export function WorkflowPrincipleSection() {
  return (
    <HomeSectionShell tone="pure">
      <SectionContainer>
        <IllustrationReveal>
          <HomeLandingSectionHeading
            id="showroom-flow-heading"
            index="02"
            title={PROTOTYPE_SHOWROOM_CORE_FLOW.title}
            description={PROTOTYPE_SHOWROOM_CORE_FLOW.body}
          />
        </IllustrationReveal>
        <ol className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROTOTYPE_SHOWROOM_CORE_FLOW.steps.map((step, index) => (
            <IllustrationReveal key={step.id}>
              <li className="h-full rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)] px-5 py-6">
                <p className="font-mono text-[12px] font-semibold tracking-[0.14em] text-[var(--color-accent-primary)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-[16px] font-semibold text-[var(--color-text-primary)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                  {step.description}
                </p>
              </li>
            </IllustrationReveal>
          ))}
        </ol>
        <IllustrationReveal>
          <p className="mx-auto mt-12 max-w-3xl text-center text-[17px] font-semibold leading-[1.8] text-[var(--color-text-primary)] md:text-[18px]">
            {PROTOTYPE_SHOWROOM_CORE_FLOW.closing}
          </p>
        </IllustrationReveal>
      </SectionContainer>
    </HomeSectionShell>
  );
}

export function CrossIndustrySection() {
  return (
    <HomeSectionShell tone="neutral">
      <SectionContainer>
        <IllustrationReveal>
          <HomeLandingSectionHeading
            id="showroom-cross-industry-heading"
            index="03"
            title={PROTOTYPE_SHOWROOM_CROSS_INDUSTRY.title}
            description={PROTOTYPE_SHOWROOM_CROSS_INDUSTRY.body}
          />
        </IllustrationReveal>
        <div className="mx-auto grid max-w-5xl gap-6">
          {PROTOTYPE_SHOWROOM_CROSS_INDUSTRY.structures.map((structure) => (
            <IllustrationReveal key={structure.id}>
              <article className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-5 py-6 md:px-7 md:py-7">
                <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)]">
                  {structure.label}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                  {structure.examples.join(" → ")}
                </p>
                <p className="mt-4 font-mono text-[13px] leading-relaxed text-[var(--color-accent-primary)]">
                  {structure.principle}
                </p>
              </article>
            </IllustrationReveal>
          ))}
        </div>
        <IllustrationReveal>
          <p className="mx-auto mt-12 max-w-3xl text-center text-[17px] font-semibold leading-[1.8] text-[var(--color-text-primary)] md:text-[18px]">
            {PROTOTYPE_SHOWROOM_CROSS_INDUSTRY.closing}
          </p>
        </IllustrationReveal>
      </SectionContainer>
    </HomeSectionShell>
  );
}

export function PrototypeToBusinessSection() {
  return (
    <HomeSectionShell tone="pure">
      <SectionContainer>
        <IllustrationReveal>
          <HomeLandingSectionHeading
            id="showroom-business-heading"
            index="04"
            title={PROTOTYPE_SHOWROOM_TO_BUSINESS.title}
            description={PROTOTYPE_SHOWROOM_TO_BUSINESS.body}
          />
        </IllustrationReveal>
        <IllustrationReveal>
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2 text-center">
            {PROTOTYPE_SHOWROOM_TO_BUSINESS.flow.map((step, index) => (
              <span key={step} className="inline-flex items-center gap-2">
                <span className="rounded-full border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)] px-3 py-1.5 text-[14px] text-[var(--color-text-secondary)]">
                  {step}
                </span>
                {index < PROTOTYPE_SHOWROOM_TO_BUSINESS.flow.length - 1 ? (
                  <span
                    className="hidden text-[var(--color-accent-primary)] sm:inline"
                    aria-hidden
                  >
                    →
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </IllustrationReveal>
        <IllustrationReveal>
          <p className="mx-auto mt-12 max-w-3xl text-center text-[17px] font-semibold leading-[1.8] text-[var(--color-text-primary)] md:text-[18px]">
            {PROTOTYPE_SHOWROOM_TO_BUSINESS.closing}
          </p>
        </IllustrationReveal>
      </SectionContainer>
    </HomeSectionShell>
  );
}

export function CollaborationSection() {
  return (
    <HomeSectionShell tone="neutral">
      <SectionContainer>
        <IllustrationReveal>
          <HomeLandingSectionHeading
            id="showroom-collaboration-heading"
            index="05"
            kicker="COLLABORATION"
            title={PROTOTYPE_SHOWROOM_COLLABORATION.title}
            description={PROTOTYPE_SHOWROOM_COLLABORATION.subtitle}
          />
        </IllustrationReveal>
        <IllustrationReveal>
          <p className="mx-auto max-w-3xl text-center text-[16px] leading-[1.85] text-[var(--color-text-secondary)]">
            {PROTOTYPE_SHOWROOM_COLLABORATION.body}
          </p>
        </IllustrationReveal>
        <IllustrationReveal>
          <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2">
            {PROTOTYPE_SHOWROOM_COLLABORATION.partners.map((partner) => (
              <li
                key={partner}
                className="rounded-full border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-4 py-2 text-[14px] text-[var(--color-text-secondary)]"
              >
                {partner}
              </li>
            ))}
          </ul>
        </IllustrationReveal>
        <IllustrationReveal className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            className={cn(homeLandingCtaButtonClass, "w-full sm:w-auto")}
          >
            <Link href={PROTOTYPE_SHOWROOM_CONTACT_HREF}>
              {PROTOTYPE_SHOWROOM_COLLABORATION.primaryCtaLabel}
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className={cn(homeLandingCtaButtonClass, "w-full sm:w-auto")}
          >
            <Link href={PROTOTYPE_SHOWROOM_CONTACT_HREF}>
              {PROTOTYPE_SHOWROOM_COLLABORATION.secondaryCtaLabel}
            </Link>
          </Button>
        </IllustrationReveal>
      </SectionContainer>
    </HomeSectionShell>
  );
}

export function FinalCtaSection() {
  return (
    <HomeSectionShell tone="pure">
      <SectionContainer className="pb-24 md:pb-32">
        <IllustrationReveal>
          <HomeLandingSectionHeading
            id="showroom-final-cta-heading"
            index="06"
            title={PROTOTYPE_SHOWROOM_FINAL_CTA.title}
            description={PROTOTYPE_SHOWROOM_FINAL_CTA.body}
          />
        </IllustrationReveal>
        <IllustrationReveal>
          <ul className="mx-auto mt-2 max-w-2xl space-y-3 text-center">
            {PROTOTYPE_SHOWROOM_FINAL_CTA.signals.map((signal) => (
              <li
                key={signal}
                className="text-[16px] leading-relaxed text-[var(--color-text-secondary)]"
              >
                「{signal}」
              </li>
            ))}
          </ul>
        </IllustrationReveal>
        <IllustrationReveal>
          <p className="mx-auto mt-8 max-w-2xl text-center text-[16px] leading-relaxed text-[var(--color-text-secondary)]">
            {PROTOTYPE_SHOWROOM_FINAL_CTA.closing}
          </p>
        </IllustrationReveal>
        <IllustrationReveal className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            className={cn(homeLandingCtaButtonClass, "w-full sm:w-auto")}
          >
            <Link href={PROTOTYPE_SHOWROOM_CONTACT_HREF}>
              {PROTOTYPE_SHOWROOM_FINAL_CTA.primaryCtaLabel}
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className={cn(homeLandingCtaButtonClass, "w-full sm:w-auto")}
          >
            <Link href={PROTOTYPE_SHOWROOM_CONTACT_HREF}>
              {PROTOTYPE_SHOWROOM_FINAL_CTA.secondaryCtaLabel}
            </Link>
          </Button>
        </IllustrationReveal>
      </SectionContainer>
    </HomeSectionShell>
  );
}
