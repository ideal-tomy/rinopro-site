import Link from "next/link";
import { Brain, Cpu, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";

const icons = [Brain, Cpu, Workflow] as const;

const { pillars } = homeLandingCopy;

export function HomeWhyPillars() {
  return (
    <section
      className="container mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-[120px]"
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
              <article className="flex h-full flex-col rounded-2xl border border-silver/20 bg-base-dark/55 p-6 ring-1 ring-warm/15 ring-inset shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--color-elevated)_12%,transparent)] md:p-8">
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
                  <Button asChild variant="ghost" className="w-full justify-center px-0 text-accent sm:w-auto">
                    <Link href={item.detailHref}>{item.detailLabel}</Link>
                  </Button>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
