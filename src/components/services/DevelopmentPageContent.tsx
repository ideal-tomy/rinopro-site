"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ScrollSequence,
  ScrollSequenceItem,
} from "@/components/motion/ScrollSequence";
import { heroStaggerContainer, heroStaggerItem } from "@/lib/motion/variants";
import { developmentFlowCopy } from "@/lib/content/site-copy";

export function DevelopmentPageContent() {
  const steps = developmentFlowCopy.steps;
  const start = 0.2;
  const end = 0.7;
  const step = (end - start) / steps.length;

  return (
    <ScrollSequence className="container mx-auto max-w-7xl px-4 py-24 md:px-6">
      <ScrollSequenceItem thresholds={[0.1, 0.2]}>
        <h1 className="mb-2 text-2xl font-bold text-accent md:text-3xl">
          {developmentFlowCopy.title}
        </h1>
        <p className="mb-8 text-text-sub">{developmentFlowCopy.purpose}</p>
      </ScrollSequenceItem>
      <motion.div
        className="mb-12 flex flex-col gap-8"
        variants={heroStaggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {steps.map((item, idx) => {
          const s = start + idx * step;
          const e = s + step;
          return (
            <motion.div
              key={item.label}
              className="flex gap-4"
              variants={heroStaggerItem}
              custom={[s, e] as [number, number]}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 font-semibold text-accent">
                {idx + 1}
              </span>
              <div>
                <h2 className="font-semibold text-text">{item.label}</h2>
                <p className="text-sm text-text-sub">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      <ScrollSequenceItem thresholds={[0.8, 1.0]} withScale>
        <Button asChild>
          <Link href="/contact">{developmentFlowCopy.cta}</Link>
        </Button>
      </ScrollSequenceItem>
    </ScrollSequence>
  );
}
