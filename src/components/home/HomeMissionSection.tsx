import { MissionContrastDiagram } from "@/components/illustrations/mission-contrast-diagram";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { mission } = homeLandingCopy;

export function HomeMissionSection() {
  return (
    <section
      id="mission"
      className="container mx-auto max-w-5xl scroll-mt-28 px-4 py-20 md:px-6 md:py-[120px]"
      aria-labelledby="home-mission-heading"
    >
      <HomeLandingSectionHeading
        id="home-mission-heading"
        index={mission.sectionIndex}
        kicker={mission.sectionKicker}
        title={mission.heading}
      />
      <div className="mx-auto max-w-3xl space-y-5 text-[16px] leading-[1.9] text-[var(--color-text-secondary)] md:text-[17px]">
        {mission.leadParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="font-semibold text-[var(--color-text-primary)]">{mission.intro}</p>
      </div>
      <div className="mt-12">
        <MissionContrastDiagram />
      </div>
      <div className="mx-auto mt-10 max-w-3xl space-y-4 text-[16px] leading-[1.9] text-[var(--color-text-secondary)] md:text-[17px]">
        {mission.footerParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
