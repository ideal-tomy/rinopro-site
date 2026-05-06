import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
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
      />
      <div className="grid gap-8 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 md:grid-cols-[1fr_2fr] md:p-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold tracking-wide text-[var(--color-accent-primary)]">
            {ceo.role}
          </p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{ceo.name}</p>
        </div>
        <div>
          <p className="text-[16px] leading-[1.9] text-[var(--color-text-secondary)] md:text-[17px]">
            {ceo.message}
          </p>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-[15px] leading-[1.8] text-[var(--color-text-secondary)]">
            {ceo.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Button asChild variant="outline" className="mt-7">
            <Link href={ceo.profileHref}>{ceo.profileLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
