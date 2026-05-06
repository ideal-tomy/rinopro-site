import Link from "next/link";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { solutions } = homeLandingCopy;

export function HomeSolutionsSection() {
  return (
    <section
      id="solutions"
      className="container mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-[120px] scroll-mt-28"
      aria-labelledby="home-solutions-heading"
    >
      <HomeLandingSectionHeading
        id="home-solutions-heading"
        index={solutions.sectionIndex}
        kicker={solutions.sectionKicker}
        title={solutions.heading}
        description={solutions.intro}
      />
      <ul className="grid list-none gap-5 md:grid-cols-2 lg:grid-cols-3">
        {solutions.items.map((item) => (
          <li key={item.title}>
            <Link
              href={item.href}
              className="block h-full rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 transition-colors hover:border-[var(--color-accent-primary)]"
            >
              <h3 className="text-[20px] font-semibold leading-snug text-[var(--color-text-primary)]">
                {item.title}
              </h3>
              <p className="mt-3 text-[16px] leading-[1.8] text-[var(--color-text-secondary)]">
                {item.body}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
