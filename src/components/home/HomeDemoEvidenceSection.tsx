"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FeaturedExperienceVideoCard } from "@/components/experience/FeaturedExperienceVideoCard";
import { Button } from "@/components/ui/button";
import { HomeHorizontalDots } from "@/components/home/HomeHorizontalDots";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import {
  heroStaggerContainer,
  heroStaggerItem,
} from "@/lib/motion/variants";
import { useCurrentLocationString } from "@/hooks/use-current-location";
import { getFeaturedExperiencePrototypes } from "@/lib/experience/prototype-registry";
import { FEATURED_SHOWCASE_VIDEO_BY_SLUG } from "@/lib/experience/featured-showcase-media";
import { homeLandingCopy } from "@/lib/content/home-landing";
import { homeLandingCtaButtonClass } from "@/lib/content/home-landing-styles";
import type { FeaturedExperienceSlug } from "@/lib/experience/prototype-registry";

const copy = homeLandingCopy.demoEvidence;

export function HomeDemoEvidenceSection() {
  const entryLocation = useCurrentLocationString();
  const railRef = useRef<HTMLDivElement | null>(null);
  const prototypes = getFeaturedExperiencePrototypes();

  return (
    <motion.section
      id="demo"
      className="container mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-[120px] scroll-mt-32"
      aria-labelledby="home-demo-evidence-heading"
      variants={heroStaggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
    >
      <motion.div
        variants={heroStaggerItem}
        custom={[0.06, 0.14] as [number, number]}
      >
        <HomeLandingSectionHeading
          id="home-demo-evidence-heading"
          index={copy.sectionIndex}
          kicker={copy.sectionKicker}
          title={copy.heading}
          description={copy.intro}
        />
      </motion.div>
      {/* PC(sm+): 2カラム grid。SP: scroll-snap 横スクロール。 */}
      <div
        ref={railRef}
        className="-mx-4 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-4 pb-2 [scroll-padding-inline:1rem] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:px-0 sm:pb-0 sm:justify-items-center md:gap-10 lg:gap-12"
      >
        {prototypes.map((p, i) => (
          <motion.div
            key={p.slug}
            data-dot-target
            variants={heroStaggerItem}
            custom={[0.1 + i * 0.06, 0.18 + i * 0.06] as [number, number]}
            className="w-[86%] min-w-[86%] shrink-0 snap-center sm:w-full sm:min-w-0 sm:max-w-[400px] sm:shrink"
          >
            <FeaturedExperienceVideoCard
              variant="split"
              meta={p}
              entryLocation={entryLocation}
              videoSrc={
                FEATURED_SHOWCASE_VIDEO_BY_SLUG[p.slug as FeaturedExperienceSlug]
              }
            />
          </motion.div>
        ))}
      </div>
      <div className="sm:hidden">
        <HomeHorizontalDots
          containerRef={railRef}
          count={prototypes.length}
          itemSelector="[data-dot-target]"
          label="体験デモ"
        />
      </div>
      <motion.div
        variants={heroStaggerItem}
        custom={[0.14, 0.22] as [number, number]}
        className="mt-14 flex justify-center md:mt-16"
      >
        <Button
          asChild
          variant="outline"
          className={`${homeLandingCtaButtonClass} motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:scale-[1.02]`}
        >
          <Link href={copy.moreDemosHref}>{copy.moreDemosLabel}</Link>
        </Button>
      </motion.div>
    </motion.section>
  );
}
