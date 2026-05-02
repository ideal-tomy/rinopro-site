"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HomeConsultCtaButton } from "@/components/home/HomeConsultCtaButton";
import { homeLandingCtaButtonClass } from "@/lib/content/home-landing-styles";

type HomeFirstViewActionsProps = {
  primaryLabel: string;
  secondaryLabel: string;
  secondaryHref: string;
};

const motionHover =
  "motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-reduce:transition-none";

export function HomeFirstViewActions({
  primaryLabel,
  secondaryLabel,
  secondaryHref,
}: HomeFirstViewActionsProps) {
  return (
    <div className="flex w-full max-w-md flex-col items-stretch gap-4 sm:max-w-none sm:flex-row sm:justify-center sm:gap-5">
      <HomeConsultCtaButton
        label={primaryLabel}
        size="lg"
        className={cn(
          "mt-0 w-full shadow-[0_0_28px_-6px_color-mix(in_srgb,var(--color-action)_50%,transparent)] sm:min-w-[260px]",
          homeLandingCtaButtonClass,
          motionHover,
          "motion-safe:hover:scale-[1.03] motion-safe:hover:shadow-[0_0_36px_-4px_color-mix(in_srgb,var(--color-action)_65%,transparent)] motion-reduce:hover:scale-100"
        )}
      />
      <Button
        asChild
        size="lg"
        variant="outline"
        className={cn(
          "w-full sm:w-auto sm:min-w-[220px]",
          homeLandingCtaButtonClass,
          motionHover,
          "motion-safe:hover:scale-[1.02] hover:border-accent/80 hover:bg-white/[0.04] hover:shadow-[0_0_24px_-8px_color-mix(in_srgb,var(--color-action)_45%,transparent)] motion-reduce:hover:scale-100"
        )}
      >
        <Link href={secondaryHref}>{secondaryLabel}</Link>
      </Button>
    </div>
  );
}
