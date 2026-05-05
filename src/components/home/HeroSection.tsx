import { ParticleBackground } from "@/components/three/ParticleBackground";
import { HomeBelowFoldDeferred } from "@/components/home/HomeBelowFoldDeferred";
import { HomeEmpathyCards } from "@/components/home/HomeEmpathyCards";
import { HomeFirstView } from "@/components/home/HomeFirstView";
import { HomeSectionShell } from "@/components/home/HomeSectionShell";
import { HomeSectionStickyNav } from "@/components/home/HomeSectionStickyNav";
import { HomeServiceFlowRow } from "@/components/home/HomeServiceFlowRow";
import { HomeWhyPillars } from "@/components/home/HomeWhyPillars";

export function HeroSection() {
  return (
    <>
      <ParticleBackground />
      <div className="home-landing-copy">
        <HomeSectionStickyNav />
        <HomeFirstView />
        <HomeSectionShell tone="alt">
          <HomeEmpathyCards />
        </HomeSectionShell>
        <HomeSectionShell>
          <HomeWhyPillars />
        </HomeSectionShell>
        <HomeSectionShell tone="alt">
          <HomeServiceFlowRow />
        </HomeSectionShell>
        <HomeBelowFoldDeferred />
      </div>
    </>
  );
}
