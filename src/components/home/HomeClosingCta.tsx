"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { HomeConsultCtaButton } from "@/components/home/HomeConsultCtaButton";
import { homeLandingCopy } from "@/lib/content/home-landing";
import { homeLandingCtaButtonClass } from "@/lib/content/home-landing-styles";

const { closing } = homeLandingCopy;

const motionHover =
  "motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-reduce:transition-none";

export function HomeClosingCta() {
  return (
    <section
      className="container mx-auto max-w-3xl px-4 py-[120px] md:px-6 md:pb-32 md:pt-[120px]"
      aria-labelledby="home-closing-cta-heading"
    >
      <div className="rounded-3xl border border-accent/35 bg-base-dark/70 px-6 py-12 text-center shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--color-glow)_18%,transparent)] md:px-12 md:py-16">
        <h2
          id="home-closing-cta-heading"
          className="text-balance text-[clamp(1.5rem,4vw,2.25rem)] font-bold leading-snug tracking-tight text-white md:text-[clamp(1.75rem,3vw,2.5rem)]"
        >
          {closing.headline}
        </h2>
        <p className="mx-auto mt-6 max-w-[40ch] text-[17px] leading-[1.8] text-white/[0.85] md:mt-8 md:text-[18px]">
          {closing.body}
        </p>
        <div className="mx-auto mt-10 flex max-w-md justify-center md:mt-12">
          <HomeConsultCtaButton
            label={closing.primaryCta}
            size="lg"
            className={cn(
              "mt-0 w-full shadow-[0_0_28px_-6px_color-mix(in_srgb,var(--color-action)_50%,transparent)]",
              homeLandingCtaButtonClass,
              motionHover,
              "motion-safe:hover:scale-[1.03] motion-safe:hover:shadow-[0_0_40px_-4px_color-mix(in_srgb,var(--color-action)_65%,transparent)] motion-reduce:hover:scale-100"
            )}
          />
        </div>
        <nav
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[15px] text-white/70 md:mt-12 md:text-[16px]"
          aria-label="関連ページ"
        >
          {closing.auxiliaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="underline-offset-4 transition hover:text-white/[0.88] hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
