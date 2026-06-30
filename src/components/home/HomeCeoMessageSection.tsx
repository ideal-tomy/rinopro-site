import Link from "next/link";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { Button } from "@/components/ui/button";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { ceo } = homeLandingCopy;

export function HomeCeoMessageSection() {
  return (
    <section
      id="ceo"
      className="container mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-[120px] scroll-mt-28"
      aria-labelledby="home-ceo-heading"
    >
      <HomeLandingSectionHeading
        id="home-ceo-heading"
        index={ceo.sectionIndex}
        kicker={ceo.sectionKicker}
        title={ceo.heading}
        description={ceo.intro}
      />
      <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 md:p-8">
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-wide text-[var(--color-accent-primary)]">{ceo.role}</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{ceo.name}</p>
        </div>
        <div className="mt-8">
          <h3 className="text-[28px] font-bold leading-tight text-[var(--color-text-primary)]">
            {ceo.messageHeading}
          </h3>
          <div className="mt-4 space-y-5 text-[16px] leading-[1.9] text-[var(--color-text-secondary)] md:text-[17px]">
            {ceo.message.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <Button asChild variant="outline" className="mt-7">
            <Link href={ceo.profileHref}>{ceo.profileLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
