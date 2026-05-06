import Link from "next/link";
import {
  BrainCircuit,
  Building2,
  Code,
  Database,
  GraduationCap,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { solutions } = homeLandingCopy;

const SOLUTION_ICONS: Record<(typeof solutions.items)[number]["iconKey"], LucideIcon> = {
  brainCircuit: BrainCircuit,
  code: Code,
  database: Database,
  graduationCap: GraduationCap,
  building2: Building2,
  trendingUp: TrendingUp,
};

export function HomeSolutionsSection() {
  return (
    <section
      id="solutions"
      className="container mx-auto max-w-6xl scroll-mt-28 px-4 py-20 md:px-6 md:py-[120px]"
      aria-labelledby="home-solutions-heading"
    >
      <HomeLandingSectionHeading
        id="home-solutions-heading"
        index={solutions.sectionIndex}
        kicker={solutions.sectionKicker}
        title={solutions.heading}
        description={solutions.intro}
      />
      <ul className="mt-10 grid list-none gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
        {solutions.items.map((item) => {
          const Icon = SOLUTION_ICONS[item.iconKey];
          return (
            <li key={item.title}>
              <Link
                href={item.href}
                className="interactive-card group block h-full rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)] transition-colors hover:border-[var(--color-accent-primary)] md:p-7"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-[var(--color-accent-primary-light)] text-[var(--color-accent-primary)]">
                  <Icon className="size-7" strokeWidth={1.5} aria-hidden />
                </div>
                <h3 className="mt-5 text-[20px] font-semibold leading-snug text-[var(--color-text-primary)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[16px] leading-[1.8] text-[var(--color-text-secondary)]">
                  {item.body}
                </p>
                <p className="mt-5 text-[15px] font-semibold text-[var(--color-accent-primary)] underline-offset-4 group-hover:underline">
                  詳しく見る
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
