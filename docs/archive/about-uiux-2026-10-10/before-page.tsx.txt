import Link from "next/link";
import { AboutApproachSection } from "@/components/about/AboutApproachSection";
import { AboutFactsSection } from "@/components/about/AboutFactsSection";
import { AboutPrinciplesSection } from "@/components/about/AboutPrinciplesSection";
import { AboutSectionHeader } from "@/components/about/AboutSectionHeader";
import { AboutStorySection } from "@/components/about/AboutStorySection";
import { AboutTeamFusionDiagram } from "@/components/about/AboutTeamFusionDiagram";
import { HomeSectionShell } from "@/components/home/HomeSectionShell";
import { Button } from "@/components/ui/button";
import { aboutCopy } from "@/lib/content/site-copy";
import { aboutReading } from "@/lib/ui/about-reading-styles";
import { cn } from "@/lib/utils";

const { hero, leaderProfiles, teamModel, cta } = aboutCopy;

export function AboutPageContent() {
  return (
    <div className="about-page-content">
      {/* 1 ヒーロー */}
      <HomeSectionShell tone="default">
        <section
          className={aboutReading.sectionInset}
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
            <p className={cn("mt-8 max-w-2xl", aboutReading.body)}>{hero.sub}</p>
          </div>
        </section>
      </HomeSectionShell>

      {/* 2 OUR STORY */}
      <HomeSectionShell tone="neutral">
        <AboutStorySection />
      </HomeSectionShell>

      {/* 3 代表 */}
      <HomeSectionShell tone="pure">
        <section
          className={aboutReading.sectionInset}
          aria-labelledby="about-leaders-heading"
        >
          <AboutSectionHeader
            id="about-leaders-heading"
            kicker={leaderProfiles.kicker}
            title={leaderProfiles.heading}
            description={leaderProfiles.intro || undefined}
          />
          <div className="mx-auto max-w-2xl">
            {leaderProfiles.profiles.map((profile) => (
              <article
                key={profile.title}
                className="border-l-4 border-[var(--color-accent-primary)]/45 pl-6 md:pl-8"
              >
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-primary)] md:text-sm">
                  {profile.title}
                </p>
                <p className="mt-3 text-lg font-bold text-[var(--color-text-primary)] md:text-xl">
                  {profile.name}
                </p>
                <div className={cn(aboutReading.body, "mt-5 space-y-5")}>
                  {profile.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </HomeSectionShell>

      {/* 4 3つの考え方 */}
      <HomeSectionShell tone="neutral">
        <AboutPrinciplesSection />
      </HomeSectionShell>

      {/* 5 4ステップ */}
      <HomeSectionShell tone="pure">
        <AboutApproachSection />
      </HomeSectionShell>

      {/* 6 標準体制 */}
      <HomeSectionShell tone="neutral">
        <section
          className={aboutReading.sectionInset}
          aria-labelledby="about-team-heading"
        >
          <AboutSectionHeader
            id="about-team-heading"
            kicker={teamModel.kicker}
            title={teamModel.heading}
            description={teamModel.intro}
          />
          <AboutTeamFusionDiagram teamModel={teamModel} />
          <p className={cn(aboutReading.body, "mx-auto mt-10 max-w-2xl text-center md:mt-14")}>
            {teamModel.footnote}
          </p>
        </section>
      </HomeSectionShell>

      {/* 7 会社概要・対応領域 */}
      <HomeSectionShell tone="pure">
        <AboutFactsSection />
      </HomeSectionShell>

      {/* 8 CTA */}
      <HomeSectionShell tone="warm">
        <section
          className={cn(aboutReading.sectionInset, "pb-28 md:pb-32")}
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
            <p className={cn("mt-8 text-balance md:mt-10", aboutReading.body)}>
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
      </HomeSectionShell>
    </div>
  );
}
