"use client";

import { ServiceJourneyDiagram } from "@/components/services/ServiceJourneyDiagram";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { flow } = homeLandingCopy;

export function HomeServiceFlowRow() {
  const steps = flow.steps;
  const journeySteps = steps.map((step, index) => ({
    number: String(index + 1).padStart(2, "0"),
    title: step.title,
    duration: step.duration,
    description: `${step.consultRole} ${step.techRole}`,
  }));

  return (
    <section
      id="approach"
      className="container mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-[120px] scroll-mt-32"
      aria-labelledby="home-flow-heading"
    >
      <HomeLandingSectionHeading
        id="home-flow-heading"
        index={flow.sectionIndex}
        kicker={flow.sectionKicker}
        title={flow.heading}
        description={flow.intro}
      />

      <div className="mt-10 md:mt-12">
        <ServiceJourneyDiagram steps={journeySteps} />
      </div>
    </section>
  );
}
