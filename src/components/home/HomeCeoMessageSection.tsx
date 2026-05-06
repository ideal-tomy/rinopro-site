import Link from "next/link";
import { CeoSilhouette } from "@/components/illustrations/ceo-silhouette";
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
      <div className="grid gap-8 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 md:grid-cols-[360px_1fr] md:p-8">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)]">
            <CeoSilhouette ariaLabel="代表写真の仮シルエット（プレースホルダー）" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold tracking-wide text-[var(--color-accent-primary)]">
              {ceo.role}
            </p>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{ceo.name}</p>
          </div>
        </div>
        <div>
          <h3 className="text-[28px] font-bold leading-tight text-[var(--color-text-primary)]">
            {ceo.messageHeading}
          </h3>
          <p className="mt-4 text-[16px] leading-[1.9] text-[var(--color-text-secondary)] md:text-[17px]">
            {ceo.message}
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {ceo.highlights.map((item, index) => (
              <article
                key={item}
                className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-base)] px-4 py-4"
              >
                <p className="text-[12px] font-semibold tracking-[0.08em] text-[var(--color-accent-primary)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-[15px] leading-[1.7] text-[var(--color-text-secondary)]">{item}</p>
              </article>
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
