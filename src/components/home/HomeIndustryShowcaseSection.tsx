import Image from "next/image";
import Link from "next/link";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { HOME_INDUSTRY_SHOWCASE_CARDS } from "@/lib/content/home-industry-cards";
import { homeLandingCopy } from "@/lib/content/home-landing";
import { homeLandingCtaButtonClass } from "@/lib/content/home-landing-styles";
import { cn } from "@/lib/utils";

const copy = homeLandingCopy.industryShowcase;

export function HomeIndustryShowcaseSection() {
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

      <ul className="mt-10 grid list-none gap-6 md:mt-12 md:grid-cols-2 md:gap-8">
        {HOME_INDUSTRY_SHOWCASE_CARDS.map((card) => (
          <li
            key={card.slug}
            className="flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]"
          >
            <div className="relative aspect-[16/10] w-full bg-[var(--color-bg)]">
              <Image
                src={card.imageSrc}
                alt={card.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-6 md:p-8">
              <p className="font-mono text-xs font-semibold tracking-[0.12em] text-[var(--color-text-secondary)]">
                {card.englishLabel}
              </p>
              <h3 className="mt-2 text-[22px] font-bold leading-snug text-text md:text-[24px]">
                {card.title}
              </h3>
              <p className="mt-3 flex-1 text-[16px] leading-[1.75] text-[var(--color-text-secondary)] md:text-[17px]">
                {card.tagline}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={card.detailHref}
                  className={cn(
                    homeLandingCtaButtonClass,
                    "inline-flex flex-1 items-center justify-center bg-[var(--color-accent-primary)] text-center text-white motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.02]"
                  )}
                >
                  {copy.detailLabel}
                </Link>
                <a
                  href={card.tryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    homeLandingCtaButtonClass,
                    "inline-flex flex-1 items-center justify-center border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] text-center text-[var(--color-text-primary)] motion-safe:transition-[transform,border-color] motion-safe:duration-300 motion-safe:hover:scale-[1.02] hover:border-[var(--color-accent-primary)]/50"
                  )}
                >
                  {copy.tryLabel}
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
