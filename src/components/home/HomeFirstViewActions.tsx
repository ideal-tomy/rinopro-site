"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { homeLandingCtaButtonClass } from "@/lib/content/home-landing-styles";

type ServiceOfferCard = {
  title: string;
  description: string;
  href: string;
};

type HomeFirstViewActionsProps = {
  cards: readonly ServiceOfferCard[];
  servicesLabel: string;
  servicesHref: string;
};

const motionHover =
  "motion-safe:transition-[transform,box-shadow,border-color] motion-safe:duration-300 motion-reduce:transition-none";

export function HomeFirstViewActions({
  cards,
  servicesLabel,
  servicesHref,
}: HomeFirstViewActionsProps) {
  return (
    <div className="flex w-full flex-col items-center gap-6 md:gap-8">
      <div className="grid w-full max-w-4xl grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className={cn(
              "interactive-card flex h-full flex-col items-center rounded-3xl border border-[var(--color-accent-primary)]/25 bg-[var(--color-accent-primary)] px-6 py-10 text-center md:px-8 md:py-12",
              motionHover,
              "hover:border-[var(--color-accent-primary)] motion-safe:hover:scale-[1.02] motion-reduce:hover:scale-100"
            )}
          >
            <h2 className="text-balance text-[clamp(1.35rem,3.5vw,1.75rem)] font-bold leading-snug tracking-tight text-white">
              {card.title}
            </h2>
            <p className="mt-4 max-w-[28ch] text-[16px] leading-[1.8] text-white/[0.88] md:mt-5 md:text-[17px]">
              {card.description}
            </p>
          </Link>
        ))}
      </div>
      <Link
        href={servicesHref}
        className={cn(
          "clickable-element flex w-full max-w-4xl items-center justify-center rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-6 py-5 text-center text-[17px] font-semibold text-[var(--color-text-primary)] shadow-[0_1px_2px_rgb(0_0_0_/_0.04)] md:rounded-3xl md:py-6 md:text-[18px]",
          homeLandingCtaButtonClass,
          motionHover,
          "hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] motion-safe:hover:scale-[1.02] motion-reduce:hover:scale-100"
        )}
      >
        {servicesLabel}
      </Link>
    </div>
  );
}
