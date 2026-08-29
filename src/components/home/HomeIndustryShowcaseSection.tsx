import Link from "next/link";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { ImplementationShowcaseCard } from "@/components/home/ImplementationShowcaseCard";
import { homeLandingCopy } from "@/lib/content/home-landing";
import { homeLandingCtaButtonClass } from "@/lib/content/home-landing-styles";
import { getV1FlagshipShowcaseItems } from "@/lib/content/implementation-showcase";
import { cn } from "@/lib/utils";

const copy = homeLandingCopy.industryShowcase;

export function HomeIndustryShowcaseSection() {
  const items = getV1FlagshipShowcaseItems();

  return (
    <section
      id="industry"
      className="container mx-auto max-w-6xl scroll-mt-32 px-4 py-20 md:px-6 md:py-[120px]"
      aria-labelledby="home-industry-showcase-heading"
    >
      <HomeLandingSectionHeading
        id="home-industry-showcase-heading"
        index={copy.sectionIndex}
        kicker={copy.sectionKicker}
        title={copy.heading}
        description={copy.intro}
      />

      <ul className="mt-10 grid list-none gap-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-10">
        {items.map((item) => (
          <li key={item.slug}>
            <ImplementationShowcaseCard item={item} priorityImage={false} />
          </li>
        ))}
      </ul>

      <div className="mt-14 flex justify-center md:mt-16">
        <Link
          href={copy.allDemosHref}
          className={cn(
            homeLandingCtaButtonClass,
            "inline-flex items-center justify-center border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] text-[var(--color-text-primary)] shadow-[0_1px_2px_rgb(0_0_0_/_0.04)] motion-safe:transition-[transform,border-color,box-shadow] motion-safe:duration-300 motion-safe:hover:scale-[1.02] hover:border-[var(--color-accent-primary)]/50"
          )}
        >
          {copy.allDemosLabel}
        </Link>
      </div>
    </section>
  );
}
