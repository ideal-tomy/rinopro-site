import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { mission } = homeLandingCopy;

export function HomeMissionSection() {
  return (
    <section
      id="mission"
      className="container mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-[120px] scroll-mt-28"
      aria-labelledby="home-mission-heading"
    >
      <HomeLandingSectionHeading
        id="home-mission-heading"
        index={mission.sectionIndex}
        kicker={mission.sectionKicker}
        title={mission.heading}
        description={mission.intro}
      />
      <div className="mx-auto max-w-3xl space-y-6 text-[16px] leading-[1.9] text-text-secondary md:text-[17px]">
        {mission.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
