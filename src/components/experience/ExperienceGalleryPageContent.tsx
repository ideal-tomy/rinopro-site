import { ImplementationShowcaseCard } from "@/components/home/ImplementationShowcaseCard";
import { Button } from "@/components/ui/button";
import {
  experienceGalleryCopy,
  getFeaturedShowcaseItems,
  getGalleryShowcaseItems,
} from "@/lib/content/experience-gallery";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function ExperienceGalleryPageContent() {
  const featuredItems = getFeaturedShowcaseItems();
  const galleryItems = getGalleryShowcaseItems();
  const { hero, stats, featuredSection, gallerySection, ctaSection } =
    experienceGalleryCopy;

  return (
    <div className="pb-24 pt-10 md:pb-32 md:pt-14">
      {/* Hero */}
      <section
        className="container mx-auto max-w-6xl px-4 text-center md:px-6"
        aria-labelledby="experience-gallery-hero-heading"
      >
        <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-[var(--color-accent-primary)] md:text-sm">
          {hero.kicker}
        </p>
        <h1
          id="experience-gallery-hero-heading"
          className="mt-3 text-balance text-[clamp(1.75rem,4.2vw,2.75rem)] font-bold leading-tight tracking-tight text-[var(--color-text-primary)] md:mt-4"
        >
          {hero.title}
        </h1>
        <p className="mx-auto mt-6 max-w-[44ch] whitespace-pre-line text-[16px] leading-[1.85] text-[var(--color-text-secondary)] md:mt-8 md:text-[17px]">
          {hero.lead}
        </p>
      </section>

      {/* Stats */}
      <section
        className="container mx-auto mt-14 max-w-6xl px-4 md:mt-20 md:px-6"
        aria-label="体験コンテンツの概要"
      >
        <ul className="grid gap-8 sm:grid-cols-3">
          {stats.map((s) => (
            <li
              key={s.label}
              className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-6 py-8 text-center shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]"
            >
              <p className="font-mono text-[clamp(2rem,5vw,3rem)] font-bold tabular-nums text-[var(--color-accent-primary)]">
                {s.value}
              </p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)] md:text-[12px]">
                {s.label}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* FEATURED */}
      <section
        id="featured-demos"
        className="container mx-auto mt-20 max-w-6xl px-4 md:mt-28 md:px-6"
        aria-labelledby="experience-featured-heading"
      >
        <p className="text-center text-[13px] font-semibold uppercase tracking-[0.15em] text-[var(--color-accent-primary)] md:text-sm">
          {featuredSection.kicker}
        </p>
        <h2
          id="experience-featured-heading"
          className="mt-3 text-center text-balance text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold text-[var(--color-text-primary)]"
        >
          {featuredSection.title}
        </h2>
        <p className="mx-auto mt-4 max-w-[44ch] text-center text-[16px] leading-[1.85] text-[var(--color-text-secondary)] md:mt-6 md:text-[17px]">
          {featuredSection.lead}
        </p>

        <ul className="mt-10 grid list-none gap-8 lg:grid-cols-2 lg:gap-10">
          {featuredItems.map((item) => (
            <li key={item.slug} id={`demo-${item.slug}`} className="scroll-mt-28">
              <ImplementationShowcaseCard item={item} />
            </li>
          ))}
        </ul>
      </section>

      {/* DEMO GALLERY */}
      {galleryItems.length > 0 ? (
        <section
          id="demo-gallery"
          className="mt-20 bg-[var(--color-bg-neutral)] py-16 md:mt-28 md:py-24"
          aria-labelledby="experience-gallery-heading"
        >
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <p className="text-center text-[13px] font-semibold uppercase tracking-[0.15em] text-[var(--color-accent-primary)] md:text-sm">
              {gallerySection.kicker}
            </p>
            <h2
              id="experience-gallery-heading"
              className="mt-3 text-center text-balance text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold text-[var(--color-text-primary)]"
            >
              {gallerySection.title}
            </h2>
            <p className="mx-auto mt-4 max-w-[44ch] text-center text-[16px] leading-[1.85] text-[var(--color-text-secondary)] md:mt-6 md:text-[17px]">
              {gallerySection.lead}
            </p>

            <ul className="mt-12 grid list-none gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {galleryItems.map((item) => (
                <li
                  key={item.slug}
                  id={`demo-${item.slug}`}
                  className="scroll-mt-28"
                >
                  <ImplementationShowcaseCard item={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section
        className="container mx-auto max-w-6xl px-4 pt-20 md:px-6 md:pt-28"
        aria-labelledby="experience-gallery-cta-heading"
      >
        <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-6 py-12 text-center md:px-12 md:py-16">
          <h2
            id="experience-gallery-cta-heading"
            className="text-balance text-[clamp(1.35rem,3vw,2rem)] font-bold text-[var(--color-text-primary)]"
          >
            {ctaSection.title}
          </h2>
          <p className="mx-auto mt-5 max-w-[42ch] text-[16px] leading-[1.85] text-[var(--color-text-secondary)] md:text-[17px]">
            {ctaSection.lead}
          </p>
          <Button asChild size="lg" className="mt-10 gap-2">
            <Link href={ctaSection.href} className="group/btn">
              {ctaSection.buttonLabel}
              <ArrowRight
                className="size-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/btn:translate-x-1"
                aria-hidden
              />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
