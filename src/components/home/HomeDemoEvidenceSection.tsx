"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FeaturedExperienceVideoCard } from "@/components/experience/FeaturedExperienceVideoCard";
import { Button } from "@/components/ui/button";
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

  return (
    <motion.section
      className="container mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-[120px]"
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
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:justify-items-center md:gap-10 lg:gap-12">
        {getFeaturedExperiencePrototypes().map((p, i) => (
          <motion.div
            key={p.slug}
            variants={heroStaggerItem}
            custom={[0.1 + i * 0.06, 0.18 + i * 0.06] as [number, number]}
            className="w-full max-w-[400px]"
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
