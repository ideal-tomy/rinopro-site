"use client";

import { usePathname } from "next/navigation";
import {
  DURATION_PAGE_IN,
} from "@/lib/motion/config";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className={cn(
        "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1",
        className
      )}
      style={{ animationDuration: `${DURATION_PAGE_IN}ms` }}
    >
      {children}
    </div>
  );
}
