import Image from "next/image";
import Link from "next/link";
import { IllustrationReveal } from "@/components/illustrations/illustration-reveal";
import { Button } from "@/components/ui/button";
import { homeLandingCtaButtonClass } from "@/lib/content/home-landing-styles";
import {
  PROTOTYPE_SHOWROOM_CONTACT_HREF,
  type PrototypeDemo,
  type PrototypeScreenshot,
} from "@/lib/content/prototype-showroom";
import { cn } from "@/lib/utils";

type PrototypeStorySectionProps = {
  demo: PrototypeDemo;
  index: number;
};

function RoleList({
  title,
  items,
  tone,
}: {
  title: string;
  items: readonly string[];
  tone: "ai" | "human";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-5 py-6 md:px-6",
        tone === "ai"
          ? "border-[var(--color-accent-primary)]/20 bg-[var(--color-accent-primary-light)]/40"
          : "border-[var(--color-border-light)] bg-[var(--color-bg-pure)]"
      )}
    >
      <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
        {title}
      </h3>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]"
          >
            <span
              className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-primary)]"
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PrototypeStorySection({ demo, index }: PrototypeStorySectionProps) {
  const heroShot = demo.screenshots.find((s) => s.role === "hero");
  const flowShot = demo.screenshots.find((s) => s.role === "flow");
  const afterShot = demo.screenshots.find((s) => s.role === "after");
  const supportShots = [flowShot, afterShot].filter(
    (shot): shot is PrototypeScreenshot => shot !== undefined
  );

  return (
    <section
      id={demo.id}
      aria-labelledby={`prototype-${demo.id}-heading`}
      className="scroll-mt-24 border-b border-[var(--color-border-light)]"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <IllustrationReveal>
          <p className="font-mono text-[28px] font-light tabular-nums tracking-[0.2em] text-[var(--color-accent-primary)]/45 md:text-[32px]">
            {String(index).padStart(2, "0")}
          </p>
          <p className="mt-2 text-[12px] font-semibold tracking-[0.16em] text-[var(--color-accent-primary)] md:text-[13px]">
            {demo.eyebrow}
          </p>
          <h2
            id={`prototype-${demo.id}-heading`}
            className="mt-4 max-w-4xl text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.2] tracking-tight text-[var(--color-text-primary)]"
          >
            {demo.title}
          </h2>
          <p className="mt-5 max-w-3xl text-[17px] leading-[1.8] text-[var(--color-text-secondary)] md:text-[18px]">
            {demo.oneLineValue}
          </p>
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
            {demo.industries.join(" / ")}
          </p>
        </IllustrationReveal>

        {heroShot ? (
          <IllustrationReveal className="mt-10 md:mt-14">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)]">
              <Image
                src={heroShot.src}
                alt={heroShot.alt}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 1152px"
              />
            </div>
          </IllustrationReveal>
        ) : null}

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <IllustrationReveal>
            <h3 className="text-[13px] font-semibold tracking-[0.14em] text-[var(--color-accent-primary)]">
              BEFORE
            </h3>
            <p className="mt-4 text-[16px] leading-[1.85] text-[var(--color-text-secondary)]">
              {demo.before}
            </p>
          </IllustrationReveal>

          <IllustrationReveal>
            <h3 className="text-[13px] font-semibold tracking-[0.14em] text-[var(--color-accent-primary)]">
              業務フロー
            </h3>
            <ol className="mt-4 space-y-3">
              {demo.workflow.map((step, stepIndex) => (
                <li
                  key={step}
                  className="flex gap-3 text-[15px] leading-relaxed text-[var(--color-text-secondary)]"
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-primary-light)] text-[12px] font-semibold text-[var(--color-accent-primary)]">
                    {stepIndex + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </IllustrationReveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <IllustrationReveal>
            <RoleList title="AIが担う部分" items={demo.aiRoles} tone="ai" />
          </IllustrationReveal>
          <IllustrationReveal>
            <RoleList
              title="人が判断する部分"
              items={demo.humanRoles}
              tone="human"
            />
          </IllustrationReveal>
        </div>

        <IllustrationReveal className="mt-12">
          <h3 className="text-[13px] font-semibold tracking-[0.14em] text-[var(--color-accent-primary)]">
            AFTER
          </h3>
          <p className="mt-4 max-w-3xl text-[16px] leading-[1.85] text-[var(--color-text-secondary)]">
            {demo.after}
          </p>
        </IllustrationReveal>

        {supportShots.length > 0 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {supportShots.map((shot) => (
              <IllustrationReveal key={shot.src}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)]">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, 560px"
                  />
                </div>
              </IllustrationReveal>
            ))}
          </div>
        ) : null}

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <IllustrationReveal>
            <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
              業界内応用
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
              {demo.industryApplications.join(" / ")}
            </p>
          </IllustrationReveal>
          <IllustrationReveal>
            <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
              他業界への横展開
            </h3>
            <p className="mt-3 font-mono text-[13px] leading-relaxed text-[var(--color-accent-primary)]">
              {demo.crossIndustryPrinciple}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
              {demo.crossIndustryTargets.join(" / ")}
            </p>
          </IllustrationReveal>
        </div>

        <IllustrationReveal className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            asChild
            className={cn(homeLandingCtaButtonClass, "w-full sm:w-auto")}
          >
            <a
              href={demo.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {demo.primaryCtaLabel}
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className={cn(homeLandingCtaButtonClass, "w-full sm:w-auto")}
          >
            <Link href={PROTOTYPE_SHOWROOM_CONTACT_HREF}>
              {demo.secondaryCtaLabel}
            </Link>
          </Button>
        </IllustrationReveal>
      </div>
    </section>
  );
}
