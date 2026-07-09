import Image from "next/image";
import Link from "next/link";
import { IllustrationReveal } from "@/components/illustrations/illustration-reveal";
import { Button } from "@/components/ui/button";
import { homeLandingCtaButtonClass } from "@/lib/content/home-landing-styles";
import {
  PROTOTYPE_SHOWROOM_CONTACT_HREF,
  PROTOTYPE_SHOWROOM_HERO,
} from "@/lib/content/prototype-showroom";
import { cn } from "@/lib/utils";

export function ShowcaseHero() {
  return (
    <section
      aria-labelledby="showroom-hero-heading"
      className="relative overflow-hidden border-b border-[var(--color-border-light)] bg-[var(--color-bg-pure)]"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center md:gap-12 md:px-6 md:py-24 lg:py-28">
        <IllustrationReveal className="order-2 md:order-1">
          <p className="text-[12px] font-semibold tracking-[0.18em] text-[var(--color-accent-primary)] md:text-[13px]">
            {PROTOTYPE_SHOWROOM_HERO.eyebrow}
          </p>
          <h1
            id="showroom-hero-heading"
            className="mt-4 text-balance text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.15] tracking-tight text-[var(--color-text-primary)]"
          >
            {PROTOTYPE_SHOWROOM_HERO.title}
          </h1>
          <p className="mt-6 max-w-[42ch] text-[17px] leading-[1.8] text-[var(--color-text-secondary)] md:text-[18px]">
            {PROTOTYPE_SHOWROOM_HERO.subtitle}
          </p>
          <p className="mt-6 font-mono text-[11px] leading-relaxed tracking-[0.08em] text-[var(--color-text-secondary)] md:text-xs">
            {PROTOTYPE_SHOWROOM_HERO.flowLine}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              className={cn(homeLandingCtaButtonClass, "w-full sm:w-auto")}
            >
              <Link href={PROTOTYPE_SHOWROOM_HERO.primaryCtaHref}>
                {PROTOTYPE_SHOWROOM_HERO.primaryCtaLabel}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className={cn(homeLandingCtaButtonClass, "w-full sm:w-auto")}
            >
              <Link href={PROTOTYPE_SHOWROOM_CONTACT_HREF}>
                {PROTOTYPE_SHOWROOM_HERO.secondaryCtaLabel}
              </Link>
            </Button>
          </div>
        </IllustrationReveal>

        <IllustrationReveal className="order-1 md:order-2">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)] shadow-[0_24px_60px_-32px_rgba(26,26,26,0.28)]">
            <Image
              src={PROTOTYPE_SHOWROOM_HERO.heroImageSrc}
              alt={PROTOTYPE_SHOWROOM_HERO.heroImageAlt}
              fill
              priority
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 52vw"
            />
          </div>
        </IllustrationReveal>
      </div>
    </section>
  );
}
