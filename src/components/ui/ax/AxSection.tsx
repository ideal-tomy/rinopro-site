import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { axLayout } from "@/lib/ui/ax-typography";

export type AxSectionProps = {
  id?: string;
  density?: "standard" | "compact";
  tone?: "default" | "muted" | "surface";
  className?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
};

export function AxSection({
  id,
  density = "standard",
  tone = "default",
  className,
  children,
  "aria-labelledby": ariaLabelledby,
}: AxSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn(
        density === "compact"
          ? axLayout.sectionCompact
          : axLayout.sectionStandard,
        tone === "muted" && axLayout.sectionMuted,
        tone === "surface" && axLayout.sectionSurface,
        className
      )}
    >
      {children}
    </section>
  );
}
