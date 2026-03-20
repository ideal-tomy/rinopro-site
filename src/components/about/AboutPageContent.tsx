"use client";

import { motion } from "framer-motion";
import { TeamMember } from "./TeamMember";
import {
  PageSectionWithScroll,
  StaggerGrid,
} from "@/components/layout/PageSectionWithScroll";
import { SkeletonShimmer } from "@/components/ui/skeleton";
import { heroStaggerContainer, heroStaggerItem } from "@/lib/motion/variants";
import { aboutCopy } from "@/lib/content/site-copy";
import type { TeamMember as TeamMemberType } from "@/lib/sanity/types";

interface AboutPageContentProps {
  members: TeamMemberType[];
}

function TrustSection({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <div className="mb-12">
      <h2 className="mb-4 font-semibold text-accent">{title}</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-text-sub">
            <span className="text-accent/70">・</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AboutPageContent({ members }: AboutPageContentProps) {
  return (
    <PageSectionWithScroll
      title={aboutCopy.title}
      cta={{ href: "/contact", label: aboutCopy.cta }}
    >
      <p className="mb-12 max-w-2xl text-text-sub">{aboutCopy.purpose}</p>

      <motion.div
        className="mb-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        variants={heroStaggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <motion.div variants={heroStaggerItem} custom={[0.2, 0.35]}>
          <TrustSection
            title={aboutCopy.values.title}
            items={aboutCopy.values.items}
          />
        </motion.div>
        <motion.div variants={heroStaggerItem} custom={[0.35, 0.5]}>
          <TrustSection
            title={aboutCopy.approach.title}
            items={aboutCopy.approach.items}
          />
        </motion.div>
        <motion.div variants={heroStaggerItem} custom={[0.5, 0.65]}>
          <TrustSection
            title={aboutCopy.domains.title}
            items={aboutCopy.domains.items}
          />
        </motion.div>
      </motion.div>

      <h2 className="mb-6 font-semibold text-text">メンバー</h2>
      {members.length > 0 ? (
        <StaggerGrid cols="2">
          {members.map((member) => (
            <TeamMember key={member._id} member={member} />
          ))}
        </StaggerGrid>
      ) : (
        <div className="mb-12 grid gap-6 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <SkeletonShimmer key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      )}
    </PageSectionWithScroll>
  );
}
