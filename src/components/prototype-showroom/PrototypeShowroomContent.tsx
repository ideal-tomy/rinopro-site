import { HomeSectionShell } from "@/components/home/HomeSectionShell";
import { PROTOTYPE_SHOWROOM_DEMOS } from "@/lib/content/prototype-showroom";
import { PrototypeStorySection } from "@/components/prototype-showroom/PrototypeStorySection";
import { ShowcaseHero } from "@/components/prototype-showroom/ShowcaseHero";
import {
  CollaborationSection,
  CrossIndustrySection,
  FieldProblemSection,
  FinalCtaSection,
  PrototypeToBusinessSection,
  WorkflowPrincipleSection,
} from "@/components/prototype-showroom/ShowroomSupportSections";

export function PrototypeShowroomContent() {
  return (
    <>
      <ShowcaseHero />
      <FieldProblemSection />
      <WorkflowPrincipleSection />

      <div id="prototypes" className="scroll-mt-24">
        {PROTOTYPE_SHOWROOM_DEMOS.map((demo, index) => (
          <HomeSectionShell
            key={demo.id}
            tone={index % 2 === 0 ? "pure" : "neutral"}
          >
            <PrototypeStorySection demo={demo} index={index + 1} />
          </HomeSectionShell>
        ))}
      </div>

      <CrossIndustrySection />
      <PrototypeToBusinessSection />
      <CollaborationSection />
      <FinalCtaSection />
    </>
  );
}
