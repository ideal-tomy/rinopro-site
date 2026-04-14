"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ParticleBackground } from "@/components/three/ParticleBackground";
import { Button } from "@/components/ui/button";
import { PageSectionDivider } from "@/components/layout/PageSectionDivider";
import {
  heroStaggerContainer,
  heroStaggerItem,
} from "@/lib/motion/variants";
import {
  topCopy,
  homeQuickStartCopy,
  homeDevelopmentSectionCopy,
  homeConsultingSectionCopy,
} from "@/lib/content/site-copy";
import { FeaturedExperienceVideoCard } from "@/components/experience/FeaturedExperienceVideoCard";
import { TypeExperienceSection } from "@/components/demo/TypeExperienceSection";
import { PurposePickSection } from "@/components/demo/PurposePickSection";
import { getFeaturedExperiencePrototypes } from "@/lib/experience/prototype-registry";
import { FEATURED_SHOWCASE_VIDEO_BY_SLUG } from "@/lib/experience/featured-showcase-media";
import type { FeaturedExperienceSlug } from "@/lib/experience/prototype-registry";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";
import { useConciergeChat } from "@/components/chat/concierge-chat-context";
import { recordVisitorEntryIntent } from "@/lib/journey/visitor-journey-storage";

interface HeroSectionProps {
  demos: (AiDemo | DemoItem)[];
}

export function HeroSection({ demos }: HeroSectionProps) {
  const { openConcierge } = useConciergeChat();

  return (
    <>
      <ParticleBackground />
      <motion.section
        className="flex flex-1 flex-col items-center justify-center gap-8 px-8 py-16 md:py-24"
        variants={heroStaggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="max-w-2xl text-center text-2xl font-bold text-accent md:text-3xl"
          variants={heroStaggerItem}
          custom={[0.1, 0.2]}
        >
          {topCopy.tagline}
        </motion.h1>
        <motion.p
          className="max-w-xl text-center text-sm text-text-sub md:text-[1rem]"
          variants={heroStaggerItem}
          custom={[0.2, 0.3]}
        >
          {topCopy.subline}
        </motion.p>
      </motion.section>

      <motion.section
        className="container mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-20"
        aria-label="相談・体験・料金の入口"
        variants={heroStaggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <motion.div
            variants={heroStaggerItem}
            custom={[0.24, 0.34] as [number, number]}
            className="flex h-full flex-col rounded-2xl border border-silver/20 bg-base-dark/60 p-5"
          >
            <h3 className="text-[1rem] font-semibold text-text">
              {homeQuickStartCopy.consult.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-text-sub">
              {homeQuickStartCopy.consult.body}
            </p>
            <Button
              className="mt-5 w-full"
              onClick={() => {
                recordVisitorEntryIntent("consult");
                openConcierge("default", "fab", { entryIntent: "consult" });
              }}
            >
              {homeQuickStartCopy.consult.ctaLabel}
            </Button>
          </motion.div>
          <motion.div
            variants={heroStaggerItem}
            custom={[0.3, 0.4] as [number, number]}
            className="flex h-full flex-col rounded-2xl border border-silver/20 bg-base-dark/60 p-5"
          >
            <h3 className="text-[1rem] font-semibold text-text">
              {homeQuickStartCopy.experience.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-text-sub">
              {homeQuickStartCopy.experience.body}
            </p>
            <Button asChild className="mt-5 w-full" variant="outline">
              <Link href={homeQuickStartCopy.experience.ctaHref}>
                {homeQuickStartCopy.experience.ctaLabel}
              </Link>
            </Button>
          </motion.div>
          <motion.div
            variants={heroStaggerItem}
            custom={[0.36, 0.46] as [number, number]}
            className="flex h-full flex-col rounded-2xl border border-silver/20 bg-base-dark/60 p-5"
          >
            <h3 className="text-[1rem] font-semibold text-text">
              {homeQuickStartCopy.estimate.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-text-sub">
              {homeQuickStartCopy.estimate.body}
            </p>
            <Button asChild className="mt-5 w-full" variant="outline">
              <Link href={homeQuickStartCopy.estimate.ctaHref}>
                {homeQuickStartCopy.estimate.ctaLabel}
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <div className="py-10 md:py-14">
        <PageSectionDivider />
      </div>

      <motion.div
        className="container mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-24"
        variants={heroStaggerContainer}
        initial="hidden"
        animate="visible"
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
        animate="visible"
      >
        <motion.div
          variants={heroStaggerItem}
          custom={[0.12, 0.22] as [number, number]}
          className="mb-16 md:mb-24"
        >
          <TypeExperienceSection
            demos={demos}
            headingId="home-type-experiences-heading"
            headingAlign="center"
            pcLayout="carousel"
          />
        </motion.div>

        <div className="py-10 md:py-12">
          <PageSectionDivider />
        </div>

        <motion.div
          variants={heroStaggerItem}
          custom={[0.18, 0.28] as [number, number]}
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
          <p className="mt-6 text-sm leading-relaxed text-text-sub md:mt-8 md:text-[1rem]">
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
          <p className="mt-6 text-sm leading-relaxed text-text-sub md:mt-8 md:text-[1rem]">
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
