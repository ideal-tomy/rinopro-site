import { AboutSectionHeader } from "@/components/about/AboutSectionHeader";
import { aboutCopy } from "@/lib/content/site-copy";
import { aboutReading } from "@/lib/ui/about-reading-styles";
import { cn } from "@/lib/utils";

const { facts } = aboutCopy;

type FactsRowProps = {
  label: string;
  value: string;
  labelTone: "primary" | "accent";
  className?: string;
};

function FactsRow({ label, value, labelTone, className }: FactsRowProps) {
  return (
    <div
      className={cn(
        "grid gap-2 py-5 sm:grid-cols-[minmax(9rem,11rem)_1fr] sm:gap-8 md:grid-cols-[12rem_1fr]",
        className
      )}
    >
      <dt
        className={cn(
          "text-[13px] font-semibold md:text-sm",
          labelTone === "accent"
            ? "uppercase tracking-[0.1em] text-[var(--color-accent-primary)]"
            : "text-[var(--color-text-primary)]"
        )}
      >
        {label}
      </dt>
      <dd className={cn(aboutReading.body, "text-[15px] md:text-[16px]")}>
        {value}
      </dd>
    </div>
  );
}

export function AboutFactsSection() {
  return (
    <section
      className={aboutReading.sectionInset}
      aria-labelledby="about-facts-heading"
    >
      <AboutSectionHeader
        id="about-facts-heading"
        kicker={facts.kicker}
        title={facts.heading}
      />
      <dl className="mx-auto divide-y divide-[var(--color-border-light)] rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-6 py-2 md:max-w-3xl md:px-8">
        {facts.companyRows.map((row) => (
          <FactsRow
            key={row.label}
            label={row.label}
            value={row.value}
            labelTone="primary"
          />
        ))}
        {facts.scopeRows.map((row, index) => (
          <FactsRow
            key={row.label}
            label={row.label}
            value={row.value}
            labelTone="accent"
            className={index === 0 ? "border-t border-[var(--color-border-light)]" : undefined}
          />
        ))}
      </dl>
    </section>
  );
}
