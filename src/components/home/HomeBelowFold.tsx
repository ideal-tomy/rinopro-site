"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PageSectionDivider } from "@/components/layout/PageSectionDivider";
import { FeaturedExperienceVideoCard } from "@/components/experience/FeaturedExperienceVideoCard";
import { PurposePickSection } from "@/components/demo/PurposePickSection";
import {
  heroStaggerContainer,
  heroStaggerItem,
} from "@/lib/motion/variants";
import {
  homeDevelopmentSectionCopy,
  homeConsultingSectionCopy,
} from "@/lib/content/site-copy";
import { useCurrentLocationString } from "@/hooks/use-current-location";
import { getFeaturedExperiencePrototypes } from "@/lib/experience/prototype-registry";
import { FEATURED_SHOWCASE_VIDEO_BY_SLUG } from "@/lib/experience/featured-showcase-media";
import type {
  AiDemo,
  DemoItem,
} from "@/lib/sanity/types";
import type { FeaturedExperienceSlug } from "@/lib/experience/prototype-registry";

interface HomeBelowFoldProps {
  demos: (AiDemo | DemoItem)[];
}

export function HomeBelowFold({ demos }: HomeBelowFoldProps) {
  const entryLocation = useCurrentLocationString();

  return (
    <>
      <div className="py-10 md:py-14">
        <PageSectionDivider />
      </div>

      <motion.div
        className="container mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-24"
        variants={heroStaggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20px" }}
      >
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:justify-items-center sm:gap-x-8 sm:gap-y-8 md:gap-x-10 md:gap-y-10 lg:gap-x-12">
          {getFeaturedExperiencePrototypes().map((p, i) => (
            <motion.div
              key={p.slug}
              variants={heroStaggerItem}
              custom={[0.1 + i * 0.08, 0.2 + i * 0.08] as [number, number]}
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
      </motion.div>

      <div className="py-10 md:py-14">
        <PageSectionDivider />
      </div>

      <motion.div
        className="container mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-24"
        variants={heroStaggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20px" }}
      >
        <motion.div
          variants={heroStaggerItem}
          custom={[0.12, 0.22] as [number, number]}
        >
          <PurposePickSection
            demos={demos}
            headingId="home-purpose-shortcuts-heading"
            headingAlign="center"
          />
        </motion.div>
      </motion.div>

      <div className="py-10 md:py-14">
        <PageSectionDivider />
      </div>

      <motion.section
        className="container mx-auto max-w-3xl px-4 pb-16 text-center md:px-6 md:pb-24"
        aria-labelledby="home-development-heading"
        variants={heroStaggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        <motion.div variants={heroStaggerItem} custom={[0.1, 0.2]}>
          <h2
            id="home-development-heading"
            className="mb-6 text-xl font-semibold text-accent md:mb-8 md:text-2xl"
          >
            {homeDevelopmentSectionCopy.sectionTitle}
          </h2>
          <p className="text-[1rem] leading-relaxed text-text md:text-lg">
            {homeDevelopmentSectionCopy.lead}
          </p>
          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-text-sub md:mt-8 md:text-[1rem]">
            {homeDevelopmentSectionCopy.body}
          </p>
          <Button asChild className="mt-8 md:mt-10" size="lg">
            <Link href={homeDevelopmentSectionCopy.ctaHref}>
              {homeDevelopmentSectionCopy.ctaLabel}
            </Link>
          </Button>
        </motion.div>
      </motion.section>

      <div className="py-10 md:py-14">
        <PageSectionDivider />
      </div>

      <motion.section
        className="container mx-auto max-w-3xl px-4 pb-24 text-center md:px-6 md:pb-32"
        aria-labelledby="home-consulting-heading"
        variants={heroStaggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        <motion.div variants={heroStaggerItem} custom={[0.12, 0.24]}>
          <h2
            id="home-consulting-heading"
            className="mb-6 text-xl font-semibold text-accent md:mb-8 md:text-2xl"
          >
            {homeConsultingSectionCopy.sectionTitle}
          </h2>
          <p className="text-[1rem] leading-relaxed text-text md:text-lg">
            {homeConsultingSectionCopy.lead}
          </p>
          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-text-sub md:mt-8 md:text-[1rem]">
            {homeConsultingSectionCopy.body}
          </p>
          <Button asChild className="mt-8 md:mt-10" size="lg" variant="outline">
            <Link href={homeConsultingSectionCopy.ctaHref}>
              {homeConsultingSectionCopy.ctaLabel}
            </Link>
          </Button>
        </motion.div>
      </motion.section>
    </>
  );
}
