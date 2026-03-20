"use client";

import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/motion/PageTransition";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      <PageTransition>{children}</PageTransition>
    </AnimatePresence>
  );
}
