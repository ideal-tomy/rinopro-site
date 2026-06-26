import { AboutSectionHeader } from "@/components/about/AboutSectionHeader";
import { aboutCopy } from "@/lib/content/site-copy";
import { aboutReading } from "@/lib/ui/about-reading-styles";
import { cn } from "@/lib/utils";

const { principles } = aboutCopy;

export function AboutPrinciplesSection() {
  return (
    <section
      id="about-principles"
      className={aboutReading.sectionInset}
      aria-labelledby="about-principles-heading"
    >
      <AboutSectionHeader
        id="about-principles-heading"
        kicker={principles.kicker}
        title={principles.heading}
      />
      <ul className="mx-auto mt-2 grid max-w-3xl list-none gap-8 md:gap-10">
        {principles.items.map((item) => (
          <li key={item.index}>
            <p className="font-mono text-[13px] font-medium tabular-nums tracking-widest text-[var(--color-accent-primary)] md:text-sm">
              {item.index}
            </p>
            <h3 className="mt-3 text-[22px] font-bold leading-snug text-text underline decoration-[var(--color-accent-primary)] decoration-2 underline-offset-[6px] md:text-[24px]">
              {item.title}
            </h3>
            <p className={cn(aboutReading.lead, "mt-4 md:mt-5")}>{item.lead}</p>
            <p className={cn(aboutReading.body, "mt-2 md:mt-3")}>{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
