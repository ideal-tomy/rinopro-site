"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeHorizontalDots } from "@/components/home/HomeHorizontalDots";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { ImplementationShowcaseCard } from "@/components/home/ImplementationShowcaseCard";
import { getV1FlagshipShowcaseItems } from "@/lib/content/implementation-showcase";
import { homeLandingCopy } from "@/lib/content/home-landing";
import { homeLandingCtaButtonClass } from "@/lib/content/home-landing-styles";

const copy = homeLandingCopy.implementationShowcase;

export function HomeImplementationShowcaseSection() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const items = getV1FlagshipShowcaseItems();

  return (
    <section
      id="industry"
      className="container mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-[120px] scroll-mt-32"
      aria-labelledby="home-implementation-showcase-heading"
    >
      <HomeLandingSectionHeading
        id="home-implementation-showcase-heading"
        index={copy.sectionIndex}
        kicker={copy.sectionKicker}
        title={copy.heading}
        description={copy.intro}
      />

      <div
        ref={railRef}
        className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scroll-padding-inline:1rem] md:mx-0 md:mt-12 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:px-0 md:pb-0 md:snap-none lg:grid-cols-3 lg:gap-10"
      >
        {items.map((item) => (
          <div
            key={item.slug}
            data-dot-target
            className="w-[min(82vw,calc(100vw-2rem))] min-w-[min(82vw,calc(100vw-2rem))] shrink-0 snap-center md:w-auto md:min-w-0 md:snap-none"
          >
            <ImplementationShowcaseCard item={item} priorityImage={false} />
          </div>
        ))}
      </div>

      <div className="md:hidden">
        <HomeHorizontalDots
          containerRef={railRef}
          count={items.length}
          itemSelector="[data-dot-target]"
          label="実装事例"
        />
      </div>

      <div className="mt-14 flex justify-center md:mt-16">
        <Button
          asChild
          variant="outline"
          className={`${homeLandingCtaButtonClass} motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:scale-[1.02]`}
        >
          <Link href={copy.allCasesHref}>{copy.allCasesLabel}</Link>
        </Button>
      </div>
    </section>
  );
}
