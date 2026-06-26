import { AboutSectionHeader } from "@/components/about/AboutSectionHeader";
import { aboutCopy } from "@/lib/content/site-copy";
import { aboutReading } from "@/lib/ui/about-reading-styles";
import { cn } from "@/lib/utils";

const { founding } = aboutCopy;

export function AboutStorySection() {
  return (
    <section
      className={aboutReading.sectionInset}
      aria-labelledby="about-founding-heading"
    >
      <AboutSectionHeader
        id="about-founding-heading"
        kicker={founding.kicker}
        title={founding.heading}
      />
      <div className="mx-auto max-w-3xl space-y-6 md:space-y-8">
        {founding.paragraphs.map((paragraph) => (
          <p key={paragraph.lead}>
            <span className={aboutReading.lead}>{paragraph.lead}</span>{" "}
            <span className={aboutReading.body}>{paragraph.body}</span>
          </p>
        ))}
      </div>
      <ul className="mx-auto mt-10 grid list-none gap-5 sm:grid-cols-2 md:mt-14 lg:grid-cols-3 lg:gap-6">
        {founding.highlights.map((item) => (
          <li
            key={item.label}
            className="rounded-2xl border border-silver/30 bg-[var(--color-bg-pure)] p-6 md:p-7"
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-primary)] md:text-[13px]">
              {item.label}
            </p>
            <p className={cn(aboutReading.lead, "mt-3")}>{item.lead}</p>
            <p className={cn(aboutReading.body, "mt-2")}>{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
