import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { ceo } = homeLandingCopy;

export function HomeCeoMessageSection() {
  return (
    <section
      id="ceo"
      className="container mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-[120px] scroll-mt-28"
      aria-labelledby="home-ceo-heading"
    >
      <HomeLandingSectionHeading
        id="home-ceo-heading"
        index={ceo.sectionIndex}
        kicker={ceo.sectionKicker}
        title={ceo.heading}
        description={ceo.intro}
      />
      <div className="grid gap-8 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 md:grid-cols-[360px_1fr] md:p-8">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[linear-gradient(160deg,#f4f4f2_0%,#ececec_45%,#f7f7f7_100%)]">
            <svg
              viewBox="0 0 360 480"
              className="h-auto w-full"
              role="img"
              aria-label="代表写真の仮シルエット"
            >
              <defs>
                <linearGradient id="silhouetteGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#f5efe0" stopOpacity="0.35" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="360" height="480" fill="url(#silhouetteGlow)" />
              <circle cx="180" cy="150" r="62" fill="#9ca3af" />
              <path
                d="M85 430c0-86 42-146 95-146h0c53 0 95 60 95 146"
                fill="#9ca3af"
              />
              <path d="M132 305l48 48 48-48" fill="none" stroke="#8b949e" strokeWidth="20" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold tracking-wide text-[var(--color-accent-primary)]">
              {ceo.role}
            </p>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{ceo.name}</p>
          </div>
        </div>
        <div>
          <h3 className="text-[28px] font-bold leading-tight text-[var(--color-text-primary)]">
            {ceo.messageHeading}
          </h3>
          <p className="mt-4 text-[16px] leading-[1.9] text-[var(--color-text-secondary)] md:text-[17px]">
            {ceo.message}
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {ceo.highlights.map((item, index) => (
              <article
                key={item}
                className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-base)] px-4 py-4"
              >
                <p className="text-[12px] font-semibold tracking-[0.08em] text-[var(--color-accent-primary)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-[15px] leading-[1.7] text-[var(--color-text-secondary)]">{item}</p>
              </article>
            ))}
          </div>
          <Button asChild variant="outline" className="mt-7">
            <Link href={ceo.profileHref}>{ceo.profileLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
