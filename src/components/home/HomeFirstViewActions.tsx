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
          "clickable-element mt-0 w-full sm:min-w-[260px]",
          homeLandingCtaButtonClass,
          motionHover,
          "motion-safe:hover:scale-[1.03] motion-reduce:hover:scale-100"
        )}
      />
      <Button
        asChild
        size="lg"
        variant="outline"
        className={cn(
          "clickable-element w-full sm:w-auto sm:min-w-[220px]",
          homeLandingCtaButtonClass,
          motionHover,
          "motion-safe:hover:scale-[1.02] motion-reduce:hover:scale-100"
        )}
      >
        <Link href={secondaryHref}>{secondaryLabel}</Link>
      </Button>
    </div>
  );
}
