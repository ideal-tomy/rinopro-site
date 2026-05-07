import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  experienceGalleryCopy,
  getExternalShowcaseItemsForGallery,
  LIVE_EXPERIENCE_DEMOS,
  resolveGalleryExternalHref,
} from "@/lib/content/experience-gallery";
import { cn } from "@/lib/utils";

function isVideoPath(path: string): boolean {
  const normalized = path.toLowerCase();
  return (
    normalized.endsWith(".mp4") ||
    normalized.endsWith(".webm") ||
    normalized.endsWith(".ogg")
  );
}

export function ExperienceGalleryPageContent() {
  const externalItems = getExternalShowcaseItemsForGallery();
  const { hero, stats, liveSection, gallerySection, ctaSection } =
    experienceGalleryCopy;
  const displayStats = [
    { ...stats[0], value: String(externalItems.length) },
    ...stats.slice(1),
  ];

  return (
    <div className="pb-24 pt-10 md:pb-32 md:pt-14">
      {/* Hero */}
      <section
        className="container mx-auto max-w-6xl px-4 text-center md:px-6"
        aria-labelledby="experience-gallery-hero-heading"
      >
        <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-[var(--color-accent-primary)] md:text-sm">
          {hero.kicker}
        </p>
        <h1
          id="experience-gallery-hero-heading"
          className="mt-3 text-balance text-[clamp(1.75rem,4.2vw,2.75rem)] font-bold leading-tight tracking-tight text-[var(--color-text-primary)] md:mt-4"
        >
          {hero.title}
        </h1>
        <p className="mx-auto mt-6 max-w-[44ch] whitespace-pre-line text-[16px] leading-[1.85] text-[var(--color-text-secondary)] md:mt-8 md:text-[17px]">
          {hero.lead}
        </p>
      </section>

      {/* Stats */}
      <section
        className="container mx-auto mt-14 max-w-6xl px-4 md:mt-20 md:px-6"
        aria-label="体験コンテンツの概要"
      >
        <ul className="grid gap-8 sm:grid-cols-3">
          {displayStats.map((s) => (
            <li
              key={s.label}
              className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-6 py-8 text-center shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]"
            >
              <p className="font-mono text-[clamp(2rem,5vw,3rem)] font-bold tabular-nums text-[var(--color-accent-primary)]">
                {s.value}
              </p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)] md:text-[12px]">
                {s.label}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* LIVE EXPERIENCE */}
      <section
        id="live-experience"
        className="container mx-auto mt-20 max-w-6xl px-4 md:mt-28 md:px-6"
        aria-labelledby="experience-live-heading"
      >
        <p className="text-center text-[13px] font-semibold uppercase tracking-[0.15em] text-[var(--color-accent-primary)] md:text-sm">
          {liveSection.kicker}
        </p>
        <h2
          id="experience-live-heading"
          className="mt-3 text-center text-balance text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold text-[var(--color-text-primary)]"
        >
          {liveSection.title}
        </h2>
        <p className="mx-auto mt-4 max-w-[40ch] text-center text-[16px] leading-[1.85] text-[var(--color-text-secondary)] md:mt-6 md:text-[17px]">
          {liveSection.lead}
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-10">
          {LIVE_EXPERIENCE_DEMOS.map((demo) => (
            <article
              key={demo.slug}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] shadow-[0_1px_2px_rgb(0_0_0_/_0.04)] motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 hover:border-[var(--color-accent-primary)]/35 hover:shadow-lg md:hover:-translate-y-1"
            >
              <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-[var(--color-bg-neutral)]">
                {isVideoPath(demo.imageSrc) ? (
                  <video
                    src={demo.imageSrc}
                    aria-label={demo.imageAlt}
                    className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.03]"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <Image
                    src={demo.imageSrc}
                    alt={demo.imageAlt}
                    fill
                    className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
                <span
                  className={cn(
                    "absolute right-3 top-3 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-bg-pure)] md:text-[11px]",
                    "bg-[#c9a961] motion-safe:animate-pulse"
                  )}
                >
                  LIVE DEMO
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent-primary)] md:text-sm">
                  {demo.industryLabel}
                </p>
                <h3 className="mt-2 text-xl font-bold leading-snug text-[var(--color-text-primary)] md:text-[1.35rem]">
                  {demo.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.75] text-[var(--color-text-secondary)] md:text-[16px]">
                  {demo.description}
                </p>
                <div className="mt-auto pt-8">
                  <Button
                    asChild
                    size="lg"
                    className="w-full gap-2 sm:w-auto sm:min-w-[200px]"
                  >
                    <Link href={demo.href} className="group/btn">
                      体験を開く
                      <ArrowRight
                        className="size-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/btn:translate-x-1"
                        aria-hidden
                      />
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* DEMO GALLERY */}
      <section
        id="demo-gallery"
        className="mt-20 bg-[var(--color-bg-neutral)] py-16 md:mt-28 md:py-24"
        aria-labelledby="experience-gallery-heading"
      >
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <p className="text-center text-[13px] font-semibold uppercase tracking-[0.15em] text-[var(--color-accent-primary)] md:text-sm">
            {gallerySection.kicker}
          </p>
          <h2
            id="experience-gallery-heading"
            className="mt-3 text-center text-balance text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold text-[var(--color-text-primary)]"
          >
            {gallerySection.title}
          </h2>
          <p className="mx-auto mt-4 max-w-[40ch] text-center text-[16px] leading-[1.85] text-[var(--color-text-secondary)] md:mt-6 md:text-[17px]">
            {gallerySection.lead}
          </p>

          <ul className="mt-12 grid list-none gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {externalItems.map((item) => {
              const href = resolveGalleryExternalHref(item);
              const isExternal =
                href.startsWith("http://") || href.startsWith("https://");
              return (
                <li
                  key={item.slug}
                  id={`demo-${item.slug}`}
                  className="scroll-mt-28"
                >
                  <a
                    href={href}
                    {...(isExternal
                      ? {
                          target: "_blank",
                          rel: "noopener noreferrer",
                          title: "外部サイトに移動します",
                        }
                      : {})}
                    className="interactive-card group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] text-left motion-safe:transition-[transform,box-shadow,border-color] motion-safe:duration-300 hover:border-[var(--color-accent-primary)]/35 hover:shadow-lg md:hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2"
                  >
                    <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-[var(--color-bg-neutral)]">
                      {item.thumbnailSrc.toLowerCase().endsWith(".mp4") ? (
                        <video
                          src={item.thumbnailSrc}
                          aria-label={item.thumbnailAlt}
                          className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.04]"
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <Image
                          src={item.thumbnailSrc}
                          alt={item.thumbnailAlt}
                          fill
                          className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.04]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <p className="text-[15px] font-bold leading-snug text-[var(--color-accent-primary)] md:text-[16px]">
                        {item.brandName}
                      </p>
                      <h3 className="mt-2 text-balance text-[17px] font-semibold leading-snug text-[var(--color-text-primary)] md:text-lg">
                        {item.productTitle}
                      </h3>
                      <p className="mt-2 text-[15px] leading-[1.75] text-[var(--color-text-secondary)] md:text-[16px]">
                        {item.catchCopy}
                      </p>
                      <p className="mt-4">
                        <span className="inline-flex rounded-full border border-[var(--color-border-light)] bg-[var(--color-accent-primary-light)] px-3 py-1 text-[13px] font-medium text-[var(--color-accent-primary)] md:text-[14px]">
                          {item.industryLabel}
                        </span>
                      </p>
                      <p className="mt-auto flex items-center gap-2 pt-6 text-[15px] font-semibold text-[var(--color-accent-primary)] md:text-[16px]">
                        <span className="inline-flex items-center gap-1 underline-offset-4 group-hover:underline">
                          体験する
                          {isExternal ? (
                            <ExternalLink className="size-4 shrink-0" aria-hidden />
                          ) : (
                            <ArrowRight
                              className="size-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-1"
                              aria-hidden
                            />
                          )}
                        </span>
                      </p>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section
        className="container mx-auto max-w-6xl px-4 pt-20 md:px-6 md:pt-28"
        aria-labelledby="experience-gallery-cta-heading"
      >
        <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-6 py-12 text-center md:px-12 md:py-16">
          <h2
            id="experience-gallery-cta-heading"
            className="text-balance text-[clamp(1.35rem,3vw,2rem)] font-bold text-[var(--color-text-primary)]"
          >
            {ctaSection.title}
          </h2>
          <p className="mx-auto mt-5 max-w-[42ch] text-[16px] leading-[1.85] text-[var(--color-text-secondary)] md:text-[17px]">
            {ctaSection.lead}
          </p>
          <Button asChild size="lg" className="mt-10 gap-2">
            <Link href={ctaSection.href} className="group/btn">
              {ctaSection.buttonLabel}
              <ArrowRight
                className="size-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/btn:translate-x-1"
                aria-hidden
              />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
