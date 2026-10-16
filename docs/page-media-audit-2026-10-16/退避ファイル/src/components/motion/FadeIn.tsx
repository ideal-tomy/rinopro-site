"use client";

import { motion } from "framer-motion";
import { DURATION_SMOOTH } from "@/lib/motion/config";
import { fadeIn } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  duration = DURATION_SMOOTH / 1000,
  className,
}: FadeInProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
