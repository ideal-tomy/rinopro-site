"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ScrollSequence,
  ScrollSequenceItem,
} from "@/components/motion/ScrollSequence";
import { heroStaggerContainer, heroStaggerItem } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

interface PageSectionWithScrollProps {
  title: string;
  children: React.ReactNode;
  cta?: { href: string; label: string };
  className?: string;
}

export function PageSectionWithScroll({
  title,
  children,
  cta,
  className,
}: PageSectionWithScrollProps) {
  return (
    <ScrollSequence
      className={cn(
        "container mx-auto max-w-7xl px-4 py-24 md:px-6",
        className
      )}
    >
      <ScrollSequenceItem thresholds={[0.1, 0.2]}>
        <h1 className="mb-4 text-2xl font-bold text-accent md:text-3xl">
          {title}
        </h1>
      </ScrollSequenceItem>
      <div className="mb-12">{children}</div>
      {cta && (
        <ScrollSequenceItem thresholds={[0.8, 1.0]} withScale>
          <Button asChild>
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        </ScrollSequenceItem>
      )}
    </ScrollSequence>
  );
}

interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: "2" | "3";
  layout?: "grid" | "list";
  /** 各子をラップする motion.div に付与（例: 2カラムグリッドで3番目を全幅に `sm:col-span-2`） */
  itemClassNameByIndex?: Record<number, string>;
}

export function StaggerGrid({
  children,
  className,
  cols = "3",
  layout = "grid",
  itemClassNameByIndex,
}: StaggerGridProps) {
  const items = React.Children.toArray(children);
  const start = 0.2;
  const end = 0.7;
  const step = (end - start) / Math.max(items.length, 1);

  return (
    <motion.div
      variants={heroStaggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "mb-12 gap-6",
        layout === "grid" && "grid sm:grid-cols-2",
        layout === "grid" && cols === "3" && "lg:grid-cols-3",
        layout === "list" && "flex flex-col",
        className
      )}
    >
      {items.map((child, i) => {
        const s = start + i * step;
        const e = s + step;
        return (
          <motion.div
            key={i}
            className={cn(itemClassNameByIndex?.[i])}
            variants={heroStaggerItem}
            custom={[s, e] as [number, number]}
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
