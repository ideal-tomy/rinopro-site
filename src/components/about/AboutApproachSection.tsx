import Link from "next/link";
import { AboutSectionHeader } from "@/components/about/AboutSectionHeader";
import { ServiceJourneyDiagram } from "@/components/services/ServiceJourneyDiagram";
import { Button } from "@/components/ui/button";
import { aboutCopy } from "@/lib/content/site-copy";
import { aboutReading } from "@/lib/ui/about-reading-styles";
import { cn } from "@/lib/utils";

const { approach } = aboutCopy;

export function AboutApproachSection() {
  const journeySteps = approach.steps.map((step) => ({
    number: step.stepIndex,
    title: step.title,
    duration: step.duration,
    description: step.summary,
  }));

  return (
    <section
      className={aboutReading.sectionInset}
      aria-labelledby="about-approach-heading"
    >
      <AboutSectionHeader
        id="about-approach-heading"
        kicker={approach.kicker}
        title={approach.heading}
        description={approach.intro}
      />
      <div className="mt-10 md:mt-12">
        <ServiceJourneyDiagram steps={journeySteps} />
      </div>
      <ol className="mx-auto mt-10 max-w-3xl list-none space-y-4 md:mt-14">
        {approach.steps.map((step) => (
          <li
            key={step.stepIndex}
            className="flex gap-4 border-t border-[var(--color-border-light)] pt-4 first:border-t-0 first:pt-0"
          >
            <span className="shrink-0 font-mono text-[13px] font-semibold tabular-nums text-[var(--color-accent-primary)] md:text-sm">
              {step.stepIndex}
            </span>
            <div>
              <p className="font-semibold text-text text-[16px] md:text-[17px]">
                {step.title}
                <span className="ml-2 text-[14px] font-normal text-text-sub">
                  {step.duration}
                </span>
              </p>
              <p className={cn(aboutReading.body, "mt-1")}>{step.summary}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex justify-center md:mt-12">
        <Button asChild variant="outline" size="lg" className="min-h-11 px-8">
          <Link href={approach.servicesLink.href}>{approach.servicesLink.label}</Link>
        </Button>
      </div>
    </section>
  );
}
