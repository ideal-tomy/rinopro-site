"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ParticleBackground } from "@/components/three/ParticleBackground";
import { PulseScale } from "@/components/motion/PulseScale";
import { Button } from "@/components/ui/button";
import {
  ScrollSequence,
  ScrollSequenceItem,
} from "@/components/motion/ScrollSequence";
import {
  heroStaggerContainer,
  heroStaggerItem,
  heroStaggerItemWithScale,
} from "@/lib/motion/variants";
import { topCopy } from "@/lib/content/site-copy";
import { FeaturedExperienceVideoCard } from "@/components/experience/FeaturedExperienceVideoCard";
import { TypeExperienceSection } from "@/components/demo/TypeExperienceSection";
import { PurposePickSection } from "@/components/demo/PurposePickSection";
import { getFeaturedExperiencePrototypes } from "@/lib/experience/prototype-registry";
import { FEATURED_SHOWCASE_VIDEO_BY_SLUG } from "@/lib/experience/featured-showcase-media";
import type { FeaturedExperienceSlug } from "@/lib/experience/prototype-registry";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";

interface HeroSectionProps {
  demos: (AiDemo | DemoItem)[];
}

export function HeroSection({ demos }: HeroSectionProps) {
  return (
    <>
      <ParticleBackground />
      <motion.section
        className="flex flex-1 flex-col items-center justify-center gap-8 px-8 py-16"
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
        <div className="flex flex-col gap-4 sm:flex-row">
          <motion.div variants={heroStaggerItemWithScale} custom={[0.9, 1.0]}>
            <PulseScale>
              <Button asChild>
                <Link href="/demo">{topCopy.ctaDemo}</Link>
              </Button>
            </PulseScale>
          </motion.div>
          <motion.div variants={heroStaggerItem} custom={[0.9, 1.0]}>
            <Button
              variant="outline"
              className="border-silver/40 text-text hover:border-accent/50 hover:bg-accent/10"
              asChild
            >
              <Link href="/demo#featured-experiences">
                {topCopy.ctaExperience}
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <motion.div
        className="container mx-auto max-w-6xl px-4 pb-10 md:px-6"
        variants={heroStaggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-text-sub/90 md:text-sm"
          variants={heroStaggerItem}
          custom={[0.05, 0.15]}
        >
          注目の体験
        </motion.p>
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

      <motion.div
        className="container mx-auto max-w-6xl px-4 pb-10 md:px-6"
        variants={heroStaggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={heroStaggerItem}
          custom={[0.12, 0.22] as [number, number]}
          className="mb-12"
        >
          <TypeExperienceSection
            demos={demos}
            headingId="home-type-experiences-heading"
            pcLayout="carousel"
          />
        </motion.div>
        <motion.div
          variants={heroStaggerItem}
          custom={[0.18, 0.28] as [number, number]}
        >
          <PurposePickSection
            demos={demos}
            headingId="home-purpose-shortcuts-heading"
          />
        </motion.div>
      </motion.div>

      <ScrollSequence className="container mx-auto max-w-4xl px-4 pb-24 md:px-6">
        <ScrollSequenceItem thresholds={[0.1, 0.2]}>
          <h2 className="mb-8 text-center text-lg font-semibold text-text md:text-xl">
            {topCopy.approach.title}
          </h2>
        </ScrollSequenceItem>
        <motion.div
          className="mb-12 grid gap-6 sm:grid-cols-3"
          variants={heroStaggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {topCopy.approach.items.map((item, i) => (
            <motion.div
              key={item.label}
              variants={heroStaggerItem}
              custom={[0.2 + i * 0.15, 0.35 + i * 0.15] as [number, number]}
              className="rounded-xl border border-silver/20 bg-base-dark/50 p-6"
            >
              <h3 className="mb-2 font-semibold text-accent">{item.label}</h3>
              <p className="text-sm text-text-sub">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
        <ScrollSequenceItem thresholds={[0.7, 0.9]} withScale>
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="border-silver/40 text-text-sub hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
              asChild
            >
              <Link href={topCopy.nextActionHref}>
                {topCopy.nextAction} → {topCopy.nextActionTarget}
              </Link>
            </Button>
          </div>
        </ScrollSequenceItem>
      </ScrollSequence>
    </>
  );
}
