"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface MotionDivProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

export function MotionDiv({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div className={cn(className)} {...props}>
      {children}
    </motion.div>
  );
}
