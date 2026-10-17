"use client";

import { ImplementationShowcaseCard } from "@/components/home/ImplementationShowcaseCard";
import { ExperienceGalleryCarousel } from "@/components/experience/ExperienceGalleryCarousel";
import { Button } from "@/components/ui/button";
import { experienceGalleryCopy } from "@/lib/content/experience-gallery";
import {
  getV1FlagshipShowcaseItems,
  getV1GalleryShowcaseItems,
  IMPLEMENTATION_SHOWCASE_ITEMS,
} from "@/lib/content/implementation-showcase";
import { headingAccentRuleClasses } from "@/lib/ui/heading-accent-rule-styles";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const SECTION_TITLE_CLASS =
  "text-balance text-[clamp(1.35rem,3vw,1.875rem)] font-bold text-[var(--color-text-primary)]";

const SECTION_LEAD_CLASS =
  "mt-3 text-[15px] leading-[1.5] text-[var(--color-text-secondary)] md:text-[16px]";

function ExperienceSectionHeading({
  id,
  title,
  lead,
}: {
  id: string;
  title: string;
  lead: string;
}) {
  return (
    <>
      <h2
        id={id}
        className={cn(SECTION_TITLE_CLASS, headingAccentRuleClasses.default)}
      >
        {title}
      </h2>
      <p className={SECTION_LEAD_CLASS}>{lead}</p>
    </>
  );
}

function FlagshipShowcaseGrid({
  items,
}: {
  items: readonly (typeof IMPLEMENTATION_SHOWCASE_ITEMS)[number][];
}) {
  return (
    <ul className="mt-10 grid list-none gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
      {items.map((item) => (
        <li
          key={item.slug}
          id={`demo-${item.slug}`}
          className="h-full scroll-mt-28"
        >
          <ImplementationShowcaseCard item={item} showIndustryLabel={false} />
        </li>
      ))}
    </ul>
  );
}

function GalleryShowcaseGrid({
  items,
}: {
  items: readonly (typeof IMPLEMENTATION_SHOWCASE_ITEMS)[number][];
}) {
  if (items.length === 0) {
    return (
      <p className="mt-8 text-[15px] text-[var(--color-text-secondary)] md:text-[16px]">
        現在、掲載準備中のデモはありません。
      </p>
    );
  }

  return (
    <>
      <ExperienceGalleryCarousel items={items} />
      <ul className="mt-8 hidden list-none gap-4 lg:grid lg:grid-cols-5 lg:gap-5">
        {items.map((item) => (
          <li
            key={item.slug}
            id={`demo-${item.slug}`}
            className="h-full scroll-mt-28"
          >
            <ImplementationShowcaseCard item={item} variant="compact" />
          </li>
        ))}
      </ul>
    </>
  );
}

export function ExperienceGalleryPageContent() {
  const { hero, flagshipSection, listSection, ctaSection } =
    experienceGalleryCopy;

  const flagshipItems = getV1FlagshipShowcaseItems();
  const galleryItems = getV1GalleryShowcaseItems();

  return (
    <div className="ax-page pb-24 pt-10 md:pb-32 md:pt-14" data-ax-theme="corporate">
      <section
        className="ax-container-wide text-center"
        aria-labelledby="experience-gallery-hero-heading"
      >
        <p className="ax-role-eyebrow">{hero.kicker}</p>
        <h1
          id="experience-gallery-hero-heading"
          className="ax-role-page-title mt-3 text-balance"
        >
          {hero.title}
        </h1>
        <p className="ax-role-lead mx-auto mt-5 max-w-[48ch] text-[var(--ax-text-supporting)]">
          {hero.lead}
        </p>
      </section>

      <section
        className="container mx-auto mt-12 max-w-6xl px-4 md:mt-16 md:px-6"
        aria-labelledby="experience-gallery-flagship-heading"
      >
        <ExperienceSectionHeading
          id="experience-gallery-flagship-heading"
          title={flagshipSection.title}
          lead={flagshipSection.lead}
        />
        <FlagshipShowcaseGrid items={flagshipItems} />
      </section>

      <section
        className="ax-container-wide mt-16 md:mt-20"
        aria-labelledby="experience-gallery-list-heading"
      >
        <ExperienceSectionHeading
          id="experience-gallery-list-heading"
          title={listSection.title}
          lead={listSection.lead}
        />
        <GalleryShowcaseGrid items={galleryItems} />
      </section>

      <section
        className="container mx-auto mt-16 max-w-6xl px-4 md:mt-24 md:px-6"
        aria-labelledby="experience-gallery-cta-heading"
      >
        <ExperienceSectionHeading
          id="experience-gallery-cta-heading"
          title={ctaSection.title}
          lead={ctaSection.lead}
        />
        <div className="mt-8">
          <Button asChild size="lg" className="gap-2">
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
