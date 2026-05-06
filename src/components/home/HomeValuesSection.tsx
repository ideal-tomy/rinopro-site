import {
  ArrowLeftRight,
  BookOpen,
  Hourglass,
  Sprout,
  User,
  type LucideIcon,
} from "lucide-react";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { values } = homeLandingCopy;

const VALUE_ICONS: Record<(typeof values.items)[number]["iconKey"], LucideIcon> = {
  user: User,
  sprout: Sprout,
  arrowLeftRight: ArrowLeftRight,
  hourglass: Hourglass,
  bookOpen: BookOpen,
};

export function HomeValuesSection() {
  return (
    <section
      id="values"
      className="container mx-auto max-w-6xl scroll-mt-28 px-4 py-20 md:px-6 md:py-[120px]"
      aria-labelledby="home-values-heading"
    >
      <HomeLandingSectionHeading
        id="home-values-heading"
        index={values.sectionIndex}
        kicker={values.sectionKicker}
        title={values.heading}
      />
      <ul className="mt-10 grid list-none gap-5 md:mt-12 md:grid-cols-2">
        {values.items.map((item) => {
          const Icon = VALUE_ICONS[item.iconKey];
          return (
            <li
              key={item.title}
              className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)] transition-[border-color,box-shadow] duration-200 hover:border-[var(--color-accent-primary)]/35 hover:shadow-[0_8px_24px_rgb(15_23_42_/_0.06)] md:p-7"
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
            </li>
          );
        })}
      </ul>
    </section>
  );
}
