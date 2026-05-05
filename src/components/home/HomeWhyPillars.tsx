import Link from "next/link";
import { Brain, Cpu, Workflow } from "lucide-react";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";

const icons = [Brain, Cpu, Workflow] as const;

const { pillars } = homeLandingCopy;

export function HomeWhyPillars() {
  return (
    <section
      id="pillars"
      className="container mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-[120px] scroll-mt-32"
      aria-labelledby="home-pillars-heading"
    >
      <HomeLandingSectionHeading
        id="home-pillars-heading"
        index={pillars.sectionIndex}
        kicker={pillars.sectionKicker}
        title={pillars.heading}
        description={pillars.intro}
      />
      <ul className="mx-auto grid max-w-6xl list-none gap-6 lg:grid-cols-3">
        {pillars.items.map((item, index) => {
          const Icon = icons[index];
          return (
            <li key={item.title}>
              <Link
                href={item.detailHref}
                className="interactive-card group flex h-full flex-col rounded-2xl border border-silver/20 bg-base-dark/55 p-6 ring-1 ring-warm/15 ring-inset shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--color-elevated)_12%,transparent)] hover:border-accent/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base md:p-8 motion-reduce:hover:!transform-none motion-reduce:hover:!shadow-none motion-reduce:active:!transform-none"
              >
                <div className="flex justify-center md:justify-start">
                  <div className="flex size-[52px] items-center justify-center rounded-2xl bg-accent/15 text-accent md:size-16 md:rounded-[1.25rem]">
                    <Icon className="size-[26px] md:size-9" aria-hidden strokeWidth={1.75} />
                  </div>
                </div>
                <h3 className="mt-6 text-balance text-xl font-semibold leading-snug text-white md:mt-7 md:text-2xl md:leading-snug">
                  {item.title}
                </h3>
                <p className="mt-4 flex-1 text-[16px] leading-[1.8] text-white/[0.85] md:text-[17px]">
                  {item.body}
                </p>
                <div className="mt-10 md:mt-12">
                  <span className="block w-full text-center text-accent underline-offset-4 transition group-hover:underline sm:w-auto sm:text-left">
                    {item.detailLabel}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
