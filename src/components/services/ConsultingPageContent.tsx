"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ScrollSequence,
  ScrollSequenceItem,
} from "@/components/motion/ScrollSequence";
import { heroStaggerContainer, heroStaggerItem } from "@/lib/motion/variants";
import { consultingCopy } from "@/lib/content/site-copy";

export function ConsultingPageContent() {
  const items = consultingCopy.items;
  const start = 0.2;
  const end = 0.6;
  const step = (end - start) / items.length;

  return (
    <ScrollSequence className="container mx-auto max-w-7xl px-4 py-24 md:px-6">
      <ScrollSequenceItem thresholds={[0.1, 0.2]}>
        <h1 className="mb-2 text-2xl font-bold text-accent md:text-3xl">
          {consultingCopy.title}
        </h1>
        <p className="mb-8 text-text-sub">{consultingCopy.purpose}</p>
      </ScrollSequenceItem>
      <motion.div
        className="mb-12 space-y-6"
        variants={heroStaggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {items.map((item, idx) => {
          const s = start + idx * step;
          const e = s + step;
          return (
            <motion.div
              key={item.label}
              variants={heroStaggerItem}
              custom={[s, e] as [number, number]}
            >
              <h2 className="mb-2 font-semibold text-text">{item.label}</h2>
              <p className="text-sm text-text-sub">{item.desc}</p>
            </motion.div>
          );
        })}
      </motion.div>
      <ScrollSequenceItem thresholds={[0.8, 1.0]} withScale>
        <Button asChild>
          <Link href="/contact">{consultingCopy.cta}</Link>
        </Button>
      </ScrollSequenceItem>
    </ScrollSequence>
  );
}
