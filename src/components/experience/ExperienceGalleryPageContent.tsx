"use client";

import { useMemo, useState } from "react";
import { ImplementationShowcaseCard } from "@/components/home/ImplementationShowcaseCard";
import { ShowcaseIndustryBreadth } from "@/components/experience/ShowcaseIndustryBreadth";
import { Button } from "@/components/ui/button";
import { experienceGalleryCopy } from "@/lib/content/experience-gallery";
import {
  getExperienceGalleryCategories,
  getV1FlagshipShowcaseItems,
  getV1GalleryShowcaseItems,
  IMPLEMENTATION_SHOWCASE_ITEMS,
  type ExperienceGalleryCategory,
} from "@/lib/content/implementation-showcase";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function ShowcaseGrid({
  items,
}: {
  items: readonly (typeof IMPLEMENTATION_SHOWCASE_ITEMS)[number][];
}) {
  if (items.length === 0) {
    return (
      <p className="mt-8 text-center text-[15px] text-[var(--color-text-secondary)] md:text-[16px]">
        該当するデモはありません。別の業種をお試しください。
      </p>
    );
  }

  return (
    <ul className="mt-10 grid list-none gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
      {items.map((item) => (
        <li key={item.slug} id={`demo-${item.slug}`} className="scroll-mt-28">
          <ImplementationShowcaseCard item={item} />
        </li>
      ))}
    </ul>
  );
}

export function ExperienceGalleryPageContent() {
  const { hero, flagshipSection, listSection, ctaSection } =
    experienceGalleryCopy;
  const categories = getExperienceGalleryCategories();
  const [activeCategory, setActiveCategory] =
    useState<ExperienceGalleryCategory["id"]>("all");

  const flagshipItems = getV1FlagshipShowcaseItems();
  const galleryItems = getV1GalleryShowcaseItems();

  const filteredAllItems = useMemo(() => {
    if (activeCategory === "all") return IMPLEMENTATION_SHOWCASE_ITEMS;
    return IMPLEMENTATION_SHOWCASE_ITEMS.filter(
      (item) => item.industryCategory === activeCategory
    );
  }, [activeCategory]);

  const isFilteredView = activeCategory !== "all";

  return (
    <div className="pb-24 pt-10 md:pb-32 md:pt-14">
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
        <p className="mx-auto mt-5 max-w-[48ch] text-[16px] leading-[1.85] text-[var(--color-text-secondary)] md:mt-6 md:text-[17px]">
          {hero.lead}
        </p>
      </section>

      {!isFilteredView ? (
        <section
          className="container mx-auto mt-12 max-w-6xl px-4 md:mt-16 md:px-6"
          aria-labelledby="experience-gallery-flagship-heading"
        >
          <h2
            id="experience-gallery-flagship-heading"
            className="text-balance text-[clamp(1.35rem,3vw,1.875rem)] font-bold text-[var(--color-text-primary)]"
          >
            {flagshipSection.title}
          </h2>
          <p className="mt-3 text-[15px] leading-[1.8] text-[var(--color-text-secondary)] md:text-[16px]">
            {flagshipSection.lead}
          </p>
          <ShowcaseGrid items={flagshipItems} />
          <ShowcaseIndustryBreadth />
        </section>
      ) : null}

      <section
        className={cn(
          "container mx-auto max-w-6xl px-4 md:px-6",
          isFilteredView ? "mt-12 md:mt-16" : "mt-16 md:mt-20"
        )}
        aria-labelledby="experience-gallery-list-heading"
      >
        <h2
          id="experience-gallery-list-heading"
          className="text-balance text-[clamp(1.35rem,3vw,1.875rem)] font-bold text-[var(--color-text-primary)]"
        >
          {isFilteredView ? listSection.filteredTitle : listSection.title}
        </h2>
        <p className="mt-3 text-[15px] leading-[1.8] text-[var(--color-text-secondary)] md:text-[16px]">
          {isFilteredView ? listSection.filteredLead : listSection.lead}
        </p>

        <div
          className="mt-6 flex flex-wrap gap-2.5 md:mt-8"
          role="group"
          aria-label={listSection.filterLabel}
        >
          {categories.map((category) => {
            const isActive = category.id === activeCategory;
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "min-h-9 rounded-full border px-4 py-1.5 text-[14px] font-medium transition-colors",
                  "motion-safe:transition-[background-color,border-color,color]",
                  isActive
                    ? "border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)] text-[var(--color-bg-pure)]"
                    : "border-[var(--color-border-light)] bg-[var(--color-bg-pure)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-primary)]/40 hover:text-[var(--color-text-primary)]"
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {isFilteredView ? (
          <ShowcaseGrid items={filteredAllItems} />
        ) : (
          <ShowcaseGrid items={galleryItems} />
        )}
      </section>

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
