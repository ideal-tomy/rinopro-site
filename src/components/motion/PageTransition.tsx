"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  DURATION_PAGE_OUT,
  DURATION_PAGE_IN,
} from "@/lib/motion/config";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const durationOut = prefersReducedMotion ? 0 : DURATION_PAGE_OUT / 1000;
  const durationIn = prefersReducedMotion ? 0 : DURATION_PAGE_IN / 1000;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(4px)" }}
      transition={{
        duration: durationIn,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
